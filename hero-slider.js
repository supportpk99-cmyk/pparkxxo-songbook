/* 빡쏘의 노래서랍 - 소개 카드 + 커버곡 배너 (PC: 반반 / 모바일: 위아래), 배너 클릭 시 팝업 재생
   singbook.html 맨 아래 </body> 바로 위에 아래 한 줄을 넣으면 돼요:
   <script src="./hero-slider.js"></script>
   같은 폴더에 cover-banner.gif 파일도 올려주세요. */
(function () {
  var YT_ID = 'BxlsVMyl3Jk';
  var GIF = './cover-banner.gif';
  /* PC에서 배너가 가로로 잘려 보일 때 보여줄 세로 위치(0%=위, 100%=아래) */
  var BANNER_POS = 'center 55%';
  /* PC에서 두 카드가 나란히 놓일 때의 높이 */
  var ROW_HEIGHT = '200px';

  var hero = document.querySelector('.hero');
  if (!hero) return;

  var css = `
.hs-row{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}
.hs-row>.hero{margin:0}
.hs-banner{position:relative;display:block;width:100%;aspect-ratio:16/9;border:1px solid #2b2540;border-radius:25px;overflow:hidden;background:#0d0b1a;cursor:pointer;padding:0;box-shadow:0 14px 40px #98647b12;-webkit-tap-highlight-color:transparent;transition:transform .22s ease,box-shadow .22s ease}
.hs-banner:hover{transform:translateY(-3px);box-shadow:0 17px 35px #98647b30}
.hs-banner:focus-visible{outline:2px solid #dba5bd;outline-offset:3px}
.hs-banner img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;image-rendering:pixelated;-webkit-user-drag:none;user-select:none}
.hs-play{position:absolute;right:12px;bottom:10px;display:flex;align-items:center;gap:6px;padding:7px 12px 7px 9px;border-radius:99px;background:#fffffff0;color:#8f4a6c;font-size:12px;font-weight:800;box-shadow:0 6px 18px #0005}
.hs-play i{font-style:normal;width:18px;height:18px;border-radius:50%;background:#bd718c;color:#fff;display:grid;place-items:center;font-size:8px;padding-left:1px}
@media(min-width:901px){
  .hs-row{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;height:` + ROW_HEIGHT + `}
  .hs-row>.hero{height:100%}
  .hs-banner{aspect-ratio:auto;height:100%}
}
@media(hover:none){.hs-banner:hover{transform:none;box-shadow:0 14px 40px #98647b12}.hs-banner:active{transform:scale(.985)}}
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
@media(prefers-reduced-motion:reduce){.hs-banner{transition:none}}
`;
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var row = document.createElement('div');
  row.className = 'hs-row';
  hero.parentNode.insertBefore(row, hero);
  row.appendChild(hero);

  var banner = document.createElement('div');
  banner.className = 'hs-banner';
  banner.setAttribute('role', 'button');
  banner.setAttribute('tabindex', '0');
  banner.setAttribute('aria-label', '커버곡 영상 재생');
  banner.innerHTML = '<img alt="PPARK_XO & 464" draggable="false"><span class="hs-play"><i>▶</i>커버곡 보기</span>';
  row.appendChild(banner);

  var img = banner.querySelector('img');
  img.style.objectPosition = BANNER_POS;
  function loadGif() { if (!img.getAttribute('src')) img.src = GIF; }
  img.decoding = 'async';
  loadGif(); /* 페이지가 열리자마자 바로 불러오기 */

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

  function openVideo() {
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
  }
  banner.addEventListener('click', openVideo);
  banner.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(); } });
  modal.querySelector('.hs-x').addEventListener('click', closeVideo);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeVideo(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeVideo(); });
})();
