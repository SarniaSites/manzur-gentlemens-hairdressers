/* Manzur Gentlemens Hairdressers — site script (vanilla, no dependencies) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================================
     OPENING HOURS — the one source of truth for the signs
     day index: 0 Sun … 6 Sat. Times in minutes after midnight.
     ================================================================ */
  var HOURS = {
    0: null,
    1: null,
    2: [540, 1020],
    3: [540, 1020],
    4: [540, 1020],
    5: [540, 1020],
    6: [480, 720]
  };
  var DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function fmt(m) {
    var h = Math.floor(m / 60), mm = m % 60;
    if (h === 12 && mm === 0) return '12 noon';
    var s = (h % 12 || 12) + (mm ? ':' + String(mm).padStart(2, '0') : '');
    return s + (h < 12 ? 'am' : 'pm');
  }
  function short(m) { var h = Math.floor(m / 60); return String(h % 12 || 12); }

  // Current time on the island (Guernsey keeps UK time)
  function islandNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: SHORT.indexOf(o.weekday), min: parseInt(o.hour, 10) * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function status() {
    var n = islandNow(), h = HOURS[n.day];
    if (h && n.min >= h[0] && n.min < h[1]) {
      return { open: true, day: n.day, line: 'Open now, until ' + fmt(h[1]) + ' today', sub: 'until ' + fmt(h[1]) };
    }
    // find the next opening
    for (var i = 0; i < 8; i++) {
      var d = (n.day + i) % 7, hh = HOURS[d];
      if (!hh) continue;
      if (i === 0 && n.min >= hh[0]) continue;
      var when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAY[d];
      return { open: false, day: n.day, line: 'Closed now. Opens ' + when + ' at ' + fmt(hh[0]), sub: 'opens ' + (i === 0 ? 'at ' + fmt(hh[0]) : i === 1 ? 'tomorrow ' + fmt(hh[0]) : SHORT[d] + ' ' + fmt(hh[0])) };
    }
    return { open: false, day: n.day, line: '', sub: '' };
  }

  /* ---------- The live hero sign ---------- */
  var live = $('[data-live-sign]');
  function paintLive() {
    var s = status();
    if (live) {
      // front face = OPEN, back = CLOSED. Show whichever is true right now.
      $('[data-face-sub="front"]', live).textContent = s.open ? s.sub : 'Tue to Sat';
      $('[data-face-sub="back"]', live).textContent = s.open ? 'Sun and Mon' : s.sub;
      live.classList.toggle('is-flipped', !s.open);
      live.dataset.state = s.open ? 'open' : 'closed';
      live.setAttribute('aria-label', 'Shop sign: ' + s.line + '. Tap to turn it over.');
    }
    var line = $('[data-live-line]'); if (line && s.line) line.textContent = s.line + '.';
    var pill = $('[data-status-text]'); if (pill && s.line) pill.textContent = s.line;
    var foot = $('[data-footer-status]'); if (foot && s.line) foot.textContent = s.line;
    var fw = $('[data-foot-word]'); if (fw) fw.textContent = s.open ? 'OPEN' : 'CLOSED';
    return s;
  }
  var nowStatus = paintLive();
  setInterval(paintLive, 60000);

  // Tap to turn any sign over (and back)
  document.addEventListener('click', function (e) {
    var sign = e.target.closest('[data-sign]');
    if (!sign) return;
    sign.classList.toggle('is-flipped');
  });

  /* ================================================================
     WEEK OF TAGS
     ================================================================ */
  var tagsHost = $('[data-tags]');
  if (tagsHost) {
    var order = [1, 2, 3, 4, 5, 6, 0]; // Monday first, like the window
    var today = islandNow().day;
    tagsHost.innerHTML = order.map(function (d, i) {
      var h = HOURS[d], closed = !h, isToday = d === today;
      // sag along the cord: deepest in the middle (desktop only, via CSS var)
      var t = (i + 0.5) / 7, sag = Math.round(4 * 34 * t * (1 - t));
      var front = closed
        ? '<span class="day">' + DAY[d] + '</span><span class="sub mt-1.5 text-[1rem]">Closed</span>'
        : '<span class="day">' + DAY[d] + '</span><span class="num mt-1 text-[2.6rem] leading-[0.9] text-paper">' + short(h[0]) + '–' + short(h[1]) + '</span>';
      var back = closed
        ? '<span class="word text-[1.05rem]">SEE YOU</span><span class="sub mt-1 text-[0.95rem]">' + 'Tuesday 9am' + '</span>'
        : '<span class="sub text-[0.95rem]">' + fmt(h[0]) + ' to</span><span class="word mt-1 text-[1.15rem]">' + fmt(h[1]).toUpperCase() + '</span>';
      return '<li class="tag shrink-0 snap-center' + (closed ? ' is-closed' : '') + (isToday ? ' is-today' : '') + '" style="--i:' + i + ';--sag:' + sag + 'px">' +
        '<div class="tag-hang hanger md:w-full md:max-w-[10.5rem]' + (isToday && !reduce ? ' swing' : '') + '" style="--swing-amp:3.5deg;--swing-dur:3.8s">' +
          '<svg class="hanger-cord h-9 w-[86px]" viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M100 4 L22 116 M100 4 L178 116" stroke="#9a6a44" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="100" cy="6" r="6" fill="#9a6a44"/></svg>' +
          '<button type="button" class="sign -mt-0.5 h-[118px] w-[8.6rem] md:w-full" data-sign aria-label="' + DAY[d] + ': ' + (closed ? 'closed' : fmt(h[0]) + ' to ' + fmt(h[1])) + (isToday ? ' (today)' : '') + '">' +
            '<span class="sign-inner h-full w-full"><span class="sign-face front">' + front + '</span><span class="sign-face back">' + back + '</span></span>' +
          '</button>' +
        '</div>' +
        (isToday ? '<span class="mt-3 text-[0.85rem] font-semibold text-accent">Today</span>' : '') +
      '</li>';
    }).join('');
    // phones: bring today's tag into view along the cord
    var t0 = $('.is-today', tagsHost);
    if (t0 && tagsHost.scrollWidth > tagsHost.clientWidth) tagsHost.scrollLeft = Math.max(0, t0.offsetLeft - tagsHost.clientWidth / 2 + t0.offsetWidth / 2);
  }

  /* ================================================================
     CUT PICKER (tabs)
     ================================================================ */
  var cuts = $('[data-cuts]');
  if (cuts) {
    var tabs = $$('[role="tab"]', cuts);
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on) {
          panel.hidden = false; panel.classList.add('is-entering');
          requestAnimationFrame(function () { requestAnimationFrame(function () { panel.classList.remove('is-entering'); }); });
        } else panel.hidden = true;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
          n.focus(); select(n); e.preventDefault();
        }
      });
    });
  }
  // "Book a wet cut" pre-selects the form
  $$('[data-pick]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = $('#f-service'); if (sel) { sel.value = a.dataset.pick; sel.closest('.field').classList.add('is-valid'); }
    });
  });

  /* ================================================================
     HEADER, MENU, ACTIVE NAV, MOBILE BAR
     ================================================================ */
  var header = $('[data-header]'), mbar = $('[data-mbar]'), hero = $('[data-hero]');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('py-4', y <= 40); header.classList.toggle('sm:py-5', y <= 40);
    header.classList.toggle('py-2.5', y > 40);
    if (mbar) mbar.classList.toggle('is-on', y > (hero ? hero.offsetHeight * 0.6 : 400));
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var menuBtn = $('[data-menu-btn]'), menu = $('[data-menu]');
  function closeMenu() { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', String(open));
      if (open) header.classList.add('is-scrolled');
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  var links = $$('.nav-link');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['cuts', 'hours', 'shop', 'about', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) secObs.observe(s); });

    /* reveals + week drop-in */
    var rev = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); rev.unobserve(en.target); } });
    }, { threshold: 0.2 });
    $$('[data-reveal], [data-week]').forEach(function (el) { rev.observe(el); });

    /* pause ambient loops when off screen */
    var loopObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) { $$('.swing, .turn', en.target).forEach(function (el) { el.style.animationPlayState = en.isIntersecting ? 'running' : 'paused'; }); });
    });
    $$('section, footer').forEach(function (s) { loopObs.observe(s); });
  } else {
    $$('[data-reveal], [data-week]').forEach(function (el) { el.classList.add('is-in'); });
  }

  // Hero load choreography (once)
  requestAnimationFrame(function () { if (hero) hero.classList.add('loaded'); });

  // Fine pointers: hero mark drifts very slightly with the cursor
  if (hero && !reduce && window.matchMedia('(pointer: fine)').matches) {
    var mark = $('.ld-mark', hero), raf = 0;
    hero.addEventListener('pointermove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        mark.style.translate = (x * -14).toFixed(1) + 'px ' + (y * -8).toFixed(1) + 'px';
      });
    });
  }

  /* ================================================================
     LIGHTBOX (arrows, Esc, swipe)
     ================================================================ */
  var lb = $('[data-lb]'), lbImg = $('[data-lb-img]'), lbCap = $('[data-lb-cap]');
  var items = $$('[data-gallery] a').filter(function (a) { return a.offsetParent !== null || true; });
  var idx = 0, lastFocus = null;
  function visibleItems() { return items.filter(function (a) { return getComputedStyle(a).display !== 'none'; }); }
  function show(i) {
    var list = visibleItems(); idx = (i + list.length) % list.length;
    var a = list[idx], img = $('img', a);
    lbImg.classList.add('is-changing');
    setTimeout(function () {
      lbImg.src = a.getAttribute('href'); lbImg.alt = img.alt; lbCap.textContent = a.dataset.caption || '';
      lbImg.onload = function () { lbImg.classList.remove('is-changing'); };
    }, 120);
  }
  function openLb(i) { lastFocus = document.activeElement; show(i); lb.classList.add('is-open'); document.body.style.overflow = 'hidden'; $('[data-lb-close]').focus(); }
  function closeLb() { lb.classList.remove('is-open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  items.forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); openLb(visibleItems().indexOf(a)); });
  });
  if (lb) {
    $('[data-lb-close]').addEventListener('click', closeLb);
    $('[data-lb-prev]').addEventListener('click', function () { show(idx - 1); });
    $('[data-lb-next]').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'Tab') { // keep focus inside
        var f = $$('button', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });
    var sx = null;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) show(idx + (dx < 0 ? 1 : -1)); sx = null;
    });
  }

  /* ================================================================
     FORM: inline validation, loading, success (the card's sign turns)
     ================================================================ */
  var form = $('[data-form]');
  if (form) {
    var fields = $$('input:not([type=hidden]):not([name=_honey]), select, textarea', form);
    function check(el) {
      var wrap = el.closest('.field'); if (!wrap) return true;
      var ok = el.checkValidity() && !(el.required && !el.value.trim());
      wrap.classList.toggle('is-invalid', !ok);
      wrap.classList.toggle('is-valid', ok && !!el.value.trim());
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    }
    fields.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value || el.required) check(el); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-invalid')) check(el); });
      el.addEventListener('change', function () { check(el); });
    });
    form.addEventListener('submit', function (e) {
      var bad = fields.filter(function (el) { return !check(el); });
      if (bad.length) { e.preventDefault(); bad[0].focus(); return; }
      if (!window.fetch || !window.FormData) return; // plain POST fallback
      e.preventDefault();
      var btn = $('[data-submit]', form); btn.classList.add('is-loading'); btn.disabled = true;
      fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error('bad'); return r.json(); })
        .then(function () {
          btn.classList.remove('is-loading');
          var sign = $('[data-form-sign]'); if (sign) sign.classList.add('is-flipped');
          $('[data-fields]', form).classList.add('opacity-50', 'pointer-events-none');
          btn.classList.add('hidden'); $('[data-form-note]', form).classList.add('hidden');
          var done = $('[data-form-done]', form); done.classList.remove('hidden'); done.focus && done.setAttribute('tabindex', '-1'); done.focus();
        })
        .catch(function () { btn.classList.remove('is-loading'); btn.disabled = false; form.submit(); });
    });
  }

  var yr = $('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();
})();
