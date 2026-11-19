/* 빡쏘의 노래서랍 - 소개 카드 <-> 커버곡 배너 슬라이더 (배너 클릭 시 팝업 재생)
   singbook.html 맨 아래 </body> 바로 위에 아래 한 줄을 넣으면 돼요:
   <script src="./hero-slider.js"></script>
   같은 폴더에 cover-banner.gif 파일도 올려주세요. */
(function () {
  var YT_ID = 'BxlsVMyl3Jk';
  var GIF = './cover-banner.gif';
  var INTERVAL = 5000;
  /* 배너는 소개 카드와 같은 높이로 잘려 보여요. 보여줄 세로 위치(0%=위, 100%=아래)를 여기서 조절 */
  var BANNER_POS = 'center 68%';

  var hero = document.querySelector('.hero');
  if (!hero) return;

  var css = `
.hs{position:relative}
.hs-view{overflow:hidden;border-radius:25px}
.hs-track{display:flex;align-items:stretch;transition:transform .5s cubic-bezier(.2,.8,.2,1);touch-action:pan-y}
.hs-slide{flex:none;width:100%;min-width:0}
.hs-slide>.hero{margin:0;height:100%}
.hs-banner{position:relative;display:block;width:100%;height:100%;min-height:96px;border:1px solid #2b2540;border-radius:25px;overflow:hidden;background:#0d0b1a;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}
.hs-banner img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;image-rendering:pixelated;-webkit-user-drag:none;user-select:none}
.hs-play{position:absolute;right:12px;bottom:10px;display:flex;align-items:center;gap:6px;padding:7px 12px 7px 9px;border-radius:99px;background:#fffffff0;color:#8f4a6c;font-size:12px;font-weight:800;box-shadow:0 6px 18px #0005}
.hs-play i{font-style:normal;width:18px;height:18px;border-radius:50%;background:#bd718c;color:#fff;display:grid;place-items:center;font-size:8px;padding-left:1px}
.hs-dots{display:flex;justify-content:center;gap:8px;margin-top:10px}
.hs-dot{width:8px;height:8px;border:0;padding:0;border-radius:50%;background:#e6c7d4;transition:width .25s,background .25s}
.hs-dot.on{width:22px;border-radius:99px;background:#bd718c}
.hs-modal{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(42,25,36,.8);backdrop-filter:blur(7px)}
.hs-modal.open{display:flex}
.hs-dialog{width:min(1000px,100%);max-height:94vh;overflow:auto;background:#fffafd;border:1px solid #f0dce5;border-radius:22px;box-shadow:0 28px 100px #0006;padding:18px}
.hs-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:13px}
.hs-head h3{font-size:19px;color:#75475e;margin:0}
.hs-head p{font-size:14px;color:#8f7787;margin:5px 0 0}
.hs-x{flex:none;width:40px;height:40px;border:0;border-radius:50%;background:#f7e8ee;color:#9c5877;font-size:26px;line-height:1;cursor:pointer}
.hs-frame{width:100%;aspect-ratio:16/9;background:#17131a;border-radius:14px;overflow:hidden}
.hs-frame iframe{display:block;width:100%;height:100%;border:0}
@media(max-width:700px){.hs-modal{padding:12px}.hs-dialog{padding:12px;border-radius:17px}.hs-head h3{font-size:16px}.hs-frame{border-radius:10px}.hs-play{right:9px;bottom:8px}}
@media(prefers-reduced-motion:reduce){.hs-track,.hs-dot{transition:none!important}}
`;
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var wrap = document.createElement('div');
  wrap.className = 'hs';
  wrap.innerHTML =
    '<div class="hs-view"><div class="hs-track">' +
      '<div class="hs-slide" id="hsS0"></div>' +
      '<div class="hs-slide" id="hsS1"><div class="hs-banner" role="button" tabindex="0" aria-label="커버곡 영상 재생"><img alt="PPARK_XO & 464" draggable="false"><span class="hs-play"><i>▶</i>커버곡 보기</span></div></div>' +
    '</div></div>' +
    '<div class="hs-dots"><button class="hs-dot on" type="button" aria-label="소개 카드"></button><button class="hs-dot" type="button" aria-label="커버곡 배너"></button></div>';
  hero.parentNode.insertBefore(wrap, hero);
  var s0 = wrap.querySelector('#hsS0');
  s0.appendChild(hero);

  var modal = document.createElement('div');
  modal.className = 'hs-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="hs-dialog" role="dialog" aria-modal="true" aria-labelledby="hsTitle">' +
      '<div class="hs-head"><div><h3 id="hsTitle">커버곡</h3><p>PPARK_XO &amp; 464</p></div>' +
      '<button class="hs-x" type="button" aria-label="팝업 닫기">×</button></div>' +
      '<div class="hs-frame"></div></div>';
  document.body.appendChild(modal);
  var frame = modal.querySelector('.hs-frame');

  var track = wrap.querySelector('.hs-track');
  var dots = wrap.querySelectorAll('.hs-dot');
  var banner = wrap.querySelector('.hs-banner');
  var img = banner.querySelector('img');
  var cur = 0, timer = null, paused = false;

  img.style.objectPosition = BANNER_POS;
  function loadGif() { if (!img.getAttribute('src')) img.src = GIF; }
  if (document.readyState === 'complete') loadGif(); else window.addEventListener('load', loadGif);

  function go(i) {
    cur = i;
    track.style.transform = 'translateX(' + (-100 * i) + '%)';
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    if (i === 1) loadGif();
  }
  function stop() { clearInterval(timer); timer = null; }
  function start() { stop(); if (paused) return; timer = setInterval(function () { go(cur === 0 ? 1 : 0); }, INTERVAL); }

  function openVideo() {
    paused = true; stop();
    frame.innerHTML = '<iframe src="https://www.youtube.com/embed/' + YT_ID + '?autoplay=1&rel=0&playsinline=1" title="커버곡 영상" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.hs-x').focus();
  }
  function closeVideo() {
    frame.innerHTML = '';
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    paused = false; start();
  }
  modal.querySelector('.hs-x').addEventListener('click', closeVideo);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeVideo(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeVideo(); });

  var sx = null, sy = 0, dragged = false;
  var view = wrap.querySelector('.hs-view');
  view.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; dragged = false; stop(); });
  view.addEventListener('pointermove', function (e) {
    if (sx !== null && Math.abs(e.clientX - sx) > 8 && Math.abs(e.clientX - sx) > Math.abs(e.clientY - sy)) dragged = true;
  });
  view.addEventListener('pointerup', function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx; sx = null;
    if (dragged && Math.abs(dx) > 40) go(dx < 0 ? 1 : 0);
    setTimeout(function () { dragged = false; }, 60);
    start();
  });
  view.addEventListener('pointercancel', function () { sx = null; start(); });
  view.addEventListener('mouseenter', stop);
  view.addEventListener('mouseleave', start);
  dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); start(); }); });

  banner.addEventListener('click', function () { if (!dragged) openVideo(); });
  banner.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(); } });

  start();
})();
