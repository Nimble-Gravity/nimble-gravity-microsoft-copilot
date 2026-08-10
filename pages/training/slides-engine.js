/**
 * slides-engine.js
 * Fetches lesson pages for the current module, extracts headings and key
 * content via DOMParser, then builds and initialises a Reveal.js deck.
 *
 * Expects window.SLIDES_CFG to be defined before this script loads:
 *   window.SLIDES_CFG = {
 *     module: 1,
 *     label:  'Workshop 1',
 *     subLabel: 'Foundations',
 *     color:  '#4f9990',
 *     lessons: [
 *       { file: '01-the-copilot-landscape.html', title: 'The Copilot Landscape' },
 *       ...
 *     ]
 *   };
 */
(function () {
  'use strict';

  var cfg = window.SLIDES_CFG;
  if (!cfg) { console.error('slides-engine: SLIDES_CFG not defined'); return; }

  var deck = document.getElementById('deck');
  if (!deck) { console.error('slides-engine: #deck not found'); return; }

  /* ─── Text helpers ─────────────────────────────────────── */

  function textOf(el) {
    return el ? el.textContent.trim() : '';
  }

  /** Return innerHTML of el, preserving <em> but stripping nested scripts. */
  function innerOf(el) {
    if (!el) return '';
    var clone = el.cloneNode(true);
    clone.querySelectorAll('script, style').forEach(function (n) { n.remove(); });
    return clone.innerHTML;
  }

  /** textOf(bodyEl), minus labelEl's text when the label sits inside the body
      (e.g. a <strong> label inside the same <p>) — avoids heading duplication. */
  function textWithout(bodyEl, labelEl) {
    if (!bodyEl) return '';
    if (!labelEl || !bodyEl.contains(labelEl)) return textOf(bodyEl);
    labelEl.setAttribute('data-sl-omit', '');
    var clone = bodyEl.cloneNode(true);
    labelEl.removeAttribute('data-sl-omit');
    var n = clone.querySelector('[data-sl-omit]');
    if (n) n.remove();
    return clone.textContent.trim().replace(/^[\s—–:·-]+/, '');
  }

  /* ─── Extraction ────────────────────────────────────────── */

  /**
   * Parse one lesson HTML string and return an array of slide descriptor objects.
   * @param {string} html   Raw HTML text of the lesson page.
   * @param {string} lessonFile  Filename, e.g. "01-the-copilot-landscape.html"
   * @param {string} fallbackTitle  Used if page-header title not found.
   */
  function extractSlides(html, lessonFile, fallbackTitle) {
    var doc = (new DOMParser()).parseFromString(html, 'text/html');
    var slides = [];

    /* ── Lesson title slide ── */
    var hdr = doc.querySelector('.page-header');
    if (hdr) {
      var titleEl  = hdr.querySelector('h1.title, h1');
      var eyeEl    = hdr.querySelector('.eyebrow');
      var subEl    = hdr.querySelector('.subtitle, p');
      slides.push({
        type:     'lesson-title',
        file:     lessonFile,
        eyebrow:  textOf(eyeEl),
        title:    titleEl ? innerOf(titleEl) : fallbackTitle,
        subtitle: textOf(subEl)
      });
    }

    /* ── Section slides ── */
    doc.querySelectorAll('.section').forEach(function (sec) {
      var h2 = sec.querySelector('h2.sec-title, h2');
      if (!h2) return;

      /* Section-level eyebrow — direct child only, not from inside a card */
      var eyeEl = sec.querySelector(':scope > .sec-eyebrow');
      var subEl = sec.querySelector(':scope > p.sec-sub, :scope > p');

      var isDark = sec.classList.contains('section-dark');
      var bullets = [];

      /* Insight cards */
      sec.querySelectorAll('.insight-card').forEach(function (card) {
        var head = card.querySelector('.sec-eyebrow, h3');
        var body = card.querySelector('p');
        if (head) {
          bullets.push({
            heading: textOf(head),
            body:    body ? textOf(body) : ''
          });
        }
      });

      /* Dev cards */
      sec.querySelectorAll('.dev-card').forEach(function (card) {
        var kicker = card.querySelector('.dev-kicker');
        var h3     = card.querySelector('h3');
        var body   = card.querySelector('p');
        var heading = kicker ? textOf(kicker) + (h3 ? ' — ' + textOf(h3) : '') : textOf(h3);
        if (heading) {
          bullets.push({
            heading: heading,
            body:    body ? textOf(body) : ''
          });
        }
      });

      /* Component cards (.comp-card) */
      sec.querySelectorAll('.comp-card').forEach(function (card) {
        var label = card.querySelector('.comp-label');
        var name  = card.querySelector('.comp-name');
        var body  = card.querySelector('.comp-body, p');
        var heading = (label ? textOf(label) + ': ' : '') + (name ? textOf(name) : '');
        if (heading.trim()) {
          bullets.push({
            heading: heading.trim(),
            body:    body ? textOf(body) : ''
          });
        }
      });

      /* Tip / trick boxes */
      sec.querySelectorAll('.tip-trick, .tip-box, .callout').forEach(function (tip) {
        var label = tip.querySelector('.tip-trick-label, .callout-label, strong');
        var body  = tip.querySelector('p, .tip-trick-copy');
        if (label) {
          bullets.push({
            heading: textOf(label),
            body:    textWithout(body, label),
            isTip:   true
          });
        }
      });

      /* Best-practice items (.bp-item) */
      sec.querySelectorAll('.bp-item').forEach(function (card) {
        var head = card.querySelector('.bp-title');
        var body = card.querySelector('.bp-body, p');
        if (head) {
          bullets.push({
            heading: textOf(head),
            body:    body ? textOf(body) : ''
          });
        }
      });

      /* Hygiene cards (.hy-card) */
      sec.querySelectorAll('.hy-card').forEach(function (card) {
        var label = card.querySelector('.hy-label');
        var title = card.querySelector('.hy-title');
        var body  = card.querySelector('.hy-body, p');
        var heading = (label ? textOf(label) + ': ' : '') + (title ? textOf(title) : '');
        if (heading.trim()) {
          bullets.push({
            heading: heading.trim(),
            body:    body ? textOf(body) : ''
          });
        }
      });

      /* Strategy cards (.sg-card) */
      sec.querySelectorAll('.sg-card').forEach(function (card) {
        var header = card.querySelector('.sg-header');
        var title  = card.querySelector('.sg-title');
        var body   = card.querySelector('p');
        var heading = header ? textOf(header).replace(/^[\u2605-\uFFFF\s✅⚠️❌]+/u, '').trim() : (title ? textOf(title) : '');
        if (!heading && title) heading = textOf(title);
        if (heading) {
          bullets.push({
            heading: heading,
            body:    (title && header ? textOf(title) + (body ? ' — ' + textOf(body) : '') : (body ? textOf(body) : ''))
          });
        }
      });

      /* Reflection cards (.reflect-card) */
      sec.querySelectorAll('.reflect-card').forEach(function (card) {
        var q    = card.querySelector('.reflect-q');
        var hint = card.querySelector('.reflect-hint');
        if (q) {
          bullets.push({
            heading: textOf(q).replace(/^"|"$/g, ''),
            body:    hint ? textOf(hint) : ''
          });
        }
      });

      /* Numbered / comparison list items (qa-row, qa-card, step-card, etc.) */
      sec.querySelectorAll('.qa-card, .step-card, .pro-con-card, .comparison-card').forEach(function (card) {
        var head = card.querySelector('h3, .card-label, strong');
        var body = card.querySelector('p');
        if (head) {
          bullets.push({
            heading: textOf(head),
            body:    textWithout(body, head)
          });
        }
      });

      slides.push({
        type:     'content',
        dark:     isDark,
        eyebrow:  textOf(eyeEl),
        title:    innerOf(h2),
        subtitle: textOf(subEl),
        bullets:  bullets
      });
    });

    return slides;
  }

  /* ─── Slide builders ────────────────────────────────────── */

  function makeSection(className) {
    var s = document.createElement('section');
    s.className = className;
    return s;
  }

  function buildModuleCover() {
    var sec = makeSection('sl-mod-cover');
    sec.innerHTML =
      '<span class="sl-dot" style="background:' + cfg.color + '"></span>' +
      '<div class="sl-mod-num">' + cfg.label + '</div>' +
      '<h1 class="sl-mod-name">' + cfg.subLabel + '</h1>' +
      '<p class="sl-mod-topics">' +
        cfg.lessons.map(function (l) { return l.title; }).join('  ·  ') +
      '</p>' +
      '<a class="sl-home-link" href="../../index.html">← Workshop Home</a>';
    return sec;
  }

  function buildLessonTitle(slide) {
    var sec = makeSection('sl-lesson-cover');
    var html = '';
    if (slide.eyebrow) html += '<div class="sl-eyebrow">' + slide.eyebrow + '</div>';
    html += '<h1 class="sl-title">' + slide.title + '</h1>';
    if (slide.subtitle) html += '<p class="sl-subtitle">' + slide.subtitle + '</p>';
    if (slide.file)     html += '<a class="sl-lesson-open" href="' + slide.file + '">Open full lesson →</a>';
    sec.innerHTML = html;
    return sec;
  }

  function buildContent(slide) {
    var cls = 'sl-content' + (slide.dark ? ' sl-dark' : '');
    var sec = makeSection(cls);
    var html = '';
    if (slide.eyebrow)  html += '<div class="sl-eyebrow">' + slide.eyebrow + '</div>';
    html += '<h2 class="sl-heading">' + slide.title + '</h2>';
    if (slide.subtitle) html += '<p class="sl-subtitle">' + slide.subtitle + '</p>';
    if (slide.bullets.length) {
      html += '<ul class="sl-bullets">';
      slide.bullets.forEach(function (b) {
        html +=
          '<li class="' + (b.isTip ? 'sl-tip' : '') + '">' +
          '<strong>' + b.heading + '</strong>' +
          (b.body ? '<span class="sl-bullet-body"> — ' + b.body + '</span>' : '') +
          '</li>';
      });
      html += '</ul>';
    }
    sec.innerHTML = html;
    return sec;
  }

  function buildEnd() {
    var sec = makeSection('sl-end');
    var firstFile = cfg.lessons.length ? cfg.lessons[0].file : '../../index.html';
    sec.innerHTML =
      '<span class="sl-dot" style="background:' + cfg.color + '"></span>' +
      '<h2>' + cfg.label + ' Complete</h2>' +
      '<div class="sl-end-links">' +
        '<a href="' + firstFile + '">Open Lessons →</a>' +
        '<a href="../../index.html">Workshop Home</a>' +
      '</div>';
    return sec;
  }

  /* ─── Fetch → extract → assemble → init ─────────────────── */

  var moduleCover = buildModuleCover();

  var promises = cfg.lessons.map(function (lesson) {
    return fetch(lesson.file)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (html) {
        return extractSlides(html, lesson.file, lesson.title);
      })
      .catch(function (err) {
        console.warn('slides-engine: could not load ' + lesson.file, err);
        return [{
          type:     'content',
          dark:     false,
          eyebrow:  'Load error',
          title:    lesson.title,
          subtitle: 'Could not fetch ' + lesson.file,
          bullets:  []
        }];
      });
  });

  Promise.all(promises).then(function (allSlides) {
    /* Rebuild deck */
    deck.innerHTML = '';
    deck.appendChild(moduleCover);

    allSlides.forEach(function (lessonSlides) {
      lessonSlides.forEach(function (slide) {
        deck.appendChild(
          slide.type === 'lesson-title' ? buildLessonTitle(slide) : buildContent(slide)
        );
      });
    });

    deck.appendChild(buildEnd());

    /* Shrink any slide whose content overflows the fixed 1280×720 box so
       nothing is ever clipped. ponytail: CSS zoom autofit — no-op in browsers
       without zoom support; swap for em-based scaling if that ever matters. */
    function fitSlides() {
      deck.querySelectorAll('section').forEach(function (sec) {
        var prevDisplay = sec.style.display;
        sec.style.display = 'flex';   /* Reveal hides non-active slides; show to measure */
        var zoom = 1;
        while (sec.scrollHeight > sec.clientHeight && zoom > 0.4) {
          zoom -= 0.05;
          sec.style.zoom = zoom;
        }
        sec.style.display = prevDisplay;
      });
    }

    /* Init Reveal */
    Reveal.initialize({
      hash:            true,
      transition:      'fade',
      transitionSpeed: 'fast',
      controls:        true,
      progress:        true,
      slideNumber:     'c/t',
      center:          false,
      width:           1280,
      height:          720,
      margin:          0.04
    }).then(fitSlides);
  });

})();
