/**
 * 정답형 퀴즈 공용 엔진 (IQ·논리 / 신조어 / 맞춤법 / 사자성어 등)
 * window.QUIZ_CONFIG = {
 *   meta: { name },
 *   questions: [{ text, options: [..], answer: <index>, explain }],
 *   bands: [{ max, emoji, title, desc, tip }],      // max = 맞힌 개수 상한, 오름차순, 마지막 99999
 * } 를 채우고 이 스크립트를 로드한다.
 * 문항마다 실제 페이지 이동(?q=N)으로 진행 — [[wooagosa_segment_reload_removed]] 패턴과 동일.
 */
(function () {
  var cfg = window.QUIZ_CONFIG;
  if (!cfg) return;
  var QS = cfg.questions;
  var state = { idx: 0, answers: [] };
  var STORAGE_KEY = 'quiz_progress_' + location.pathname;

  function saveState() { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {} }
  function loadState() { try { var r = sessionStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function goToQuestionPage(idx) {
    var url = new URL(location.href);
    url.searchParams.set('q', String(idx + 1));
    location.href = url.toString();
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var el = {
    start: document.getElementById('quizStart'),
    quiz: document.getElementById('quizQuestion'),
    result: document.getElementById('quizResult'),
    startBtn: document.getElementById('quizStartBtn'),
    progressFill: document.getElementById('quizProgressFill'),
    progressLabel: document.getElementById('quizProgressLabel'),
    questionText: document.getElementById('quizQuestionText'),
    choices: document.getElementById('quizChoicesList'),
    backBtn: document.getElementById('quizBackBtn'),
    resultArea: document.getElementById('quizResultArea'),
    retryBtn: document.getElementById('quizRetryBtn')
  };
  if (!el.start) return;

  function showScreen(name) {
    el.start.style.display = name === 'start' ? 'block' : 'none';
    el.quiz.style.display = name === 'quiz' ? 'block' : 'none';
    el.result.style.display = name === 'result' ? 'block' : 'none';
  }

  function renderQuestion() {
    var q = QS[state.idx];
    el.questionText.textContent = q.text;
    el.progressFill.style.width = Math.round((state.idx / QS.length) * 100) + '%';
    el.progressLabel.textContent = (state.idx + 1) + ' / ' + QS.length;
    el.backBtn.disabled = state.idx === 0;
    el.choices.innerHTML = q.options.map(function (label, i) {
      return '<button class="quiz-choice-btn" data-v="' + i + '">' + esc(label) + '</button>';
    }).join('');
    Array.prototype.forEach.call(el.choices.querySelectorAll('.quiz-choice-btn'), function (btn) {
      btn.addEventListener('click', function () { answer(parseInt(btn.dataset.v, 10)); });
    });
  }

  function answer(v) {
    state.answers.push(v);
    state.idx++;
    if (state.idx >= QS.length) { finish(); } else { saveState(); goToQuestionPage(state.idx); }
  }

  function goBack() {
    if (state.idx === 0) return;
    state.answers.pop();
    state.idx--;
    saveState();
    goToQuestionPage(state.idx);
  }

  function bandOf(score) {
    return cfg.bands.find(function (b) { return score <= b.max; }) || cfg.bands[cfg.bands.length - 1];
  }

  function renderResult(score, answers) {
    var band = bandOf(score);
    window.QUIZ_RESULT_SUMMARY = band.emoji + ' ' + band.title + ' (' + score + '/' + QS.length + ')';
    var html =
      '<div class="result-emoji">' + band.emoji + '</div>' +
      '<div class="result-type-label">' + esc(cfg.meta.name) + ' 결과</div>' +
      '<div class="result-title">' + esc(band.title) + '</div>' +
      '<p style="color:var(--purple-dk);font-weight:800;margin:-.4rem 0 1rem;">' + score + ' / ' + QS.length + ' 정답</p>' +
      '<p class="result-desc">' + esc(band.desc) + '</p>';
    if (band.tip) {
      html += '<div class="result-trait-grid"><div class="result-trait-card"><h4>💡 한마디</h4><p>' + esc(band.tip) + '</p></div></div>';
    }
    if (answers) {
      var wrong = [];
      QS.forEach(function (q, i) { if (answers[i] !== q.answer) wrong.push(i); });
      if (wrong.length) {
        html += '<div class="result-trait-grid" style="margin-top:1rem;text-align:left;">';
        html += '<div class="result-trait-card" style="grid-column:1/-1"><h4>❌ 틀린 문제 해설 (' + wrong.length + '개)</h4></div>';
        wrong.slice(0, 12).forEach(function (i) {
          var q = QS[i];
          html += '<div class="result-trait-card" style="grid-column:1/-1"><h4>Q' + (i + 1) + '. ' + esc(q.text) + '</h4>' +
            '<p>내 답: ' + esc(q.options[answers[i]] === undefined ? '-' : q.options[answers[i]]) + ' → 정답: <b>' + esc(q.options[q.answer]) + '</b>' +
            (q.explain ? '<br>' + esc(q.explain) : '') + '</p></div>';
        });
        if (wrong.length > 12) html += '<div class="result-trait-card" style="grid-column:1/-1"><p>그 밖에 ' + (wrong.length - 12) + '개를 더 틀렸어요.</p></div>';
        html += '</div>';
      }
    }
    el.resultArea.innerHTML = html;
  }

  function finish() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    var score = 0;
    QS.forEach(function (q, i) { if (state.answers[i] === q.answer) score++; });
    renderResult(score, state.answers);
    showScreen('result');
    try {
      var url = new URL(location.href);
      url.searchParams.delete('q');
      url.searchParams.set('score', score);
      history.replaceState(null, '', url.toString());
    } catch (e) {}
    if (window.gtag) gtag('event', 'quiz_result', { test: cfg.meta.name, score: score });
  }

  function start() { state = { idx: 0, answers: [] }; saveState(); goToQuestionPage(0); }
  function retry() { showScreen('start'); }

  el.startBtn.addEventListener('click', start);
  el.backBtn.addEventListener('click', goBack);
  if (el.retryBtn) el.retryBtn.addEventListener('click', retry);

  try {
    var params = new URLSearchParams(location.search);
    if (params.has('q')) {
      var saved = loadState();
      if (saved && saved.idx < QS.length) { state = saved; showScreen('quiz'); renderQuestion(); } else { showScreen('start'); }
    } else if (params.has('score')) {
      var s = parseInt(params.get('score'), 10);
      if (!isNaN(s)) { renderResult(s, null); showScreen('result'); }
    }
  } catch (e) {}
})();
