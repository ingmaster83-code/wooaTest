/**
 * 축-조합형 테스트 공용 엔진 (MBTI 이상형 / 동물상 / 관상 등)
 * 페이지에서 window.QUIZ_CONFIG = { meta, questions, results, resultTitleLabel } 를 채우고 이 스크립트를 로드한다.
 * questions: [{ axis, text, a, b, av, bv }, ...]
 * results:   { CODE: { emoji, title, tagline, desc, strengths:[{h,p}], growth:{h,p}, match } }
 */
(function () {
  var cfg = window.QUIZ_CONFIG;
  if (!cfg) return;

  var QUESTIONS = cfg.questions;
  var RESULTS = cfg.results;

  var axisOrder = [];
  var axisLetters = {};
  QUESTIONS.forEach(function (q) {
    if (axisLetters[q.axis] === undefined) {
      axisOrder.push(q.axis);
      axisLetters[q.axis] = [q.av, q.bv];
    }
  });

  var counts = {};
  QUESTIONS.forEach(function (q) { counts[q.av] = 0; counts[q.bv] = 0; });

  var state = { idx: 0, counts: null, history: [] };

  var el = {
    start: document.getElementById('quizStart'),
    quiz: document.getElementById('quizQuestion'),
    result: document.getElementById('quizResult'),
    startBtn: document.getElementById('quizStartBtn'),
    progressFill: document.getElementById('quizProgressFill'),
    progressLabel: document.getElementById('quizProgressLabel'),
    questionText: document.getElementById('quizQuestionText'),
    choiceA: document.getElementById('quizChoiceA'),
    choiceB: document.getElementById('quizChoiceB'),
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
    var q = QUESTIONS[state.idx];
    el.questionText.textContent = q.text;
    el.choiceA.textContent = q.a;
    el.choiceB.textContent = q.b;
    el.progressFill.style.width = Math.round((state.idx / QUESTIONS.length) * 100) + '%';
    el.progressLabel.textContent = (state.idx + 1) + ' / ' + QUESTIONS.length;
    el.backBtn.disabled = state.idx === 0;
  }

  function answer(letter) {
    state.counts[letter]++;
    state.history.push(letter);
    state.idx++;
    if (state.idx >= QUESTIONS.length) {
      finish();
    } else {
      renderQuestion();
    }
  }

  function goBack() {
    if (state.idx === 0) return;
    var last = state.history.pop();
    state.counts[last]--;
    state.idx--;
    renderQuestion();
  }

  function computeCode() {
    return axisOrder.map(function (axis) {
      var pair = axisLetters[axis];
      return state.counts[pair[0]] >= state.counts[pair[1]] ? pair[0] : pair[1];
    }).join('');
  }

  function finish() {
    var code = computeCode();
    renderResult(code);
    showScreen('result');
    try {
      var url = new URL(location.href);
      url.searchParams.set('type', code);
      history.replaceState(null, '', url.toString());
    } catch (e) {}
    if (window.gtag) gtag('event', 'quiz_result', { test: cfg.meta.name, type: code });
  }

  function renderResult(code) {
    var r = RESULTS[code];
    if (!r) { el.resultArea.innerHTML = '<p>결과를 계산할 수 없습니다. 다시 시도해주세요.</p>'; return; }
    var traitCards = (r.strengths || []).map(function (s) {
      return '<div class="result-trait-card"><h4>' + s.h + '</h4><p>' + s.p + '</p></div>';
    }).join('');
    var growthCard = r.growth ? '<div class="result-trait-card"><h4>' + r.growth.h + '</h4><p>' + r.growth.p + '</p></div>' : '';
    var matchCard = r.match ? '<div class="result-trait-card"><h4>💜 ' + (cfg.matchLabel || '잘 맞는 유형') + '</h4><p>' + r.match + '</p></div>' : '';
    el.resultArea.innerHTML =
      '<div class="result-emoji">' + r.emoji + '</div>' +
      '<div class="result-type-label">' + (cfg.resultTitleLabel ? cfg.resultTitleLabel(code) : code) + '</div>' +
      '<div class="result-title">' + r.title + '</div>' +
      (r.tagline ? '<p style="color:var(--purple-dk);font-weight:700;margin:-.5rem 0 1rem;">' + r.tagline + '</p>' : '') +
      '<p class="result-desc">' + r.desc + '</p>' +
      '<div class="result-trait-grid">' + traitCards + growthCard + matchCard + '</div>';
  }

  function start() {
    state = { idx: 0, counts: {}, history: [] };
    QUESTIONS.forEach(function (q) { state.counts[q.av] = 0; state.counts[q.bv] = 0; });
    showScreen('quiz');
    renderQuestion();
  }

  function retry() { showScreen('start'); }

  el.startBtn.addEventListener('click', start);
  el.choiceA.addEventListener('click', function () { answer(QUESTIONS[state.idx].av); });
  el.choiceB.addEventListener('click', function () { answer(QUESTIONS[state.idx].bv); });
  el.backBtn.addEventListener('click', goBack);
  if (el.retryBtn) el.retryBtn.addEventListener('click', retry);

  try {
    var params = new URLSearchParams(location.search);
    var t = (params.get('type') || '').toUpperCase();
    if (RESULTS[t]) {
      renderResult(t);
      showScreen('result');
    }
  } catch (e) {}
})();
