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

    // Submit buttons
    document.querySelectorAll('.btn-modal').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var form = btn.getAttribute('data-form');
        var messages = {
          booking: 'Appointment requested! In a live site this connects to your scheduling system.',
          signin:  'Signed in successfully!',
          signup:  'Account created successfully!'
        };
        alert(messages[form] || 'Submitted!');
        closeModal(form);
      });
    });

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

    // Open "booking" modal triggers
    var bookingTriggers = [
      'bookNavBtn', 'heroBookBtn', 'welcomeBookBtn', 'teamBookBtn', 'bannerBookBtn'
    ];
    bookingTriggers.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          openModal('booking');
        });
      }
    });

    // Sign In trigger
    var signinBtn = document.getElementById('signinBtn');
    if (signinBtn) {
      signinBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal('signin');
      });
    }

    // Mobile menu sign in / book now
    var mobSignin = document.getElementById('mobSignin');
    if (mobSignin) {
      mobSignin.addEventListener('click', function (e) {
        e.preventDefault();
        closeMob();
        openModal('signin');
      });
    }
    var mobBook = document.getElementById('mobBook');
    if (mobBook) {
      mobBook.addEventListener('click', function (e) {
        e.preventDefault();
        closeMob();
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
     LIVE CHAT
  ───────────────────────────────────────── */

  var chatOpen = false;
  var replyIndex = 0;
  var chatReplies = [
    'Thank you for reaching out! For scheduling, please call 816-974-3389 or use the Book a Session button.',
    'We serve Missouri and Kansas clients in-person and virtually. Would you like to learn more?',
    'Each counselor has different specialties. Would you like help finding the best fit for you?',
    'We offer individual counseling, couples therapy, life coaching, and more. What are you looking for?',
    'Feel free to email tanise@jecounselingkc.com or call 816-974-3389 and we will get back to you quickly!'
  ];

  function toggleChat() {
    chatOpen = !chatOpen;
    var win = document.getElementById('chatWin');
    if (win) win.classList.toggle('open', chatOpen);
    if (chatOpen) {
      var input = document.getElementById('chatIn');
      if (input) input.focus();
    }
  }

  function sendChat() {
    var input = document.getElementById('chatIn');
    var msgs  = document.getElementById('chatMsgs');
    if (!input || !msgs) return;

    var text = input.value.trim();
    if (!text) return;

    var outDiv = document.createElement('div');
    outDiv.className   = 'msg out';
    outDiv.textContent = text;
    msgs.appendChild(outDiv);
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(function () {
      var inDiv = document.createElement('div');
      inDiv.className   = 'msg in';
      inDiv.textContent = chatReplies[replyIndex % chatReplies.length];
      replyIndex++;
      msgs.appendChild(inDiv);
      msgs.scrollTop = msgs.scrollHeight;
    }, 900);
  }

  function initChat() {
    var toggleBtn = document.getElementById('chatToggleBtn');
    var sendBtn   = document.getElementById('chatSendBtn');
    var input     = document.getElementById('chatIn');

    if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
    if (sendBtn)   sendBtn.addEventListener('click', sendChat);
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') sendChat();
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
    initMobileMenu();
    initChat();
    initScrollReveal();
  });

})();
