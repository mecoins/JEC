/**
 * Journey Embraced Counseling — main.js
 * Modals, dropdown, mobile menu, scroll reveal, Netlify form submission
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     MODALS
  ───────────────────────────────────────── */

  function openModal(name) {
    var overlay = document.getElementById(name + 'Modal');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(name) {
    var overlay = document.getElementById(name + 'Modal');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Reset form and success message when closing
    var form = overlay.querySelector('form');
    var success = overlay.querySelector('.modal-success');
    if (form) { form.reset(); form.style.display = ''; }
    if (success) success.style.display = 'none';
  }

  function initModals() {
    // Close buttons (✕)
    document.querySelectorAll('.modal-x').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var overlay = btn.closest('.modal-overlay');
        if (overlay) closeModal(overlay.id.replace('Modal', ''));
      });
    });

    // Click backdrop to close
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          closeModal(overlay.id.replace('Modal', ''));
        }
      });
    });

    // Generic "Book a Session" triggers — no pre-selection
    var bookingTriggers = ['bookNavBtn', 'heroBookBtn', 'welcomeBookBtn', 'teamBookBtn', 'bannerBookBtn'];
    bookingTriggers.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          var select = document.getElementById('counselorSelect');
          if (select) select.value = '';
          openModal('booking');
        });
      }
    });

    // Mobile book now
    var mobBook = document.getElementById('mobBook');
    if (mobBook) {
      mobBook.addEventListener('click', function (e) {
        e.preventDefault();
        closeMob();
        var select = document.getElementById('counselorSelect');
        if (select) select.value = '';
        openModal('booking');
      });
    }

    // Individual counselor "Book with [Name]" buttons — pre-select counselor
    document.querySelectorAll('.book-counselor-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var counselor = btn.getAttribute('data-counselor');
        var select = document.getElementById('counselorSelect');
        if (select && counselor) {
          select.value = counselor;
        }
        openModal('booking');
      });
    });

    // Escape key closes any open modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(function (overlay) {
          closeModal(overlay.id.replace('Modal', ''));
        });
      }
    });
  }

  /* ─────────────────────────────────────────
     NETLIFY FORM SUBMISSION
  ───────────────────────────────────────── */

  function initBookingForm() {
    var form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      var data = new FormData(form);

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      })
      .then(function () {
        // Show success, hide form
        form.style.display = 'none';
        var success = document.getElementById('bookingSuccess');
        if (success) success.style.display = 'block';
        // Auto-close after 4 seconds
        setTimeout(function () { closeModal('booking'); }, 4000);
      })
      .catch(function () {
        if (submitBtn) {
          submitBtn.textContent = 'Request Appointment';
          submitBtn.disabled = false;
        }
        alert('There was a problem sending your request. Please call us at 816-974-3389 or email cstokes@jecounselingkc.com');
      });
    });
  }

  /* ─────────────────────────────────────────
     TEAM DROPDOWN
  ───────────────────────────────────────── */

  function initTeamDropdown() {
    var btn = document.getElementById('teamDropBtn');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var item   = btn.closest('.nav-item');
      var isOpen = item.classList.contains('open');

      closeAllDropdowns();

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    document.querySelectorAll('.drop-card').forEach(function (card) {
      card.addEventListener('click', closeAllDropdowns);
    });
  }

  /* ─────────────────────────────────────────
     CONTACT US DROPDOWN
  ───────────────────────────────────────── */

  function initContactDropdown() {
    var btn  = document.getElementById('contactDropBtn');
    var drop = document.getElementById('contactDrop');
    if (!btn || !drop) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = drop.classList.contains('contact-drop--open');
      // Close team dropdown
      closeAllDropdowns();
      if (!isOpen) {
        drop.classList.add('contact-drop--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close on outside click
    document.addEventListener('click', function () {
      drop.classList.remove('contact-drop--open');
      btn.setAttribute('aria-expanded', 'false');
    });

    // Prevent clicks inside dropdown from bubbling and closing it
    drop.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.nav-item.open').forEach(function (el) {
      el.classList.remove('open');
    });
    document.querySelectorAll('[aria-expanded="true"]').forEach(function (el) {
      el.setAttribute('aria-expanded', 'false');
    });
  }

  // Close all dropdowns on outside click
  document.addEventListener('click', closeAllDropdowns);

  /* ─────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────── */

  function openMob() {
    var menu   = document.getElementById('mobMenu');
    var toggle = document.getElementById('mobToggle');
    if (menu)   menu.classList.add('open');
    if (toggle) { toggle.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); }
    document.body.style.overflow = 'hidden';
  }

  function closeMob() {
    var menu   = document.getElementById('mobMenu');
    var toggle = document.getElementById('mobToggle');
    if (menu)   menu.classList.remove('open');
    if (toggle) { toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    document.body.style.overflow = '';
  }

  function initMobileMenu() {
    var toggle = document.getElementById('mobToggle');
    var close  = document.getElementById('mobClose');

    if (toggle) toggle.addEventListener('click', function () {
      var isOpen = document.getElementById('mobMenu').classList.contains('open');
      isOpen ? closeMob() : openMob();
    });

    if (close) close.addEventListener('click', closeMob);

    document.querySelectorAll('.mob-menu a:not(#mobBook)').forEach(function (link) {
      link.addEventListener('click', closeMob);
    });
  }

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */

  function initScrollReveal() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initModals();
    initBookingForm();
    initTeamDropdown();
    initContactDropdown();
    initMobileMenu();
    initScrollReveal();
  });

})();
