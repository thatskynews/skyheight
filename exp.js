/*!
 * SkyHeight · 实验性功能后端模块（exp.js）
 * ---------------------------------------------------------------
 * 部署位置：https://skyheight.pages.dev/exp.js   （与 version.json 同目录）
 *
 * 【加载方式】前端（index.html）只做「桥接加载」，功能本体都在本文件：
 *   1. 首次进入实验性功能抽屉时下载本文件（抽屉里只显示加载圈）；
 *      下载失败 → 抽屉里「重试」按钮上方显示"加载失败，请检查你的网络连接"，
 *      点「重试」后按钮文字变成加载圈。
 *   2. 下载成功后：源码存入 IndexedDB（库 sky-height-exp / 表 kv / 键 code，
 *      不可用时退回 localStorage），样式 css 另存一份到 localStorage（键 sky-height-exp-css）。
 *   3. 之后启动：若有实验效果在生效（见 setActive），先用本地缓存立即执行（断网也可用），
 *      同时后台检查新版本；新版本写入缓存，下次启动生效。
 *   4. 下载到的文件若语法错误、缺少 SkyExp.define、或 api 高于前端支持的版本，会被拒绝，继续使用旧缓存。
 *   更新后端只需覆盖部署本文件，前端无需改动。
 *
 * 【协议（api = 1）】本文件必须调用一次 SkyExp.define({...})，字段：
 *   id        固定 'sky-exp'
 *   api       桥接协议版本。高于前端支持的版本时前端会拒绝加载（避免新后端跑在旧前端上）
 *   version   后端模块版本号（显示在实验性功能抽屉底部）
 *   css       样式字符串。前端注入 <style id="exp-style">，并缓存到 localStorage，
 *             下次启动时在首屏前就注入（防闪烁）
 *   strings   { zh:{...}, en:{...} }  文案，会并入前端 I18N；调试日志文案用 L_ 前缀，如 L_fxSet
 *             （繁体由前端自动从 zh 转换，无需单独写）
 *   init(host)            加载成功后调用一次（启动时，或首次进入实验性功能抽屉时）
 *   mount(host, el)       每次打开实验性功能抽屉时调用，把界面画进 el（要可重复调用）
 *   onSeg(key, v, host)   分段选择器（data-seg="key"）被点选时调用
 *   getSeg(key)           返回该分段选择器当前选中的值（前端据此高亮）
 *   onLang(host)          （可选）语言切换后调用
 *
 * 【host 提供】$ t dlog lsGet lsSet toast openSheet closeSheet docEl lang() isTw()
 *             translate() renderSettings() enhanceSeg(segEl) setActive(bool)
 *   setActive(true)：告诉前端「下次启动有实验效果在生效」，前端会在启动时提前加载本模块。
 *   说明：加载中/加载失败/重试的界面和文案（expLoadFail、expRetry）属于前端，本文件不用管。
 *
 * 【新增一个实验性功能】在 css 加样式 → strings 加文案 → mount 里加一个 .sec + .seg
 *   （data-seg 用新 key）→ onSeg / getSeg 里处理该 key。
 * ---------------------------------------------------------------
 */
SkyExp.define({
  id: 'sky-exp',
  api: 1,
  version: '1.2.0',
  build: 3,
  date: '2026-11-22',

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
html[data-ctrl="pill"] :is(.ibtn,.top-avatar,.fab,.btn,.dev-btn,.seg,.seg button,.seg-thumb,.avatar-btn){border-radius:999px!important}
#fx-defs{position:absolute;width:0;height:0;overflow:hidden;pointer-events:none}
.exp-ver{margin:22px 0 4px;text-align:center;font-size:12px;color:var(--on-surface-variant);opacity:.7;letter-spacing:.3px}
/* ---- 按钮效果：液态弹性（参数取自 液态玻璃-按钮组：折射12/-24、模糊2、饱和1.5、边缘高光、按压光0.15+0.08、阴影24/0.1） ---- */
html[data-btnfx="liquid"] :is(.btn,.dev-btn,.fab){isolation:isolate;--lg-p:0;--lg-x:50%;--lg-y:50%;--lg-r:72px;-webkit-tap-highlight-color:transparent;
  -webkit-backdrop-filter:saturate(1.5) blur(2px) var(--lg-lens,blur(0px));backdrop-filter:saturate(1.5) blur(2px) var(--lg-lens,blur(0px))}
html[data-btnfx="liquid"] :is(.btn,.dev-btn){position:relative;box-shadow:0 4px 24px rgba(0,0,0,.1)}
html[data-btnfx="liquid"] .btn.filled,html[data-btnfx="liquid"] .fab{background:color-mix(in srgb,var(--primary) 75%,transparent)}
html[data-btnfx="liquid"] .btn.danger{background:color-mix(in srgb,#BA1A1A 75%,transparent)}
html[data-btnfx="liquid"][data-theme="dusk"] .btn.danger{background:color-mix(in srgb,#9E3A31 75%,transparent)}
html[data-btnfx="liquid"][data-theme="dark"] .btn.danger{background:color-mix(in srgb,#93000A 75%,transparent)}
html[data-btnfx="liquid"] :is(.btn,.dev-btn,.fab)::before,html[data-btnfx="liquid"] :is(.btn,.dev-btn,.fab)::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;mix-blend-mode:plus-lighter;opacity:0}
html[data-btnfx="liquid"] :is(.btn,.dev-btn,.fab).lg-r::before{opacity:1;background:#fff;-webkit-mask:var(--lg-rim) center/100% 100% no-repeat;mask:var(--lg-rim) center/100% 100% no-repeat}
html[data-btnfx="liquid"] :is(.btn,.dev-btn,.fab).lg-on::after{opacity:1;
  background:
   radial-gradient(circle var(--lg-r) at var(--lg-x) var(--lg-y),
     rgba(255,255,255,calc(.15 * var(--lg-p))) 0%,rgba(255,255,255,calc(.14355 * var(--lg-p))) 12.5%,rgba(255,255,255,calc(.1266 * var(--lg-p))) 25%,
     rgba(255,255,255,calc(.1026 * var(--lg-p))) 37.5%,rgba(255,255,255,calc(.075 * var(--lg-p))) 50%,rgba(255,255,255,calc(.0474 * var(--lg-p))) 62.5%,
     rgba(255,255,255,calc(.0234 * var(--lg-p))) 75%,rgba(255,255,255,calc(.00645 * var(--lg-p))) 87.5%,rgba(255,255,255,0) 100%),
   linear-gradient(rgba(255,255,255,calc(.08 * var(--lg-p))),rgba(255,255,255,calc(.08 * var(--lg-p))))}
html[data-btnfx="liquid"] :is(.btn,.dev-btn):active{transform:none;filter:none}
html[data-btnfx="liquid"] .fab:active{transform:translateX(-50%)}
html[data-btnfx="liquid"] :is(.btn,.dev-btn,.fab).lg-on{transition:none!important}
#lg-defs{position:absolute;width:0;height:0;overflow:hidden;pointer-events:none}
`,

  /* ============================== 文案 ============================== */
  strings: {
    zh: {
      secUiFx: '界面效果', secCtrl: '控件效果', secBtn: '按钮效果',
      btnDefault: '默认', btnLiquid: '液态弹性',
      fxFlat: '扁平风格', fxLiquid: '液态玻璃', fxFrost: '磨砂玻璃',
      ctrlRound: '圆角UI控件', ctrlPill: '胶囊UI控件',
      expModVer: '实验性功能模块 v{v}',
      L_fxSet: '界面效果 → {v}', L_ctrlSet: '控件效果 → {v}', L_btnFxSet: '按钮效果 → {v}',
      L_btnFxLens: '液态按钮：{n} 种尺寸的光学贴图已生成', L_btnFxNoLens: '当前环境不支持折射滤镜，按钮仅保留边缘光/弹性/按压光',
      L_fxLens: '液态玻璃：{n} 个控件滤镜已生成',
      L_fxNoLens: '当前环境不支持折射滤镜，已降级为磨砂'
    },
    en: {
      secUiFx: 'UI effect', secCtrl: 'Control style', secBtn: 'Button effect',
      btnDefault: 'Default', btnLiquid: 'Liquid elastic',
      fxFlat: 'Flat', fxLiquid: 'Liquid glass', fxFrost: 'Frosted glass',
      ctrlRound: 'Rounded controls', ctrlPill: 'Pill controls',
      expModVer: 'Experimental module v{v}',
      L_fxSet: 'UI effect → {v}', L_ctrlSet: 'Control style → {v}', L_btnFxSet: 'Button effect → {v}',
      L_btnFxLens: 'Liquid buttons: {n} optical maps built', L_btnFxNoLens: 'Refraction filter unsupported here; buttons keep rim light, spring and press glow',
      L_fxLens: 'Liquid glass: {n} control filters built',
      L_fxNoLens: 'Refraction filter unsupported here, fell back to frosted'
    }
  },

  /* ============================== 逻辑 ============================== */
  init: function (host) {
    var M = this;
    var $ = host.$;
    var K_FX = 'sky-height-fx', K_CTRL = 'sky-height-ctrl';
    var fxPref = 'flat', ctrlPref = 'round';
    var FX_TARGETS = ['btn-top-avatar', 'btn-help', 'btn-history', 'btn-settings'];
    var NS = 'http://www.w3.org/2000/svg';
    var lensOK = !!(window.chrome || /Chrom(e|ium)\//.test(navigator.userAgent)) && !/Firefox\//.test(navigator.userAgent);
    var lensCount = 0, lensRO = null, lensTimer = 0;

    var lf = host.lsGet(K_FX), lc = host.lsGet(K_CTRL);
    if (lf === 'liquid' || lf === 'frost') fxPref = lf;
    if (lc === 'pill') ctrlPref = 'pill';

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
      var cx = cv.getContext('2d'), im = cx.createImageData(cw, ch), dp = Math.min(24, Math.min(w, h) / 2);
      for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) {
        var px = (x + .5) / sc - w / 2, py = (y + .5) / sc - h / 2;
        var qx = Math.abs(px) - (w / 2 - r), qy = Math.abs(py) - (h / 2 - r);
        var ox = Math.max(qx, 0), oy = Math.max(qy, 0), len = Math.sqrt(ox * ox + oy * oy);
        var dist = -(len + Math.min(Math.max(qx, qy), 0) - r);
        var nx = 0, ny = 0;
        if (qx > 0 && qy > 0) { nx = qx / len * (px < 0 ? -1 : 1); ny = qy / len * (py < 0 ? -1 : 1); }
        else if (qx > qy) nx = px < 0 ? -1 : 1; else ny = py < 0 ? -1 : 1;
        var st = dist >= dp ? 0 : Math.pow(1 - Math.max(dist, 0) / dp, 1.6);
        var i = (y * cw + x) * 4;
        im.data[i] = 128 - nx * st * 127; im.data[i + 1] = 128 - ny * st * 127; im.data[i + 2] = 128; im.data[i + 3] = 255;
      }
      cx.putImageData(im, 0, 0);
      return cv.toDataURL('image/png');
    }

    function buildLens() {
      var defs = fxDefs(), root = host.docEl, n = 0;
      while (defs.firstChild) defs.removeChild(defs.firstChild);
      if (fxPref !== 'liquid' || !lensOK) { root.classList.remove('fx-lens'); return; }
      FX_TARGETS.forEach(function (id) {
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
        dm.setAttribute('in', 'SourceGraphic'); dm.setAttribute('in2', 'map'); dm.setAttribute('scale', '22');
        dm.setAttribute('xChannelSelector', 'R'); dm.setAttribute('yChannelSelector', 'G');
        f.appendChild(fi); f.appendChild(dm); defs.appendChild(f);
        el.style.setProperty('--lens', 'url(#lens-' + id + ')'); n++;
      });
      root.classList.toggle('fx-lens', n > 0);
      lensCount = n;
    }
    function scheduleLens() { clearTimeout(lensTimer); lensTimer = setTimeout(buildLens, 60); }

    function applyFx(silent) {
      var d = host.docEl;
      if (fxPref === 'flat') d.removeAttribute('data-fx'); else d.setAttribute('data-fx', fxPref);
      if (ctrlPref === 'pill') d.setAttribute('data-ctrl', 'pill'); else d.removeAttribute('data-ctrl');
      if (fxPref === 'liquid' && !lensRO && window.ResizeObserver) {
        lensRO = new ResizeObserver(scheduleLens);
        FX_TARGETS.forEach(function (id) { var el = $(id); if (el) lensRO.observe(el); });
      }
      buildLens();
      if (!silent && fxPref === 'liquid') {
        if (lensOK) host.dlog('info', 'fx', 'fxLens', { n: lensCount }); else host.dlog('warn', 'fx', 'fxNoLens');
      }
    }
    function syncActive() { host.setActive(fxPref !== 'flat' || ctrlPref === 'pill' || btnPref === 'liquid'); }

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

    /* 暴露给 onSeg / getSeg */
    M._setFx = setFx; M._setCtrl = setCtrl;
    M._get = function (k) { return k === 'uiFx' ? fxPref : k === 'ctrlShape' ? ctrlPref : k === 'btnFx' ? btnPref : null; };

    window.addEventListener('resize', function () { if (fxPref === 'liquid') scheduleLens(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (fxPref === 'liquid') scheduleLens(); });


    /* ===================== 按钮效果：液态弹性 =====================
     * 参数全部取自「液态玻璃-按钮组」源码（画心人 / 群友源码）：
     *  - 折射：边缘 12px 内、circleMap 曲线、最大偏移 24px（refractionHeight=12, refractionAmount=-24）
     *  - 模糊 2、饱和度 1.5；填充/危险按钮的着色 0.75（tint）
     *  - 边缘高光：Default 模式，角度 45°，宽 0.5dp，强度 = |边缘法线·光向|（用 canvas 按原 shader 逐像素算出，加色混合）
     *  - 按压：放大 4/48、拖动位移 tanh(0.05)、沿拖动方向拉伸；弹簧 spring(阻尼比0.5, k=300)，松手立刻回弹
     *  - 按压光：整钮加白 0.08×p + 手指处径向光 0.15×p（半径 = 短边×1.5，smoothstep 衰减），加色混合
     *  - 阴影：半径 24、透明度 0.1、下移 4
     * 说明：折射依赖 backdrop-filter:url()，仅 Chromium 生效；其余浏览器只有模糊/饱和度，其他效果照常。
     * 只做视觉，不拦截事件，按钮原有的 click 逻辑照常触发。
     */
    var K_BTN = 'sky-height-btnfx';
    var btnPref = host.lsGet(K_BTN) === 'liquid' ? 'liquid' : 'off';
    var BTN_SEL = '.btn,.dev-btn,.fab';
    var OM = Math.sqrt(300), ZE = 0.5, OD = OM * Math.sqrt(1 - ZE * ZE), R_PRESS = 4 / 48;
    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var bAct = [], bRaf = 0, bLast = 0, bDown = null;
    var lgDefs = null, lgRim = {}, lgLens = {}, lgObs = null, lgMO = null, lgScanT = 0, lgKeys = {};

    /* ---- 圆角矩形 SDF 与梯度（与源码 shader 同式） ---- */
    function sdRR(px, py, hx, hy, r) {
      var qx = Math.abs(px) - hx + r, qy = Math.abs(py) - hy + r;
      return Math.sqrt(Math.pow(Math.max(qx, 0), 2) + Math.pow(Math.max(qy, 0), 2)) + Math.min(Math.max(qx, qy), 0) - r;
    }
    function gradRR(px, py, hx, hy, gr) {
      var qx = Math.abs(px) - hx + gr, qy = Math.abs(py) - hy + gr, sx = px < 0 ? -1 : 1, sy = py < 0 ? -1 : 1;
      if (Math.max(qx, qy) > 0) {
        var ox = Math.max(qx, 0), oy = Math.max(qy, 0), l = Math.sqrt(ox * ox + oy * oy) || 1;
        return [ox / l * sx, oy / l * sy];
      }
      return qx > qy ? [sx, 0] : [0, sy];
    }
    /* 折射位移图：d = circleMap(1 - 深度/12) × (-24)，偏移 = d × 外法线；feDisplacementMap scale=48 */
    function lgLensMap(w, h, r) {
      var sc = Math.min(2, window.devicePixelRatio || 1), cw = Math.max(1, Math.round(w * sc)), ch = Math.max(1, Math.round(h * sc));
      var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      var cx = cv.getContext('2d'), im = cx.createImageData(cw, ch), gr = Math.min(r * 1.5, Math.min(w, h) / 2);
      for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) {
        var px = (x + .5) / sc - w / 2, py = (y + .5) / sc - h / 2, sd = sdRR(px, py, w / 2, h / 2, r), ox = 0, oy = 0;
        if (sd < 0 && -sd < 12) {
          var t = 1 - (-sd) / 12, d = (1 - Math.sqrt(Math.max(0, 1 - t * t))) * -24, g = gradRR(px, py, w / 2, h / 2, gr);
          ox = d * g[0]; oy = d * g[1];
        }
        var i = (y * cw + x) * 4;
        im.data[i] = Math.max(0, Math.min(255, 127.5 + ox / 48 * 255)); im.data[i + 1] = Math.max(0, Math.min(255, 127.5 + oy / 48 * 255));
        im.data[i + 2] = 128; im.data[i + 3] = 255;
      }
      cx.putImageData(im, 0, 0);
      return cv.toDataURL('image/png');
    }
    /* 边缘高光图：宽 ceil(0.5dpr)×2 的描边、σ=0.25dpr 三点高斯、裁掉外半边、强度 |法线·(cos45°,sin45°)| */
    function lgRimMap(w, h, r, dpr) {
      var cw = Math.max(1, Math.round(w * dpr)), ch = Math.max(1, Math.round(h * dpr)), rd = r * dpr;
      var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      var cx = cv.getContext('2d'), im = cx.createImageData(cw, ch), hx = cw / 2, hy = ch / 2;
      var half = Math.ceil(0.5 * dpr), sigma = Math.max(0.25 * dpr, 0.1), gr = Math.min(rd * 1.5, Math.min(hx, hy)), k = Math.SQRT1_2;
      for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) {
        var px = x + .5 - hx, py = y + .5 - hy, sd = sdRR(px, py, hx, hy, rd);
        if (sd > 0 || sd < -half - sigma) continue;
        var m = 0, ws = 0;
        for (var j = -1; j <= 1; j++) {
          var off = j * sigma, wt = Math.exp(-0.5 * off * off / (sigma * sigma));
          m += (Math.abs(sd - off) < half ? 1 : 0) * wt; ws += wt;
        }
        m = m / ws * 0.5;
        if (m <= 0) continue;
        var g = gradRR(px, py, hx, hy, gr), a = Math.abs(g[0] * k + g[1] * k) * m, i = (y * cw + x) * 4;
        im.data[i] = 255; im.data[i + 1] = 255; im.data[i + 2] = 255; im.data[i + 3] = Math.round(a * 255);
      }
      cx.putImageData(im, 0, 0);
      return cv.toDataURL('image/png');
    }
    function lgDefsEl() {
      if (lgDefs) return lgDefs;
      var d = document.createElementNS(NS, 'svg');
      d.setAttribute('id', 'lg-defs'); d.setAttribute('aria-hidden', 'true');
      lgDefs = document.createElementNS(NS, 'defs'); d.appendChild(lgDefs); document.body.appendChild(d);
      return lgDefs;
    }
    function lgFilter(key, w, h, r) {
      var id = 'lgl-' + key.replace(/[^0-9a-z]/gi, '_');
      if (lgLens[key]) return id;
      var f = document.createElementNS(NS, 'filter');
      f.setAttribute('id', id); f.setAttribute('x', '0'); f.setAttribute('y', '0'); f.setAttribute('width', w); f.setAttribute('height', h);
      f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('primitiveUnits', 'userSpaceOnUse'); f.setAttribute('color-interpolation-filters', 'sRGB');
      var fi = document.createElementNS(NS, 'feImage'), url = lgLensMap(w, h, r);
      fi.setAttribute('x', '0'); fi.setAttribute('y', '0'); fi.setAttribute('width', w); fi.setAttribute('height', h);
      fi.setAttribute('preserveAspectRatio', 'none'); fi.setAttribute('result', 'map');
      fi.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url); fi.setAttribute('href', url);
      var dm = document.createElementNS(NS, 'feDisplacementMap');
      dm.setAttribute('in', 'SourceGraphic'); dm.setAttribute('in2', 'map'); dm.setAttribute('scale', '48');
      dm.setAttribute('xChannelSelector', 'R'); dm.setAttribute('yChannelSelector', 'G');
      f.appendChild(fi); f.appendChild(dm); lgDefsEl().appendChild(f);
      lgLens[key] = id; return id;
    }
    function lgPrep(el) {
      var w = el.offsetWidth, h = el.offsetHeight;
      if (!w || !h) return;
      var r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      var dpr = Math.min(3, window.devicePixelRatio || 1), key = w + 'x' + h + 'x' + r.toFixed(1) + 'x' + dpr;
      if (el.__lgKey === key) return;
      el.__lgKey = key; lgKeys[key] = 1;
      if (!lgRim[key]) lgRim[key] = lgRimMap(w, h, r, dpr);
      el.style.setProperty('--lg-rim', 'url("' + lgRim[key] + '")'); el.classList.add('lg-r');
      if (lensOK) el.style.setProperty('--lg-lens', 'url(#' + lgFilter(key, w, h, r) + ')');
    }
    function lgScan() {
      document.querySelectorAll(BTN_SEL).forEach(function (el) {
        if (lgObs) { if (!el.__lgObs) { el.__lgObs = 1; lgObs.observe(el); } } else lgPrep(el);
      });
    }
    function lgRefresh() {
      if (btnPref !== 'liquid') return;
      document.querySelectorAll(BTN_SEL).forEach(function (el) { el.__lgKey = null; lgPrep(el); });
    }
    function lgOff() {
      if (lgObs) { lgObs.disconnect(); lgObs = null; }
      if (lgMO) { lgMO.disconnect(); lgMO = null; }
      document.querySelectorAll(BTN_SEL).forEach(function (el) {
        el.__lgObs = 0; el.__lgKey = null; el.classList.remove('lg-r');
        el.style.removeProperty('--lg-rim'); el.style.removeProperty('--lg-lens');
      });
      var d = $('lg-defs'); if (d && d.parentNode) d.parentNode.removeChild(d);
      lgDefs = null; lgRim = {}; lgLens = {}; lgKeys = {};
    }

    /* ---- 弹簧：spring(0.5, 300)，解析解与源码 springStepUnderdamped 一致 ---- */
    function spr(t) { return { x: 0, v: 0, t: t || 0 }; }
    function sprStep(s, dt) {
      var x0 = s.x - s.t, b = (s.v + ZE * OM * x0) / OD;
      var dc = Math.exp(-ZE * OM * dt), cw = Math.cos(OD * dt), sw = Math.sin(OD * dt);
      var off = dc * (x0 * cw + b * sw);
      s.v = -ZE * OM * off + dc * (-x0 * OD * sw + b * OD * cw);
      s.x = s.t + off;
    }
    function bFind(el) { for (var i = 0; i < bAct.length; i++) if (bAct[i].el === el) return bAct[i]; return null; }
    function bLocal(s, e) {
      var r = s.el.getBoundingClientRect(), k = r.width / (s.w || 1) || 1;
      return [(e.clientX - (r.left + r.width / 2)) / k + s.w / 2, (e.clientY - (r.top + r.height / 2)) / k + s.h / 2];
    }
    function bRender(s) {
      var el = s.el, w = s.w, h = s.h, minD = Math.min(w, h), maxD = Math.max(w, h);
      var p = s.p.x, dx = s.dx.x, dy = s.dy.x;
      var tx = minD * Math.tanh(0.05 * dx / minD), ty = minD * Math.tanh(0.05 * dy / minD);
      var ang = Math.atan2(dy, dx);
      var sx = 1 + R_PRESS * p + R_PRESS * Math.abs(Math.cos(ang) * dx / maxD) * Math.min(w / h, 1);
      var sy = 1 + R_PRESS * p + R_PRESS * Math.abs(Math.sin(ang) * dy / maxD) * Math.min(h / w, 1);
      sx = Math.max(0.5, Math.min(1.6, sx)); sy = Math.max(0.5, Math.min(1.6, sy));
      if (!reduceMotion) {
        if (s.fab) el.style.transform = 'translateX(-50%) translate(' + tx + 'px,' + ty + 'px) scale(' + sx + ',' + sy + ')';
        else { el.style.translate = tx + 'px ' + ty + 'px'; el.style.scale = sx + ' ' + sy; }
      }
      el.style.setProperty('--lg-p', Math.max(0, p).toFixed(3));
      el.style.setProperty('--lg-x', Math.max(0, Math.min(w, s.x0 + dx)).toFixed(1) + 'px');
      el.style.setProperty('--lg-y', Math.max(0, Math.min(h, s.y0 + dy)).toFixed(1) + 'px');
      el.style.setProperty('--lg-r', (minD * 1.5).toFixed(0) + 'px');
    }
    function bClear(s) {
      var el = s.el;
      el.classList.remove('lg-on');
      if (s.fab) el.style.removeProperty('transform'); else { el.style.removeProperty('translate'); el.style.removeProperty('scale'); }
      ['--lg-p', '--lg-x', '--lg-y', '--lg-r'].forEach(function (k) { el.style.removeProperty(k); });
    }
    function bTick(now) {
      var dt = Math.min(0.05, Math.max(0.001, (now - bLast) / 1000)); bLast = now;
      for (var i = bAct.length - 1; i >= 0; i--) {
        var s = bAct[i];
        sprStep(s.p, dt); sprStep(s.dx, dt); sprStep(s.dy, dt);
        bRender(s);
        var rest = Math.abs(s.p.x - s.p.t) < 5e-4 && Math.abs(s.p.v) < 5e-4 &&
          Math.abs(s.dx.x - s.dx.t) < 0.05 && Math.abs(s.dx.v) < 0.5 && Math.abs(s.dy.x - s.dy.t) < 0.05 && Math.abs(s.dy.v) < 0.5;
        if (rest && s.p.t === 0 && bDown !== s) { bClear(s); bAct.splice(i, 1); }
      }
      bRaf = bAct.length ? requestAnimationFrame(bTick) : 0;
    }
    function bKick() { if (!bRaf) { bLast = performance.now(); bRaf = requestAnimationFrame(bTick); } }
    function bRelease(s) { if (bDown === s) bDown = null; s.p.t = 0; s.dx.t = 0; s.dy.t = 0; bKick(); }
    document.addEventListener('pointerdown', function (e) {
      if (btnPref !== 'liquid' || (e.pointerType === 'mouse' && e.button !== 0)) return;
      var el = e.target && e.target.closest ? e.target.closest(BTN_SEL) : null;
      if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      var s = bFind(el);
      if (!s) { s = { el: el, w: 1, h: 1, fab: el.classList.contains('fab'), p: spr(0), dx: spr(0), dy: spr(0), x0: 0, y0: 0, sx0: 0, sy0: 0 }; bAct.push(s); }
      if (bDown && bDown !== s) bRelease(bDown);
      bDown = s; s.w = el.offsetWidth || 1; s.h = el.offsetHeight || 1;
      var l = bLocal(s, e); s.x0 = l[0]; s.y0 = l[1]; s.sx0 = e.clientX; s.sy0 = e.clientY;
      s.p.t = 1; s.dx.t = 0; s.dy.t = 0;
      el.classList.add('lg-on'); bKick();
    }, true);
    document.addEventListener('pointermove', function (e) {
      var s = bDown; if (!s) return;
      s.dx.t = e.clientX - s.sx0; s.dy.t = e.clientY - s.sy0;
    }, true);
    function bUp() { if (bDown) bRelease(bDown); }
    document.addEventListener('pointerup', bUp, true);
    document.addEventListener('pointercancel', bUp, true);

    function applyBtn(silent) {
      if (btnPref === 'liquid') {
        host.docEl.setAttribute('data-btnfx', 'liquid');
        if (window.ResizeObserver && !lgObs) lgObs = new ResizeObserver(function (es) { es.forEach(function (e) { lgPrep(e.target); }); });
        if (window.MutationObserver && !lgMO && document.body) {
          lgMO = new MutationObserver(function () {
            if (lgScanT) return;
            lgScanT = requestAnimationFrame(function () { lgScanT = 0; lgScan(); });
          });
          lgMO.observe(document.body, { childList: true, subtree: true });
        }
        lgScan();
        if (!silent) {
          if (lensOK) host.dlog('info', 'fx', 'btnFxLens', { n: Object.keys(lgKeys).length });
          else host.dlog('warn', 'fx', 'btnFxNoLens');
        }
      } else {
        host.docEl.removeAttribute('data-btnfx');
        bAct.forEach(bClear); bAct = []; bDown = null;
        lgOff();
      }
    }
    function setBtn(v) {
      var nv = v === 'liquid' ? 'liquid' : 'off'; if (nv === btnPref) return;
      btnPref = nv; host.lsSet(K_BTN, btnPref); syncActive();
      host.dlog('action', 'fx', 'btnFxSet', { v: btnPref === 'liquid' ? host.t('btnLiquid') : host.t('btnDefault') });
      applyBtn(); host.renderSettings();
    }
    M._setBtn = setBtn;
    var _sc0 = M._setCtrl; M._setCtrl = function (v) { _sc0(v); setTimeout(lgRefresh, 0); };
    window.addEventListener('resize', function () { setTimeout(lgRefresh, 80); });
    applyBtn(true);

    applyFx(true);
  },

  /* ============================== 界面 ============================== */
  mount: function (host, el) {
    if (el.getAttribute('data-exp-ui') !== '2') {
      el.setAttribute('data-exp-ui', '2');
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
        '<div class="sec" data-i="secBtn"></div>' +
        '<div class="seg" role="radiogroup" data-seg="btnFx">' +
          '<button type="button" role="radio" data-v="off"><span data-i="btnDefault"></span></button>' +
          '<button type="button" role="radio" data-v="liquid"><span data-i="btnLiquid"></span></button>' +
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
  },
  getSeg: function (key) { return this._get ? this._get(key) : null; }
});
