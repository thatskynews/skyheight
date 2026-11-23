SkyExp.define({
  id: 'sky-exp',
  api: 1,
  version: '1.1.5',
  build: 17,
  date: '2026-11-23',

  /* ============================== 样式 ============================== */
  css: `
html[data-fx="frost"] .ibtn,html[data-fx="frost"] .top-avatar,html[data-fx="liquid"] .ibtn,html[data-fx="liquid"] .top-avatar{
  background:color-mix(in srgb, var(--surface) 46%, transparent);
  -webkit-backdrop-filter:blur(12px) saturate(2) brightness(1.08);backdrop-filter:blur(12px) saturate(2) brightness(1.08);
  background-image:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.03) 70%);
  box-shadow:0 6px 18px rgba(0,0,0,.18),inset 0 1px 1px rgba(255,255,255,.14)}
html[data-fx="liquid"] .ibtn,html[data-fx="liquid"] .top-avatar{background-color:transparent;
  background-image:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.03) 70%)}
html[data-fx="liquid"] .ibtn,html[data-fx="liquid"] .top-avatar{background-color:color-mix(in srgb, var(--surface) 28%, transparent)}
html[data-fx="liquid"].fx-lens .ibtn,html[data-fx="liquid"].fx-lens .top-avatar{
  -webkit-backdrop-filter:var(--lens) blur(1.5px) saturate(1.8);backdrop-filter:var(--lens) blur(1.5px) saturate(1.8)}
html[data-fx="liquid"] :is(.ibtn,.top-avatar){
  background-color:color-mix(in srgb,var(--surface) 9%,transparent);
  background-image:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.015) 65%);
  -webkit-backdrop-filter:blur(2px) saturate(1.5);backdrop-filter:blur(2px) saturate(1.5);
  box-shadow:0 4px 14px rgba(0,0,0,.10),inset 0 0 0 1px rgba(255,255,255,.065),inset 1px 1.5px 3px rgba(255,255,255,.3),inset -1px -1.5px 3px rgba(255,255,255,.11),inset 0 0 14px rgba(255,255,255,.05)}
html[data-fx="liquid"].fx-lens :is(.ibtn,.top-avatar){
  -webkit-backdrop-filter:var(--lens) blur(.4px) saturate(1.45) brightness(1.05);backdrop-filter:var(--lens) blur(.4px) saturate(1.45) brightness(1.05)}
html[data-fabvis="liquid"] .fab{background:transparent!important;color:#fff;
  background-image:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.015) 65%)!important;
  -webkit-backdrop-filter:blur(2px) saturate(1.5);backdrop-filter:blur(2px) saturate(1.5);
  box-shadow:0 4px 14px rgba(0,0,0,.10),inset 0 0 0 1px rgba(255,255,255,.065),inset 1px 1.5px 3px rgba(255,255,255,.3),inset -1px -1.5px 3px rgba(255,255,255,.11),inset 0 0 14px rgba(255,255,255,.05)!important}
html[data-fabvis="liquid"][data-theme="light"] .fab{color:#000}
html[data-fabvis="liquid"] .fab.fab-lens{-webkit-backdrop-filter:var(--lens) blur(.4px) saturate(1.45) brightness(1.05);backdrop-filter:var(--lens) blur(.4px) saturate(1.45) brightness(1.05)}
html[data-fx="liquid"]:not([data-btnvis="aura"]):not(#x) :is(.ibtn,.top-avatar)::before,html[data-fabvis="liquid"]:not([data-btnvis="aura"]):not(#x) .fab::before{content:none}
html[data-fabvis="liquid"]:not(#x) .fab,html[data-fx="liquid"]:not(#x) :is(.ibtn,.top-avatar){isolation:isolate}
html[data-btnvis="aura"] :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.seg){isolation:isolate}
html[data-btnvis="aura"] :is(.btn,.dev-btn,.avatar-btn){position:relative}
html[data-btnvis="aura"]:not(#x) :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.seg){
  box-shadow:0 9px 14px -7px rgba(255,255,255,.13),0 20px 26px -12px rgba(255,255,255,.065)!important}
html[data-btnvis="aura"] :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.seg)::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:-1;
  background:linear-gradient(180deg,rgba(255,255,255,0) 0,rgba(255,255,255,0) 55%,rgba(255,255,255,.05) 100%);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.2),inset 0 -1px 1px rgba(255,255,255,.34),inset 0 -10px 14px -9px rgba(255,255,255,.1)}
html[data-btnvis="aura"] :is(.top-avatar,.avatar-btn)::before{z-index:2}
html[data-btnvis="aura"][data-theme="light"]:not(#x) :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.seg){
  box-shadow:0 9px 14px -7px rgba(0,0,0,.12),0 20px 26px -12px rgba(0,0,0,.07)!important}
html[data-btnvis="aura"][data-theme="light"] :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.seg)::before{
  background:linear-gradient(180deg,rgba(255,255,255,.25),rgba(255,255,255,0) 45%,rgba(0,0,0,.02));
  box-shadow:inset 0 1px 1px rgba(255,255,255,.9),inset 0 -1px 1px rgba(0,0,0,.09)}
html[data-ctrl="pill"] :is(.ibtn,.top-avatar,.fab,.btn,.dev-btn,.seg,.seg button,.seg-thumb,.avatar-btn){border-radius:999px!important}
#fx-defs{position:absolute;width:0;height:0;overflow:hidden;pointer-events:none}
html[data-btnfx="on"] :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.social-links a){isolation:isolate;-webkit-tap-highlight-color:transparent}
html[data-btnfx="on"] :is(.btn,.dev-btn,.avatar-btn),html[data-btnvis="glow"] :is(.btn,.dev-btn,.avatar-btn){position:relative}
html[data-btnvis="glow"] :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.seg){isolation:isolate}
html[data-btnvis="glow"] :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.seg)::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:-1;
  background:linear-gradient(180deg,rgba(255,255,255,.07),rgba(255,255,255,0) 45%,rgba(255,255,255,.025));
  box-shadow:inset 0 1px 1px rgba(255,255,255,.3),inset 0 -1px 1px rgba(255,255,255,.1),inset 0 0 0 1px rgba(255,255,255,.06),inset 0 0 10px rgba(255,255,255,.06)}
html[data-btnvis="glow"][data-theme="light"] :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.seg)::before{
  background:linear-gradient(180deg,rgba(255,255,255,.3),rgba(255,255,255,0) 45%,rgba(0,0,0,.02));
  box-shadow:inset 0 1px 1px rgba(255,255,255,.8),inset 0 -1px 1px rgba(0,0,0,.07),inset 0 0 0 1px rgba(0,0,0,.035),inset 0 0 8px rgba(255,255,255,.35)}
html[data-btnvis="glow"] :is(.top-avatar,.avatar-btn)::before{z-index:2}
html[data-btnfx="on"] .social-links a{position:relative;padding:12px;margin:-12px;border-radius:50%}
html[data-btnfx="on"] .seg{touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
html[data-btnfx="on"] :is(.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.social-links a){touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-user-drag:none}
html[data-btnfx="on"] .fxb-on{transition:none!important;will-change:transform}
.fxb-glow{position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;z-index:-1;
  background:radial-gradient(circle var(--lr,70px) at var(--lx,50%) var(--ly,50%),rgba(255,255,255,.62),rgba(255,255,255,.2) 45%,rgba(255,255,255,0) 100%),
    radial-gradient(circle calc(var(--lr,70px)*1.7) at var(--lx,50%) var(--ly,50%),color-mix(in srgb,var(--primary) 28%,transparent),transparent 100%);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.6),inset 0 -1px 1px rgba(255,255,255,.2),inset 0 0 14px rgba(255,255,255,.22)}
.ibtn>.fxb-glow{position:absolute;z-index:-1}
.top-avatar>.fxb-glow,.avatar-btn>.fxb-glow{z-index:2}
.seg>.fxb-glow{z-index:0}
.exp-ver{margin:22px 0 4px;text-align:center;font-size:12px;color:var(--on-surface-variant);opacity:.7;letter-spacing:.3px}
`,

  /* ============================== 文案 ============================== */
  strings: {
    zh: {
      secUiFx: '界面效果', secCtrl: '控件效果', secBtnFx: '按钮动效',
      btnFxOff: '关闭', btnFxOn: '流光视效', secBtnVis: '按钮视效', btnVisOff: '关闭', btnVisOn: '浮光视效', btnVisAura: '辉光视效', secFabVis: '重测视钮', fabVisOff: '关闭', fabVisOn: '适配液态',
      fxFlat: '扁平风格', fxLiquid: '液态玻璃', fxFrost: '磨砂玻璃',
      ctrlRound: '圆角UI控件', ctrlPill: '胶囊UI控件',
      expModVer: '实验性功能模块 v{v}',
      L_fxSet: '界面效果 → {v}', L_ctrlSet: '控件效果 → {v}', L_btnFxSet: '按钮动效 → {v}', L_btnVisSet: '按钮视效 → {v}', L_fabVisSet: '重测视钮 → {v}',
      L_fxLens: '液态玻璃：{n} 个控件滤镜已生成',
      L_fxNoLens: '当前环境不支持折射滤镜，已降级为磨砂'
    },
    en: {
      secUiFx: 'UI effect', secCtrl: 'Control style', secBtnFx: 'Button effects',
      btnFxOff: 'Off', btnFxOn: 'Morphlight', secBtnVis: 'Button look', btnVisOff: 'Off', btnVisOn: 'Glass rim', btnVisAura: 'Aura', secFabVis: 'Re-measure button', fabVisOff: 'Off', fabVisOn: 'Liquid adapt',
      fxFlat: 'Flat', fxLiquid: 'Liquid glass', fxFrost: 'Frosted glass',
      ctrlRound: 'Rounded controls', ctrlPill: 'Pill controls',
      expModVer: 'Experimental module v{v}',
      L_fxSet: 'UI effect → {v}', L_ctrlSet: 'Control style → {v}', L_btnFxSet: 'Button effects → {v}', L_btnVisSet: 'Button look → {v}', L_fabVisSet: 'Re-measure button → {v}',
      L_fxLens: 'Liquid glass: {n} control filters built',
      L_fxNoLens: 'Refraction filter unsupported here, fell back to frosted'
    }
  },

  /* ============================== 逻辑 ============================== */
  init: function (host) {
    var M = this;
    var $ = host.$;
    var K_FX = 'sky-height-fx', K_CTRL = 'sky-height-ctrl', K_BTN = 'sky-height-btnfx', K_VIS = 'sky-height-btnvis', K_FAB = 'sky-height-fabvis';
    var fxPref = 'flat', ctrlPref = 'round', btnPref = 'off', visPref = 'off', fabPref = 'off';
    var FX_TARGETS = ['btn-top-avatar', 'btn-help', 'btn-history', 'btn-settings'];
    var NS = 'http://www.w3.org/2000/svg';
    var lensOK = !!(window.chrome || /Chrom(e|ium)\//.test(navigator.userAgent)) && !/Firefox\//.test(navigator.userAgent);
    var lensCount = 0, lensRO = null, lensTimer = 0;

    var lf = host.lsGet(K_FX), lc = host.lsGet(K_CTRL);
    if (lf === 'liquid' || lf === 'frost') fxPref = lf;
    if (lc === 'pill') ctrlPref = 'pill';
    if (host.lsGet(K_BTN) === 'on') btnPref = 'on';
    var lv = host.lsGet(K_VIS); if (lv === 'glow' || lv === 'aura') visPref = lv;
    if (host.lsGet(K_FAB) === 'liquid') fabPref = 'liquid';

    function fxDefs() {
      var d = $('fx-defs');
      if (!d) {
        d = document.createElementNS(NS, 'svg');
        d.setAttribute('id', 'fx-defs'); d.setAttribute('aria-hidden', 'true');
        d.appendChild(document.createElementNS(NS, 'defs'));
        document.body.appendChild(d);
      }
      return d.firstChild;
    }

    /* 位移图：圆角矩形 SDF + 弧形边缘。R=横向、G=竖向、128=不推 */
    function lensMap(w, h, r) {
      var sc = Math.min(2, window.devicePixelRatio || 1), cw = Math.max(1, Math.round(w * sc)), ch = Math.max(1, Math.round(h * sc));
      var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      var cx = cv.getContext('2d'), im = cx.createImageData(cw, ch), dp = Math.min(26, Math.min(w, h) / 2);
      for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) {
        var px = (x + .5) / sc - w / 2, py = (y + .5) / sc - h / 2;
        var qx = Math.abs(px) - (w / 2 - r), qy = Math.abs(py) - (h / 2 - r);
        var ox = Math.max(qx, 0), oy = Math.max(qy, 0), len = Math.sqrt(ox * ox + oy * oy);
        var dist = -(len + Math.min(Math.max(qx, qy), 0) - r);
        var nx = 0, ny = 0;
        if (qx > 0 && qy > 0) { nx = qx / len * (px < 0 ? -1 : 1); ny = qy / len * (py < 0 ? -1 : 1); }
        else if (qx > qy) nx = px < 0 ? -1 : 1; else ny = py < 0 ? -1 : 1;
        var st = dist >= dp ? 0 : Math.pow(1 - Math.max(dist, 0) / dp, 2);
        var i = (y * cw + x) * 4;
        im.data[i] = 128 - nx * st * 127; im.data[i + 1] = 128 - ny * st * 127; im.data[i + 2] = 128; im.data[i + 3] = 255;
      }
      cx.putImageData(im, 0, 0);
      return cv.toDataURL('image/png');
    }

    function buildLens() {
      var defs = fxDefs(), root = host.docEl, n = 0;
      while (defs.firstChild) defs.removeChild(defs.firstChild);
      var ids = (fxPref === 'liquid' ? FX_TARGETS : []).concat(fabPref === 'liquid' ? ['fab-reset'] : []);
      var fabEl = $('fab-reset'); if (fabEl) fabEl.classList.remove('fab-lens');
      if (!ids.length || !lensOK) { root.classList.remove('fx-lens'); return; }
      ids.forEach(function (id) {
        var el = $(id); if (!el) return;
        var w = el.offsetWidth, h = el.offsetHeight;
        if (!w || !h) { el.style.removeProperty('--lens'); return; }
        var r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
        r = Math.min(r, w / 2, h / 2);
        var f = document.createElementNS(NS, 'filter');
        f.setAttribute('id', 'lens-' + id); f.setAttribute('x', '0'); f.setAttribute('y', '0');
        f.setAttribute('width', w); f.setAttribute('height', h);
        f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('primitiveUnits', 'userSpaceOnUse');
        f.setAttribute('color-interpolation-filters', 'sRGB');
        var fi = document.createElementNS(NS, 'feImage');
        fi.setAttribute('x', '0'); fi.setAttribute('y', '0'); fi.setAttribute('width', w); fi.setAttribute('height', h);
        fi.setAttribute('preserveAspectRatio', 'none'); fi.setAttribute('result', 'map');
        var url = lensMap(w, h, r);
        fi.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url); fi.setAttribute('href', url);
        var dm = document.createElementNS(NS, 'feDisplacementMap');
        dm.setAttribute('in', 'SourceGraphic'); dm.setAttribute('in2', 'map'); dm.setAttribute('scale', '30');
        dm.setAttribute('xChannelSelector', 'R'); dm.setAttribute('yChannelSelector', 'G');
        f.appendChild(fi); f.appendChild(dm); defs.appendChild(f);
        el.style.setProperty('--lens', 'url(#lens-' + id + ')');
        if (id === 'fab-reset') el.classList.add('fab-lens'); else n++;
      });
      root.classList.toggle('fx-lens', n > 0);
      lensCount = n;
    }
    function scheduleLens() { clearTimeout(lensTimer); lensTimer = setTimeout(buildLens, 60); }

    function applyFx(silent) {
      var d = host.docEl;
      if (fxPref === 'flat') d.removeAttribute('data-fx'); else d.setAttribute('data-fx', fxPref);
      if (ctrlPref === 'pill') d.setAttribute('data-ctrl', 'pill'); else d.removeAttribute('data-ctrl');
      if ((fxPref === 'liquid' || fabPref === 'liquid') && !lensRO && window.ResizeObserver) {
        lensRO = new ResizeObserver(scheduleLens);
        FX_TARGETS.concat(['fab-reset']).forEach(function (id) { var el = $(id); if (el) lensRO.observe(el); });
      }
      buildLens();
      if (!silent && fxPref === 'liquid') {
        if (lensOK) host.dlog('info', 'fx', 'fxLens', { n: lensCount }); else host.dlog('warn', 'fx', 'fxNoLens');
      }
    }
    function syncActive() { host.setActive(fxPref !== 'flat' || ctrlPref === 'pill' || btnPref === 'on' || visPref !== 'off' || fabPref === 'liquid'); }

    function setFx(v) {
      if (['flat', 'liquid', 'frost'].indexOf(v) < 0 || v === fxPref) return;
      fxPref = v; host.lsSet(K_FX, v); syncActive();
      host.dlog('action', 'fx', 'fxSet', { v: v });
      applyFx(); host.renderSettings();
    }
    function setCtrl(v) {
      var nv = v === 'pill' ? 'pill' : 'round'; if (nv === ctrlPref) return;
      ctrlPref = nv; host.lsSet(K_CTRL, ctrlPref); syncActive();
      host.dlog('action', 'fx', 'ctrlSet', { v: ctrlPref });
      applyFx(true); host.renderSettings();
      scheduleLens();
    }

    /* ---------- 按钮动效：形变（morph）+ 触摸照明（touch illumination） ----------
       参考「液态玻璃-按钮组」：按下时按钮收缩并随手指拖动拉伸变形，松手弹簧回弹；
       手指所在处有一团会跟随滑动的高光，边缘带一圈轮廓光。纯 CSS + rAF 弹簧，不依赖 WebGL。 */
    var BTN_SEL = '.ibtn,.top-avatar,.avatar-btn,.btn,.dev-btn,.fab,.social-links a';
    var reduceMo = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var items = [], btnRaf = 0, btnLast = 0, btnBound = false;

    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
    function glowOf(el) {
      var g = null, k = el.children;
      for (var i = 0; i < k.length; i++) if (k[i].className === 'fxb-glow') { g = k[i]; break; }
      if (!g) { g = document.createElement('i'); g.className = 'fxb-glow'; g.setAttribute('aria-hidden', 'true'); el.appendChild(g); }
      return g;
    }
    function findItem(el) { for (var i = 0; i < items.length; i++) if (items[i].el === el) return items[i]; return null; }
    function dropItem(s) {
      var i = items.indexOf(s); if (i >= 0) items.splice(i, 1);
      s.el.classList.remove('fxb-on');
      if (s.mode === 'tf') s.el.style.removeProperty('transform');
      if (s.mode === 'prop') { s.el.style.removeProperty('scale'); s.el.style.removeProperty('translate'); s.el.style.removeProperty('transform-origin'); }
      if (s.g) { s.g.style.opacity = '0'; }
    }
    function btnStep(ts) {
      var dt = Math.min(0.032, (ts - btnLast) / 1000 || 0.016); btnLast = ts;
      for (var n = items.length - 1; n >= 0; n--) {
        var s = items[n], tx = 0, ty = 0, tsx = 1, tsy = 1, tli = 0;
        if (s.pressed) {
          var dx = s.px - s.cx, dy = s.py - s.cy;
          if (!reduceMo) {
            tx = clamp(dx * 0.12, -5, 5); ty = clamp(dy * 0.12, -4, 4);
            var ax = Math.min(Math.abs(dx) / s.w, 0.7), ay = Math.min(Math.abs(dy) / s.h, 0.7);
            tsx = s.bx * (1 + 0.14 * ax - 0.05 * ay); tsy = s.by * (1 + 0.14 * ay - 0.05 * ax);
          }
          tli = 1;
        }
        var k = s.pressed ? 420 : 240, c = s.pressed ? 30 : 13;
        s.vx += (k * (tx - s.x) - c * s.vx) * dt; s.x += s.vx * dt;
        s.vy += (k * (ty - s.y) - c * s.vy) * dt; s.y += s.vy * dt;
        s.vsx += (k * (tsx - s.sx) - c * s.vsx) * dt; s.sx += s.vsx * dt;
        s.vsy += (k * (tsy - s.sy) - c * s.vsy) * dt; s.sy += s.vsy * dt;
        s.li += (tli - s.li) * Math.min(1, dt * (s.pressed ? 16 : 6));
        if (s.pressed) {
          var f = Math.min(1, dt * 20);
          if (s.mode === 'tf') {
            s.lx += ((s.px - s.cx - s.x) / s.sx + s.w / 2 - s.lx) * f;
            s.ly += ((s.py - s.cy - s.y) / s.sy + s.h / 2 - s.ly) * f;
          } else {
            s.lx += (s.px - s.gl - s.lx) * f; s.ly += (s.py - s.gt - s.ly) * f;
          }
        }
        if (s.mode === 'tf') s.el.style.transform = 'translate3d(' + s.x.toFixed(2) + 'px,' + s.y.toFixed(2) + 'px,0) scale(' + s.sx.toFixed(4) + ',' + s.sy.toFixed(4) + ')';
        else if (s.mode === 'prop') {
          try { var mm = new DOMMatrixReadOnly(getComputedStyle(s.el).transform); s.el.style.transformOrigin = (mm.m41 + s.el.offsetWidth / 2).toFixed(1) + 'px ' + (mm.m42 + s.el.offsetHeight / 2).toFixed(1) + 'px'; } catch (_) {}
          s.el.style.translate = s.x.toFixed(2) + 'px ' + s.y.toFixed(2) + 'px'; s.el.style.scale = s.sx.toFixed(4) + ' ' + s.sy.toFixed(4);
        }
        s.g.style.opacity = s.li.toFixed(3);
        s.g.style.setProperty('--lx', s.lx.toFixed(1) + 'px'); s.g.style.setProperty('--ly', s.ly.toFixed(1) + 'px');
        if (!s.pressed && Math.abs(s.x) < 0.05 && Math.abs(s.y) < 0.05 && Math.abs(s.sx - 1) < 0.002 && Math.abs(s.sy - 1) < 0.002 &&
            Math.abs(s.vx) < 0.5 && Math.abs(s.vsx) < 0.02 && s.li < 0.01) dropItem(s);
      }
      btnRaf = items.length ? requestAnimationFrame(btnStep) : 0;
    }
    function btnKick() { if (!btnRaf) { btnLast = performance.now(); btnRaf = requestAnimationFrame(btnStep); } }
    function btnDown(e) {
      if (btnPref !== 'on' || (e.pointerType === 'mouse' && e.button !== 0)) return;
      var t0 = e.target; if (!t0 || !t0.closest) return;
      if (t0.closest('.more,.more-card')) return;
      var el = null, gp = null, mode = 'tf', seg = t0.closest('.seg');
      if (seg && seg.querySelector('.seg-thumb')) { el = seg.querySelector('.seg-thumb'); gp = seg; mode = 'prop'; }
      else { el = t0.closest(BTN_SEL); gp = el; if (el && el.classList.contains('fab')) mode = 'prop'; }
      if (!el || (mode !== 'tf' && !seg && (el.disabled || el.getAttribute('aria-disabled') === 'true')) || (mode === 'tf' && (el.disabled || el.getAttribute('aria-disabled') === 'true'))) return;
      var s = findItem(el), r = el.getBoundingClientRect(), gr = gp.getBoundingClientRect();
      if (!s) {
        s = { el: el, g: null, x: 0, y: 0, sx: 1, sy: 1, vx: 0, vy: 0, vsx: 0, vsy: 0, li: 0, lx: 0, ly: 0 };
        items.push(s);
      }
      s.mode = mode; s.g = glowOf(gp);
      s.w = el.offsetWidth || r.width; s.h = el.offsetHeight || r.height;
      s.cx = r.left + r.width / 2 - s.x; s.cy = r.top + r.height / 2 - s.y;
      s.gl = gr.left; s.gt = gr.top;
      if (el.classList.contains('seg-thumb')) { s.bx = 0.95; s.by = 0.88; }
      else if (el.classList.contains('fab')) { s.bx = 0.96; s.by = 0.94; }
      else if (el.classList.contains('btn') || el.classList.contains('dev-btn')) { s.bx = 0.98; s.by = 0.96; }
      else { s.bx = s.by = 0.93; }
      s.px = e.clientX; s.py = e.clientY; s.pid = e.pointerId; s.pressed = true;
      if (s.li < 0.02) { s.lx = e.clientX - gr.left; s.ly = e.clientY - gr.top; }
      s.g.style.setProperty('--lr', Math.max(40, Math.min(110, (mode === 'tf' ? s.w : gr.width * 0.5) * 0.55)).toFixed(0) + 'px');
      if (mode === 'tf') el.classList.add('fxb-on');
      btnKick();
    }
    function btnMove(e) {
      for (var i = 0; i < items.length; i++) if (items[i].pressed && items[i].pid === e.pointerId) { items[i].px = e.clientX; items[i].py = e.clientY; }
    }
    function btnUp(e) {
      for (var i = 0; i < items.length; i++) if (items[i].pressed && items[i].pid === e.pointerId) items[i].pressed = false;
      btnKick();
    }
    function btnReleaseAll() { for (var i = 0; i < items.length; i++) items[i].pressed = false; btnKick(); }
    function btnGuard(e) {
      if (btnPref !== 'on') return;
      var n = e.target; if (n && n.nodeType === 3) n = n.parentElement;
      if (n && n.closest && n.closest(BTN_SEL)) e.preventDefault();
    }
    function btnBind() {
      if (btnBound) return; btnBound = true;
      document.addEventListener('contextmenu', btnGuard, true);
      document.addEventListener('selectstart', btnGuard, true);
      document.addEventListener('dragstart', btnGuard, true);
      document.addEventListener('pointerdown', btnDown, true);
      document.addEventListener('pointermove', btnMove, true);
      document.addEventListener('pointerup', btnUp, true);
      document.addEventListener('pointercancel', btnUp, true);
      window.addEventListener('blur', btnReleaseAll);
    }
    function applyBtn() {
      if (btnPref === 'on') { host.docEl.setAttribute('data-btnfx', 'on'); btnBind(); }
      else {
        host.docEl.removeAttribute('data-btnfx');
        while (items.length) dropItem(items[0]);
      }
    }
    function applyVis() { if (visPref !== 'off') host.docEl.setAttribute('data-btnvis', visPref); else host.docEl.removeAttribute('data-btnvis'); }
    function setVis(v) {
      var nv = (v === 'glow' || v === 'aura') ? v : 'off'; if (nv === visPref) return;
      visPref = nv; host.lsSet(K_VIS, nv); syncActive();
      host.dlog('action', 'fx', 'btnVisSet', { v: nv });
      applyVis(); host.renderSettings();
    }
    function applyFab() { if (fabPref === 'liquid') host.docEl.setAttribute('data-fabvis', 'liquid'); else host.docEl.removeAttribute('data-fabvis'); }
    function setFab(v) {
      var nv = v === 'liquid' ? 'liquid' : 'off'; if (nv === fabPref) return;
      fabPref = nv; host.lsSet(K_FAB, nv); syncActive();
      host.dlog('action', 'fx', 'fabVisSet', { v: nv });
      applyFab(); applyFx(true); host.renderSettings();
    }
    function setBtn(v) {
      var nv = v === 'on' ? 'on' : 'off'; if (nv === btnPref) return;
      btnPref = nv; host.lsSet(K_BTN, nv); syncActive();
      host.dlog('action', 'fx', 'btnFxSet', { v: nv });
      applyBtn(); host.renderSettings();
    }

    /* 暴露给 onSeg / getSeg */
    M._setFx = setFx; M._setCtrl = setCtrl; M._setBtn = setBtn; M._setVis = setVis; M._setFab = setFab;
    M._get = function (k) { return k === 'uiFx' ? fxPref : k === 'ctrlShape' ? ctrlPref : k === 'btnFx' ? btnPref : k === 'btnVis' ? visPref : k === 'fabVis' ? fabPref : null; };

    window.addEventListener('resize', function () { if (fxPref === 'liquid' || fabPref === 'liquid') scheduleLens(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (fxPref === 'liquid' || fabPref === 'liquid') scheduleLens(); });

    applyFab(); applyFx(true);
    applyBtn(); applyVis();
  },

  /* ============================== 界面 ============================== */
  mount: function (host, el) {
    if (!el.getAttribute('data-exp-ui')) {
      el.setAttribute('data-exp-ui', '1');
      el.innerHTML =
        '<div class="sec" data-i="secUiFx"></div>' +
        '<div class="seg" role="radiogroup" data-seg="uiFx">' +
          '<button type="button" role="radio" data-v="flat"><span data-i="fxFlat"></span></button>' +
          '<button type="button" role="radio" data-v="liquid"><span data-i="fxLiquid"></span></button>' +
          '<button type="button" role="radio" data-v="frost"><span data-i="fxFrost"></span></button>' +
        '</div>' +
        '<div class="sec" data-i="secCtrl"></div>' +
        '<div class="seg" role="radiogroup" data-seg="ctrlShape">' +
          '<button type="button" role="radio" data-v="round"><span data-i="ctrlRound"></span></button>' +
          '<button type="button" role="radio" data-v="pill"><span data-i="ctrlPill"></span></button>' +
        '</div>' +
        '<div class="sec" data-i="secBtnFx"></div>' +
        '<div class="seg" role="radiogroup" data-seg="btnFx">' +
          '<button type="button" role="radio" data-v="off"><span data-i="btnFxOff"></span></button>' +
          '<button type="button" role="radio" data-v="on"><span data-i="btnFxOn"></span></button>' +
        '</div>' +
        '<div class="sec" data-i="secBtnVis"></div>' +
        '<div class="seg" role="radiogroup" data-seg="btnVis">' +
          '<button type="button" role="radio" data-v="off"><span data-i="btnVisOff"></span></button>' +
          '<button type="button" role="radio" data-v="glow"><span data-i="btnVisOn"></span></button>' +
          '<button type="button" role="radio" data-v="aura"><span data-i="btnVisAura"></span></button>' +
        '</div>' +
        '<div class="sec" data-i="secFabVis"></div>' +
        '<div class="seg" role="radiogroup" data-seg="fabVis">' +
          '<button type="button" role="radio" data-v="off"><span data-i="fabVisOff"></span></button>' +
          '<button type="button" role="radio" data-v="liquid"><span data-i="fabVisOn"></span></button>' +
        '</div>' +
        '<div class="exp-ver" id="exp-ver"></div>';
      el.querySelectorAll('.seg').forEach(function (s) { host.enhanceSeg(s); });
    }
    var ver = el.querySelector('#exp-ver');
    if (ver) ver.setAttribute('data-ver', this.version);
    host.translate();
    this._fillVer(host, el);
    host.renderSettings();
  },
  _fillVer: function (host, el) {
    var v = el.querySelector('#exp-ver');
    if (v) v.textContent = host.t('expModVer', { v: this.version });
  },
  onLang: function (host) {
    var el = host.$('exp-mount');
    if (el) this._fillVer(host, el);
  },

  onSeg: function (key, v) {
    if (key === 'uiFx') this._setFx(v);
    else if (key === 'ctrlShape') this._setCtrl(v);
    else if (key === 'btnFx') this._setBtn(v);
    else if (key === 'btnVis') this._setVis(v);
    else if (key === 'fabVis') this._setFab(v);
  },
  getSeg: function (key) { return this._get ? this._get(key) : null; }
});
