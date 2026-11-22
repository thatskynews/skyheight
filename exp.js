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
  version: '1.1.0',
  build: 2,
  date: '2026-11-22',

  /* ============================== 样式 ============================== */
  css: `
html[data-fx="frost"] .ibtn,html[data-fx="frost"] .top-avatar{
  background:color-mix(in srgb, var(--surface) 46%, transparent);
  -webkit-backdrop-filter:blur(12px) saturate(2) brightness(1.08);backdrop-filter:blur(12px) saturate(2) brightness(1.08);
  background-image:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.03) 70%);
  box-shadow:0 6px 18px rgba(0,0,0,.18),inset 0 1px 1px rgba(255,255,255,.14)}
/* ---- 液态玻璃（按钮组）：形状 / 背景模糊 / 边缘折射 / 边缘高光 / 外阴影 五层 ---- */
html[data-fx="liquid"] :is(.ibtn,.top-avatar,.btn){
  --lgx-sp:0;
  background-color:var(--lgx-bg,transparent)!important;
  background-image:
    radial-gradient(150% 130% at var(--lgx-x,50%) var(--lgx-y,-30%),rgba(255,255,255,calc(.30 * var(--lgx-sp,0))) 0%,rgba(255,255,255,0) 60%),
    linear-gradient(180deg,rgba(255,255,255,.17),rgba(255,255,255,.05) 38%,rgba(255,255,255,0) 62%,rgba(255,255,255,.07))!important;
  background-repeat:no-repeat!important;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.26),inset 0 1px 0 rgba(255,255,255,.44),inset 0 -1px 1px rgba(255,255,255,.14),0 8px 20px rgba(0,0,0,.20)!important;
  -webkit-backdrop-filter:var(--lgx-f)!important;backdrop-filter:var(--lgx-f)!important;
  transition:transform .38s cubic-bezier(.34,1.56,.64,1),background-color .2s!important}
html[data-fx="liquid"] :is(.ibtn,.top-avatar,.btn):active{transform:none!important;filter:none!important}
html[data-fx="liquid"] :is(.ibtn,.top-avatar,.btn).lgx-press{transform:scale(.94)!important}
html[data-fx="liquid"] .ibtn::after{display:none}
html[data-fx="liquid"] .ibtn,html[data-fx="liquid"] .top-avatar{--lgx-bg:color-mix(in srgb,var(--surface) 52%,transparent)}
html[data-fx="liquid"] .btn.outlined{--lgx-bg:color-mix(in srgb,var(--surface-container) 62%,transparent)}
html[data-fx="liquid"] .btn.filled{--lgx-bg:var(--primary)}
html[data-fx="liquid"] .btn.danger{--lgx-bg:#BA1A1A}
html[data-theme="dusk"][data-fx="liquid"] .btn.danger{--lgx-bg:#9E3A31}
html[data-theme="dark"][data-fx="liquid"] .btn.danger{--lgx-bg:#93000A}
html[data-theme="light"][data-fx="liquid"] :is(.ibtn,.top-avatar,.btn){
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.07),inset 0 1px 0 rgba(255,255,255,.92),inset 0 -1px 1px rgba(0,0,0,.05),0 2px 8px rgba(0,0,0,.05)!important}
html[data-ctrl="pill"] :is(.ibtn,.top-avatar,.fab,.btn,.dev-btn,.seg,.seg button,.seg-thumb,.avatar-btn){border-radius:999px!important}
#fx-defs{position:absolute;width:0;height:0;overflow:hidden;pointer-events:none}
.exp-ver{margin:22px 0 4px;text-align:center;font-size:12px;color:var(--on-surface-variant);opacity:.7;letter-spacing:.3px}
`,

  /* ============================== 文案 ============================== */
  strings: {
    zh: {
      secUiFx: '界面效果', secCtrl: '控件效果',
      fxFlat: '扁平风格', fxLiquid: '液态玻璃', fxFrost: '磨砂玻璃',
      ctrlRound: '圆角UI控件', ctrlPill: '胶囊UI控件',
      expModVer: '实验性功能模块 v{v}',
      L_fxSet: '界面效果 → {v}', L_ctrlSet: '控件效果 → {v}',
      L_fxLens: '液态玻璃：{n} 个按钮已套用玻璃效果',
      L_fxNoLens: '当前环境不支持折射滤镜，已降级为磨砂'
    },
    en: {
      secUiFx: 'UI effect', secCtrl: 'Control style',
      fxFlat: 'Flat', fxLiquid: 'Liquid glass', fxFrost: 'Frosted glass',
      ctrlRound: 'Rounded controls', ctrlPill: 'Pill controls',
      expModVer: 'Experimental module v{v}',
      L_fxSet: 'UI effect → {v}', L_ctrlSet: 'Control style → {v}',
      L_fxLens: 'Liquid glass: {n} buttons styled',
      L_fxNoLens: 'Refraction filter unsupported here, fell back to frosted'
    }
  },

  /* ============================== 逻辑 ============================== */
  init: function (host) {
    var M = this;
    var $ = host.$;
    var K_FX = 'sky-height-fx', K_CTRL = 'sky-height-ctrl';
    var fxPref = 'flat', ctrlPref = 'round';
    var GLASS_SEL = '#btn-top-avatar,#btn-help,#btn-history,#btn-settings,.btn';
    var NS = 'http://www.w3.org/2000/svg';
    var glassOK = false;
    try {
      glassOK = !!(window.CSS && CSS.supports && (CSS.supports('backdrop-filter', 'url(#lgx-x)') || CSS.supports('-webkit-backdrop-filter', 'url(#lgx-x)')) && !/Firefox\//.test(navigator.userAgent));
    } catch (e) { glassOK = false; }
    var filtCache = {}, glassCount = 0, glassTimer = 0, glassRO = null, glassMO = null;

    var lf = host.lsGet(K_FX), lc = host.lsGet(K_CTRL);
    if (lf === 'liquid' || lf === 'frost') fxPref = lf;
    if (lc === 'pill') ctrlPref = 'pill';

    function fxDefs() {
      var d = $('fx-defs');
      if (!d) {
        d = document.createElementNS(NS, 'svg');
        d.setAttribute('id', 'fx-defs'); d.setAttribute('aria-hidden', 'true');
        d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
        d.appendChild(document.createElementNS(NS, 'defs'));
        (document.body || document.documentElement).appendChild(d);
      }
      return d.firstChild;
    }

    /* 位移图：圆角矩形 SDF + 弧形边缘。R=横向、G=竖向、128=不推 */
    function lensMap(w, h, r, bezel, curve) {
      var sc = Math.min(2, window.devicePixelRatio || 1), cw = Math.max(2, Math.round(w * sc)), ch = Math.max(2, Math.round(h * sc));
      var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      var cx = cv.getContext('2d'), im = cx.createImageData(cw, ch), d = im.data;
      var hx = w / 2, hy = h / 2, rr = Math.min(r, hx, hy);
      for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) {
        var px = (x + .5) / sc - hx, py = (y + .5) / sc - hy;
        var qx = Math.abs(px) - (hx - rr), qy = Math.abs(py) - (hy - rr), dist, nx = 0, ny = 0;
        if (qx > 0 && qy > 0) {
          var l = Math.sqrt(qx * qx + qy * qy) || 1; dist = rr - l;
          nx = qx / l * (px < 0 ? -1 : 1); ny = qy / l * (py < 0 ? -1 : 1);
        } else if (qx > qy) { dist = rr - qx; nx = px < 0 ? -1 : 1; }
        else { dist = rr - qy; ny = py < 0 ? -1 : 1; }
        var t = Math.min(Math.max(dist / bezel, 0), 1);
        var m = dist < 0 ? 0 : Math.pow(1 - t, curve);
        var k = (y * cw + x) * 4;
        d[k] = 128 - nx * m * 127; d[k + 1] = 128 - ny * m * 127; d[k + 2] = 128; d[k + 3] = 255;
      }
      cx.putImageData(im, 0, 0);
      return cv.toDataURL('image/png');
    }

    /* 每个尺寸一张滤镜：背景模糊 → 边缘位移（折射）→ 提饱和 */
    function ensureFilter(w, h, r) {
      var key = 'lgx-' + Math.round(w) + 'x' + Math.round(h) + 'r' + Math.round(r);
      if (filtCache[key]) return filtCache[key];
      var f = document.getElementById(key), defs = fxDefs();
      if (!f) {
        var bezel = Math.max(6, Math.min(20, Math.min(w, h) * 0.34));
        var scale = Math.max(8, Math.min(34, Math.min(w, h) * 0.6));
        var url = lensMap(w, h, r, bezel, 2.2);
        f = document.createElementNS(NS, 'filter');
        f.setAttribute('id', key);
        f.setAttribute('x', '0'); f.setAttribute('y', '0');
        f.setAttribute('width', w); f.setAttribute('height', h);
        f.setAttribute('filterUnits', 'userSpaceOnUse');
        f.setAttribute('primitiveUnits', 'userSpaceOnUse');
        f.setAttribute('color-interpolation-filters', 'sRGB');
        var fi = document.createElementNS(NS, 'feImage');
        fi.setAttribute('result', 'map');
        fi.setAttribute('x', '0'); fi.setAttribute('y', '0');
        fi.setAttribute('width', w); fi.setAttribute('height', h);
        fi.setAttribute('preserveAspectRatio', 'none');
        fi.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
        fi.setAttribute('href', url);
        var bl = document.createElementNS(NS, 'feGaussianBlur');
        bl.setAttribute('in', 'SourceGraphic'); bl.setAttribute('result', 'b'); bl.setAttribute('stdDeviation', '1.2');
        var dm = document.createElementNS(NS, 'feDisplacementMap');
        dm.setAttribute('in', 'b'); dm.setAttribute('in2', 'map'); dm.setAttribute('scale', String(scale));
        dm.setAttribute('xChannelSelector', 'R'); dm.setAttribute('yChannelSelector', 'G');
        var cm = document.createElementNS(NS, 'feColorMatrix');
        cm.setAttribute('type', 'saturate'); cm.setAttribute('values', '1.3');
        f.appendChild(fi); f.appendChild(bl); f.appendChild(dm); f.appendChild(cm);
        defs.appendChild(f);
      }
      filtCache[key] = 'url(#' + key + ')';
      return filtCache[key];
    }

    function clearFilters() {
      var d = fxDefs();
      while (d.firstChild) d.removeChild(d.firstChild);
      filtCache = {};
    }

    /* 按下：弹簧缩放 + 高光跟手 */
    function bindGlass(el) {
      if (el.getAttribute('data-lgx')) return;
      el.setAttribute('data-lgx', '1');
      el.addEventListener('pointerdown', function (e) {
        el.classList.add('lgx-press');
        el.style.setProperty('--lgx-sp', '1');
        var r = el.getBoundingClientRect();
        el.style.setProperty('--lgx-x', (e.clientX - r.left) + 'px');
        el.style.setProperty('--lgx-y', (e.clientY - r.top) + 'px');
      });
      el.addEventListener('pointermove', function (e) {
        if (!el.classList.contains('lgx-press')) return;
        var r = el.getBoundingClientRect();
        el.style.setProperty('--lgx-x', (e.clientX - r.left) + 'px');
        el.style.setProperty('--lgx-y', (e.clientY - r.top) + 'px');
      });
      ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach(function (t) {
        el.addEventListener(t, function () {
          el.classList.remove('lgx-press');
          el.style.setProperty('--lgx-sp', '0');
        });
      });
    }

    function refreshGlass() {
      if (fxPref !== 'liquid') return;
      var list = document.querySelectorAll(GLASS_SEL), n = 0;
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (!el.offsetWidth || !el.offsetHeight) continue;
        if (el.closest && el.closest('#sheet-exp')) continue;
        var w = el.offsetWidth, h = el.offsetHeight;
        var r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
        r = Math.min(r, w / 2, h / 2);
        if (glassOK) el.style.setProperty('--lgx-f', ensureFilter(w, h, r));
        else el.style.removeProperty('--lgx-f');
        bindGlass(el);
        if (glassRO) glassRO.observe(el);
        n++;
      }
      glassCount = n;
    }
    function scheduleGlass() { clearTimeout(glassTimer); glassTimer = setTimeout(refreshGlass, 120); }

    function installGlass() {
      if (!document.body) return;
      if (!glassRO && window.ResizeObserver) glassRO = new ResizeObserver(scheduleGlass);
      if (!glassMO) {
        glassMO = new MutationObserver(function (recs) {
          for (var i = 0; i < recs.length; i++) {
            var t = recs[i].target;
            if (recs[i].type === 'attributes' && t && t.classList && t.classList.contains('lgx-press')) continue;
            scheduleGlass(); return;
          }
        });
        glassMO.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      }
      refreshGlass();
    }

    function applyFx(silent) {
      var d = host.docEl;
      if (fxPref === 'flat') d.removeAttribute('data-fx'); else d.setAttribute('data-fx', fxPref);
      if (ctrlPref === 'pill') d.setAttribute('data-ctrl', 'pill'); else d.removeAttribute('data-ctrl');
      if (fxPref === 'liquid') {
        installGlass();
        if (!silent) { if (glassOK) host.dlog('info', 'fx', 'fxLens', { n: glassCount }); else host.dlog('warn', 'fx', 'fxNoLens'); }
      } else {
        clearFilters(); glassCount = 0;
      }
    }
    function syncActive() { host.setActive(fxPref !== 'flat' || ctrlPref === 'pill'); }

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
      clearFilters(); applyFx(true); host.renderSettings();
      scheduleGlass();
    }

    /* 暴露给 onSeg / getSeg */
    M._setFx = setFx; M._setCtrl = setCtrl;
    M._get = function (k) { return k === 'uiFx' ? fxPref : k === 'ctrlShape' ? ctrlPref : null; };

    window.addEventListener('resize', function () { if (fxPref === 'liquid') scheduleGlass(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (fxPref === 'liquid') scheduleGlass(); });

    applyFx(true);
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
  },
  getSeg: function (key) { return this._get ? this._get(key) : null; }
});
