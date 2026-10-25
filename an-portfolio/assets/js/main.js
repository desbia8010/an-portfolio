/* =========================================================================
   AN · main.js
   Dựng nội dung từ content.js, điều hướng, ánh sáng máy chiếu, ghép chữ quanh
   AN, lớp Ghi chú của người viết, chương _ AN, cửa sổ ảnh và video.
   JavaScript thuần, không dùng thư viện ngoài.
   ========================================================================= */
(() => {
  'use strict';

  const CFG = window.AN_CONFIG || {};
  const D = window.AN_CONTENT;
  if (!D) return;
  CFG.images = CFG.images || {};
  CFG.video = CFG.video || {};
  CFG.video.cutdowns = CFG.video.cutdowns || {};
  CFG.cv = CFG.cv || {};

  /* ---------- Tiện ích ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const easeInOut = k => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plain = s => String(s == null ? '' : s).replace(/<[^>]*>/g, '');
  const debounce = (fn, ms) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); }; };
  const EASE = 'cubic-bezier(.16,1,.3,1)';

  const params = new URLSearchParams(location.search);
  const EMBED = params.has('embed');
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqDesk = matchMedia('(min-width: 1024px)');
  const mqFine = matchMedia('(hover: hover) and (pointer: fine)');

  const CH = D.chapters;
  const CH_IDS = CH.map(c => c.id);
  const byId = {};
  CH.forEach(c => { byId[c.id] = c; });
  const BG = { ban: '#16110F', lan: '#151A1D', vang: '#1E1219', toan: '#111829', tan: '#2A1B13' };
  const ACC = { ban: '#FF6B4A', lan: '#8FA9B8', vang: '#FF4FA3', toan: '#3D7BFF', tan: '#E8D5B9' };
  const FX = CH_IDS.concat('chuong-tiep');          // màn có tắt đèn, bật đèn khi chuyển tới
  const LIGHT = ['chuong-tiep'];                    // màn nền trắng
  const RAIL = [{ id: 'an', label: 'AN' }].concat(CH.map(c => ({ id: c.id, label: c.rail })), [{ id: 'chuong-tiep', label: '_AN' }]);

  const S = {
    lang: pickLang(),
    mode: pickMode(),
    reduced: mqReduce.matches,
    desk: mqDesk.matches,
    fine: mqFine.matches,
    active: null, lastFx: null, navFrom: null,
    programmatic: false, pending: null, scrollEndT: 0,
    sound: false, heroP: 0,
    cvOk: { vi: false, en: false },
    entered: new Set(), sent: new Set(),
    next: null, openNotes: null, presentOpen: false
  };

  function pickLang() {
    const q = params.get('lang');
    if (q === 'vi' || q === 'en') return q;
    try { const s = localStorage.getItem('an-lang'); if (s === 'vi' || s === 'en') return s; } catch (e) { /* bỏ qua */ }
    return 'vi';
  }
  function pickMode() {
    if (params.get('v') === 'thay') {
      try { sessionStorage.setItem('an-mode', 'thay'); } catch (e) { /* bỏ qua */ }
      return 'thay';
    }
    try { if (sessionStorage.getItem('an-mode') === 'thay') return 'thay'; } catch (e) { /* bỏ qua */ }
    return 'ban';
  }

  /* Lấy chữ theo ngôn ngữ và cách xưng hô */
  function t(x, vars) {
    if (x == null) return '';
    let v = typeof x === 'string' ? x : (x[S.lang] != null ? x[S.lang] : x.vi);
    if (v && typeof v === 'object') v = v[S.mode] != null ? v[S.mode] : v.ban;
    v = v == null ? '' : String(v);
    if (vars) v = v.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
    return v;
  }
  const get = path => path.split('.').reduce((o, k) => (o ? o[k] : undefined), D);

  /* ---------- Khung “thay sau” và ảnh tự nhận file ---------- */
  function ph(main, extra = '', cls = '') {
    return `<div class="ph ${cls}">${main ? `<span class="ph__k">${main}</span>` : ''}${extra}<span class="ph__t">${esc(t(D.ui.ph))}</span></div>`;
  }
  const EXT = ['webp', 'jpg', 'jpeg', 'png'];
  const srcList = base => EXT.map(e => `${base}.${e}`);
  function imgTag(list, alt, phHTML, remote, eager) {
    return `<img alt="${esc(alt)}"${eager ? '' : ' loading="lazy"'} decoding="async"${remote ? ' referrerpolicy="no-referrer"' : ''} data-srcs="${esc(JSON.stringify(list))}" data-ph="${esc(phHTML)}">`;
  }
  /* Thử lần lượt .webp, .jpg, .jpeg, .png; không có file nào thì hiện khung “thay sau” */
  function hydrate(root = document) {
    $$('img[data-srcs]', root).forEach(img => {
      if (img.dataset.h) return;
      img.dataset.h = '1';
      let list = [];
      try { list = JSON.parse(img.dataset.srcs); } catch (e) { list = []; }
      let i = 0;
      const next = () => {
        if (i >= list.length) {
          const tmp = document.createElement('div');
          tmp.innerHTML = img.dataset.ph || '';
          const node = tmp.firstElementChild;
          if (node) img.replaceWith(node); else img.remove();
          return;
        }
        img.src = list[i++];
      };
      img.addEventListener('error', next);
      next();
    });
  }

  /* Kiểm tra file có trên máy chủ (video, CV) */
  const headCache = new Map();
  function exists(url) {
    if (!url || location.protocol === 'file:') return Promise.resolve(false);
    if (!headCache.has(url)) {
      headCache.set(url, fetch(url, { method: 'HEAD', cache: 'no-store' })
        .then(r => r.ok && !/text\/html/i.test(r.headers.get('content-type') || ''))
        .catch(() => false));
    }
    return headCache.get(url);
  }

  /* ---------- Chữ chương: các chữ cái ghép quanh AN ---------- */
  function nameInner(ch) {
    const L = (c, side) => `<span class="cl" data-side="${side}">${c}</span>`;
    let pre = [...ch.pre].map(c => L(c, 'pre')).join('');
    if (ch.id === 'tan') pre += '<span class="cl cl--drop is-gone" data-side="pre"><span>O</span></span>';
    const an = ch.an === 'ÁN'
      ? '<span class="can"><span class="acc-host">Á<span class="acc">Á</span></span>N</span>'
      : '<span class="can">AN</span>';
    const post = [...ch.post].map(c => L(c, 'post')).join('');
    return pre + an + post;
  }
  const setBase = (host, c) => { if (host && host.firstChild && host.firstChild.nodeType === 3) host.firstChild.nodeValue = c; };

  /* Chữ cái bay từ ngoài vào, lần lượt từng chữ, chậm dần ở cuối */
  function flyIn(el, delay = 0, o = {}) {
    const dur = o.dur || 700, stagger = o.stagger || 60;
    return $$('.cl:not(.cl--drop)', el).map((c, i) => {
      const side = c.dataset.side === 'post' ? 1 : -1;
      const dx = side * (1.1 + Math.random() * .7), dy = (Math.random() - .5) * .9, rot = side * (8 + Math.random() * 18);
      const blur = S.desk ? 'blur(.05em)' : 'blur(0px)';
      if (i === 0) sfx('khop', delay + dur * .55);
      return c.animate([
        { transform: `translate(${dx}em, ${dy}em) rotate(${rot}deg)`, opacity: 0, filter: blur },
        { transform: 'none', opacity: 1, filter: 'blur(0px)' }
      ], { duration: dur, delay: delay + i * stagger, easing: EASE, fill: 'backwards' });
    });
  }

  /* Đo vùng dấu sắc trên chữ Á để chỉ cho dấu rơi xuống */
  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');
  function fontOf(el) {
    const cs = getComputedStyle(el);
    return { cs, font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, fs: parseFloat(cs.fontSize) };
  }
  function accentClip(host) {
    try {
      const f = fontOf(host);
      ctx.font = f.font;
      const cap = ctx.measureText('A').actualBoundingBoxAscent;
      if (!cap) return null;
      const probe = document.createElement('i');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      host.appendChild(probe);
      const base = probe.offsetTop;
      probe.remove();
      const h = host.offsetHeight;
      const cut = base - cap - f.fs * .02;
      if (!(cut > 0 && cut < h)) return null;
      return `inset(${-f.fs}px ${-f.fs * .3}px ${(h - cut).toFixed(1)}px ${-f.fs * .3}px)`;
    } catch (e) { return null; }
  }
  /* Dấu sắc rơi xuống chữ A như một cú click, nảy nhẹ (400 ms) */
  function dropAccent(host, delay = 0) {
    if (!host) return;
    const acc = $('.acc', host);
    setTimeout(() => {
      if (!host.isConnected) return;
      const clip = accentClip(host);
      if (!clip || S.reduced) { setBase(host, 'Á'); return; }
      acc.style.clipPath = clip;
      acc.style.webkitClipPath = clip;
      setBase(host, 'A');
      acc.style.visibility = 'visible';
      const a = acc.animate([
        { transform: 'translateY(-1.3em)', opacity: 0, easing: 'linear' },
        { transform: 'translateY(-1.3em)', opacity: 1, offset: .06, easing: 'cubic-bezier(.55,0,1,.45)' },
        { transform: 'translateY(0)', offset: .6, easing: 'cubic-bezier(0,.55,.45,1)' },
        { transform: 'translateY(-.08em)', offset: .78, easing: 'cubic-bezier(.55,0,1,.45)' },
        { transform: 'translateY(0)', opacity: 1 }
      ], { duration: 400, fill: 'both' });
      sfx('khop', 240);
      a.onfinish = () => { setBase(host, 'Á'); acc.style.visibility = 'hidden'; a.cancel(); };
    }, delay);
  }
  /* Chữ O rơi khỏi TOAN, còn lại TAN (600 ms) */
  function dropO(el, delay = 0) {
    const o = $('.cl--drop', el);
    if (!o) return;
    o.classList.remove('is-gone');
    o.style.opacity = '1';
    const w = o.offsetWidth;
    o.style.width = w + 'px';
    setTimeout(() => {
      if (!o.isConnected) return;
      const g = o.firstElementChild;
      sfx('khop', 380);
      const fall = g.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(.9em) rotate(24deg)', opacity: 0 }], { duration: 600, easing: 'cubic-bezier(.55,0,.85,.35)', fill: 'forwards' });
      const col = o.animate([{ width: w + 'px' }, { width: '0px' }], { duration: 480, delay: 120, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
      fall.onfinish = () => { o.classList.add('is-gone'); o.style.width = ''; o.style.opacity = ''; fall.cancel(); col.cancel(); };
    }, delay);
  }

  /* ---------- Âm thanh (tắt mặc định) ---------- */
  let actx = null;
  function sfx(kind, delay = 0) {
    if (!S.sound || EMBED) return;
    setTimeout(() => {
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        const now = actx.currentTime;
        if (kind === 'tach') {
          const len = Math.floor(actx.sampleRate * .05);
          const buf = actx.createBuffer(1, len, actx.sampleRate);
          const d = buf.getChannelData(0);
          for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
          const src = actx.createBufferSource(); src.buffer = buf;
          const bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = .8;
          const g = actx.createGain(); g.gain.value = .5;
          src.connect(bp).connect(g).connect(actx.destination); src.start(now);
          const o = actx.createOscillator(), og = actx.createGain();
          o.frequency.setValueAtTime(140, now); o.frequency.exponentialRampToValueAtTime(60, now + .08);
          og.gain.setValueAtTime(.25, now); og.gain.exponentialRampToValueAtTime(.001, now + .1);
          o.connect(og).connect(actx.destination); o.start(now); o.stop(now + .12);
        } else {
          const o = actx.createOscillator(), g = actx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(1250, now); o.frequency.exponentialRampToValueAtTime(700, now + .05);
          g.gain.setValueAtTime(.16, now); g.gain.exponentialRampToValueAtTime(.001, now + .07);
          o.connect(g).connect(actx.destination); o.start(now); o.stop(now + .08);
        }
      } catch (e) { /* trình duyệt không hỗ trợ */ }
    }, delay);
  }
  function toggleSound() {
    S.sound = !S.sound;
    if (S.sound) {
      try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) { /* bỏ qua */ }
      sfx('khop');
    }
    syncSound();
  }
  function syncSound() {
    $$('[data-sound]').forEach(b => {
      b.setAttribute('aria-pressed', String(S.sound));
      b.setAttribute('aria-label', t(S.sound ? D.ui.soundOff : D.ui.soundOn));
    });
  }

  /* ---------- Tắt đèn, bật đèn (300 + 150 + 400 ms) ---------- */
  function lights() {
    if (EMBED) return;
    const L = $('#lights'), F = $('#flash');
    L.getAnimations().forEach(a => a.cancel());
    F.getAnimations().forEach(a => a.cancel());
    if (S.reduced) { L.animate([{ opacity: 0 }, { opacity: .6 }, { opacity: 0 }], { duration: 200 }); return; }
    if (S.desk) {
      L.animate([
        { opacity: 0, easing: 'cubic-bezier(.4,0,1,1)' },
        { opacity: 1, offset: .353 },
        { opacity: 1, offset: .529, easing: 'cubic-bezier(0,0,.2,1)' },
        { opacity: .15, offset: .576 },
        { opacity: .6, offset: .635 },
        { opacity: .08, offset: .694, easing: 'ease-out' },
        { opacity: 0 }
      ], { duration: 850 });
      F.animate([{ opacity: 0 }, { opacity: .16 }, { opacity: 0 }], { duration: 260, delay: 450, easing: 'ease-out' });
    } else {
      L.animate([
        { opacity: 0, easing: 'cubic-bezier(.4,0,1,1)' },
        { opacity: 1, offset: .353 },
        { opacity: 1, offset: .529, easing: 'ease-out' },
        { opacity: 0 }
      ], { duration: 850 });
    }
  }

  /* ---------- Dựng nội dung ---------- */
  const NOTE_ICON = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 3h10M3 7h10M3 11h6" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>';
  const PLAY_ICON = '<svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true"><path d="M6 4v12l10-6z" fill="currentColor"/></svg>';
  const SOUND_SVG = $('.sound') ? $('.sound').innerHTML : '';

  const goalHTML = s => { const i = s.indexOf(':'); return i > 0 ? `<b>${esc(s.slice(0, i))}</b>${esc(s.slice(i))}` : esc(s); };
  const contactLine = () => esc(t(D.contact.line)).replace(/\bAn\b/, '<span class="can">An</span>');
  function qrImg(eager, kind) {
    if (kind === 'cv') {
      const b = CFG.images.qrCv || 'assets/img/qr-cv';
      return imgTag(srcList(b).concat([b + '.svg']), t(D.contact.qrCv), ph(esc(t(D.contact.qrCv))), false, eager);
    }
    const base = CFG.images.qr;
    return imgTag(srcList(base).concat([base + '.svg']), t(D.contact.qr), ph(esc(t(D.contact.qr)), `<span>${esc(t(D.contact.qrWait))}</span>`), false, eager);
  }

  function renderRail() {
    $('#rail').innerHTML = RAIL.map(r => `<a href="#${r.id}" data-rail="${r.id}">${r.label}</a>`).join('');
  }
  function renderMenu() {
    $('.menu__nav').innerHTML = `
      <a href="#muc-luc">${esc(t(D.ui.toc))}</a>
      <a href="#phu-luc">${esc(t(D.ui.appendix))}</a>
      <a href="#lien-he">${esc(t(D.ui.contact))}</a>
      <a href="#lien-he" class="menu__cv" data-cv>${esc(t(D.ui.cv))}</a>
      <div class="menu__row">
        <button class="tool lang" type="button" data-lang-toggle aria-label="${esc(t(D.ui.lang))}"><span data-l="vi">VI</span><span class="lang__sep">/</span><span data-l="en">EN</span></button>
        <button class="tool sound" type="button" data-sound aria-pressed="false">${SOUND_SVG}</button>
      </div>`;
  }

  function tocHTML() {
    const cells = [{ id: 'an', num: t(D.toc.opening.num), name: t(D.toc.opening.name), word: '<span class="can">AN</span>', label: 'AN', bg: '#0D0B0A', acc: '#FFB547' }]
      .concat(CH.map(c => ({ id: c.id, num: t(D.ui.chapterN, { n: c.n }), name: t(c.project), word: nameInner(c), label: c.rail, bg: BG[c.id], acc: ACC[c.id] })))
      .concat([{ id: 'chuong-tiep', num: t(D.toc.next.num), name: t(D.toc.next.name), word: '<span class="blank">_</span><span class="can">AN</span>', label: '_ AN', bg: '#FFFFFF', acc: '#0D0B0A', light: true }]);
    return `<div class="container">
      <header class="sec-head"><h2 class="sec-title">${esc(t(D.toc.title))}</h2><p class="sec-lead">${esc(t(D.toc.lead))}</p></header>
      <ol class="toc__list">${cells.map(c => `<li><a class="toc__cell${c.light ? ' toc__cell--light' : ''}" href="#${c.id}" style="--cbg:${c.bg};--cacc:${c.acc}"><span class="toc__word" aria-hidden="true">${c.word}</span><span class="toc__meta"><span class="toc__num">${esc(c.num)}</span><span class="toc__name">${esc(c.name)}</span></span><span class="sr-only">${esc(c.label)}</span></a></li>`).join('')}</ol>
    </div>`;
  }

  function thumbHTML(ch, gi, more) {
    const it = ch.gallery[gi];
    const alt = plain(t(it.cap));
    let inner;
    if (it.drive) {
      inner = `<span class="browser"><span class="browser__bar"><i></i><i></i><i></i></span><span class="browser__body"><b>Bean Cafe</b><span class="browser__play">${PLAY_ICON}</span><span>${esc(t(D.ui.browserLabel))}</span></span></span>`;
    } else {
      inner = imgTag(it.src ? [it.src] : srcList(CFG.images.evidence + it.file), alt, ph(esc(t(it.fig || D.ui.evidence))), !!it.src);
    }
    return `<li><button class="thumb" type="button" data-open="${ch.id}:${gi}" aria-label="${esc(alt)}">${inner}${more > 0 ? `<span class="thumb__more">${esc(t(D.ui.more, { n: more }))}</span>` : ''}</button></li>`;
  }

  function notesHTML(ch) {
    const n = ch.notes, H = D.ui.heads;
    const P = (x, cls = '') => (x ? `<p class="type ${cls}"><span class="type__ghost">${t(x)}</span></p>` : '');
    const cell = (head, body, cls = '') => `<details class="cell ${cls}" open><summary>${esc(head)}<i class="chev" aria-hidden="true"></i></summary><div class="cell__body">${body}</div></details>`;
    const results = `<ul>${n.results.map(r => `<li class="type"><span class="type__ghost">${t(r)}</span></li>`).join('')}</ul>${P(n.resultsNote, 'src')}${P(n.resultsDate, 'date')}`;
    const links = ch.links.length
      ? `<div class="notes__links">${ch.links.map(l => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(t(l.label))} ↗</a>`).join('')}</div>`
      : `<p class="notes__note">${esc(t(ch.linksNote))}</p>`;
    return `
      <div class="notes__top">
        <h3 class="notes__name" tabindex="-1" aria-label="${ch.rail} · ${esc(t(D.ui.notesBtn))}"><span aria-hidden="true">${nameInner(ch)}</span></h3>
        <p class="label">${esc(t(D.ui.notesBtn))}</p>
      </div>
      <div class="notes__grid">
        ${cell(t(H.context), P(n.context))}
        ${cell(t(H.role), P(n.role))}
        ${cell(t(H.insight), P(n.insight) + P(n.insightSrc, 'src'))}
        ${cell(t(H.execution), P(n.execution))}
        ${cell(t(n.resultsHead), results, 'cell--results')}
      </div>
      <div class="notes__foot">${links}<button class="btn btn--line" type="button" data-notes="close">${esc(t(D.ui.back))}</button></div>`;
  }

  function chapterHTML(ch) {
    const nxt = ch.n < 5 ? { href: '#' + CH[ch.n].id, label: t(D.ui.nextChapter) } : { href: '#phu-luc', label: t(D.ui.toAppendix) };
    const more = ch.gallery.length - ch.strip.length;
    const strip = ch.strip.map((gi, k) => thumbHTML(ch, gi, k === ch.strip.length - 1 ? more : 0)).join('');
    return `<div class="container">
      <div class="layer story" data-layer="story">
        <header class="story__head">
          <p class="label">${esc(t(D.ui.chapterOf, { n: ch.n }))} · ${esc(t(ch.project))}</p>
          <h2 class="cname is-pre" aria-label="${ch.rail}"><span aria-hidden="true">${nameInner(ch)}</span></h2>
        </header>
        <div class="story__text"><p class="story__p">${t(ch.story)}</p></div>
        <div class="story__cta"><button class="btn-notes" type="button" data-notes="open" aria-expanded="false">${NOTE_ICON}<span>${esc(t(D.ui.notesBtn))}</span></button></div>
        <div class="story__media story__media--noclip">
          <div class="clip" data-clip="${ch.id}" hidden>${ph(`<span class="clip__w">${ch.rail}</span>`, `<span>${esc(t(D.ui.clip))}</span>`)}</div>
          <ul class="strip">${strip}</ul>
        </div>
        <div class="story__next"><a class="next-link" href="${nxt.href}">${esc(nxt.label)}</a></div>
      </div>
      <div class="layer notes is-off" data-layer="notes" inert aria-hidden="true">${notesHTML(ch)}</div>
    </div>`;
  }

  function appendixHTML() {
    const A = D.appendix;
    const [c1, c2, c3] = A.cols;
    const li = arr => arr.map(x => `<li>${t(x)}</li>`).join('');
    const portrait = `<div class="portrait">${imgTag(srcList(CFG.images.portrait), 'Đoàn Minh Duy An', ph(esc(t(c1.portrait))))}</div>`;
    const cards = A.projects.map(p => {
      const tag = p.chapter ? 'button' : 'div';
      const cover = p.cover === false
        ? `<span class="pcard__cover pcard__cover--type"><span>${esc(t(p.course))}</span></span>`
        : `<span class="pcard__cover">${imgTag(srcList(CFG.images.covers + p.id), `${t(A.cover)} · ${t(p.course)}`, ph(esc(t(A.cover))))}</span>`;
      return `
      <li><${tag} class="pcard${p.chapter ? '' : ' pcard--static'}"${p.chapter ? ` type="button" data-project="${p.id}"` : ''}>
        ${cover}
        <span class="pcard__body">
          <span class="pcard__row"><span class="label">${esc(t(p.course))}</span><span class="pcard__grade">${p.grade}</span></span>
          <span class="pcard__topic">${esc(t(p.topic))}</span>
          <span class="pcard__result">${esc(t(p.result))}</span>
          ${p.action ? `<span class="pcard__go">${esc(t(p.action))}</span>` : ''}
        </span>
      </${tag}></li>`;
    }).join('');
    return `<div class="container">
      <header class="sec-head"><h2 class="sec-title">${esc(t(A.title))}</h2></header>
      <div class="apx">
        <section class="apx__col"><h3 class="apx__head">${esc(t(c1.head))}</h3>${portrait}<p class="apx__name">${esc(c1.name)}</p><ul class="apx__list">${li(c1.items)}</ul></section>
        <section class="apx__col"><h3 class="apx__head">${esc(t(c2.head))}</h3><p class="label">${esc(t(c2.mottoLabel))}</p><p class="motto">${esc(t(c2.motto))}</p><ul class="apx__list">${li(c2.items)}</ul></section>
        <section class="apx__col"><h3 class="apx__head">${esc(t(c3.head))}</h3><ul class="apx__list">${li(c3.items)}</ul></section>
      </div>
      <div class="projects"><h3 class="projects__head">${esc(t(A.projectsHead))}</h3><ul class="projects__list">${cards}</ul></div>
    </div>`;
  }

  function nextHTML() {
    const N = D.next;
    const slot = (id, label) => `<input class="slot is-empty" id="${id}" type="text" maxlength="4" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" enterkeyhint="done" aria-label="${esc(t(label))}">`;
    return `<div class="container">
      <p class="label">${esc(t(N.label))}</p>
      <p class="next__lead">${esc(t(N.lead))}</p>
      <div class="word-row" id="word-row">${slot('slot-pre', N.pre)}<span class="word-an">AN</span>${slot('slot-post', N.post)}</div>
      <p class="next__notice">${esc(t(N.notice))}</p>
      <div class="next__actions"><button class="btn btn--dark" type="button" data-combine>${esc(t(N.combine))}</button></div>
      <p class="next__msg" aria-live="polite"></p>
      <div class="next__result" aria-live="polite" hidden>
        <p class="answer reveal"></p>
        <ol class="goals">${N.goals.map(g => `<li class="reveal">${goalHTML(t(g))}</li>`).join('')}</ol>
        <div class="next__cta reveal"><a class="btn btn--an" href="#lien-he" data-cv>${esc(t(D.ui.cv))}</a><button class="btn btn--line" type="button" data-again>${esc(t(N.again))}</button></div>
      </div>
    </div>`;
  }

  function contactHTML() {
    const Cc = D.contact;
    const mail = `mailto:${CFG.email}?subject=${encodeURIComponent(Cc.subject)}`;
    return `<div class="container"><div class="contact__grid">
      <div>
        <h2 class="contact__line">${contactLine()}</h2>
        <div class="contact__btns">
          <div class="cbtn"><a class="btn btn--an btn--breath" href="#lien-he" data-cv>${esc(t(D.ui.cv))}</a><span class="cbtn__meta" data-cv-meta></span></div>
          <div class="cbtn"><a class="btn btn--line" href="${esc(mail)}" data-mail>${esc(t(Cc.email))}</a><span class="cbtn__meta">${esc(CFG.email)}</span></div>
          <div class="cbtn"><a class="btn btn--line" href="https://zalo.me/${esc(CFG.zalo)}" target="_blank" rel="noopener">${esc(t(Cc.zalo))}</a><span class="cbtn__meta">${esc(CFG.zalo)}</span></div>
        </div>
      </div>
      <div class="qr-wrap"><div class="qr">${qrImg(false, 'cv')}</div><p class="cbtn__meta">${esc(t(Cc.qrCv))}</p></div>
    </div></div>`;
  }

  function renderStatic() {
    document.documentElement.lang = S.lang;
    $$('[data-t]').forEach(el => { el.textContent = t(get(el.dataset.t)); });
    $$('[data-t-aria]').forEach(el => { el.setAttribute('aria-label', t(get(el.dataset.tAria))); });
    const tag = $('.hero__tag');
    if (tag) tag.innerHTML = `${esc(t(D.hero.bgPh))} <span class="ph__t">${esc(t(D.ui.ph))}</span>`;
    $$('[data-lang-toggle] [data-l]').forEach(s => s.classList.toggle('is-on', s.dataset.l === S.lang));
  }

  function renderAll(keep) {
    closeAllNotes();
    renderRail();
    renderMenu();
    $('#muc-luc').innerHTML = tocHTML();
    CH.forEach(ch => { $('#' + ch.id).innerHTML = chapterHTML(ch); });
    $('#phu-luc').innerHTML = appendixHTML();
    $('#chuong-tiep').innerHTML = nextHTML();
    $('#lien-he').innerHTML = contactHTML();
    renderStatic();
    // chương chưa vào: chỉ còn chữ AN, dấu sắc chờ rơi
    $$('.story .acc-host').forEach(h => setBase(h, 'A'));
    if (keep) {
      CH.forEach(ch => {
        const r = $('#' + ch.id).getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) {
          const name = $(`#${ch.id} .story .cname`);
          name.classList.remove('is-pre');
          setBase($('.acc-host', name), 'Á');
          S.entered.add(ch.id);
        } else S.entered.delete(ch.id);
      });
    }
    hydrate();
    syncSound();
    updateCvUI();
    setupClips();
    fitRow();
    if (keep && S.next) restoreNext();
    if (S.active) setActive(S.active, true);
    const mb = $('.menu-btn');
    if (mb) mb.setAttribute('aria-label', t($('#menu').hidden ? D.ui.menu : D.ui.close));
  }

  function setLang(l) {
    if (l === S.lang) return;
    S.lang = l;
    try { localStorage.setItem('an-lang', l); } catch (e) { /* bỏ qua */ }
    renderAll(true);
  }

  /* ---------- Chữ AN: giữa màn mở đầu → logo góc trái ---------- */
  const mark = $('#an-mark');
  const slot = $('.hero__slot');
  const topbar = $('#topbar');
  const H = { ok: false, three: false };
  function mixRGB(a, b, k) { return a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(','); }
  function build3D() {
    if (S.desk && S.fine && !S.reduced && !EMBED) {
      const n = 14;
      let html = '<div class="an3d"><div class="an3d__rot">';
      for (let i = n; i >= 1; i--) html += `<span class="an3d__l" style="--i:${i};color:rgb(${mixRGB([70, 40, 12], [214, 140, 44], (n - i) / (n - 1))})">AN</span>`;
      html += '<span class="an3d__face">AN</span></div></div>';
      mark.innerHTML = html;
      H.three = true;
    } else {
      mark.innerHTML = '<span class="an3d__face">AN</span>';
      H.three = false;
    }
    H.rot = $('.an3d__rot', mark);
  }
  function measureHero() {
    if (!slot) return;
    const r = slot.getBoundingClientRect();
    H.x = r.left;
    H.y = r.top + scrollY;
    H.fs = parseFloat(getComputedStyle(slot).fontSize) || 1;
    const desk = mqDesk.matches;
    const safeTop = parseFloat(getComputedStyle(topbar).paddingTop) || 0;
    const tb = topbar.offsetHeight - safeTop;
    H.lfs = desk ? 30 : 24;
    H.lx = parseFloat(getComputedStyle(topbar).paddingLeft) || 20;
    H.ly = safeTop + (tb - .9 * H.lfs) / 2;
    H.s = H.lfs / H.fs;
    H.range = Math.max(240, $('#an').offsetHeight * .55);
    H.ok = true;
  }
  let lastE = -1;
  function heroUpdate() {
    if (!H.ok) return;
    const p = clamp(scrollY / H.range, 0, 1);
    S.heroP = p;
    const e = S.reduced ? (p < .5 ? 0 : 1) : easeInOut(p);
    if (S.reduced && e !== lastE && lastE !== -1) mark.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
    lastE = e;
    const x = lerp(H.x, H.lx, e), y = lerp(H.y - scrollY, H.ly, e), s = lerp(1, H.s, e);
    mark.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
    mark.style.setProperty('--p', p.toFixed(3));
    mark.classList.toggle('is-logo', p >= 1);
    if (H.three && !tilt.raf && (tilt.x || tilt.y)) tilt.raf = requestAnimationFrame(tiltStep);
  }
  /* Xoay tối đa 15° theo chuột */
  const tilt = { tx: 0, ty: 0, x: 0, y: 0, raf: 0 };
  function tiltStep() {
    const f = 1 - S.heroP;
    tilt.x += (tilt.tx * f - tilt.x) * .08;
    tilt.y += (tilt.ty * f - tilt.y) * .08;
    if (H.rot) { H.rot.style.setProperty('--rx', tilt.x.toFixed(2) + 'deg'); H.rot.style.setProperty('--ry', tilt.y.toFixed(2) + 'deg'); }
    if (Math.abs(tilt.tx * f - tilt.x) + Math.abs(tilt.ty * f - tilt.y) > .05) tilt.raf = requestAnimationFrame(tiltStep);
    else tilt.raf = 0;
  }

  /* ---------- Con trỏ vòng sáng ---------- */
  const cur = $('#cursor');
  const C = { x: -100, y: -100, tx: -100, ty: -100, raf: 0, last: 0 };
  function cursorStep(now) {
    const dt = Math.min(64, now - C.last); C.last = now;
    const k = S.reduced ? 1 : 1 - Math.exp(-dt / 40);
    C.x += (C.tx - C.x) * k; C.y += (C.ty - C.y) * k;
    cur.style.transform = `translate3d(${C.x.toFixed(1)}px, ${C.y.toFixed(1)}px, 0)`;
    if (Math.abs(C.tx - C.x) + Math.abs(C.ty - C.y) > .3) C.raf = requestAnimationFrame(cursorStep);
    else C.raf = 0;
  }
  function onPointer(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (S.fine && !EMBED) {
      C.tx = e.clientX; C.ty = e.clientY;
      cur.classList.add('is-on');
      cur.classList.toggle('is-big', !!(e.target.closest && e.target.closest('a, button, input, [data-cursor]')));
      if (!C.raf) { C.last = performance.now(); C.raf = requestAnimationFrame(cursorStep); }
    }
    if (H.three && S.heroP < 1 && !S.reduced) {
      tilt.tx = clamp(((e.clientY / innerHeight) - .5) * -30, -15, 15);
      tilt.ty = clamp(((e.clientX / innerWidth) - .5) * 30, -15, 15);
      if (!tilt.raf) tilt.raf = requestAnimationFrame(tiltStep);
    }
  }

  /* ---------- Điều hướng, chương hiện tại ---------- */
  let SCREENS = [];
  let ticking = false;
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    if (S.programmatic) { clearTimeout(S.scrollEndT); S.scrollEndT = setTimeout(scrollEnded, 160); }
  }
  function frame() { ticking = false; heroUpdate(); updateNav(); }
  function updateNav(force) {
    const vh = innerHeight, mid = vh * .5, top = 36;
    let active = null, topId = null;
    for (const s of SCREENS) {
      const r = s.getBoundingClientRect();
      if (!active && r.top <= mid && r.bottom > mid) active = s.id;
      if (!topId && r.top <= top && r.bottom > top) topId = s.id;
      if (S.entered.has(s.id) && (r.bottom < 0 || r.top > vh)) resetChapter(s.id);
    }
    const light = LIGHT.includes(topId);
    topbar.classList.toggle('is-light', light);
    mark.classList.toggle('is-light', light && S.heroP >= 1);
    topbar.classList.toggle('is-solid', scrollY > vh * .6);
    if (active && (active !== S.active || force)) setActive(active, !!force);
  }
  function setActive(id, silent) {
    S.active = id;
    const railId = id === 'muc-luc' ? 'an' : (id === 'phu-luc' || id === 'lien-he') ? null : id;
    $$('#rail a').forEach(a => {
      const on = a.dataset.rail === railId;
      a.classList.toggle('is-on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    $('#rail').classList.toggle('is-light', LIGHT.includes(id));
    const ch = byId[id];
    $('.mbar__label').textContent = ch ? t(D.ui.chapterOf, { n: ch.n }) : t(D.ui.screens[id]);
    $$('.mbar__track i').forEach((i, k) => i.classList.toggle('is-on', ch ? k < ch.n : false));
    if (silent || !FX.includes(id)) return;
    const from = S.lastFx;
    S.lastFx = id;
    if (S.programmatic) { S.pending = { id, from: S.navFrom }; return; }
    enterScreen(id, from === id ? null : from);
  }
  function go(id) {
    const el = document.getElementById(id);
    if (!el) return;
    S.programmatic = true;
    S.pending = null;
    S.navFrom = S.lastFx;
    clearTimeout(S.scrollEndT);
    S.scrollEndT = setTimeout(scrollEnded, 700);
    el.scrollIntoView({ behavior: S.reduced ? 'auto' : 'smooth', block: 'start' });
    try { history.replaceState(null, '', location.pathname + location.search + '#' + id); } catch (e) { /* bỏ qua */ }
  }
  function scrollEnded() {
    if (!S.programmatic) return;
    S.programmatic = false;
    updateNav();
    if (S.pending) {
      const p = S.pending; S.pending = null;
      enterScreen(p.id, p.from === p.id ? null : p.from);
    }
  }

  function enterScreen(id, from) {
    const name = byId[id] ? $(`#${id} .story .cname`) : null;
    if (EMBED) { if (name) { S.entered.add(id); assemble(name, id, null, 0); } return; }
    lights();
    if (!name) { sfx('tach', S.reduced ? 0 : 450); return; }
    S.entered.add(id);
    assemble(name, id, from, S.reduced ? 0 : 450);
  }
  function assemble(name, id, from, T0) {
    if (name.getAnimations) name.getAnimations({ subtree: true }).forEach(a => a.cancel());
    const host = $('.acc-host', name);
    if (S.reduced) {
      name.classList.remove('is-pre');
      setBase(host, 'Á');
      $$('.cl:not(.cl--drop)', name).forEach(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'backwards' }));
      return;
    }
    sfx('tach', T0);
    if (id === 'tan' && from === 'toan') {
      // TO·AN → T·AN: hiện TOAN trong bóng tối, bật đèn thì chữ O rơi
      setTimeout(() => { name.classList.remove('is-pre'); dropO(name, Math.max(0, T0 - 300)); }, Math.min(300, T0));
      return;
    }
    name.classList.remove('is-pre');
    setBase(host, 'A');
    flyIn(name, T0);
    if (host) dropAccent(host, T0 + 420);
  }
  function resetChapter(id) {
    const name = $(`#${id} .story .cname`);
    S.entered.delete(id);
    if (!name) return;
    if (name.getAnimations) name.getAnimations({ subtree: true }).forEach(a => a.cancel());
    name.classList.add('is-pre');
    $$('.cl--drop', name).forEach(o => { o.classList.add('is-gone'); o.style.width = ''; o.style.opacity = ''; });
    $$('.acc-host', name).forEach(h => { setBase(h, 'A'); $('.acc', h).style.visibility = 'hidden'; });
  }

  /* ---------- Lớp Ghi chú của người viết ---------- */
  function setLayer(el, on) {
    el.classList.toggle('is-off', !on);
    if (on) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    else { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
  }
  function openNotes(sec) {
    const story = $('[data-layer="story"]', sec), notes = $('[data-layer="notes"]', sec);
    if (!notes || !notes.classList.contains('is-off')) return;
    if (S.openNotes && S.openNotes !== sec.id) closeNotes($('#' + S.openNotes), false);
    const btn = $('[data-notes="open"]', sec);
    $$('.cell', notes).forEach(c => { c.open = true; });
    const a = story.animate([{ opacity: 1 }, { opacity: 0 }], { duration: S.reduced ? 200 : 300, easing: 'ease-out', fill: 'forwards' });
    a.onfinish = () => { setLayer(story, false); a.cancel(); };
    setTimeout(() => {
      setLayer(notes, true);
      notes.animate([{ opacity: 0 }, { opacity: 1 }], { duration: S.reduced ? 200 : 260, easing: 'ease-out' });
      typeNotes(notes);
      if (btn) btn.setAttribute('aria-expanded', 'true');
      const h = $('.notes__name', notes);
      if (h) h.focus({ preventScroll: true });
    }, S.reduced ? 0 : 220);
    S.openNotes = sec.id;
  }
  function closeNotes(sec, focus = true) {
    if (!sec) return;
    const story = $('[data-layer="story"]', sec), notes = $('[data-layer="notes"]', sec);
    if (!notes || notes.classList.contains('is-off')) return;
    stopTyping(notes);
    const a = notes.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
    a.onfinish = () => { setLayer(notes, false); a.cancel(); };
    setLayer(story, true);
    story.animate([{ opacity: 0 }, { opacity: 1 }], { duration: S.reduced ? 200 : 300, delay: 100, fill: 'backwards' });
    const btn = $('[data-notes="open"]', sec);
    if (btn) { btn.setAttribute('aria-expanded', 'false'); if (focus) btn.focus({ preventScroll: true }); }
    if (S.openNotes === sec.id) S.openNotes = null;
  }
  function closeAllNotes() { if (S.openNotes) closeNotes($('#' + S.openNotes), false); S.openNotes = null; }
  /* Chữ đơn cách gõ ra như máy đánh chữ (desktop) */
  function typeNotes(layer) {
    if (S.reduced || !S.desk) return;
    const cells = $$('.cell', layer);
    $$('.type', layer).forEach(b => {
      const ghost = $('.type__ghost', b);
      const txt = ghost.textContent;
      const cell = b.closest('.cell');
      const ci = cells.indexOf(cell), bi = $$('.type', cell).indexOf(b);
      let live = $('.type__live', b);
      if (!live) { live = document.createElement('span'); live.className = 'type__live'; live.setAttribute('aria-hidden', 'true'); b.appendChild(live); }
      live.textContent = '';
      b.classList.add('is-typing');
      const start = performance.now() + 120 + ci * 90 + bi * 140;
      const dur = Math.min(800, 200 + txt.length * 4);
      const step = now => {
        if (!b.isConnected) return;
        const k = clamp((now - start) / dur, 0, 1);
        live.textContent = txt.slice(0, Math.round(txt.length * k));
        if (k < 1) b._raf = requestAnimationFrame(step);
        else { b.classList.remove('is-typing'); live.remove(); }
      };
      b._raf = requestAnimationFrame(step);
    });
  }
  function stopTyping(layer) {
    $$('.type', layer).forEach(b => {
      cancelAnimationFrame(b._raf);
      b.classList.remove('is-typing');
      const l = $('.type__live', b);
      if (l) l.remove();
    });
  }

  /* ---------- Cửa sổ ảnh, video, slide ---------- */
  let openDlg = null, lastFocus = null;
  function openDialog(el) {
    lastFocus = document.activeElement;
    openDlg = el;
    el.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    const x = $('.x', el);
    if (x) x.focus();
  }
  function closeDialog() {
    if (!openDlg) return;
    const el = openDlg;
    openDlg = null;
    el.hidden = true;
    if (el.id === 'lightbox') $('.lightbox__stage', el).innerHTML = '';
    if (el.id === 'modal') $('.modal__body', el).innerHTML = '';
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function trap(e) {
    const f = $$('a[href], button:not([disabled]), iframe, video[controls], input, [tabindex]:not([tabindex="-1"])', openDlg).filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  const LB = { ch: null, i: 0 };
  function openLB(chId, i) {
    LB.ch = byId[chId];
    LB.i = i;
    if (!LB.ch) return;
    renderLB();
    openDialog($('#lightbox'));
  }
  function renderLB() {
    const ch = LB.ch, it = ch.gallery[LB.i];
    const cap = plain(t(it.cap));
    let media;
    if (it.drive) {
      media = `<div class="frame"><div class="frame__bar"><i></i><i></i><i></i><span>${esc(cap)}</span></div><iframe src="https://drive.google.com/file/d/${esc(it.drive)}/preview" allow="autoplay; fullscreen" allowfullscreen title="${esc(cap)}"></iframe></div>`;
    } else {
      media = imgTag(it.src ? [it.src] : srcList(CFG.images.evidence + it.file), cap, ph(esc(t(it.fig || D.ui.evidence))), !!it.src, true);
    }
    $('.lightbox__stage').innerHTML = media;
    $('.lightbox__cap').textContent = cap;
    $('.lightbox__count').textContent = `${LB.i + 1}/${ch.gallery.length}`;
    hydrate($('#lightbox'));
  }
  function stepLB(d) {
    if (!LB.ch) return;
    const n = LB.ch.gallery.length;
    LB.i = (LB.i + d + n) % n;
    renderLB();
  }

  function videoHTML(base, o = {}) {
    const tracks = o.tracks === false ? '' : ['vi', 'en'].map(l => `<track kind="subtitles" srclang="${l}" label="${l === 'vi' ? 'Tiếng Việt' : 'English'}" src="${base}.${l}.vtt"${l === S.lang ? ' default' : ''}>`).join('');
    return `<video class="${o.cls || ''}"${o.controls ? ' controls' : ''}${o.autoplay ? ' autoplay' : ''}${o.muted ? ' muted' : ''}${o.loop ? ' loop' : ''} playsinline preload="${o.preload || 'metadata'}"><source src="${base}.mp4" type="video/mp4"><source src="${base}.webm" type="video/webm">${tracks}</video>`;
  }
  function openModal(title, body) {
    const m = $('#modal');
    $('.modal__body', m).innerHTML = `<p class="modal__title">${esc(title)}</p>${body}`;
    m.setAttribute('aria-label', title);
    openDialog(m);
  }
  async function openVideo() {
    const base = CFG.video.cv;
    const ok = await exists(base + '.mp4');
    const title = t(D.hero.videoTitle);
    openModal(title, ok ? videoHTML(base, { controls: true, autoplay: true, cls: 'modal__video' }) : ph(esc(title), `<span>${esc(t(D.hero.videoPh))}</span>`));
  }
  function openProject(id) {
    const p = D.appendix.projects.find(x => x.id === id);
    if (p && p.chapter) go(p.chapter);
  }

  /* ---------- Video nền, cutdown, CV ---------- */
  async function setupHeroBg() {
    const base = CFG.video.hero;
    if (await exists(base + '.mp4')) {
      $('.hero__bg').insertAdjacentHTML('afterbegin', `<video${S.reduced ? '' : ' autoplay'} muted loop playsinline preload="auto"><source src="${base}.mp4" type="video/mp4"><source src="${base}.webm" type="video/webm"></video><div class="hero__dim"></div>`);
    }
    // Nút “Xem video CV” chỉ hiện khi có file video
    if (await exists(CFG.video.cv + '.mp4')) { const b = $('[data-video]'); if (b) b.hidden = false; }
  }
  let clipIO = null;
  /* Clip cutdown chỉ hiện khi có file; không có thì 4 ảnh minh chứng chiếm chỗ */
  function setupClips() {
    if (clipIO) clipIO.disconnect();
    clipIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(en => {
      const v = $('video', en.target);
      if (v && !S.reduced) { if (en.isIntersecting) v.play().catch(() => {}); else v.pause(); }
    }), { threshold: .4 }) : null;
    $$('.clip[data-clip]').forEach(async box => {
      const base = CFG.video.cutdowns[box.dataset.clip];
      if (!base || !(await exists(base + '.mp4'))) return;
      box.innerHTML = videoHTML(base, { muted: true, loop: true, preload: 'none', controls: S.reduced });
      $('video', box).muted = true;
      box.hidden = false;
      box.parentElement.classList.remove('story__media--noclip');
      if (clipIO) clipIO.observe(box);
    });
  }
  async function checkCV() {
    S.cvOk.vi = await exists(CFG.cv.vi);
    S.cvOk.en = await exists(CFG.cv.en);
    updateCvUI();
  }
  function cvUrl() {
    if (S.cvOk[S.lang]) return CFG.cv[S.lang];
    if (S.cvOk.vi) return CFG.cv.vi;
    if (S.cvOk.en) return CFG.cv.en;
    const L = CFG.cvLink || {};
    return L[S.lang] || L.vi || null;
  }
  function updateCvUI() {
    const u = cvUrl();
    $$('[data-cv]').forEach(a => {
      if (u && /^https?:/.test(u)) { a.setAttribute('href', u); a.removeAttribute('download'); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
      else if (u) { a.setAttribute('href', u); a.setAttribute('download', u.split('/').pop()); a.removeAttribute('target'); }
      else { a.removeAttribute('download'); a.setAttribute('href', '#lien-he'); }
    });
    $$('[data-cv-meta]').forEach(m => { m.textContent = u ? (/^https?:/.test(u) ? (S.lang === 'en' ? 'CV · PDF · English' : 'CV · PDF · Tiếng Việt') : u.split('/').pop()) : t(D.ui.cvMissing); });
  }

  /* ---------- Liên hệ ---------- */
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('is-on'), 2600);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      ta.remove();
      return ok;
    }
  }
  /* Máy không có ứng dụng thư: sao chép địa chỉ, hiện “Đã sao chép” */
  function onMail() {
    let left = false;
    const markLeft = () => { left = true; };
    addEventListener('blur', markLeft, { once: true });
    document.addEventListener('visibilitychange', markLeft, { once: true });
    setTimeout(() => {
      removeEventListener('blur', markLeft);
      document.removeEventListener('visibilitychange', markLeft);
      if (!left) copy(CFG.email).then(ok => { if (ok) toast(`${t(D.ui.copied)}: ${CFG.email}`); });
    }, 1000);
  }

  /* ---------- Chương _ AN ---------- */
  const norm = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'D').toUpperCase().replace(/[^A-Z]/g, '');
  const letters = s => (s || '').replace(/[^\p{L}]/gu, '').toUpperCase();
  function cleanSlot(el) {
    if (el._composing) return;
    const v = [...letters(el.value)].slice(0, 2).join('');
    if (v !== el.value) el.value = v;
    el.classList.toggle('is-empty', !v);
    fitRow();
  }
  function sizeSlot(el) {
    if (!el) return;
    const f = fontOf(el);
    ctx.font = f.font;
    const w = el.value ? ctx.measureText(el.value).width + f.fs * .06 : f.fs * .62;
    el.style.width = Math.ceil(w) + 'px';
  }
  function sizeSlots() { $$('.slot').forEach(sizeSlot); }
  /* Chữ ghép dài hơn bề ngang màn hình thì thu nhỏ cho vừa */
  function fitRow() {
    const row = $('#word-row');
    if (!row) return;
    row.style.removeProperty('--ws');
    sizeSlots();
    const box = row.parentElement, cs = getComputedStyle(box);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const w = row.getBoundingClientRect().width;
    if (avail > 0 && w > avail) {
      row.style.setProperty('--ws', Math.floor(parseFloat(getComputedStyle(row).fontSize) * avail / w) + 'px');
      sizeSlots();
    }
  }
  function msg(s) { const m = $('.next__msg'); if (m) m.textContent = s; }
  function combine() {
    const pre = $('#slot-pre'), post = $('#slot-post');
    if (!pre || pre.readOnly) return;
    const a = norm(pre.value), b = norm(post.value);
    if (!a && !b) { msg(t(D.next.empty)); pre.focus(); return; }
    const key = `${a}|${b}`;
    const entry = D.next.words[key];
    if (key === 'D|') pre.value = 'Đ';             // gõ “d” hiểu là “Đ”
    const word = entry ? entry.word : [pre.value, 'AN', post.value].filter(Boolean).join('·');
    S.next = { pre: pre.value, post: post.value, key };
    msg('');
    showResult(entry, false);
    send(word, pre.value, post.value);
  }
  function showResult(entry, instant) {
    const row = $('#word-row'), res = $('.next__result');
    const pre = $('#slot-pre'), post = $('#slot-post');
    [pre, post].forEach(el => { el.readOnly = true; el.classList.remove('is-empty'); sizeSlot(el); if (!instant) el.blur(); });
    fitRow();
    row.classList.remove('is-done');
    void row.offsetWidth;
    row.classList.add('is-done');
    $('.answer', res).textContent = t(entry ? entry.a : D.next.other);
    $('[data-combine]').hidden = true;
    res.hidden = false;
    const items = [$('.answer', res)].concat($$('.goals li', res), [$('.next__cta', res)]);
    const delays = instant || S.reduced ? [0, 0, 0, 0] : [300, 900, 1200, 1700];
    items.forEach(el => el.classList.remove('is-in'));
    items.forEach((el, k) => setTimeout(() => el.classList.add('is-in'), delays[Math.min(k, 3)]));
    if (!instant) sfx('khop');
  }
  function restoreNext() {
    const pre = $('#slot-pre'), post = $('#slot-post');
    if (!pre || !S.next) return;
    pre.value = S.next.pre; post.value = S.next.post;
    showResult(D.next.words[S.next.key], true);
  }
  function resetNext() {
    const pre = $('#slot-pre'), post = $('#slot-post');
    [pre, post].forEach(el => { el.readOnly = false; el.value = ''; el.classList.add('is-empty'); });
    fitRow();
    $('#word-row').classList.remove('is-done');
    $('.next__result').hidden = true;
    $('[data-combine]').hidden = false;
    msg('');
    S.next = null;
    pre.focus();
  }
  function send(word, a, b) {
    if (EMBED || !CFG.formspree || S.sent.has(word) || S.sent.size >= 8) return;
    S.sent.add(word);
    fetch(CFG.formspree, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: `[Portfolio AN] Chữ mới ở chương _ AN: ${word}`,
        chu_ghep: word,
        chu_truoc: a || '(trống)',
        chu_sau: b || '(trống)',
        xung_ho: S.mode === 'thay' ? 'em – thầy (link có ?v=thay)' : 'mình – bạn',
        ngon_ngu: S.lang,
        thoi_gian: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        trang: location.href
      })
    }).then(r => {
      msg(r.ok ? t(D.next.sent) : t(D.next.failed));
      if (!r.ok) S.sent.delete(word);
    }).catch(() => { msg(t(D.next.failed)); S.sent.delete(word); });
  }

  /* ---------- Menu điện thoại ---------- */
  function toggleMenu(open) {
    const m = $('#menu'), b = $('.menu-btn');
    const on = open != null ? open : m.hidden;
    m.hidden = !on;
    b.setAttribute('aria-expanded', String(on));
    b.setAttribute('aria-label', t(on ? D.ui.close : D.ui.menu));
    document.documentElement.style.overflow = on ? 'hidden' : '';
    if (on) { const a = $('a', m); if (a) a.focus(); }
  }
  function closeMenu() { if (!$('#menu').hidden) toggleMenu(false); }

  /* ---------- Presentation Mode (tải present.js khi cần) ---------- */
  const SLIDE_FOR = { an: 1, 'muc-luc': 1, ban: 3, lan: 4, vang: 5, toan: 6, tan: 7, 'phu-luc': 2, 'chuong-tiep': 8, 'lien-he': 9 };
  function openPresent() {
    if (EMBED) return;
    closeMenu();
    let el = $('#present');
    if (!el) { el = document.createElement('div'); el.id = 'present'; el.className = 'present'; document.body.appendChild(el); }
    el.hidden = false;
    if (el.requestFullscreen && !document.fullscreenElement) el.requestFullscreen().catch(() => {});
    const n = SLIDE_FOR[S.active] || 1;
    if (window.ANPresent) { window.ANPresent.open(n); return; }
    const s = document.createElement('script');
    s.src = 'assets/js/present.js';
    s.onload = () => { if (window.ANPresent) window.ANPresent.open(n); };
    s.onerror = () => { el.hidden = true; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); };
    document.body.appendChild(s);
  }

  /* ---------- Sự kiện ---------- */
  document.addEventListener('click', e => {
    const el = e.target;
    if (!el.closest) return;
    const cv = el.closest('[data-cv]');
    if (cv) {
      if (!cvUrl()) { e.preventDefault(); toast(t(D.ui.cvMissing)); }
      closeMenu();
      return;
    }
    if (el.closest('[data-mail]')) { onMail(); return; }
    const a = el.closest('a[href^="#"]');
    if (a) {
      const id = a.getAttribute('href').slice(1);
      if (id && document.getElementById(id)) { e.preventDefault(); closeMenu(); closeDialog(); go(id); }
      return;
    }
    if (el.closest('[data-lang-toggle]')) { setLang(S.lang === 'vi' ? 'en' : 'vi'); return; }
    if (el.closest('[data-sound]')) { toggleSound(); return; }
    if (el.closest('[data-present]')) { openPresent(); return; }
    if (el.closest('.menu-btn')) { toggleMenu(); return; }
    if (el.closest('[data-video]')) { openVideo(); return; }
    const th = el.closest('[data-open]');
    if (th) { const [c, i] = th.dataset.open.split(':'); openLB(c, +i); return; }
    const nb = el.closest('[data-notes]');
    if (nb) { const sec = nb.closest('.chapter'); if (nb.dataset.notes === 'open') openNotes(sec); else closeNotes(sec); return; }
    const pc = el.closest('[data-project]');
    if (pc) { openProject(pc.dataset.project); return; }
    if (el.closest('[data-combine]')) { combine(); return; }
    if (el.closest('[data-again]')) { resetNext(); return; }
    if (el.closest('[data-close]')) { closeDialog(); return; }
    const lb = el.closest('[data-lb]');
    if (lb) { stepLB(+lb.dataset.lb); return; }
    if (openDlg && (el === openDlg || el.classList.contains('lightbox__stage') || el.classList.contains('modal__body'))) closeDialog();
  });

  document.addEventListener('keydown', e => {
    if (S.presentOpen) return;
    if (openDlg) {
      if (e.key === 'Escape') { e.preventDefault(); closeDialog(); }
      else if (openDlg.id === 'lightbox' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); stepLB(e.key === 'ArrowLeft' ? -1 : 1); }
      else if (e.key === 'Tab') trap(e);
      return;
    }
    const tg = e.target;
    if (tg.classList && tg.classList.contains('slot')) {
      if (e.key === 'Enter') { e.preventDefault(); combine(); return; }
      if (e.key === 'Backspace' && tg.id === 'slot-post' && !tg.value) { $('#slot-pre').focus(); return; }
    }
    if (e.key === 'Escape') {
      if (!$('#menu').hidden) { toggleMenu(false); $('.menu-btn').focus(); return; }
      if (S.openNotes) { closeNotes($('#' + S.openNotes)); return; }
    }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName) || tg.isContentEditable;
    if (!typing && !e.metaKey && !e.ctrlKey && !e.altKey && (e.key === 'f' || e.key === 'F') && mqDesk.matches && !EMBED) {
      e.preventDefault();
      openPresent();
    }
  });

  document.addEventListener('input', e => { if (e.target.classList && e.target.classList.contains('slot')) cleanSlot(e.target); });
  document.addEventListener('compositionstart', e => { if (e.target.classList && e.target.classList.contains('slot')) e.target._composing = true; });
  document.addEventListener('compositionend', e => { if (e.target.classList && e.target.classList.contains('slot')) { e.target._composing = false; cleanSlot(e.target); } });

  /* Mục lục: rê chuột thì các chữ cái bay vào ghép quanh AN */
  document.addEventListener('mouseover', e => {
    const cell = e.target.closest && e.target.closest('.toc__cell');
    if (!cell || (e.relatedTarget && cell.contains(e.relatedTarget)) || !S.fine || S.reduced) return;
    flyIn($('.toc__word', cell), 0);
  });

  /* ---------- Khởi động ---------- */
  function init() {
    document.documentElement.classList.toggle('is-embed', EMBED);
    SCREENS = $$('.screen');
    $('#main').insertAdjacentHTML('afterend', '<footer class="footer">Đoàn Minh Duy An · 2026</footer>');
    renderAll(false);
    build3D();
    measureHero();
    heroUpdate();
    mark.classList.add('is-ready');
    setupHeroBg();
    checkCV();

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('scrollend', () => { if (S.programmatic) { clearTimeout(S.scrollEndT); scrollEnded(); } });
    addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
    addEventListener('resize', debounce(() => {
      S.desk = mqDesk.matches;
      measureHero(); heroUpdate(); fitRow(); updateNav();
    }, 120));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measureHero(); heroUpdate(); fitRow(); });

    // Điểm vào có #chương: nhảy thẳng tới, không cuộn mượt
    const h = decodeURIComponent(location.hash.slice(1));
    const target = h && document.getElementById(h);
    if (target) {
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      target.scrollIntoView({ block: 'start' });
      html.style.scrollBehavior = prev;
      heroUpdate();
    }
    updateNav(true);
    if (FX.includes(S.active)) { S.lastFx = S.active; enterScreen(S.active, null); }

    // Tải trước present.js khi rảnh (desktop)
    if (mqDesk.matches && !EMBED) {
      const pre = () => { const l = document.createElement('link'); l.rel = 'prefetch'; l.href = 'assets/js/present.js'; document.head.appendChild(l); };
      if ('requestIdleCallback' in window) requestIdleCallback(pre, { timeout: 4000 }); else setTimeout(pre, 3000);
    }
  }

  /* Dùng chung với present.js */
  window.AN = {
    t, esc, plain, D, CFG, S, CH, byId, ACC, BG,
    nameInner, flyIn, dropAccent, dropO, setBase, imgTag, srcList, ph, hydrate, sfx,
    goalHTML, contactLine, qrImg, exists
  };

  init();
})();
