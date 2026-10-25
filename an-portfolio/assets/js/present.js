/* =========================================================================
   AN · present.js — Presentation Mode: 9 slide 16:9 và biến thể chiếu P0–P9
   Tải khi bấm nút Trình chiếu hoặc phím F.
   Phím: ←/→ chuyển slide · P biến thể chiếu · N chạy ngay nhịp tiếp theo
         B màn đen · R chạy lại slide · + / − cỡ chữ AN · Esc thoát
   Biến thể chiếu theo “AN – Kịch bản chi tiết & Storyboard Video CV”:
   nền đen tuyệt đối, ẩn con trỏ, chữ AN luôn ở cùng tọa độ. Các chữ tạo bằng
   vật thật (dấu sắc băng keo, chữ L bằng bóng người, chữ V bằng lightstick)
   và chữ trên đầu ngón tay (hậu kỳ) KHÔNG được chiếu.
   Mỗi hình chiếu chạy theo nhịp hẹn giờ khớp thoại; bấm N để chạy nhịp sớm hơn.
   ========================================================================= */
(() => {
  'use strict';
  const A = window.AN;
  if (!A || window.ANPresent) return;
  const { t, esc, plain, D, CFG } = A;
  const P = Object.assign({ anX: .5, anY: .55, anSize: 180, eyeTop: .16, eyeBottom: .36, chinY: .7 }, CFG.projection || {});
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const W = 1920, H = 1080, AX = P.anX * W, AY = P.anY * H, CY = P.chinY * H;
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const PCOL = { ban: '#FF8A6E', lan: '#B9CDD8', vang: '#FF6FB5', toan: '#EAF0FF', tan: '#E8D5B9' };
  // Màu chiếu từng chương: cam ấm, xanh nước, hồng neon, trắng lạnh, nâu ấm
  const WASH = { ban: 'rgba(255,140,60,.42)', lan: 'rgba(120,180,220,.32)', vang: 'rgba(255,79,163,.36)', toan: 'rgba(225,235,255,.26)', tan: 'rgba(170,110,60,.40)' };
  const ctx = document.createElement('canvas').getContext('2d');

  const st = { open: false, i: 0, prev: 0, proj: false, black: false, fs: false, anims: [], timers: [], rafs: [], idle: 0, beat: null, size: loadSize() };
  let root = null, stage = null, hud = null;

  function loadSize() {
    try { const v = parseFloat(localStorage.getItem('an-proj-size')); if (v >= 60 && v <= 520) return v; } catch (e) { /* bỏ qua */ }
    return P.anSize;
  }
  const anim = (el, kf, o) => { if (!el) return null; const a = el.animate(kf, o); st.anims.push(a); return a; };
  const later = (fn, ms) => { st.timers.push(setTimeout(fn, ms)); };
  const slideEl = n => $(`.slide[data-n="${n}"]`, root);
  const T2 = (vi, en) => t({ vi, en });

  /* Nhịp: [[mốc ms, hàm], …] chạy tự động; phím N chạy ngay nhịp kế tiếp */
  function beats(list) {
    st.beat = { list, i: 0 };
    list.forEach(([ms], k) => later(() => fire(k), ms));
  }
  function fire(k) {
    const b = st.beat;
    if (!b) return;
    while (b.i <= k && b.i < b.list.length) b.list[b.i++][1]();
  }
  function nextBeat() { if (st.beat && st.beat.i < st.beat.list.length) fire(st.beat.i); }

  /* ---------- Ảnh ---------- */
  const evImg = file => A.imgTag(A.srcList(CFG.images.evidence + file), file, A.ph(esc(file)), false, true);
  const remoteImg = (src, alt) => A.imgTag([src], alt, A.ph(esc(alt)), true, true);

  /* ---------- Slide thuyết trình ---------- */
  function snChapter(c) {
    const it = c.gallery[c.slide.img];
    const img = it.src ? remoteImg(it.src, plain(t(it.cap))) : A.imgTag(A.srcList(CFG.images.evidence + it.file), plain(t(it.cap)), A.ph(esc(t(it.fig))), false, true);
    return `<div class="sn sn--ch" style="background:${A.BG[c.id]};--acc:${A.ACC[c.id]}">
      <div>
        <p class="sn__label">${esc(t(D.ui.chapterOf, { n: c.n }))} · ${esc(t(c.project))}</p>
        <h2 class="sn__name" aria-label="${c.rail}">${A.nameInner(c)}</h2>
        <p class="sn__sent">${esc(t(c.story))}</p>
        <div class="sn__stat"><b>${t(c.slide.stat)}</b><span>${esc(t(c.slide.statLabel))}</span></div>
      </div>
      <div class="sn__img">${img}</div>
    </div>`;
  }
  const NORMAL = {
    1: () => `<div class="sn sn--center" style="background:#0D0B0A"><div class="sn__an"><span class="an3d__face">AN</span></div><p class="sn__line">${esc(t(D.hero.sub))}</p></div>`,
    2: () => `<div class="sn" style="background:#0D0B0A"><p class="sn__label">${esc(t(D.present.mottoLabel))}</p><p class="sn__motto">${esc(t(D.appendix.cols[1].motto))}</p></div>`,
    3: () => snChapter(A.CH[0]),
    4: () => snChapter(A.CH[1]),
    5: () => snChapter(A.CH[2]),
    6: () => snChapter(A.CH[3]),
    7: () => snChapter(A.CH[4]),
    8: () => `<div class="sn sn--center sn--next"><p class="sn__word"><span class="blank">_</span><span class="word-an">AN</span></p><p class="sn__line">${esc(t(D.present.inviteLine))}</p><ul class="sn__goals">${D.next.goals.map(g => `<li>${A.goalHTML(t(g))}</li>`).join('')}</ul></div>`,
    9: () => `<div class="sn" style="background:#0D0B0A"><h2 class="contact__line" style="font-size:132px;margin:0">${A.contactLine()}</h2><p class="sn__contact">${esc(CFG.email)}<br>Zalo ${esc(CFG.zalo)}</p><div class="sn__qr">${A.qrImg(true, 'cv')}</div></div>`
  };
  NORMAL[0] = NORMAL[1];

  /* ---------- Biến thể chiếu ---------- */
  const L = (x, side) => `<span class="cl" data-side="${side}">${x}</span>`;
  // Chữ AN neo ở tọa độ cố định; chữ cái khác gắn hai bên
  function pw(c, o = {}) {
    const pre = o.pre != null ? o.pre : (c ? [...c.pre].map(x => L(x, 'pre')).join('') : '');
    const post = o.post != null ? o.post : (c ? [...c.post].map(x => L(x, 'post')).join('') : '');
    return `<div class="pw${o.glow ? ' pw--glow' : ''}"><span class="pw__an" style="--pcol:${c ? PCOL[c.id] : '#F4EDE4'}"><span class="pw__pre">${pre}</span>AN<span class="pw__post">${post}</span>${o.blank ? '<span class="blank">_</span>' : ''}</span></div>`;
  }
  const wash = id => `<div class="p-wash" style="--w:${WASH[id]}"></div>`;
  const ticks = Array.from({ length: 12 }, (_, k) => `<line x1="50" y1="11" x2="50" y2="${k % 3 ? 17 : 21}" stroke="currentColor" stroke-width="${k % 3 ? 3 : 5}" transform="rotate(${k * 30} 50 50)"/>`).join('');
  const CLOCK = `<span class="cl cl--clock" data-side="pre"><svg class="p-clock" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="8"/>${ticks}<line class="p-hand" x1="50" y1="50" x2="50" y2="16" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="currentColor"/></svg></span>`;

  const PROJ = {
    // Cảnh 1: P0 khung trắng phẳng đóng vai “đèn phòng”, chập hai lần rồi tắt
    0: () => '<div class="p0"></div>',
    // Cảnh 2C: AN rơi chậm vào lòng bàn tay
    1: () => pw(null),
    // Cảnh 3: lưới số liệu, đường xu hướng, màu loang; hòa thành đốm hổ phách ở cằm
    2: () => {
      const nums = D.present.p2Numbers;
      const col = k => { const arr = nums.filter((_, i) => i % 4 === k); const list = arr.concat(arr, arr); return `<div class="p-nums__col"><div class="p-nums__in">${list.concat(list).map(n => `<div>${esc(n)}</div>`).join('')}</div></div>`; };
      const pts = [[90, 860], [250, 720], [410, 770], [570, 580], [730, 630], [900, 430]];
      const blobs = [['#FFB547', 560, 140, 80], ['#FF4FA3', 460, 460, 400], ['#3D7BFF', 480, 260, 640], ['#FF6B4A', 380, 620, 160], ['#8FA9B8', 320, 60, 720]]
        .map(([c, s, x, y]) => `<div class="p-blob" style="background:${c};width:${s}px;height:${s}px;left:${x}px;top:${y}px"></div>`).join('');
      return `<div class="p-half p-half--l" style="transform-origin:100% ${CY}px"><div class="p-grid"></div><div class="p-nums">${[0, 1, 2, 3].map(col).join('')}</div>
        <svg class="p-trend" viewBox="0 0 960 1080" aria-hidden="true"><polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#FFB547" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#FFB547"/>`).join('')}</svg>
        <div class="p-words">${D.present.p2Words.map(w => `<span>${esc(w)}</span>`).join('')}</div></div>
        <div class="p-half p-half--r" style="transform-origin:0 ${CY}px">${blobs}</div>
        <div class="p-dot" style="left:${AX}px;top:${CY}px"></div><div class="p-eye"></div>`;
    },
    // Cảnh 4: chỉ chiếu B + AN (dấu sắc là băng keo thật)
    3: () => {
      const c = A.byId.ban;
      const spots = [[80, 100, 240], [130, 640, 220], [480, 90, 190], [1450, 100, 230], [1590, 540, 240], [1300, 800, 200]];
      const floats = c.gallery.filter(g => g.src).slice(0, 6).map((g, k) => { const [x, y, s] = spots[k]; return `<div class="p-float p-img" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px">${remoteImg(g.src, plain(t(g.cap)))}</div>`; }).join('');
      const note = (x, y, name) => `<div class="p-note" style="left:${x}px;top:${y}px"><b>Shopee</b>${esc(T2('Bạn có đơn hàng mới', 'You have a new order'))} · ${esc(name)}</div>`;
      const steps = [T2('Thấy', 'See'), T2('Thích', 'Like'), T2('Cân nhắc', 'Consider'), T2('Mua', 'Buy')];
      return `${wash('ban')}${floats}${note(AX - 640, AY + 170, 'LUCKY BOX SAKAMOTO DAYS')}${note(AX + 200, AY + 230, 'LUCKY BOX CORTIS')}
        <div class="p-prog" style="left:${AX - 516}px;top:${AY - 330}px">${steps.map((s, k) => `<span${k < 3 ? ' class="is-on"' : ''}>${esc(s)}</span>`).join('')}</div>${pw(c)}`;
    },
    // Cảnh 5: chỉ chiếu AN (chữ L là bóng người); bình luận tan thành gợn nước
    4: () => {
      const src = D.present.p4Comments.length ? D.present.p4Comments : Array.from({ length: 6 }, () => D.present.p4Placeholder);
      const ys = [140, 400, 690, 200, 470, 760];
      const cm = src.slice(0, 6).map((c, k) => `<p class="p-cmt" data-k="${k}" style="top:${ys[k]}px">${esc(typeof c === 'string' ? c : t(c))}</p>`).join('');
      let seed = 7;
      const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
      const dots = Array.from({ length: 150 }, () => `<i class="p-fol" style="left:${Math.round(rnd() * W)}px;top:${Math.round(rnd() * H)}px"></i>`).join('');
      return `${wash('lan')}<div class="p-dots">${dots}</div><div class="p-img" style="left:80px;top:110px;width:470px;height:400px">${evImg('1-4')}</div><div class="p-img" style="left:1390px;top:90px;width:450px;height:390px">${evImg('1-7')}</div>${cm}${pw(null)}`;
    },
    // Cảnh 6: chiếu AN + G (chữ V vẽ bằng lightstick); sóng âm, ô ấn phẩm, tim bay
    5: () => {
      const beams = [[200, -16], [700, 9], [1150, -7], [1560, 14]].map(([x, r]) => `<div class="p-beam" style="left:${x}px;transform:rotate(${r}deg)"></div>`).join('');
      const tiles = [['2-2', 90, 120], ['2-3', 90, 600], ['2-5', 1530, 330]].map(([f, x, y]) => `<div class="p-img p-tile" style="left:${x}px;top:${y}px;width:300px;height:300px">${evImg(f)}</div>`).join('');
      const hearts = Array.from({ length: 12 }, (_, k) => `<span class="p-heart" style="left:${120 + (k * 149) % 1680}px">♥</span>`).join('');
      return `${wash('vang')}<div class="p-waves"></div>${beams}${tiles}${hearts}${pw(A.byId.vang, { pre: '', glow: true })}`;
    },
    // Cảnh 7: T + đồng hồ (chữ O) + AN; lưới commplan dừng ở 3 ô; về 00:00 → D-Day; O rơi khỏi khung
    6: () => {
      const cells = D.present.p6Cells;
      let html = '';
      for (let i = 0; i < 34 * 6; i++) html += `<div>${esc(cells[(i * 7 + Math.floor(i / 6)) % cells.length])}</div>`;
      const boxes = [['2', T2('chiến dịch', 'campaigns')], ['4', T2('content calendar', 'content calendars')], ['5', T2('mảng việc', 'workstreams')]]
        .map(([n, l], k) => `<div class="p-cell" style="left:1370px;top:${250 + k * 180}px"><b>${n}</b><span>${esc(l)}</span></div>`).join('');
      return `${wash('toan')}<div class="p-sheet"><div class="p-sheet__in">${html}${html}</div></div>${boxes}<p class="p-dday">D-Day 26/7</p>${pw(A.byId.toan, { pre: L('T', 'pre') + CLOCK })}`;
    },
    // Cảnh 8: tường chỉ còn TAN (chữ O đã rơi ở cảnh 7)
    7: () => {
      const smoke = [0, 1, 2, 3].map(k => `<div class="p-smoke" style="left:${790 + k * 70}px;top:${720 + (k % 2) * 40}px;width:${240 + k * 30}px;height:${240 + k * 30}px"></div>`).join('');
      const [a, b] = D.present.p7.map(x => t(x));
      return `${wash('tan')}${smoke}<p class="p-text" style="left:120px;top:800px">${esc(a)}</p><p class="p-text" style="right:120px;top:800px">${esc(b)}</p>${pw(A.byId.tan, { pre: L('T', 'pre') })}<div class="p-eye"></div>`;
    },
    // Cảnh 9: chỉ “_ AN” với gạch dưới nhấp nháy (chữ trên đầu ngón tay làm bằng hậu kỳ)
    8: () => pw(null, { blank: true, glow: false }),
    // Cảnh 10B: “_ AN” trên lòng bàn tay, gạch dưới nở thành mã QR website
    9: () => `${pw(null, { blank: true })}<div class="p-qr">${A.qrImg(true, 'web')}</div>`
  };

  /* Đặt tâm nét chữ AN đúng tọa độ neo */
  function centerAN(an) {
    try {
      const cs = getComputedStyle(an);
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing;
      const m = ctx.measureText('AN');
      const probe = document.createElement('i');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      an.insertBefore(probe, $('.pw__post', an));
      const base = probe.offsetTop;
      probe.remove();
      const w = an.offsetWidth, h = an.offsetHeight;
      if (!w || !h) return;
      an.style.setProperty('--dx', (w / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2).toFixed(1) + 'px');
      an.style.setProperty('--dy', (h / 2 - (base - m.actualBoundingBoxAscent / 2)).toFixed(1) + 'px');
    } catch (e) { /* giữ căn giữa theo khung chữ */ }
  }
  const centerAll = box => { if (box) $$('.pw__an', box).forEach(centerAN); };
  const fadeIn = (el, dur = 900, to = 1) => anim(el, [{ opacity: 0 }, { opacity: to }], { duration: dur, easing: 'ease-out', fill: 'forwards' });
  function ring(box, x, y, o = {}) {
    const r = document.createElement('div');
    r.className = 'p-ring';
    r.style.left = x + 'px'; r.style.top = y + 'px';
    if (o.color) r.style.borderColor = o.color;
    box.appendChild(r);
    anim(r, [{ transform: 'scale(.2)', opacity: o.from || .8 }, { transform: `scale(${o.scale || 3})`, opacity: o.keep || 0 }], { duration: o.dur || 1600, delay: o.delay || 0, easing: 'cubic-bezier(.2,.6,.3,1)', fill: 'both', iterations: o.iter || 1 });
  }

  /* ---------- Chạy hiệu ứng từng slide ---------- */
  function runNormal(n, box) {
    if (n <= 1) anim($('.sn__line', box), [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 250, easing: EASE, fill: 'backwards' });
    if (n === 2) anim($('.sn__motto', box), [{ opacity: 0 }, { opacity: 1 }], { duration: 900, fill: 'backwards' });
    if (n >= 3 && n <= 7) {
      const c = A.CH[n - 3], name = $('.sn__name', box);
      if (c.id === 'tan' && st.prev === 6) { A.dropO(name, 350); return; }
      const h = $('.acc-host', name);
      if (h) A.setBase(h, 'A');
      A.flyIn(name, 150);
      if (h) A.dropAccent(h, 560);
    }
  }
  const flicker = (el, off) => anim(el, off
    ? [{ opacity: 1 }, { opacity: .15, offset: .12 }, { opacity: 1, offset: .22 }, { opacity: .25, offset: .4 }, { opacity: .9, offset: .5 }, { opacity: 0 }]
    : [{ opacity: 1 }, { opacity: .2, offset: .25 }, { opacity: 1, offset: .45 }, { opacity: .4, offset: .7 }, { opacity: 1 }],
    { duration: off ? 1100 : 450, easing: 'steps(1, end)', fill: 'forwards' });

  const RUNP = {
    0(box) {
      const w = $('.p0', box);
      // 0:05 đèn chập lần 1 ở chữ “về…” · 0:07 chập lần 2 rồi tắt hẳn; sau đó bấm → sang P1
      beats([[5000, () => flicker(w)], [7000, () => flicker(w, true)]]);
    },
    1(box) {
      // 1 giây đen (tiếng “tạch”), AN rơi chậm như đốm lửa, nảy nhẹ một lần
      anim($('.pw', box), [
        { transform: 'translateY(-820px)', easing: 'cubic-bezier(.45,0,.9,.5)' },
        { transform: 'translateY(0)', offset: .72, easing: 'cubic-bezier(0,.5,.4,1)' },
        { transform: 'translateY(-34px)', offset: .86, easing: 'cubic-bezier(.5,0,1,.5)' },
        { transform: 'translateY(0)' }
      ], { duration: 2000, delay: 1000, fill: 'backwards' });
      anim($('.pw__an', box), [{ textShadow: '0 0 0 rgba(255,181,71,0)' }, { textShadow: '0 0 .35em rgba(255,181,71,.9)' }, { textShadow: '0 0 .14em rgba(255,181,71,.45)' }], { duration: 1400, delay: 2400, fill: 'forwards' });
    },
    2(box) {
      $$('.p-nums__in', box).forEach((el, k) => anim(el, [{ transform: 'translateY(0)' }, { transform: 'translateY(-50%)' }], { duration: [26000, 34000, 22000, 30000][k % 4], iterations: Infinity }));
      $$('.p-words span', box).forEach((el, k) => anim(el, [{ opacity: 0, transform: 'translateX(-24px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 400 + k * 380, easing: EASE, fill: 'backwards' }));
      const blobs = $$('.p-blob', box);
      blobs.forEach((el, k) => anim(el, [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${k % 2 ? -140 : 160}px, ${k % 3 ? 120 : -140}px) scale(${(1.25 - k * .06).toFixed(2)})` }], { duration: 6500 + k * 1400, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' }));
      const line = $('.p-trend polyline', box), dots = $$('.p-trend circle', box);
      const len = line.getTotalLength ? line.getTotalLength() : 1200;
      line.style.strokeDasharray = len; line.style.strokeDashoffset = len;
      dots.forEach(d => { d.style.opacity = .55; });
      const L2 = $('.p-half--l', box), R = $('.p-half--r', box), dot = $('.p-dot', box);
      beats([
        // 0:26 “vẽ đường chiến lược”: các chấm tự nối thành đường xu hướng
        [11000, () => { anim(line, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1500, easing: 'ease-in-out', fill: 'forwards' }); dots.forEach((d, k) => anim(d, [{ opacity: .55 }, { opacity: 1 }], { duration: 300, delay: k * 220, fill: 'forwards' })); }],
        // 0:30 “trực giác”: màu loang nở như mực nhỏ vào nước
        [15000, () => anim(R, [{ filter: 'saturate(1) brightness(1)' }, { filter: 'saturate(1.5) brightness(1.35)' }], { duration: 1800, easing: 'ease-out', fill: 'forwards' })],
        // 0:33 hai nửa chảy về cằm, hòa thành đốm hổ phách rồi tắt
        [18000, () => {
          anim(L2, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.04)', opacity: 0 }], { duration: 1000, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' });
          anim(R, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.04)', opacity: 0 }], { duration: 1000, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' });
          anim(dot, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.2)', offset: .45 }, { opacity: 1, transform: 'scale(1)', offset: .7 }, { opacity: 0, transform: 'scale(.6)' }], { duration: 2000, delay: 700, fill: 'forwards' });
        }]
      ]);
    },
    3(box) {
      const an = $('.pw__an', box);
      A.flyIn(an, 200);
      const floats = $$('.p-float', box), notes = $$('.p-note', box), prog = $('.p-prog', box);
      beats([
        // 0:38 ảnh sản phẩm trôi qua tay
        [3000, () => floats.forEach((el, k) => {
          fadeIn(el, 1000, .8);
          anim(el, [{ transform: 'translateY(0) rotate(0deg)' }, { transform: `translateY(${k % 2 ? -46 : 40}px) rotate(${k % 2 ? 3 : -3}deg)` }], { duration: 5200 + k * 900, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
        })],
        // 0:40 bóp bong bóng xốp: hai thông báo đơn hàng bật lên
        [5200, () => anim(notes[0], [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1.06)', offset: .6 }, { opacity: 1, transform: 'scale(1)' }], { duration: 380, easing: 'ease-out', fill: 'forwards' })],
        [6000, () => anim(notes[1], [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1.06)', offset: .6 }, { opacity: 1, transform: 'scale(1)' }], { duration: 380, easing: 'ease-out', fill: 'forwards' })],
        // 0:44 thanh tiến trình bốn nấc ngang ngực
        [9000, () => { notes.forEach(n => anim(n, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' })); fadeIn(prog, 700); }],
        // 0:47 đẩy hộp về phía máy quay: nhích thêm đúng một nấc
        [12000, () => { const s = $$('span', prog)[3]; s.classList.add('is-on'); anim(s, [{ filter: 'brightness(1)' }, { filter: 'brightness(1.8)' }, { filter: 'brightness(1)' }], { duration: 900 }); }]
      ]);
    },
    4(box) {
      const cm = $$('.p-cmt', box);
      cm.forEach(el => { el.style.opacity = 0; });
      const imgs = $$('.p-img', box), dots = $$('.p-fol', box);
      const drift = (el, k) => {
        const left = k < 3, w = el.offsetWidth || 620;
        const x0 = left ? -w - 40 : W + 40, x1 = left ? AX - 420 - w : AX + 420;
        const dur = 7000;
        anim(el, [{ transform: `translateX(${x0}px)`, opacity: 0 }, { opacity: .95, offset: .15 }, { opacity: .95, offset: .82 }, { transform: `translateX(${x1}px)`, opacity: 0 }], { duration: dur, easing: 'cubic-bezier(.3,.1,.4,1)', fill: 'forwards' });
        later(() => ring(box, left ? x1 + w : x1, (parseFloat(el.style.top) || 300) + 40, { scale: 3.2 }), dur * .85);
      };
      beats([
        // 0:54 bình luận trôi chậm từ hai phía về phía An, chạm bóng chữ L thì tan thành gợn nước
        [4000, () => cm.forEach((el, k) => later(() => drift(el, k), (k % 3) * 1300 + (k < 3 ? 0 : 650)))],
        // 1:01 “con số 0”: gợn nước nở từ chỗ ngón tay chạm sàn, chấm sáng lan kín tường
        [10500, () => {
          for (let k = 0; k < 6; k++) ring(box, AX - 160, AY + 330, { scale: 13, dur: 3200, delay: k * 420, keep: k === 5 ? .3 : 0 });
          dots.forEach((d, k) => anim(d, [{ opacity: 0 }, { opacity: .85 }], { duration: 600, delay: 600 + (k % 50) * 45, fill: 'forwards' }));
        }],
        // tranh triển lãm, rồi trang báo Thanh Niên ở vòng ngoài cùng
        [12500, () => fadeIn(imgs[0], 1200, .85)],
        [14500, () => fadeIn(imgs[1], 1200, .85)]
      ]);
    },
    5(box) {
      A.flyIn($('.pw__an', box), 200);
      const waves = $('.p-waves', box);
      for (let k = 0; k < 4; k++) ring(waves, AX, AY, { color: 'rgba(255,111,181,.7)', scale: 9, dur: 2400, delay: k * 600, iter: Infinity });
      $$('.p-beam', box).forEach((el, k) => anim(el, [.15, 1, .25, .9, .05, .85, .2].map(o => ({ opacity: o, easing: 'steps(1, end)' })), { duration: 1500 + k * 260, iterations: Infinity, delay: k * 180 }));
      const tiles = $$('.p-tile', box), hearts = $$('.p-heart', box);
      beats([
        // 1:10 key visual và ấn phẩm hiện thành từng ô, nảy theo beat
        [3000, () => tiles.forEach((el, k) => { fadeIn(el, 500 + k * 200); anim(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }], { duration: 480, direction: 'alternate', iterations: Infinity, delay: k * 160, easing: 'ease-in-out' }); })],
        // 1:16 tim bay lên như đèn flash khán đài
        [9000, () => hearts.forEach((el, k) => anim(el, [{ transform: 'translateY(0) scale(.8)', opacity: 0 }, { opacity: 1, offset: .15 }, { transform: `translateY(-${700 + (k % 4) * 80}px) scale(1.2)`, opacity: 0 }], { duration: 2800, delay: (k % 6) * 260, iterations: 2, easing: 'ease-out' }))]
      ]);
    },
    6(box) {
      const an = $('.pw__an', box);
      A.flyIn(an, 200);
      const hand = $('.p-hand', box);
      let tick = anim(hand, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 60000, iterations: Infinity, easing: 'steps(60, end)' });
      const sheet = anim($('.p-sheet__in', box), [{ transform: 'translateY(0)' }, { transform: 'translateY(-50%)' }], { duration: 42000, iterations: Infinity });
      const cells = $$('.p-cell', box), dday = $('.p-dday', box);
      const fill = c => { $('b', c).style.visibility = 'visible'; anim(c, [{ transform: 'scale(1.08)', background: 'rgba(240,245,255,.35)' }, { transform: 'scale(1)', background: 'rgba(240,245,255,.08)' }], { duration: 500, fill: 'forwards' }); };
      cells.forEach(c => { $('b', c).style.visibility = 'hidden'; });
      beats([
        // 1:22 lưới commplan khựng lại đúng ba ô cần điền
        [3000, () => { sheet.pause(); cells.forEach((c, k) => fadeIn(c, 400 + k * 150)); }],
        // dán ba tờ note: 2 · 4 · 5
        [5000, () => fill(cells[0])], [6400, () => fill(cells[1])], [7800, () => fill(cells[2])],
        // 1:28 đồng hồ quay nhanh về 00:00, hiện D-Day 26/7
        [9000, () => { tick.cancel(); tick = anim(hand, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(1440deg)' }], { duration: 1400, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' }); later(() => fadeIn(dday, 600), 1400); }],
        // 1:31 chữ O bong khỏi TOAN và rơi ra khỏi khung, nối sang cảnh 8
        [11500, () => {
          const o = $('.cl--clock', box), w = o.offsetWidth;
          o.style.width = w + 'px';
          anim($('svg', o), [{ transform: 'none', opacity: 1 }, { transform: 'translateY(900px) rotate(50deg)', opacity: 1 }], { duration: 1000, easing: 'cubic-bezier(.55,0,.85,.35)', fill: 'forwards' });
          anim(o, [{ width: w + 'px' }, { width: '0px' }], { duration: 600, delay: 250, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
        }]
      ]);
    },
    7(box) {
      $$('.p-smoke', box).forEach((el, k) => anim(el, [{ transform: 'translate(0,0) scale(.6)', opacity: 0 }, { opacity: .55, offset: .3 }, { transform: `translate(${k % 2 ? 40 : -50}px, -480px) scale(1.4)`, opacity: 0 }], { duration: 6500 + k * 700, iterations: Infinity, delay: -k * 1300, easing: 'ease-out' }));
      const tx = $$('.p-text', box);
      tx.forEach(el => { el.style.opacity = 0; });
      // 1:35 “bản năng → chiến lược”: hai dòng A+ và Trưởng nhóm × 3
      beats([[4500, () => tx.forEach((el, k) => anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: k * 500, fill: 'forwards' }))]]);
    },
    8(box) {
      anim($('.pw__an', box), [{ textShadow: '0 0 .1em rgba(255,181,71,.35)' }, { textShadow: '0 0 .3em rgba(255,181,71,.7)' }], { duration: 2400, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
    },
    9(box) {
      const an = $('.pw__an', box), blank = $('.blank', an), q = $('.p-qr', box);
      q.style.opacity = 0;
      // 2:22 gạch dưới nở ra thành mã QR; giữ yên ít nhất 3 giây để quét
      beats([[2000, () => {
        anim(blank, [{ transform: 'scaleX(1)', opacity: 1 }, { transform: 'scaleX(4)', opacity: 0 }], { duration: 400, fill: 'forwards' });
        anim(an, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 150, fill: 'forwards' });
        anim(q, [{ opacity: 0, transform: 'translate(-50%, -50%) scale(.15)' }, { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }], { duration: 800, delay: 300, easing: EASE, fill: 'forwards' });
      }]]);
    }
  };

  /* ---------- Khung trình chiếu ---------- */
  function render(n) {
    const sl = slideEl(n);
    $('.slide__n', sl).innerHTML = NORMAL[n]();
    $('.slide__p', sl).innerHTML = PROJ[n]();
    A.hydrate(sl);
  }
  function build() {
    root = document.getElementById('present');
    if (!root) { root = document.createElement('div'); root.id = 'present'; document.body.appendChild(root); }
    root.className = 'present' + (st.proj ? ' is-proj' : '');
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', t(D.ui.present));
    let slides = '';
    for (let n = 0; n <= 9; n++) slides += `<section class="slide" data-n="${n}"><div class="slide__n"></div><div class="slide__p"></div></section>`;
    root.innerHTML = `<div class="present__stage">${slides}</div><div class="present__hud"></div><div class="present__black"></div>`;
    stage = $('.present__stage', root);
    hud = $('.present__hud', root);
    stage.style.setProperty('--ax', AX + 'px');
    stage.style.setProperty('--ay', AY + 'px');
    stage.style.setProperty('--eye-t', (P.eyeTop * H) + 'px');
    stage.style.setProperty('--eye-b', (P.eyeBottom * H) + 'px');
    setSize(st.size, true);
    // Dựng sẵn mọi slide để tải trước toàn bộ ảnh
    for (let n = 0; n <= 9; n++) render(n);
    fit();
  }
  function fit() {
    if (!stage) return;
    stage.style.setProperty('--ps', Math.min(innerWidth / W, innerHeight / H).toFixed(4));
  }
  function setSize(v, quiet) {
    st.size = Math.max(60, Math.min(520, v));
    if (stage) stage.style.setProperty('--pas', st.size + 'px');
    try { localStorage.setItem('an-proj-size', String(st.size)); } catch (e) { /* bỏ qua */ }
    if (!quiet && st.proj && root) centerAll($('.slide.is-active .slide__p', root));
  }
  function stopAll() {
    st.anims.forEach(a => { try { a.cancel(); } catch (e) { /* bỏ qua */ } });
    st.anims = [];
    st.timers.forEach(clearTimeout);
    st.timers = [];
    st.rafs.forEach(cancelAnimationFrame);
    st.rafs = [];
    st.beat = null;
  }
  function wake() {
    if (!hud) return;
    hud.classList.remove('is-idle');
    clearTimeout(st.idle);
    st.idle = setTimeout(() => hud.classList.add('is-idle'), 2600);
  }
  function show(n, replay) {
    n = Math.max(st.proj ? 0 : 1, Math.min(9, n));
    if (n === st.i && !replay) return;
    stopAll();
    if (n !== st.i) { st.prev = st.i; st.i = n; }
    render(n);
    $$('.slide', root).forEach(s => s.classList.toggle('is-active', +s.dataset.n === n));
    const sl = slideEl(n);
    if (st.proj) {
      const box = $('.slide__p', sl);
      centerAll(box);
      (RUNP[n] || (() => {}))(box);
    } else runNormal(n, $('.slide__n', sl));
    hud.textContent = `${n} / 9  ·  ${t(D.present.hint)}`;
    wake();
  }
  function onKey(e) {
    if (!st.open) return;
    const k = e.key;
    let handled = true;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') show(st.i + 1);
    else if (k === 'ArrowLeft' || k === 'PageUp') show(st.i - 1);
    else if (k === 'Home') show(st.proj ? 0 : 1);
    else if (k === 'End') show(9);
    else if (k === 'p' || k === 'P') { st.proj = !st.proj; root.classList.toggle('is-proj', st.proj); show(st.proj ? st.i : Math.max(1, st.i), true); }
    else if (k === 'n' || k === 'N') nextBeat();
    else if (k === 'b' || k === 'B') { st.black = !st.black; root.classList.toggle('is-black', st.black); }
    else if (k === 'r' || k === 'R') show(st.i, true);
    else if (k === '+' || k === '=') setSize(st.size + 10);
    else if (k === '-' || k === '_') setSize(st.size - 10);
    else if (k === 'Escape') close();
    else if (k === 'f' || k === 'F') { /* đang trình chiếu */ }
    else handled = false;
    if (handled) { e.preventDefault(); e.stopImmediatePropagation(); }
  }
  function open(n) {
    build();
    st.open = true;
    st.black = false;
    st.i = -1;
    st.prev = 0;
    A.S.presentOpen = true;
    root.hidden = false;
    if (document.fullscreenElement) st.fs = true;
    show(n || 1, true);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (st.open && st.proj) centerAll($('.slide.is-active .slide__p', root)); });
  }
  function close() {
    if (!st.open) return;
    st.open = false;
    A.S.presentOpen = false;
    stopAll();
    if (document.fullscreenElement) { st.fs = false; document.exitFullscreen().catch(() => {}); }
    root.hidden = true;
    root.innerHTML = '';
    root.classList.remove('is-proj', 'is-black');
  }

  document.addEventListener('keydown', onKey, true);
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) st.fs = true;
    else if (st.open && st.fs) { st.fs = false; close(); }
  });
  document.addEventListener('pointermove', () => { if (st.open && !st.proj) wake(); }, { passive: true });
  addEventListener('resize', () => { if (st.open) fit(); });

  window.ANPresent = { open, close, isOpen: () => st.open };
})();
