(() => {
  const WA_NUMBER = '56958484121';
  const DEFAULT_MESSAGE = 'Hola, soy [Nombre]. Quiero cotizar [Servicio/Plan]. Estoy en [Sector].';
  const API_BASE = window.SIA_API_BASE || 'http://localhost:3000';

  const setWhatsAppLinks = () => {
    document.querySelectorAll('[data-wa]').forEach((link) => {
      const message = link.getAttribute('data-message') || DEFAULT_MESSAGE;
      const number = link.getAttribute('data-number') || WA_NUMBER;
      link.setAttribute('href', `https://wa.me/${number}?text=${encodeURIComponent(message)}`);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
    });
  };

  const setActiveNav = () => {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === current) {
        link.classList.add('active');
      }
    });
  };

  const initNavToggle = () => {
    const toggle = document.querySelector('.nav-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  };

  const initReveal = () => {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || items.length === 0) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((item) => observer.observe(item));
  };

  const initPlanButtons = () => {
    const select = document.querySelector('select[name=plan_name]');
    if (!select) return;
    document.querySelectorAll('[data-plan]').forEach((btn) => {
      btn.addEventListener('click', () => {
        select.value = btn.getAttribute('data-plan');
      });
    });
  };

  const initForms = () => {
    const forms = document.querySelectorAll('form[data-endpoint]');
    forms.forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (form.classList.contains('is-loading')) return;

        const status = form.querySelector('.form-status');
        const data = Object.fromEntries(new FormData(form).entries());
        const required = Array.from(form.querySelectorAll('[required]'));
        const missing = required.find((field) => !field.value.trim());

        if (missing) {
          if (status) status.textContent = 'Completa los campos requeridos.';
          missing.focus();
          return;
        }

        form.classList.add('is-loading');
        if (status) status.textContent = 'Enviando...';

        try {
          const endpoint = form.dataset.endpoint || '';
          const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            form.reset();
            if (status) status.textContent = 'Listo. Te contactaremos en breve.';
          } else {
            if (status) status.textContent = 'No se pudo enviar. Intenta nuevamente.';
          }
        } catch (error) {
          if (status) status.textContent = 'Error de conexion. Intenta nuevamente.';
        } finally {
          form.classList.remove('is-loading');
        }
      });
    });
  };

  const setYear = () => {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  };

  setWhatsAppLinks();
  setActiveNav();
  initNavToggle();
  initReveal();
  initPlanButtons();
  initForms();
  setYear();
})();



