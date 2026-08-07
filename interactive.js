/*
 * interactive.js — client-only workshop interactivity (quizzes + maturity poll).
 *
 * Self-contained IIFE that injects its own CSS, then scans the page for mount
 * points and hydrates them. No backend, no network: all state lives in
 * localStorage under a single versioned key. Cross-cohort aggregation is out of
 * scope (would need a backend) — the maturity poll shows each attendee only
 * their own answer; the facilitator tallies the room live.
 *
 * Author API (drop a placeholder div; this script fills it):
 *   <div class="ix-quiz" data-ix-quiz="m1" data-ix-pass="3"></div>
 *   <div class="ix-poll" data-ix-poll="maturity"></div>
 *   <div class="ix-readout"></div>
 *
 * Slides-safety: mount classes (ix-*) and everything rendered inside are NOT any
 * of the 9 card classes slides-engine.js extracts, so widgets never leak onto a
 * deck. Place a widget in a <div class="section"> WITHOUT an h2.sec-title and the
 * engine generates no slide for it at all (the widget renders its own heading).
 */
(function () {
  'use strict';

  var LS_KEY = 'ng-copilot:v1';

  // ── Storage layer (self-healing; survives private-mode / disabled storage) ──
  function getStore() {
    try {
      var v = JSON.parse(window.localStorage.getItem(LS_KEY));
      return (v && typeof v === 'object') ? v : {};
    } catch (e) { return {}; }
  }
  function setStore(s) {
    try {
      s.meta = { version: 1 };
      window.localStorage.setItem(LS_KEY, JSON.stringify(s));
      return true;
    } catch (e) { return false; }
  }
  function saveQuiz(id, result) { var s = getStore(); s.quiz = s.quiz || {}; s.quiz[id] = result; setStore(s); }
  function getQuiz(id)          { var s = getStore(); return (s.quiz || {})[id] || null; }
  function savePoll(id, value)  { var s = getStore(); s.poll = s.poll || {}; s.poll[id] = { value: value, ts: Date.now() }; setStore(s); }
  function getPoll(id)          { var s = getStore(); return (s.poll || {})[id] || null; }
  function saveProfile(name)    { var s = getStore(); s.profile = { name: name, ts: Date.now() }; setStore(s); }
  function getProfile()         { var s = getStore(); return s.profile || null; }
  function saveAck(id, name)    { var s = getStore(); s.ack = s.ack || {}; s.ack[id] = { name: name, ts: Date.now() }; setStore(s); }
  function getAck(id)           { var s = getStore(); return (s.ack || {})[id] || null; }
  function clearAck(id)         { var s = getStore(); if (s.ack) { delete s.ack[id]; setStore(s); } }
  function resetAll()           { try { window.localStorage.removeItem(LS_KEY); } catch (e) {} }

  var MODULE_LABELS = { m1: 'Module 1 · Foundations & Copilot Chat', m2: 'Module 2 · Copilot in the Apps', m3: 'Module 3 · The Researcher Agent', m4: 'Module 4 · Analyst & The Close Room' };
  function passedCount() { var s = getStore(); var q = s.quiz || {}; var n = 0; ['m1','m2','m3','m4'].forEach(function (m) { if (q[m] && q[m].passed) n++; }); return n; }
  function fmtDate(ts) { var d = ts ? new Date(ts) : new Date(); var m = ['January','February','March','April','May','June','July','August','September','October','November','December']; return m[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }

  // ── Content config (questions live here, not in lesson HTML) ────────────────
  var QUIZZES = {
    m1: {
      label: 'Module 1 · Foundations & Copilot Chat',
      questions: [
        { q: 'Before trusting a Copilot Chat answer, what should you check first?',
          options: ['Nothing — a confident answer is a correct answer', 'Where it came from: the sources and citations Copilot used, and whether Work IQ, your prompt, and any attached files actually scoped it to the right place', 'Whether the model is the largest one available'],
          answer: 1 },
        { q: 'Which of your organization’s data can Copilot see when it answers you?',
          options: ['Everything in the tenant, including other teams’ files', 'Only content you already have at least view permission to', 'Only files you created yourself'],
          answer: 1 },
        { q: 'Microsoft’s four elements of a strong prompt are…',
          options: ['Goal, Context, Expectations, Source', 'Persona, Task, Format, Tone', 'Who, What, When, Where'],
          answer: 0 },
        { q: 'You want the same variance-commentary prompt to run itself every Monday morning. What do you use?',
          options: ['A scheduled prompt — any prompt on a recurring schedule, up to 10 per user', 'A macro in Excel', 'You can’t — Copilot prompts are one-off'],
          answer: 0 }
      ]
    },
    m2: {
      label: 'Module 2 · Copilot in the Apps',
      questions: [
        { q: 'When Copilot in Excel runs a forecast or a statistical analysis, what is it actually doing?',
          options: ['Guessing from patterns in the visible cells', 'Writing and running Python against your data, right in the workbook', 'Sending the workbook to a human analyst'],
          answer: 1 },
        { q: 'How do you verify exactly which cells Copilot changed in a workbook?',
          options: ['You can’t — you have to diff it by hand', 'The Show Changes pane attributes every edit Copilot made', 'Copilot never edits cells directly'],
          answer: 1 },
        { q: 'The fastest route from a set of findings to a structured, on-brand deck is…',
          options: ['Copy-pasting into a blank deck', 'PowerPoint’s Narrative Builder, referencing your source file and an approved brand template', 'Asking Copilot Chat for slide text and formatting it yourself'],
          answer: 1 },
        { q: 'You missed a meeting where the close calendar changed. The best Copilot move is…',
          options: ['Ask a colleague to retype their notes', 'Open the Teams intelligent recap — AI notes, speaker attribution, and action items', 'Wait for the official minutes next week'],
          answer: 1 }
      ]
    },
    m3: {
      label: 'Module 3 · The Researcher Agent',
      questions: [
        { q: 'Before it starts working, Researcher usually asks you clarifying questions. You should…',
          options: ['Skip them — the first prompt is all that matters', 'Answer them carefully — engaging with the clarifying phase is Microsoft’s #1 stated best practice', 'Cancel and rewrite the prompt from scratch'],
          answer: 1 },
        { q: 'How long can a complex Researcher run take?',
          options: ['A few seconds, like a chat reply', '10–45 minutes — so kick it off early and keep working', 'It always takes exactly five minutes'],
          answer: 1 },
        { q: 'What can Researcher draw on for a report?',
          options: ['Only the public web', 'Only files you attach', 'The web AND your work data — files, mail, meetings, chats — plus connected third-party sources, scoped per run'],
          answer: 2 },
        { q: 'Researcher and Analyst share a usage pool. As of mid-2026 it is…',
          options: ['Unlimited runs', '25 combined queries per user per month, resetting on the 1st', '5 runs per day'],
          answer: 1 }
      ]
    },
    m4: {
      label: 'Module 4 · Analyst & The Close Room',
      questions: [
        { q: 'What is Analyst’s signature capability?',
          options: ['It formats spreadsheets faster than Excel', 'Chain-of-thought data analysis that writes and runs Python — with the code visible so you can verify the method', 'It replaces the need for a data warehouse'],
          answer: 1 },
        { q: 'When do you reach for Analyst instead of Copilot in Excel?',
          options: ['Never — they are the same feature', 'When the question spans multiple files or needs forecasting/statistics, rather than edits inside one open workbook', 'Only when Excel is not installed'],
          answer: 1 },
        { q: 'You need a cited brief on a diligence target that pulls from the data room AND the public web. Which tool?',
          options: ['Researcher — deep, multi-source research with citations', 'Analyst — it is newer', 'Excel Copilot — everything starts in Excel'],
          answer: 0 },
        { q: 'You need a quick formula fix and a chart in the workbook you have open. Which tool?',
          options: ['Researcher', 'Copilot in Excel — native edits in the open workbook, with change attribution', 'A scheduled prompt'],
          answer: 1 },
        { q: 'Feeding Analyst clean, tabular data with clear headers matters because…',
          options: ['Analyst refuses files with more than one tab', 'Its Python runs against your columns as-is — clean structure in, reliable analysis out', 'It only reads the first 100 rows'],
          answer: 1 },
        { q: 'Which is TRUE about how Copilot handles your prompts and data?',
          options: ['Prompts and responses are used to train the foundation models', 'Prompts, responses, and Graph data are NOT used to train the foundation models', 'Copilot can read any file in the tenant, regardless of permissions'],
          answer: 1 },
        { q: 'A compliance nuance your team should know about the agents:',
          options: ['Researcher and Analyst session content is not covered by eDiscovery by default — save important outputs to files that ARE governed', 'Agent sessions are printed and mailed to Compliance automatically', 'Researcher reports are legally citable audit evidence'],
          answer: 0 }
      ]
    }
  };

  var POLLS = {
    maturity: {
      title: 'Where are you on the Copilot maturity scale?',
      levels: [
        { title: 'Curious',    desc: 'Not really using Copilot for work yet.' },
        { title: 'Dabbling',   desc: 'Occasional Copilot Chat questions, no real workflow.' },
        { title: 'In the flow', desc: 'Using Copilot in Excel, Outlook, or Word most weeks.' },
        { title: 'Advanced',   desc: 'Grounded prompts, referenced files, scheduled prompts.' },
        { title: 'Agentic',    desc: 'Already putting Researcher or Analyst on real work.' }
      ]
    }
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('copilot-ix-styles')) return;
    var s = document.createElement('style');
    s.id = 'copilot-ix-styles';
    s.textContent = [
      '.ix-quiz,.ix-poll,.ix-readout{margin-top:28px;}',
      '.ix-card{border:1px solid var(--border);border-radius:14px;background:var(--white);padding:26px 28px;box-shadow:0 4px 18px rgba(33,15,54,.05);}',
      '.ix-kicker{font-family:\'Roboto Mono\',monospace;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--violet);}',
      '.ix-card-title{font-size:20px;font-weight:600;color:var(--navy);margin:6px 0 2px;line-height:1.25;}',
      '.ix-card-sub{font-size:14px;color:var(--slate);margin:0;}',
      '.ix-q{margin-top:20px;}',
      '.ix-q-text{font-size:15px;font-weight:600;color:var(--navy);margin-bottom:10px;}',
      '.ix-opts{display:flex;flex-direction:column;gap:8px;}',
      '.ix-opt{display:flex;align-items:center;gap:11px;text-align:left;width:100%;padding:11px 14px;border:1px solid var(--border);border-radius:10px;background:var(--off);color:var(--slate);font-size:14px;font-family:inherit;line-height:1.45;cursor:pointer;transition:border-color .15s,background .15s,color .15s;}',
      '.ix-opt:hover{border-color:var(--mint-on-dark);}',
      '.ix-opt:disabled{cursor:default;}',
      '.ix-opt.selected{border-color:var(--teal);background:rgba(47,107,102,.08);color:var(--navy);font-weight:600;}',
      '.ix-opt.correct{border-color:var(--mint-on-dark);background:rgba(64,140,132,.16);color:var(--navy);font-weight:600;}',
      '.ix-opt.incorrect{border-color:var(--ember);background:rgba(196,59,49,.10);color:var(--navy);}',
      '.ix-mark{flex:0 0 auto;width:18px;height:18px;border-radius:50%;border:2px solid #c3c2cf;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;}',
      '.ix-opt.selected .ix-mark{border-color:var(--teal);background:var(--teal);}',
      '.ix-opt.correct .ix-mark{border-color:var(--mint-on-dark);background:var(--mint-on-dark);}',
      '.ix-opt.incorrect .ix-mark{border-color:var(--ember);background:var(--ember);}',
      '.ix-actions{margin-top:22px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;}',
      '.ix-btn{background:var(--teal);color:var(--white);border:none;padding:10px 20px;min-height:40px;border-radius:8px;font-size:14px;font-weight:600;font-family:inherit;letter-spacing:.3px;cursor:pointer;transition:background .2s,box-shadow .2s;box-shadow:0 2px 8px rgba(33,15,54,.12);}',
      '.ix-btn:hover{background:var(--mint);}',
      '.ix-btn--ghost{background:transparent;color:var(--teal);border:1px solid var(--border);box-shadow:none;}',
      '.ix-btn--ghost:hover{background:transparent;border-color:var(--mint);color:var(--mint);}',
      '.ix-hint{font-size:13px;color:var(--slate);}',
      '.ix-result{margin-top:20px;padding:14px 16px;border-radius:10px;font-size:15px;display:flex;align-items:center;gap:10px;line-height:1.4;}',
      '.ix-result.pass{background:rgba(64,140,132,.12);border:1px solid rgba(64,140,132,.32);color:var(--teal);}',
      '.ix-result.fail{background:var(--amberL);border:1px solid rgba(232,163,23,.32);color:var(--amber-accessible);}',
      '.ix-result-badge{font-size:18px;}',
      '.ix-done{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}',
      '.ix-done-icon{flex:0 0 auto;width:44px;height:44px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:22px;color:#fff;background:var(--mint-on-dark);}',
      '.ix-done-icon.fail{background:var(--amber);}',
      '.ix-done-copy{flex:1 1 220px;min-width:0;}',
      '.ix-done-title{font-size:17px;font-weight:600;color:var(--navy);}',
      '.ix-done-sub{font-size:14px;color:var(--slate);margin-top:2px;}',
      // quiz flow (one question at a time)
      '.ixq{position:relative;overflow:hidden;}',
      '.ixq-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;}',
      '.ixq-counter{font-family:\'Roboto Mono\',monospace;font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--slate);}',
      '.ixq-dots{display:flex;gap:7px;}',
      '.ixq-dot{width:9px;height:9px;border-radius:50%;background:var(--border);transition:background .25s,transform .25s;}',
      '.ixq-dot.done{background:var(--mint-on-dark);}',
      '.ixq-dot.active{background:var(--teal);transform:scale(1.4);}',
      '.ixq-stage{position:relative;margin-top:6px;}',
      '.ixq-panel{transition:opacity .32s ease,transform .32s ease;}',
      '.ixq-panel.ixq-enter{opacity:0;transform:translateX(26px);}',
      '.ixq-panel.ixq-enter.ixq-active{opacity:1;transform:translateX(0);}',
      '.ixq-q{font-size:17px;font-weight:600;color:var(--navy);margin:18px 0 14px;line-height:1.35;}',
      '.ixq-opt-pop{animation:ixq-pop .42s cubic-bezier(.2,.9,.3,1.4) both;}',
      '.ixq-feedback{margin-top:14px;font-size:14px;font-weight:600;opacity:0;max-height:0;overflow:hidden;transition:opacity .25s ease,max-height .25s ease;}',
      '.ixq-feedback.show{opacity:1;max-height:88px;}',
      '.ixq-feedback.good{color:var(--teal);}',
      '.ixq-feedback.bad{color:var(--amber-accessible);}',
      '.ixq-next{margin-top:18px;min-height:40px;}',
      '.ixq-next .ix-btn{animation:ixq-rise .3s ease both;}',
      '.ixq-result-panel{text-align:center;padding:12px 0 4px;}',
      '.ixq-badge{font-size:46px;line-height:1;margin:8px 0 8px;display:inline-block;animation:ixq-pop .55s cubic-bezier(.2,.9,.3,1.5) both;}',
      '.ixq-result-title{font-size:24px;font-weight:700;color:var(--navy);}',
      '.ixq-result-score{font-size:16px;color:var(--slate);margin-top:6px;font-family:\'Roboto Mono\',monospace;}',
      '.ixq-result-sub{font-size:14px;color:var(--slate);margin-top:8px;line-height:1.5;max-width:46ch;margin-left:auto;margin-right:auto;}',
      '.ixq-result-panel .ix-actions{justify-content:center;}',
      '.ixq-confetti{position:absolute;inset:0;overflow:hidden;pointer-events:none;border-radius:14px;}',
      '.ixq-confetti-piece{position:absolute;top:-14px;width:9px;height:14px;border-radius:2px;opacity:0;animation:ixq-fall 1.2s ease-in forwards;}',
      '@keyframes ixq-fall{0%{opacity:1;transform:translateY(-10%) translateX(0) rotate(0);}100%{opacity:0;transform:translateY(440px) translateX(calc(var(--dx,0) * 120px)) rotate(var(--rot,180deg));}}',
      '@keyframes ixq-pop{0%{transform:scale(0);}60%{transform:scale(1.15);}100%{transform:scale(1);}}',
      '@keyframes ixq-rise{0%{opacity:0;transform:translateY(8px);}100%{opacity:1;transform:translateY(0);}}',
      '@media(prefers-reduced-motion:reduce){.ixq-panel,.ixq-badge,.ixq-next .ix-btn,.ixq-opt-pop{transition:none !important;animation:none !important;}.ixq-dot{transition:none;}}',
      // poll
      '.ix-scale{display:flex;flex-direction:column;gap:10px;margin-top:18px;}',
      '.ix-level{display:flex;align-items:flex-start;gap:14px;width:100%;text-align:left;padding:13px 16px;border:1px solid var(--border);border-radius:12px;background:var(--off);font-family:inherit;cursor:pointer;transition:border-color .15s,background .15s,transform .1s;}',
      '.ix-level:hover{border-color:var(--violet);}',
      '.ix-level.selected{border-color:var(--violet);background:rgba(140,71,228,.08);}',
      '.ix-level-num{flex:0 0 auto;width:26px;height:26px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-family:\'Roboto Mono\',monospace;font-size:12px;font-weight:700;color:var(--violet);background:rgba(140,71,228,.12);}',
      '.ix-level.selected .ix-level-num{color:#fff;background:var(--violet);}',
      '.ix-level-title{font-size:15px;font-weight:600;color:var(--navy);}',
      '.ix-level-desc{font-size:13px;color:var(--slate);margin-top:2px;}',
      '.ix-poll-note{margin-top:14px;font-size:13px;color:var(--slate);font-style:italic;}',
      // readout
      '.ix-readout-grid{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;}',
      '.ix-pill{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;font-size:13px;font-weight:600;border:1px solid var(--border);background:var(--off);color:var(--slate);}',
      '.ix-pill.on{border-color:rgba(64,140,132,.4);background:rgba(64,140,132,.12);color:var(--teal);}',
      '.ix-note{margin-top:16px;font-size:13px;color:var(--slate);line-height:1.6;}',
      // profile
      '.ix-field{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:18px;}',
      '.ix-input{flex:1 1 240px;min-width:0;padding:11px 14px;border:1px solid var(--border);border-radius:10px;font-size:15px;font-family:inherit;color:var(--navy);background:var(--off);}',
      '.ix-input:focus{outline:none;border-color:var(--teal);}',
      '.ix-saved{margin-top:12px;font-size:14px;color:var(--teal);font-weight:600;}',
      // progress
      '.ix-prog{display:flex;flex-direction:column;gap:10px;margin-top:18px;}',
      '.ix-prog-row{display:flex;align-items:center;gap:14px;padding:12px 16px;border:1px solid var(--border);border-radius:12px;background:var(--off);}',
      '.ix-prog-row.on{border-color:rgba(64,140,132,.4);background:rgba(64,140,132,.1);}',
      '.ix-prog-check{flex:0 0 auto;width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;background:#c3c2cf;}',
      '.ix-prog-row.on .ix-prog-check{background:var(--mint-on-dark);}',
      '.ix-prog-label{flex:1 1 auto;min-width:0;font-size:15px;font-weight:600;color:var(--navy);}',
      '.ix-prog-score{font-size:13px;color:var(--slate);font-family:\'Roboto Mono\',monospace;}',
      '.ix-bar{height:10px;border-radius:999px;background:var(--border);overflow:hidden;margin-top:18px;}',
      '.ix-bar-fill{height:100%;background:var(--mint-on-dark);transition:width .4s ease;}',
      '.ix-prog-summary{margin-top:12px;font-size:15px;color:var(--navy);font-weight:600;}',
      // certificate
      '.ix-cert{margin-top:18px;border:2px solid var(--teal);border-radius:16px;padding:40px 36px;text-align:center;background:linear-gradient(180deg,#fff, #f7faf9);}',
      '.ix-cert-eyebrow{font-family:\'Roboto Mono\',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--teal);}',
      '.ix-cert-title{font-size:26px;font-weight:700;color:var(--navy);margin:10px 0 6px;}',
      '.ix-cert-line{font-size:15px;color:var(--slate);}',
      '.ix-cert-name{font-size:30px;font-weight:700;color:var(--navy);margin:14px 0;border-bottom:2px solid var(--border);display:inline-block;padding:0 24px 8px;}',
      '.ix-cert-meta{font-size:13px;color:var(--slatel);margin-top:14px;}',
      '.ix-cert-disclaimer{margin-top:18px;font-size:12px;color:var(--slatel);font-style:italic;}',
      '.ix-locked{margin-top:18px;border:1px dashed var(--border);border-radius:14px;padding:30px 28px;text-align:center;background:var(--off);}',
      '.ix-locked-icon{font-size:28px;}',
      '.ix-locked-title{font-size:18px;font-weight:600;color:var(--navy);margin-top:8px;}',
      '.ix-locked-sub{font-size:14px;color:var(--slate);margin-top:6px;}',
      // acknowledgment
      '.ix-check-row{display:flex;align-items:flex-start;gap:11px;margin-top:16px;font-size:15px;color:var(--navy);line-height:1.5;cursor:pointer;}',
      '.ix-check-row input{margin-top:3px;flex:0 0 auto;width:18px;height:18px;cursor:pointer;}',
      // print: when printing the certificate, show only the print layer
      '.ix-print-layer{display:none;}',
      '@media print{body.ix-printing > *:not(.ix-print-layer){display:none !important;} .ix-print-layer{display:block !important;padding:0;} .ix-print-layer .ix-cert{margin:0;border-width:3px;}}'
    ].join('');
    document.head.appendChild(s);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // ── Quiz ────────────────────────────────────────────────────────────────────
  function renderQuiz(mount) {
    var id = mount.getAttribute('data-ix-quiz');
    var cfg = QUIZZES[id];
    if (!cfg) return;
    var total = cfg.questions.length;
    var pass = parseInt(mount.getAttribute('data-ix-pass'), 10);
    if (isNaN(pass)) pass = Math.ceil(total * 0.6);

    renderQuizFlow(mount, id, cfg, total, pass);
  }

  // One question at a time: select → instant feedback → Next, with animated
  // transitions and a confetti celebration on a pass. Saves the same
  // {passed, score, total, ts} shape so progress/certificate are unaffected.
  function renderQuizFlow(mount, id, cfg, total, pass) {
    mount.innerHTML = '';
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var card = el('div', 'ix-card ixq');
    card.appendChild(el('div', 'ix-kicker', 'Knowledge check · ' + cfg.label));

    var prior = getQuiz(id);
    if (prior && prior.passed) {
      card.appendChild(el('p', 'ix-card-sub', '✓ You’ve already passed this (' + prior.score + '/' + prior.total + '). Run through it again any time.'));
    }

    var head = el('div', 'ixq-head');
    var counter = el('div', 'ixq-counter', 'Question 1 of ' + total);
    head.appendChild(counter);
    var dots = el('div', 'ixq-dots');
    var dotEls = [];
    for (var i = 0; i < total; i++) { var dn = el('span', 'ixq-dot'); dots.appendChild(dn); dotEls.push(dn); }
    head.appendChild(dots);
    card.appendChild(head);

    var stage = el('div', 'ixq-stage');
    card.appendChild(stage);

    var score = 0;
    var current = 0;

    function paintDots() {
      dotEls.forEach(function (dot, k) {
        dot.className = 'ixq-dot' + (k < current ? ' done' : '') + (k === current ? ' active' : '');
      });
    }

    // Replace the stage panel, sliding the new one in (unless reduced motion).
    function swap(node) {
      if (reduce || !stage.firstChild) { stage.innerHTML = ''; stage.appendChild(node); return; }
      stage.innerHTML = '';
      node.classList.add('ixq-enter');
      stage.appendChild(node);
      requestAnimationFrame(function () { requestAnimationFrame(function () { node.classList.add('ixq-active'); }); });
    }

    function buildQuestion(idx) {
      var qcfg = cfg.questions[idx];
      counter.textContent = 'Question ' + (idx + 1) + ' of ' + total;
      paintDots();

      var panel = el('div', 'ixq-panel');
      panel.appendChild(el('div', 'ixq-q', (idx + 1) + '. ' + qcfg.q));
      var opts = el('div', 'ix-opts');
      var feedback = el('div', 'ixq-feedback');
      var nextWrap = el('div', 'ixq-next');
      var optBtns = [];
      var answered = false;

      qcfg.options.forEach(function (optText, oi) {
        var b = el('button', 'ix-opt');
        b.type = 'button';
        b.appendChild(el('span', 'ix-mark'));
        b.appendChild(el('span', null, optText));
        b.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          var correct = oi === qcfg.answer;
          if (correct) score++;
          optBtns.forEach(function (ob, k) {
            ob.disabled = true;
            if (k === qcfg.answer) { ob.classList.add('correct'); if (!reduce) ob.classList.add('ixq-opt-pop'); }
            else if (k === oi) ob.classList.add('incorrect');
          });
          feedback.className = 'ixq-feedback show ' + (correct ? 'good' : 'bad');
          feedback.textContent = correct ? 'Correct.' : 'Not quite — the right answer is highlighted.';
          var isLast = idx === total - 1;
          var nb = el('button', 'ix-btn', isLast ? 'See results →' : 'Next question →');
          nb.type = 'button';
          nb.addEventListener('click', function () {
            if (isLast) { showResults(); }
            else { current = idx + 1; swap(buildQuestion(idx + 1)); }
          });
          nextWrap.appendChild(nb);
        });
        optBtns.push(b);
        opts.appendChild(b);
      });

      panel.appendChild(opts);
      panel.appendChild(feedback);
      panel.appendChild(nextWrap);
      return panel;
    }

    function showResults() {
      var passed = score >= pass;
      saveQuiz(id, { passed: passed, score: score, total: total, ts: Date.now() });
      current = total;
      dotEls.forEach(function (dot) { dot.className = 'ixq-dot done'; });
      counter.textContent = passed ? 'Complete' : 'Almost there';

      var panel = el('div', 'ixq-panel ixq-result-panel');
      panel.appendChild(el('div', 'ixq-badge' + (passed ? ' pass' : ' fail'), passed ? '🎉' : '↻'));
      panel.appendChild(el('div', 'ixq-result-title', passed ? 'You passed!' : 'So close.'));
      panel.appendChild(el('div', 'ixq-result-score', 'You scored ' + score + ' / ' + total + '.'));
      panel.appendChild(el('div', 'ixq-result-sub', passed
        ? 'Module complete — it now counts toward your certificate.'
        : 'You need ' + pass + ' of ' + total + ' to pass. Give it another go — you’ve got this.'));

      var actions = el('div', 'ix-actions');
      if (passed) {
        var prog = el('a', 'ix-btn', 'See my progress →');
        prog.href = '../workshops/my-progress.html';
        actions.appendChild(prog);
      }
      var again = el('button', 'ix-btn' + (passed ? ' ix-btn--ghost' : ''), passed ? 'Retake' : 'Try again');
      again.type = 'button';
      again.addEventListener('click', function () { renderQuizFlow(mount, id, cfg, total, pass); });
      actions.appendChild(again);
      panel.appendChild(actions);

      swap(panel);
      if (passed && !reduce) burstConfetti(card);
    }

    stage.appendChild(buildQuestion(0));
    mount.appendChild(card);
  }

  // Lightweight CSS confetti burst, scoped to the quiz card. No libraries.
  function burstConfetti(host) {
    var layer = el('div', 'ixq-confetti');
    var colors = ['#2f6b66', '#8c47e4', '#e8a317', '#2b6880', '#408c84'];
    for (var i = 0; i < 28; i++) {
      var p = el('span', 'ixq-confetti-piece');
      p.style.background = colors[i % colors.length];
      p.style.left = (8 + Math.random() * 84) + '%';
      p.style.setProperty('--dx', (Math.random() * 2 - 1).toFixed(2));
      p.style.setProperty('--rot', Math.round(Math.random() * 540 - 270) + 'deg');
      p.style.animationDelay = (Math.random() * 0.15).toFixed(2) + 's';
      p.style.animationDuration = (0.9 + Math.random() * 0.7).toFixed(2) + 's';
      layer.appendChild(p);
    }
    host.appendChild(layer);
    setTimeout(function () { if (layer.parentNode) layer.parentNode.removeChild(layer); }, 1900);
  }

  function renderQuizDone(mount, id, cfg, saved, pass) {
    mount.innerHTML = '';
    var card = el('div', 'ix-card');
    card.appendChild(el('div', 'ix-kicker', 'Knowledge check · ' + cfg.label));
    var done = el('div', 'ix-done');
    var icon = el('div', 'ix-done-icon' + (saved.passed ? '' : ' fail'), saved.passed ? '✓' : '↻');
    done.appendChild(icon);
    var copy = el('div', 'ix-done-copy');
    copy.appendChild(el('div', 'ix-done-title', saved.passed ? 'Module complete' : 'Not passed yet'));
    copy.appendChild(el('div', 'ix-done-sub', 'Your score: ' + saved.score + '/' + saved.total + '.'));
    done.appendChild(copy);
    card.appendChild(done);
    var actions = el('div', 'ix-actions');
    var retake = el('button', 'ix-btn ix-btn--ghost', 'Retake');
    retake.type = 'button';
    retake.addEventListener('click', function () {
      renderQuizFlow(mount, id, cfg, cfg.questions.length, pass);
    });
    actions.appendChild(retake);
    card.appendChild(actions);
    mount.appendChild(card);
  }

  // ── Maturity poll (client-only — shows only your own answer) ────────────────
  function renderPoll(mount) {
    var id = mount.getAttribute('data-ix-poll') || 'maturity';
    var cfg = POLLS[id];
    if (!cfg) return;
    mount.innerHTML = '';
    var card = el('div', 'ix-card');
    card.appendChild(el('div', 'ix-kicker', 'Live poll'));
    card.appendChild(el('div', 'ix-card-title', cfg.title));
    card.appendChild(el('p', 'ix-card-sub', 'Pick the one that fits you best today.'));

    var saved = getPoll(id);
    var scale = el('div', 'ix-scale');
    var btns = [];
    cfg.levels.forEach(function (lvl, i) {
      var b = el('button', 'ix-level');
      b.type = 'button';
      b.appendChild(el('span', 'ix-level-num', String(i + 1)));
      var body = el('span', 'ix-level-body');
      body.appendChild(el('span', 'ix-level-title', lvl.title));
      body.appendChild(el('span', 'ix-level-desc', lvl.desc));
      body.style.display = 'block';
      b.appendChild(body);
      if (saved && saved.value === i) b.classList.add('selected');
      b.addEventListener('click', function () {
        savePoll(id, i);
        btns.forEach(function (ob, k) { ob.classList.toggle('selected', k === i); });
      });
      btns.push(b);
      scale.appendChild(b);
    });
    card.appendChild(scale);
    card.appendChild(el('p', 'ix-poll-note', 'Your answer is saved on this device only — your facilitator tallies the room live.'));
    mount.appendChild(card);
  }

  // ── Personal readout (local progress only; no cohort aggregation) ───────────
  function renderReadout(mount) {
    mount.innerHTML = '';
    var s = getStore();
    var quiz = s.quiz || {};
    var card = el('div', 'ix-card');
    card.appendChild(el('div', 'ix-kicker', 'Your progress'));
    card.appendChild(el('div', 'ix-card-title', 'Personal workshop readout'));
    card.appendChild(el('p', 'ix-card-sub', 'A snapshot of your own progress on this device.'));

    var grid = el('div', 'ix-readout-grid');
    ['m1', 'm2', 'm3', 'm4'].forEach(function (m, i) {
      var passed = quiz[m] && quiz[m].passed;
      var pill = el('span', 'ix-pill' + (passed ? ' on' : ''));
      pill.appendChild(el('span', null, (passed ? '✓ ' : '○ ') + 'Module ' + (i + 1)));
      grid.appendChild(pill);
    });
    card.appendChild(grid);

    card.appendChild(el('p', 'ix-note',
      'This readout reflects your local progress only. Cross-cohort aggregation (who engaged, duplicate use cases, the IT readout) needs a backend and is out of scope for this version.'));

    var actions = el('div', 'ix-actions');
    var reset = el('button', 'ix-btn ix-btn--ghost', 'Clear my data');
    reset.type = 'button';
    reset.addEventListener('click', function () { resetAll(); renderReadout(mount); document.querySelectorAll('[data-ix-quiz]').forEach(renderQuiz); document.querySelectorAll('[data-ix-poll]').forEach(renderPoll); });
    actions.appendChild(reset);
    card.appendChild(actions);
    mount.appendChild(card);
  }

  // ── Profile (a name, stored locally) ────────────────────────────────────────
  function renderProfile(mount) {
    mount.innerHTML = '';
    var prof = getProfile();
    var card = el('div', 'ix-card');
    card.appendChild(el('div', 'ix-kicker', 'Your profile'));
    card.appendChild(el('div', 'ix-card-title', 'Who you are'));
    card.appendChild(el('p', 'ix-card-sub', 'Add your name so your progress and certificate are personalized. Stored on this device only.'));
    var field = el('div', 'ix-field');
    var input = el('input', 'ix-input');
    input.type = 'text';
    input.placeholder = 'Your full name';
    if (prof && prof.name) input.value = prof.name;
    var save = el('button', 'ix-btn', 'Save');
    save.type = 'button';
    field.appendChild(input);
    field.appendChild(save);
    card.appendChild(field);
    var saved = el('p', 'ix-saved');
    saved.style.display = 'none';
    card.appendChild(saved);
    function doSave() {
      var name = input.value.trim();
      if (!name) return;
      saveProfile(name);
      saved.textContent = 'Saved — hi, ' + name + '.';
      saved.style.display = 'block';
      refreshProgressViews();
    }
    save.addEventListener('click', doSave);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSave(); });
    mount.appendChild(card);
  }

  // ── Progress dashboard ──────────────────────────────────────────────────────
  function renderProgress(mount) {
    mount.innerHTML = '';
    var s = getStore();
    var quiz = s.quiz || {};
    var prof = getProfile();
    var card = el('div', 'ix-card');
    card.appendChild(el('div', 'ix-kicker', 'Your progress'));
    card.appendChild(el('div', 'ix-card-title', (prof && prof.name) ? (prof.name + "'s progress") : 'Your progress'));
    card.appendChild(el('p', 'ix-card-sub', 'Module quizzes you have passed, on this device.'));
    var rows = el('div', 'ix-prog');
    ['m1', 'm2', 'm3', 'm4'].forEach(function (m) {
      var q = quiz[m];
      var passed = q && q.passed;
      var row = el('div', 'ix-prog-row' + (passed ? ' on' : ''));
      row.appendChild(el('span', 'ix-prog-check', passed ? '✓' : '○'));
      row.appendChild(el('span', 'ix-prog-label', MODULE_LABELS[m]));
      row.appendChild(el('span', 'ix-prog-score', q ? (q.score + '/' + q.total) : '—'));
      rows.appendChild(row);
    });
    card.appendChild(rows);
    var n = passedCount();
    var bar = el('div', 'ix-bar');
    var fill = el('div', 'ix-bar-fill');
    fill.style.width = (n / 4 * 100) + '%';
    bar.appendChild(fill);
    card.appendChild(bar);
    card.appendChild(el('p', 'ix-prog-summary', n + ' of 4 modules complete' + (n === 4 ? ' — certificate unlocked below.' : '.')));
    var actions = el('div', 'ix-actions');
    var reset = el('button', 'ix-btn ix-btn--ghost', 'Clear my data');
    reset.type = 'button';
    reset.addEventListener('click', function () { resetAll(); refreshProgressViews(); document.querySelectorAll('[data-ix-profile]').forEach(renderProfile); });
    actions.appendChild(reset);
    card.appendChild(actions);
    mount.appendChild(card);
  }

  // ── Certificate (client-only; gated on all four module quizzes passed) ──────
  function buildCertNode() {
    var prof = getProfile();
    var name = (prof && prof.name) ? prof.name : '';
    var cert = el('div', 'ix-cert');
    cert.appendChild(el('div', 'ix-cert-eyebrow', 'Nimble Gravity × Brown & Brown · Copilot Enablement'));
    cert.appendChild(el('div', 'ix-cert-title', 'Certificate of Completion'));
    cert.appendChild(el('div', 'ix-cert-line', 'This certifies that'));
    cert.appendChild(el('div', 'ix-cert-name', name || 'Your name'));
    cert.appendChild(el('div', 'ix-cert-line', 'completed the four-module M365 Copilot Advanced Workshop.'));
    var d = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    cert.appendChild(el('div', 'ix-cert-meta', months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()));
    cert.appendChild(el('div', 'ix-cert-disclaimer', 'A personal record of completion — not an official Brown & Brown training record.'));
    return cert;
  }

  function renderCertificate(mount) {
    mount.innerHTML = '';
    var n = passedCount();
    if (n < 4) {
      var locked = el('div', 'ix-locked');
      locked.appendChild(el('div', 'ix-locked-icon', '🔒'));
      locked.appendChild(el('div', 'ix-locked-title', 'Certificate locked'));
      locked.appendChild(el('div', 'ix-locked-sub', 'Pass all four module quizzes to unlock your certificate — ' + n + ' of 4 done. Each one lives at the end of its module’s lab lesson.'));
      mount.appendChild(locked);
      return;
    }
    var prof = getProfile();
    var card = el('div', 'ix-card');
    card.appendChild(el('div', 'ix-kicker', 'You did it'));
    card.appendChild(el('div', 'ix-card-title', 'Your certificate'));
    if (!prof || !prof.name) {
      card.appendChild(el('p', 'ix-card-sub', 'Add your name in the profile above to personalize it.'));
    }
    card.appendChild(buildCertNode());
    var actions = el('div', 'ix-actions');
    var printBtn = el('button', 'ix-btn', 'Print / Save as PDF');
    printBtn.type = 'button';
    printBtn.addEventListener('click', function () {
      var layer = el('div', 'ix-print-layer');
      layer.appendChild(buildCertNode());
      document.body.appendChild(layer);
      document.body.classList.add('ix-printing');
      function cleanup() { document.body.classList.remove('ix-printing'); if (layer.parentNode) layer.parentNode.removeChild(layer); window.removeEventListener('afterprint', cleanup); }
      window.addEventListener('afterprint', cleanup);
      window.print();
      setTimeout(cleanup, 1500);
    });
    actions.appendChild(printBtn);
    card.appendChild(actions);
    mount.appendChild(card);
  }

  function refreshProgressViews() {
    document.querySelectorAll('[data-ix-progress]').forEach(renderProgress);
    document.querySelectorAll('[data-ix-certificate]').forEach(renderCertificate);
    document.querySelectorAll('[data-ix-readout]').forEach(renderReadout);
  }

  // ── Acknowledgment gate (e.g. Rules of the Road) ────────────────────────────
  function renderAck(mount) {
    var id = mount.getAttribute('data-ix-ack') || 'acceptable-use';
    mount.innerHTML = '';
    var card = el('div', 'ix-card');
    card.appendChild(el('div', 'ix-kicker', 'Acknowledgment'));
    var existing = getAck(id);
    if (existing) {
      var done = el('div', 'ix-done');
      done.appendChild(el('div', 'ix-done-icon', '✓'));
      var copy = el('div', 'ix-done-copy');
      copy.appendChild(el('div', 'ix-done-title', 'Acknowledged'));
      copy.appendChild(el('div', 'ix-done-sub', 'By ' + existing.name + ' on ' + fmtDate(existing.ts) + '. A personal record on this device — not a legal acknowledgment.'));
      done.appendChild(copy);
      card.appendChild(done);
      var a = el('div', 'ix-actions');
      var redo = el('button', 'ix-btn ix-btn--ghost', 'Update');
      redo.type = 'button';
      redo.addEventListener('click', function () { clearAck(id); renderAck(mount); });
      a.appendChild(redo);
      card.appendChild(a);
      mount.appendChild(card);
      return;
    }
    card.appendChild(el('div', 'ix-card-title', 'Read and acknowledge'));
    card.appendChild(el('p', 'ix-card-sub', 'Confirm you have read the Rules of the Road before using Copilot on Brown & Brown work. This is a personal acknowledgment stored on your device — not a legal record, and pending official Brown & Brown policy.'));
    var prof = getProfile();
    var field = el('div', 'ix-field');
    var input = el('input', 'ix-input');
    input.type = 'text';
    input.placeholder = 'Your full name';
    if (prof && prof.name) input.value = prof.name;
    field.appendChild(input);
    card.appendChild(field);
    var row = el('label', 'ix-check-row');
    var cb = el('input');
    cb.type = 'checkbox';
    row.appendChild(cb);
    row.appendChild(el('span', null, 'I have read and agree to the Rules of the Road.'));
    card.appendChild(row);
    var actions = el('div', 'ix-actions');
    var btn = el('button', 'ix-btn', 'Acknowledge');
    btn.type = 'button';
    var hint = el('span', 'ix-hint', '');
    btn.addEventListener('click', function () {
      var name = input.value.trim();
      if (!cb.checked) { hint.textContent = 'Tick the box to confirm.'; return; }
      if (!name) { hint.textContent = 'Add your name.'; return; }
      if (!prof) saveProfile(name);
      saveAck(id, name);
      renderAck(mount);
    });
    actions.appendChild(btn);
    actions.appendChild(hint);
    card.appendChild(actions);
    mount.appendChild(card);
  }

  // ── Init ────────────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    document.querySelectorAll('[data-ix-quiz]').forEach(renderQuiz);
    document.querySelectorAll('[data-ix-poll]').forEach(renderPoll);
    document.querySelectorAll('[data-ix-readout]').forEach(renderReadout);
    document.querySelectorAll('[data-ix-profile]').forEach(renderProfile);
    document.querySelectorAll('[data-ix-progress]').forEach(renderProgress);
    document.querySelectorAll('[data-ix-certificate]').forEach(renderCertificate);
    document.querySelectorAll('[data-ix-ack]').forEach(renderAck);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.CopilotIX = { reset: resetAll, store: getStore };
})();
