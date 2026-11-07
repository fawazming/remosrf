/* =========================================================
   Remo Students Relief Foundation — site interactions
   ========================================================= */
(function () {
  'use strict';

  var $ = function (selector, context) {
    return (context || document).querySelector(selector);
  };
  var $$ = function (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  };

  /* ---------- Auto year ---------- */
  $$('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Toast ---------- */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(message) {
    if (!toastEl) return;
    var msg = $('[data-toast-message]', toastEl);
    if (msg) msg.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 4200);
  }
  $$('[data-toast-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      toastEl.classList.remove('is-visible');
    });
  });

  /* ---------- Scroll progress, header, back to top ---------- */
  var header = $('[data-header]');
  var progress = $('#scroll-progress');
  var backTop = $('[data-back-top]');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
    if (backTop) backTop.classList.toggle('is-visible', y > 650);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Mobile menu ---------- */
  var menu = $('#mobile-menu');
  var menuBtn = $('#menu-btn');
  var menuPanel = $('#menu-panel');
  var menuLastFocus = null;

  function setMenu(open) {
    if (!menu) return;
    if (open) {
      menuLastFocus = document.activeElement;
      menu.classList.remove('hidden');
      menu.setAttribute('aria-hidden', 'false');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      requestAnimationFrame(function () {
        menu.classList.add('is-open');
      });
      setTimeout(function () {
        var first = menuPanel ? $('a, button', menuPanel) : null;
        if (first) first.focus();
      }, 180);
    } else {
      menu.classList.remove('is-open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      setTimeout(function () {
        menu.classList.add('hidden');
        menu.setAttribute('aria-hidden', 'true');
      }, 340);
      if (menuLastFocus) menuLastFocus.focus();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
  }
  $$('[data-menu-close], #mobile-menu a').forEach(function (el) {
    el.addEventListener('click', function () {
      setMenu(false);
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1700;
    var start = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.textContent = target + suffix;
      return;
    }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0' + suffix;
    requestAnimationFrame(step);
  }

  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  /* ---------- FAQ accordion ---------- */
  $$('[data-faq]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      if (!item) return;
      var group = item.closest('[data-faq-group]');
      var wasOpen = item.classList.contains('is-open');
      if (group) {
        $$('.faq-item', group).forEach(function (other) {
          other.classList.remove('is-open');
          var otherBtn = $('[data-faq]', other);
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
      }
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Form validation + success panels ---------- */
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(field) {
    var wrap = field.closest('.field') || field.closest('[data-field]');
    var error = wrap ? $('.field-error', wrap) : null;
    if (!wrap) return true;
    var value = field.value ? field.value.trim() : '';
    var valid = true;

    if (field.type === 'checkbox') {
      valid = field.checked;
    } else if (field.required && !value) {
      valid = false;
    } else if (field.type === 'email' && value && !emailPattern.test(value)) {
      valid = false;
    } else if (field.getAttribute('data-minlength') && value.length < parseInt(field.getAttribute('data-minlength'), 10)) {
      valid = false;
    }

    wrap.classList.toggle('has-error', !valid);
    field.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if (error) {
      if (!valid) {
        error.textContent =
          field.type === 'email' && value
            ? 'Please enter a valid email address.'
            : field.type === 'checkbox'
              ? 'Please confirm this before continuing.'
              : field.getAttribute('data-error') || 'This field is required.';
        error.hidden = false;
      } else {
        error.hidden = true;
      }
    }
    return valid;
  }

  $$('form[data-form]').forEach(function (form) {
    var wrap = form.closest('[data-form-wrap]');
    var success = wrap ? $('[data-form-success]', wrap) : null;

    $$('input, select, textarea', form).forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.closest('.has-error')) validateField(field);
      });
      field.addEventListener('change', function () {
        if (field.closest('.has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var valid = true;
      var fields = $$('[required]', form);
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        toast('Please check the highlighted fields and try again.');
        var firstError = $('.has-error input, .has-error select, .has-error textarea', form);
        if (firstError) firstError.focus();
        return;
      }

      form.classList.add('hidden');
      if (success) {
        success.classList.remove('hidden');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast('Thank you — your message has been received.');
    });
  });

  $$('[data-form-reset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wrap = btn.closest('[data-form-wrap]');
      if (!wrap) return;
      var form = $('form[data-form]', wrap);
      var success = $('[data-form-success]', wrap);
      if (form) {
        form.reset();
        form.classList.remove('hidden');
        $$('.has-error', form).forEach(function (el) {
          el.classList.remove('has-error');
        });
        $$('.field-error', form).forEach(function (el) {
          el.hidden = true;
        });
        var first = $('input, select, textarea', form);
        if (first) first.focus();
      }
      if (success) success.classList.add('hidden');
    });
  });

  /* ---------- Newsletter ---------- */
  $$('form[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = $('input[type="email"]', form);
      if (!input || !emailPattern.test(input.value.trim())) {
        toast('Please enter a valid email address.');
        if (input) input.focus();
        return;
      }
      toast('You are on the list — thank you for staying close to the work.');
      form.reset();
    });
  });

  /* ---------- Donation modal ---------- */
  var donateModal = $('#donate-modal');
  var donateForm = $('[data-donate-form]');
  var donateLastFocus = null;
  var selectedAmount = 10000;
  var selectedFrequency = 'once';

  function selectAmount(amount) {
    selectedAmount = amount;
    $$('.amount-btn', donateModal).forEach(function (btn) {
      btn.classList.toggle('is-selected', btn.getAttribute('data-amount') === String(amount));
    });
    var customWrap = $('[data-custom-wrap]', donateModal);
    if (customWrap) customWrap.classList.toggle('hidden', String(amount) !== 'custom');
  }

  function selectFrequency(freq) {
    selectedFrequency = freq;
    $$('.freq-btn', donateModal).forEach(function (btn) {
      btn.classList.toggle('is-selected', btn.getAttribute('data-frequency') === freq);
    });
  }

  function resetDonate() {
    if (!donateForm) return;
    donateForm.reset();
    selectedAmount = 10000;
    selectedFrequency = 'once';
    selectAmount(10000);
    selectFrequency('once');
    var step = $('[data-donate-step]', donateForm);
    var success = $('[data-donate-success]', donateForm);
    if (step) step.classList.remove('hidden');
    if (success) success.classList.add('hidden');
    var err = $('[data-donate-error]', donateForm);
    if (err) err.classList.add('hidden');
  }

  function openDonate(amount) {
    if (!donateModal) return;
    donateLastFocus = document.activeElement;
    resetDonate();
    if (amount) {
      if (['5000', '10000', '25000', '50000'].indexOf(String(amount)) > -1) {
        selectAmount(parseInt(amount, 10));
      } else {
        selectAmount('custom');
        var custom = $('[data-custom-amount]', donateModal);
        if (custom) custom.value = amount;
      }
    }
    donateModal.classList.remove('hidden');
    donateModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    requestAnimationFrame(function () {
      donateModal.classList.add('is-open');
    });
    setTimeout(function () {
      var close = $('[data-donate-close]', donateModal);
      if (close) close.focus();
    }, 120);
  }

  function closeDonate() {
    if (!donateModal || donateModal.classList.contains('hidden')) return;
    donateModal.classList.remove('is-open');
    donateModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    setTimeout(function () {
      donateModal.classList.add('hidden');
    }, 260);
    if (donateLastFocus) donateLastFocus.focus();
  }

  document.addEventListener('click', function (event) {
    var opener = event.target.closest('[data-open-donate]');
    if (opener) {
      event.preventDefault();
      openDonate(opener.getAttribute('data-amount'));
    }
    if (event.target.closest('[data-donate-close]')) {
      event.preventDefault();
      closeDonate();
    }
  });

  if (donateModal) {
    $$('.amount-btn', donateModal).forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectAmount(btn.getAttribute('data-amount'));
        var custom = $('[data-custom-amount]', donateModal);
        if (custom && btn.getAttribute('data-amount') !== 'custom') custom.value = '';
      });
    });
    $$('.freq-btn', donateModal).forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectFrequency(btn.getAttribute('data-frequency'));
      });
    });
  }

  if (donateForm) {
    donateForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = $('[name="donor_name"]', donateForm);
      var email = $('[name="donor_email"]', donateForm);
      var custom = $('[data-custom-amount]', donateForm);
      var error = $('[data-donate-error]', donateForm);
      var amount = selectedAmount === 'custom' ? parseInt(custom ? custom.value : '', 10) : selectedAmount;

      if (!name || !name.value.trim() || !email || !emailPattern.test(email.value.trim()) || !amount || amount < 100) {
        if (error) {
          error.textContent = 'Please add your name, a valid email, and a gift amount of at least ₦100.';
          error.classList.remove('hidden');
        }
        if (name && !name.value.trim()) name.focus();
        else if (email && !emailPattern.test(email.value.trim())) email.focus();
        else if (custom && (!amount || amount < 100)) custom.focus();
        return;
      }

      var success = $('[data-donate-success]', donateForm);
      var step = $('[data-donate-step]', donateForm);
      var amountLabel = '₦' + amount.toLocaleString('en-NG') + (selectedFrequency === 'monthly' ? ' / month' : '');
      var nameTarget = $('[data-donor-name]', donateForm);
      var amountTarget = $('[data-donor-amount]', donateForm);
      if (nameTarget) nameTarget.textContent = name.value.trim().split(' ')[0];
      if (amountTarget) amountTarget.textContent = amountLabel;
      if (step) step.classList.add('hidden');
      if (success) success.classList.remove('hidden');
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = $('#lightbox');
  var lightboxImg = $('#lightbox-img');
  var lightboxCaption = $('#lightbox-caption');
  var lightboxCounter = $('#lightbox-counter');
  var galleryItems = $$('[data-lightbox]');
  var lightboxIndex = 0;
  var lightboxLastFocus = null;

  function showLightbox(index) {
    if (!lightbox || !lightboxImg || !galleryItems.length) return;
    lightboxIndex = (index + galleryItems.length) % galleryItems.length;
    var item = galleryItems[lightboxIndex];
    lightboxImg.src = item.getAttribute('data-src') || item.getAttribute('href') || '';
    lightboxImg.alt = item.getAttribute('data-caption') || 'Remo Students Relief Foundation gallery image';
    if (lightboxCaption) lightboxCaption.textContent = item.getAttribute('data-caption') || '';
    if (lightboxCounter) lightboxCounter.textContent = lightboxIndex + 1 + ' / ' + galleryItems.length;
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lightboxLastFocus = document.activeElement;
    showLightbox(index);
    lightbox.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
    });
    setTimeout(function () {
      var close = $('[data-lightbox-close]', lightbox);
      if (close) close.focus();
    }, 100);
  }

  function closeLightbox() {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () {
      lightbox.classList.add('hidden');
    }, 240);
    if (lightboxLastFocus) lightboxLastFocus.focus();
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function (event) {
      event.preventDefault();
      openLightbox(index);
    });
  });

  if (lightbox) {
    var closeBtn = $('[data-lightbox-close]', lightbox);
    var prevBtn = $('[data-lightbox-prev]', lightbox);
    var nextBtn = $('[data-lightbox-next]', lightbox);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { showLightbox(lightboxIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showLightbox(lightboxIndex + 1); });
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  /* ---------- Keyboard handling ---------- */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (lightbox && !lightbox.classList.contains('hidden')) closeLightbox();
      else if (donateModal && !donateModal.classList.contains('hidden')) closeDonate();
      else if (menu && !menu.classList.contains('hidden')) setMenu(false);
    }
    if (lightbox && !lightbox.classList.contains('hidden')) {
      if (event.key === 'ArrowLeft') showLightbox(lightboxIndex - 1);
      if (event.key === 'ArrowRight') showLightbox(lightboxIndex + 1);
    }
  });

  /* ---------- Contact topic pre-select ---------- */
  var topicSelect = $('[data-topic-select]');
  if (topicSelect) {
    var params = new URLSearchParams(window.location.search);
    var topic = params.get('topic');
    var map = {
      sponsor: 'Sponsorship',
      partner: 'Partnership / CSR',
      volunteer: 'Volunteering',
      student: 'Student support',
      media: 'Media'
    };
    if (topic && map[topic]) topicSelect.value = map[topic];
  }

  /* ---------- Copy-to-clipboard ---------- */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      var text = btn.getAttribute('data-copy');
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          toast('Email address copied to clipboard.');
        }).catch(function () {
          toast(text);
        });
      } else {
        toast(text);
      }
    });
  });

  /* ---------- Program filters ---------- */
  var filterButtons = $$('[data-filter]');
  var programCards = $$('[data-program-category]');
  if (filterButtons.length && programCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        filterButtons.forEach(function (other) {
          other.classList.toggle('is-active', other === btn);
          other.setAttribute('aria-pressed', other === btn ? 'true' : 'false');
        });
        programCards.forEach(function (card) {
          var show = filter === 'all' || card.getAttribute('data-program-category') === filter;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }
})();
