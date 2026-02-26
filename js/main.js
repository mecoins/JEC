/**
 * Journey Embraced Counseling — main.js
 * All interactive behaviour: modals, dropdown, chat, mobile menu, scroll reveal
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     MODALS
  ───────────────────────────────────────── */

  /**
   * Open a modal by name (e.g. 'booking', 'signin', 'signup')
   * @param {string} name
   */
  function openModal(name) {
    var overlay = document.getElementById(name + 'Modal');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close a modal by name
   * @param {string} name
   */
  function closeModal(name) {
    var overlay = document.getElementById(name + 'Modal');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    var form = overlay.querySelector('form');
    var success = overlay.querySelector('.modal-success');
    if (form) { form.reset(); form.style.display = ''; }
    if (success) success.style.display = 'none';
  }

  /**
   * Switch from one modal to another
   * @param {string} from
   * @param {string} to
   */
  function switchModal(from, to) {
    closeModal(from);
    setTimeout(function () { openModal(to); }, 200);
  }

  /** Wire up all modal triggers */
  function initModals() {
    // Close buttons (✕)
    document.querySelectorAll('.modal-x').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var overlay = btn.closest('.modal-overlay');
        if (overlay) closeModal(overlay.id.replace('Modal', ''));
      });
    });

    // Click on backdrop to close
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          closeModal(overlay.id.replace('Modal', ''));
        }
      });
    });

    // Netlify form submission
    var bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn = bookingForm.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(bookingForm)).toString()
        }).then(function () {
          bookingForm.style.display = 'none';
          var success = document.getElementById('bookingSuccess');
          if (success) success.style.display = 'block';
          setTimeout(function () { closeModal('booking'); }, 4000);
        }).catch(function () {
          if (submitBtn) { submitBtn.textContent = 'Request Appointment'; submitBtn.disabled = false; }
          alert('There was a problem. Please call 816-974-3389 or email cstokes@jecounselingkc.com');
        });
      });
    }

    // Switch modal links (e.g. "Sign in" / "Create an account")
    document.querySelectorAll('[data-switch-to]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var overlay = link.closest('.modal-overlay');
        var from    = overlay ? overlay.id.replace('Modal', '') : null;
        var to      = link.getAttribute('data-switch-to');
        if (from) switchModal(from, to);
        else openModal(to);
      });
    });

    // Generic booking triggers — no pre-selection
    var bookingTriggers = [
      'bookNavBtn', 'heroBookBtn', 'welcomeBookBtn', 'teamBookBtn', 'bannerBookBtn'
    ];
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

    // Individual counselor buttons — pre-select counselor
    document.querySelectorAll('.book-counselor-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var counselor = btn.getAttribute('data-counselor');
        var select = document.getElementById('counselorSelect');
        if (select && counselor) select.value = counselor;
        openModal('booking');
      });
    });

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
     TEAM DROPDOWN
  ───────────────────────────────────────── */

  function initTeamDropdown() {
    var btn = document.getElementById('teamDropBtn');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var item   = btn.closest('.nav-item');
      var isOpen = item.classList.contains('open');

      // Close all open dropdowns first
      document.querySelectorAll('.nav-item.open').forEach(function (el) {
        el.classList.remove('open');
      });
      btn.setAttribute('aria-expanded', 'false');

      // Toggle this one
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close dropdown on outside click
    document.addEventListener('click', function () {
      document.querySelectorAll('.nav-item.open').forEach(function (el) {
        el.classList.remove('open');
      });
      btn.setAttribute('aria-expanded', 'false');
    });

    // Close dropdown when a counselor link is clicked
    document.querySelectorAll('.drop-card').forEach(function (card) {
      card.addEventListener('click', function () {
        document.querySelectorAll('.nav-item.open').forEach(function (el) {
          el.classList.remove('open');
        });
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

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

    // Auto-close nav links (except sign-in/book which have their own handlers)
    document.querySelectorAll('.mob-menu a:not(#mobSignin):not(#mobBook)').forEach(function (link) {
      link.addEventListener('click', closeMob);
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
      // Close team dropdown first
      document.querySelectorAll('.nav-item.open').forEach(function(el){ el.classList.remove('open'); });
      if (!isOpen) {
        drop.classList.add('contact-drop--open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        drop.classList.remove('contact-drop--open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', function () {
      drop.classList.remove('contact-drop--open');
      btn.setAttribute('aria-expanded', 'false');
    });

    drop.addEventListener('click', function (e) { e.stopPropagation(); });
  }


  /* ─────────────────────────────────────────
     WORKSHOP MODALS
  ───────────────────────────────────────── */

  function initWorkshopModals() {
    // Connected workshop button
    var connectedBtn = document.getElementById('connectedBtn');
    if (connectedBtn) {
      connectedBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('connected');
      });
    }

    // Recover Well workshop button
    var recoverBtn = document.getElementById('recoverBtn');
    if (recoverBtn) {
      recoverBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('recover');
      });
    }

    // Connected form submission
    var connectedForm = document.getElementById('connectedForm');
    if (connectedForm) {
      connectedForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn = connectedForm.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(connectedForm)).toString()
        }).then(function () {
          connectedForm.style.display = 'none';
          var success = document.getElementById('connectedSuccess');
          if (success) success.style.display = 'block';
          setTimeout(function () { closeModal('connected'); }, 4000);
        }).catch(function () {
          if (submitBtn) { submitBtn.textContent = 'Reserve My Spot'; submitBtn.disabled = false; }
          alert('There was a problem. Please call 816-974-3389 or email cstokes@jecounselingkc.com');
        });
      });
    }

    // Recover Well form submission
    var recoverForm = document.getElementById('recoverForm');
    if (recoverForm) {
      recoverForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn = recoverForm.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(recoverForm)).toString()
        }).then(function () {
          recoverForm.style.display = 'none';
          var success = document.getElementById('recoverSuccess');
          if (success) success.style.display = 'block';
          setTimeout(function () { closeModal('recover'); }, 4000);
        }).catch(function () {
          if (submitBtn) { submitBtn.textContent = 'Reserve My Spot'; submitBtn.disabled = false; }
          alert('There was a problem. Please call 816-974-3389 or email cstokes@jecounselingkc.com');
        });
      });
    }
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
    initTeamDropdown();
    initContactDropdown();
    initMobileMenu();
    initWorkshopModals();
    initScrollReveal();
  });

})();
