/* 숫자 기억력 테스트 — 숫자를 잠깐 보여주고 기억해서 입력. 3자리부터 시작, 틀리면 종료 */
(function () {
  var root = document.getElementById('gameRoot');
  if (!root) return;
  var level = 3, best = 0;
  root.innerHTML = '<div id="nmBox" style="border-radius:16px;background:#F5F3FF;padding:2.2rem 1rem;text-align:center;min-height:200px;"></div><div id="nmResult"></div>';
  var box = document.getElementById('nmBox'), res = document.getElementById('nmResult');
  function rnd(n) { var s = String(1 + Math.floor(Math.random() * 9)); for (var i = 1; i < n; i++) s += Math.floor(Math.random() * 10); return s; }
  function intro() {
    level = 3; best = 0; res.innerHTML = '';
    box.innerHTML = '<div style="font-size:1.4rem;font-weight:800;color:var(--navy)">🧠 숫자 기억력 테스트</div><p style="color:var(--text-mid);margin:.5rem 0 1rem;">화면에 잠깐 나타나는 숫자를 기억해서 입력하세요.<br>3자리부터 시작하며 한 번 틀리면 끝나요.</p><button class="btn btn-primary btn-lg" id="nmStart">시작하기 →</button>';
    document.getElementById('nmStart').addEventListener('click', round);
  }
  function round() {
    var num = rnd(level);
    box.innerHTML = '<div style="color:var(--text-mid);font-size:.9rem">' + level + '자리 — 기억하세요!</div><div style="font-size:2.6rem;font-weight:800;letter-spacing:.25rem;color:var(--purple-dk);margin:1rem 0;">' + num + '</div><div style="height:6px;background:#E9E3FF;border-radius:3px;overflow:hidden"><div id="nmBar" style="height:100%;width:100%;background:#7C3AED;transition:width ' + (800 + level * 350) + 'ms linear"></div></div>';
    setTimeout(function () { var b = document.getElementById('nmBar'); if (b) b.style.width = '0%'; }, 30);
    setTimeout(function () {
      box.innerHTML = '<div style="color:var(--text-mid);font-size:.9rem">방금 본 숫자를 입력하세요</div><input id="nmInput" inputmode="numeric" autocomplete="off" maxlength="' + (level + 2) + '" style="font-size:1.8rem;text-align:center;width:80%;max-width:320px;padding:.6rem;margin:1rem 0;border:2px solid #C4B5FD;border-radius:12px;letter-spacing:.2rem;"><br><button class="btn btn-primary" id="nmGo">확인</button>';
      var inp = document.getElementById('nmInput'); inp.focus();
      function check() {
        if (inp.value.trim() === num) { best = level; level++; box.innerHTML = '<div style="font-size:2rem">✅</div><div style="font-weight:800;color:var(--navy)">정답! 다음은 ' + level + '자리</div>'; setTimeout(round, 900); }
        else { finish(num, inp.value.trim()); }
      }
      document.getElementById('nmGo').addEventListener('click', check);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
    }, 800 + level * 350 + 300);
  }
  function finish(num, mine) {
    var emoji, title, desc;
    if (best >= 11) { emoji = '🧠'; title = '기억력 천재급'; desc = '일반적으로 알려진 평균(약 7자리 안팎)을 크게 넘는 기록이에요.'; }
    else if (best >= 9) { emoji = '🏆'; title = '기억력 상위권'; desc = '평균보다 훨씬 좋은 기록이에요. 집중을 아주 잘했어요.'; }
    else if (best >= 7) { emoji = '😎'; title = '평균 이상'; desc = '짧은 숫자를 기억하는 평균 범위(7±2자리)에 들어요.'; }
    else if (best >= 5) { emoji = '🙂'; title = '평균 범위'; desc = '컨디션과 집중에 따라 쉽게 좋아질 수 있어요.'; }
    else { emoji = '🌱'; title = '워밍업 필요'; desc = '처음엔 누구나 낯설어요. 숫자를 끊어서(예: 3-3-2) 묶어 외워보세요.'; }
    box.innerHTML = '<div style="font-size:3rem">' + emoji + '</div><div class="result-title">' + title + '</div><p class="result-desc">최고 <b>' + best + '자리</b> 성공<br>마지막 문제: ' + num + ' (내 답: ' + (mine || '-') + ')<br>' + desc + '</p><button class="btn btn-secondary" id="nmRetry">🔄 다시 하기</button>';
    window.QUIZ_RESULT_SUMMARY = emoji + ' 숫자 기억력 ' + best + '자리';
    document.getElementById('nmRetry').addEventListener('click', intro);
    if (window.gtag) gtag('event', 'game_result', { test: 'memory', best: best });
  }
  intro();
})();
