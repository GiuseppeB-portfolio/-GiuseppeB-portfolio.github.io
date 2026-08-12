/* ==========================================================================
   Giuseppe Bianco — Portfolio
   Nessuna dipendenza esterna: menu mobile, reveal allo scroll,
   grafico hero animato, contatore KPI, nav attiva in base alla sezione.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------- Anno corrente nel footer ---------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------- Menu mobile ------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Chiude il menu quando si sceglie una voce (utile su mobile)
    mainNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------- Reveal degli elementi allo scroll ------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const heroVisual = document.querySelector('.hero-visual');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Mostra tutto subito, senza animazioni, se l'utente lo preferisce
    revealEls.forEach((el) => el.classList.add('in-view'));
    if (heroVisual) heroVisual.classList.add('in-view');
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    // Il grafico nella hero si "disegna" quando entra in vista
    if (heroVisual) {
      const chartObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              heroVisual.classList.add('in-view');
              chartObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      chartObserver.observe(heroVisual);
    }
  }

  /* --------------------------- Contatore KPI ------------------------------ */
  const kpiEls = document.querySelectorAll('.kpi-value');

  function animateCount(el) {
    const target = parseFloat(el.dataset.count || '0');
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1100; // ms
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easing "ease-out" per un rallentamento naturale in chiusura
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    }
    requestAnimationFrame(tick);
  }

  if (kpiEls.length) {
    if (prefersReducedMotion) {
      kpiEls.forEach((el) => {
        el.textContent = `${el.dataset.prefix || ''}${el.dataset.count}${el.dataset.suffix || ''}`;
      });
    } else {
      const kpiObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              kpiObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      kpiEls.forEach((el) => kpiObserver.observe(el));
    }
  }

  /* ------------------- Evidenzia la voce di nav attiva --------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          const link = document.querySelector(`.nav-link[href="#${id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

});
/* ------------------------ Filtri sezione Progetti ------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const emptyStates = document.querySelectorAll('.projects-empty');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        let anyVisible;

        projectCards.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';
        });

        // Mostra il messaggio di "categoria in arrivo" solo se il filtro
        // selezionato non ha nessuna card corrispondente
        emptyStates.forEach((empty) => {
          const category = empty.dataset.category;
          anyVisible = [...projectCards].some(
            (card) => card.dataset.category === category
          );
          empty.style.display = (filter === category && !anyVisible) ? '' : 'none';
        });
      });
    });
  }
