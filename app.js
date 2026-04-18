/* app.js — cAp Interactivity */

(function() {
  'use strict';

  // === Sticky Nav Scroll Behavior ===
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // === Mobile Menu ===
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // === Smooth Scroll for Anchor Links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // === Scroll Reveal Animations ===
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // === Active Nav Link Highlight ===
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  function highlightNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--color-accent)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // === Form Handling ===
  const form = document.getElementById('capContactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const company = form.querySelector('#company').value.trim();
      const type = form.querySelector('#type').value;
      const message = form.querySelector('#message').value.trim();

      const typeLabels = {
        'einzelbetrieb': 'Einzelbetrieb',
        'kette': 'Hotelkette / Gruppe',
        'verband': 'Verband / IHK / DEHOGA',
        'sonstiges': 'Sonstiges'
      };

      const subject = encodeURIComponent('Erstgespräch-Anfrage von ' + name);
      let body = 'Name: ' + name + '\n';
      body += 'E-Mail: ' + email + '\n';
      if (company) body += 'Unternehmen: ' + company + '\n';
      if (type) body += 'Typ: ' + (typeLabels[type] || type) + '\n';
      if (message) body += '\nNachricht:\n' + message;

      const mailtoLink = 'mailto:kevinschlesier@culinaryapprenticeprojekt.net'
        + '?subject=' + subject
        + '&body=' + encodeURIComponent(body);

      window.location.href = mailtoLink;

      // Show confirmation
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'E-Mail-Programm wird geöffnet...';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Erstgespräch anfragen';
          btn.disabled = false;
        }, 3000);
      }
    });
  }

})();
