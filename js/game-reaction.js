/* 반응속도 테스트 — 5회 평균. 화면이 초록색으로 바뀌면 최대한 빨리 클릭 */
(function () {
  var root = document.getElementById('gameRoot');
  if (!root) return;
  var ROUNDS = 5, times = [], state = 'idle', timer = null, t0 = 0;
  root.innerHTML = '<div id="rtPad" style="user-select:none;cursor:pointer;border-radius:16px;padding:3.5rem 1rem;text-align:center;color:#fff;font-weight:800;font-size:1.3rem;background:#7C3AED;min-height:180px;display:flex;align-items:center;justify-content:center;flex-direction:column;"></div><p id="rtLog" style="text-align:center;color:var(--text-mid);margin:.75rem 0 0;font-size:.9rem;"></p><div id="rtResult"></div>';
  var pad = document.getElementById('rtPad'), log = document.getElementById('rtLog'), res = document.getElementById('rtResult');
  function set(bg, html) { pad.style.background = bg; pad.innerHTML = html; }
  function idle() { state = 'idle'; set('#7C3AED', '<div>⚡ 반응속도 테스트</div><div style="font-size:.95rem;font-weight:500;margin-top:.5rem;">클릭해서 시작 (총 ' + ROUNDS + '회)</div>'); log.textContent = ''; }
  function wait() {
    state = 'wait';
    set('#DC2626', '<div>🔴 기다리세요…</div><div style="font-size:.95rem;font-weight:500;margin-top:.5rem;">초록색이 되면 바로 클릭!</div>');
    timer = setTimeout(function () { state = 'go'; t0 = performance.now(); set('#16A34A', '<div>🟢 지금 클릭!</div>'); }, 1500 + Math.random() * 2500);
  }
  function finish() {
    state = 'done';
    var sum = 0; times.forEach(function (t) { sum += t; });
    var avg = Math.round(sum / times.length), best = Math.min.apply(null, times);
    var emoji, title, desc;
    if (avg < 200) { emoji = '⚡'; title = '번개 반응'; desc = '일반적으로 알려진 평균(약 250ms)보다 훨씬 빠른 편이에요.'; }
    else if (avg < 250) { emoji = '🏎️'; title = '빠른 반응'; desc = '평균보다 빠른 편이에요. 집중이 잘 된 상태예요.'; }
    else if (avg < 300) { emoji = '🙂'; title = '평균적인 반응'; desc = '일반적인 사람의 반응속도 범위 안이에요.'; }
    else if (avg < 400) { emoji = '🐢'; title = '느긋한 반응'; desc = '기기·화면 지연이나 컨디션 영향일 수 있어요. 한 번 더 해보세요.'; }
    else { emoji = '😴'; title = '졸린 반응'; desc = '피곤하거나 집중이 흐트러진 상태일 수 있어요. 잠깐 쉬고 다시 해보세요.'; }
    set('#7C3AED', '<div style="font-size:2.5rem">' + emoji + '</div><div>' + avg + 'ms</div>');
    log.textContent = '';
    res.innerHTML = '<div class="result-box" style="margin-top:1rem"><div class="result-title">' + title + '</div><p class="result-desc">' + desc + '<br>평균 <b>' + avg + 'ms</b> · 최고 <b>' + best + 'ms</b> · 기록: ' + times.join(', ') + 'ms</p><button class="btn btn-secondary" id="rtRetry">🔄 다시 하기</button></div>';
    window.QUIZ_RESULT_SUMMARY = emoji + ' 반응속도 ' + avg + 'ms';
    document.getElementById('rtRetry').addEventListener('click', function () { times = []; res.innerHTML = ''; idle(); });
    if (window.gtag) gtag('event', 'game_result', { test: 'reaction', avg: avg });
  }
  pad.addEventListener('click', function () {
    if (state === 'idle') { times = []; res.innerHTML = ''; wait(); }
    else if (state === 'wait') { clearTimeout(timer); state = 'early'; set('#F59E0B', '<div>⚠️ 너무 빨랐어요!</div><div style="font-size:.95rem;font-weight:500;margin-top:.5rem;">클릭해서 이번 회차를 다시 시작</div>'); }
    else if (state === 'early') { wait(); }
    else if (state === 'go') {
      var ms = Math.round(performance.now() - t0);
      times.push(ms);
      log.textContent = times.length + '회차: ' + ms + 'ms';
      if (times.length >= ROUNDS) { finish(); } else { state = 'between'; set('#7C3AED', '<div>' + ms + 'ms</div><div style="font-size:.95rem;font-weight:500;margin-top:.5rem;">클릭해서 다음 회차 (' + times.length + '/' + ROUNDS + ')</div>'); }
    } else if (state === 'between') { wait(); }
  });
  idle();
})();
