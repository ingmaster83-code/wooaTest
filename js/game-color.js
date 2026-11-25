/* 색 구별 테스트 — 다른 색 한 칸 찾기. 점점 색 차이가 작아지고 판이 커져요. 제한시간 45초, 오답은 -3초 */
(function () {
  var root = document.getElementById('gameRoot');
  if (!root) return;
  var TOTAL = 45, left = TOTAL, score = 0, iv = null, odd = -1;
  root.innerHTML = '<div id="clHead" style="display:flex;justify-content:space-between;font-weight:800;color:var(--navy);margin-bottom:.6rem;"><span id="clScore">점수 0</span><span id="clTime">45초</span></div><div id="clGrid" style="display:grid;gap:6px;max-width:420px;margin:0 auto;"></div><div id="clResult"></div>';
  var grid = document.getElementById('clGrid'), res = document.getElementById('clResult'), sEl = document.getElementById('clScore'), tEl = document.getElementById('clTime');
  function intro() {
    left = TOTAL; score = 0; res.innerHTML = ''; sEl.textContent = '점수 0'; tEl.textContent = TOTAL + '초';
    grid.style.display = 'block';
    grid.innerHTML = '<div style="text-align:center;padding:2rem 0"><div style="font-size:1.4rem;font-weight:800;color:var(--navy)">🎨 색 구별 테스트</div><p style="color:var(--text-mid);margin:.5rem 0 1rem;">다른 색 한 칸을 찾아 누르세요. 판이 점점 커지고 색 차이는 작아져요.<br>제한시간 ' + TOTAL + '초 · 틀리면 -3초</p><button class="btn btn-primary btn-lg" id="clStart">시작하기 →</button></div>';
    document.getElementById('clStart').addEventListener('click', begin);
  }
  function begin() {
    grid.style.display = 'grid';
    next();
    clearInterval(iv);
    iv = setInterval(function () { left -= 1; tEl.textContent = Math.max(0, left) + '초'; if (left <= 0) { clearInterval(iv); finish(); } }, 1000);
  }
  function next() {
    var n = Math.min(7, 2 + Math.floor(score / 3));
    var hue = Math.floor(Math.random() * 360), sat = 60 + Math.floor(Math.random() * 20), light = 48 + Math.floor(Math.random() * 10);
    var diff = Math.max(3, 20 - score * 1.1);
    var oddLight = light + (Math.random() < 0.5 ? diff : -diff);
    odd = Math.floor(Math.random() * n * n);
    grid.style.gridTemplateColumns = 'repeat(' + n + ',1fr)';
    var h = '';
    for (var i = 0; i < n * n; i++) {
      h += '<button data-i="' + i + '" style="aspect-ratio:1;border:none;border-radius:8px;cursor:pointer;background:hsl(' + hue + ',' + sat + '%,' + (i === odd ? oddLight : light) + '%)"></button>';
    }
    grid.innerHTML = h;
    Array.prototype.forEach.call(grid.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        if (left <= 0) return;
        if (parseInt(b.dataset.i, 10) === odd) { score++; sEl.textContent = '점수 ' + score; next(); }
        else { left -= 3; tEl.textContent = Math.max(0, left) + '초'; if (left <= 0) { clearInterval(iv); finish(); } }
      });
    });
  }
  function finish() {
    var emoji, title, desc;
    if (score >= 28) { emoji = '🦅'; title = '매의 눈'; desc = '색 차이를 아주 예민하게 구별하는 편이에요.'; }
    else if (score >= 20) { emoji = '🎨'; title = '색채 감각 상위권'; desc = '작은 색 차이도 잘 찾아내요.'; }
    else if (score >= 12) { emoji = '🙂'; title = '평균적인 색 감각'; desc = '일반적인 범위의 구별 능력이에요. 화면 밝기와 컨디션에 따라 달라질 수 있어요.'; }
    else { emoji = '🌱'; title = '워밍업 필요'; desc = '화면 밝기를 올리고 다시 해보세요. 기기 화면에 따라 색이 다르게 보일 수 있어요.'; }
    grid.style.display = 'none';
    res.innerHTML = '<div class="result-box" style="margin-top:.5rem"><div class="result-emoji">' + emoji + '</div><div class="result-title">' + title + '</div><p class="result-desc">점수 <b>' + score + '</b><br>' + desc + '<br><small>※ 의학적 색각 검사가 아니에요. 색약·색맹이 걱정되면 안과 검진을 받아보세요.</small></p><button class="btn btn-secondary" id="clRetry">🔄 다시 하기</button></div>';
    window.QUIZ_RESULT_SUMMARY = emoji + ' 색 구별 ' + score + '점';
    document.getElementById('clRetry').addEventListener('click', function () { grid.style.display = 'block'; intro(); });
    if (window.gtag) gtag('event', 'game_result', { test: 'color', score: score });
  }
  intro();
})();
