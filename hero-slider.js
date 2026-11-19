/* 빡쏘의 노래서랍 - 소개 카드 ↔ 커버곡 배너 슬라이더
   singbook.html 맨 아래 </body> 바로 위에 아래 한 줄을 넣으면 돼요:
   <script src="./hero-slider.js"></script>
   같은 폴더에 cover-banner.gif 파일도 올려주세요. */
(function () {
  var YT_ID = 'BxlsVMyl3Jk';
  var GIF = './cover-banner.gif';
  var INTERVAL = 5000;

  var hero = document.querySelector('.hero');
  if (!hero) return;

  var css = `
.hs{position:relative}
.hs-view{overflow:hidden;border-radius:25px;transition:height .4s cubic-bezier(.2,.8,.2,1)}
.hs-track{display:flex;align-items:flex-start;transition:transform .5s cubic-bezier(.2,.8,.2,1);touch-action:pan-y}
.hs-slide{flex:none;width:100%;min-width:0}
.hs-slide>.hero{margin:0}
.hs-banner{position:relative;display:block;width:100%;aspect-ratio:16/9;border:1px solid #2b2540;border-radius:25px;overflow:hidden;background:#0d0b1a;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}
.hs-banner img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;image-rendering:pixelated;-webkit-user-drag:none;user-select:none}
.hs-play{position:absolute;right:14px;bottom:14px;display:flex;align-items:center;gap:6px;padding:8px 13px 8px 10px;border-radius:99px;background:#fffffff0;color:#8f4a6c;font-size:13px;font-weight:800;box-shadow:0 6px 18px #0005}
.hs-play i{font-style:normal;width:20px;height:20px;border-radius:50%;background:#bd718c;color:#fff;display:grid;place-items:center;font-size:9px;padding-left:1px}
.hs-video{position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:25px;overflow:hidden}
.hs-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0;display:block}
.hs-close{position:absolute;top:10px;right:10px;z-index:2;width:36px;height:36px;border:0;border-radius:50%;background:#000a;color:#fff;font-size:22px;line-height:1}
.hs-dots{display:flex;justify-content:center;gap:8px;margin-top:10px}
.hs-dot{width:8px;height:8px;border:0;padding:0;border-radius:50%;background:#e6c7d4;transition:width .25s,background .25s}
.hs-dot.on{width:22px;border-radius:99px;background:#bd718c}
@media(prefers-reduced-motion:reduce){.hs-track,.hs-view,.hs-dot{transition:none!important}}
`;
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var wrap = document.createElement('div');
  wrap.className = 'hs';
  wrap.innerHTML =
    '<div class="hs-view"><div class="hs-track">' +
      '<div class="hs-slide" id="hsS0"></div>' +
      '<div class="hs-slide" id="hsS1"></div>' +
    '</div></div>' +
    '<div class="hs-dots"><button class="hs-dot on" type="button" aria-label="소개 카드"></button><button class="hs-dot" type="button" aria-label="커버곡 배너"></button></div>';
  hero.parentNode.insertBefore(wrap, hero);
  var s0 = wrap.querySelector('#hsS0'), s1 = wrap.querySelector('#hsS1');
  s0.appendChild(hero);

  var view = wrap.querySelector('.hs-view'), track = wrap.querySelector('.hs-track');
  var dots = wrap.querySelectorAll('.hs-dot');
  var cur = 0, timer = null, playing = false;

  function bannerHTML() {
    return '<div class="hs-banner" role="button" tabindex="0" aria-label="커버곡 영상 재생">' +
      '<img alt="PPARK_XO & 464" draggable="false"><span class="hs-play"><i>▶</i>커버곡 보기</span></div>';
  }
  s1.innerHTML = bannerHTML();
  var gifLoaded = false;
  function loadGif() {
    if (gifLoaded) return;
    var img = s1.querySelector('img');
    if (img) { img.src = GIF; gifLoaded = true; }
  }
  if (document.readyState === 'complete') loadGif(); else window.addEventListener('load', loadGif);

  function fit() { view.style.height = (cur === 0 ? s0 : s1).offsetHeight + 'px'; }
  function go(i) {
    cur = i;
    track.style.transform = 'translateX(' + (-100 * i) + '%)';
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    if (i === 1) loadGif();
    fit();
  }
  function stop() { clearInterval(timer); timer = null; }
  function start() { stop(); if (playing) return; timer = setInterval(function () { go(cur === 0 ? 1 : 0); }, INTERVAL); }

  function openVideo() {
    playing = true; stop();
    s1.innerHTML =
      '<div class="hs-video"><button class="hs-close" type="button" aria-label="영상 닫기">×</button>' +
      '<iframe src="https://www.youtube.com/embed/' + YT_ID + '?autoplay=1&rel=0&playsinline=1" title="커버곡 영상" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
    s1.querySelector('.hs-close').onclick = closeVideo;
    fit();
  }
  function closeVideo() {
    playing = false;
    s1.innerHTML = bannerHTML();
    gifLoaded = false; loadGif();
    bindBanner(); fit(); start();
  }
  function bindBanner() {
    var b = s1.querySelector('.hs-banner');
    if (!b) return;
    b.addEventListener('click', function () { if (!dragged) openVideo(); });
    b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(); } });
  }

  var sx = null, sy = 0, dragged = false;
  view.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; dragged = false; stop(); });
  view.addEventListener('pointermove', function (e) {
    if (sx !== null && Math.abs(e.clientX - sx) > 8 && Math.abs(e.clientX - sx) > Math.abs(e.clientY - sy)) dragged = true;
  });
  function release(e) {
    if (sx === null) return;
    var dx = e.clientX - sx; sx = null;
    if (!playing && dragged && Math.abs(dx) > 40) go(dx < 0 ? 1 : 0);
    setTimeout(function () { dragged = false; }, 60);
    start();
  }
  view.addEventListener('pointerup', release);
  view.addEventListener('pointercancel', function () { sx = null; start(); });
  view.addEventListener('mouseenter', stop);
  view.addEventListener('mouseleave', start);
  dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); start(); }); });
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);

  bindBanner();
  setTimeout(fit, 0);
  start();
})();
