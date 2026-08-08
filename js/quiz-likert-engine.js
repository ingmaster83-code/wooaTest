/**
 * 척도(Likert)형 테스트 공용 엔진 (Big5 / 번아웃 / ADHD / 우울증 등)
 * window.QUIZ_CONFIG = {
 *   meta, mode: 'traits'|'band',
 *   scaleLabels: ['전혀 아니다', ...], scaleValues: [0,1,2,3],
 *   items: [{ text, trait, reverse }],
 *   traits: { key: { name, icon, low, high } },   // mode:'traits'
 *   bands: [{ max, title, emoji, desc, tip }],     // mode:'band', 오름차순, 마지막 max:Infinity
 * } 를 채우고 이 스크립트를 로드한다.
 */
(function () {
  var cfg = window.QUIZ_CONFIG;
  if (!cfg) return;

  var ITEMS = cfg.items;
  var SCALE = cfg.scaleLabels;
  var VALUES = cfg.scaleValues;

  var state = { idx: 0, answers: [] };

  var el = {
    start: document.getElementById('quizStart'),
    quiz: document.getElementById('quizQuestion'),
    result: document.getElementById('quizResult'),
    startBtn: document.getElementById('quizStartBtn'),
    progressFill: document.getElementById('quizProgressFill'),
    progressLabel: document.getElementById('quizProgressLabel'),
    questionText: document.getElementById('quizQuestionText'),
    choices: document.getElementById('quizChoicesScale'),
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
    var it = ITEMS[state.idx];
    el.questionText.textContent = it.text;
    el.progressFill.style.width = Math.round((state.idx / ITEMS.length) * 100) + '%';
    el.progressLabel.textContent = (state.idx + 1) + ' / ' + ITEMS.length;
    el.backBtn.disabled = state.idx === 0;
    el.choices.innerHTML = SCALE.map(function (label, i) {
      return '<button class="quiz-choice-btn" data-v="' + i + '">' + label + '</button>';
    }).join('');
    Array.prototype.forEach.call(el.choices.querySelectorAll('.quiz-choice-btn'), function (btn) {
      btn.addEventListener('click', function () { answer(parseInt(btn.dataset.v, 10)); });
    });
  }

  function answer(valueIdx) {
    state.answers.push(valueIdx);
    state.idx++;
    if (state.idx >= ITEMS.length) {
      finish();
    } else {
      renderQuestion();
    }
  }

  function goBack() {
    if (state.idx === 0) return;
    state.answers.pop();
    state.idx--;
    renderQuestion();
  }

  function scoreOf(itemIdx) {
    var it = ITEMS[itemIdx];
    var raw = VALUES[state.answers[itemIdx]];
    if (it.reverse) {
      var maxV = VALUES[VALUES.length - 1];
      var minV = VALUES[0];
      raw = maxV + minV - raw;
    }
    return raw;
  }

  function finish() {
    if (cfg.mode === 'traits') {
      var pctMap = computeTraitPercents();
      renderTraitResult(pctMap);
      try {
        var url1 = new URL(location.href);
        Object.keys(pctMap).forEach(function (key) { url1.searchParams.set(key, pctMap[key]); });
        history.replaceState(null, '', url1.toString());
      } catch (e) {}
    } else {
      var total = computeTotal();
      renderBandResult(total);
      try {
        var url2 = new URL(location.href);
        url2.searchParams.set('score', total);
        history.replaceState(null, '', url2.toString());
      } catch (e) {}
    }
    showScreen('result');
    if (window.gtag) gtag('event', 'quiz_result', { test: cfg.meta.name });
  }

  function computeTraitPercents() {
    var maxV = VALUES[VALUES.length - 1];
    var minV = VALUES[0];
    var traitScores = {};
    var traitCounts = {};
    ITEMS.forEach(function (it, i) {
      traitScores[it.trait] = (traitScores[it.trait] || 0) + scoreOf(i);
      traitCounts[it.trait] = (traitCounts[it.trait] || 0) + 1;
    });
    var pctMap = {};
    Object.keys(cfg.traits).forEach(function (key) {
      var avg = traitScores[key] / traitCounts[key];
      pctMap[key] = Math.round(((avg - minV) / (maxV - minV)) * 100);
    });
    return pctMap;
  }

  function computeTotal() {
    var total = 0;
    ITEMS.forEach(function (it, i) { total += scoreOf(i); });
    return total;
  }

  function renderTraitResult(pctMap) {
    var html = '<div class="result-emoji">📊</div><div class="result-title">' + cfg.meta.resultTitle + '</div>';
    html += '<div style="max-width:480px;margin:1.25rem auto 0;text-align:left;">';
    Object.keys(cfg.traits).forEach(function (key) {
      var t = cfg.traits[key];
      var pct = pctMap[key];
      var desc = pct >= 55 ? t.high : t.low;
      html +=
        '<div style="margin-bottom:1.1rem;">' +
        '<div style="display:flex;justify-content:space-between;font-size:.88rem;font-weight:700;color:var(--navy);margin-bottom:.3rem;"><span>' + t.icon + ' ' + t.name + '</span><span>' + pct + '%</span></div>' +
        '<div class="quiz-progress-track" style="margin-bottom:.4rem;"><div class="quiz-progress-fill" style="width:' + pct + '%;"></div></div>' +
        '<p style="font-size:.85rem;color:var(--text-mid);margin:0;">' + desc + '</p>' +
        '</div>';
    });
    html += '</div>';
    el.resultArea.innerHTML = html;
  }

  function renderBandResult(total) {
    var band = cfg.bands.find(function (b) { return total <= b.max; }) || cfg.bands[cfg.bands.length - 1];
    el.resultArea.innerHTML =
      '<div class="result-emoji">' + band.emoji + '</div>' +
      '<div class="result-title">' + band.title + '</div>' +
      '<p class="result-desc">' + band.desc + '</p>' +
      (band.tip ? '<div class="result-trait-grid"><div class="result-trait-card"><h4>💡 이럴 때 도움이 돼요</h4><p>' + band.tip + '</p></div></div>' : '');
  }

  function start() {
    state = { idx: 0, answers: [] };
    showScreen('quiz');
    renderQuestion();
  }

  function retry() { showScreen('start'); }

  el.startBtn.addEventListener('click', start);
  el.backBtn.addEventListener('click', goBack);
  if (el.retryBtn) el.retryBtn.addEventListener('click', retry);

  try {
    var params = new URLSearchParams(location.search);
    if (cfg.mode === 'traits') {
      var keys = Object.keys(cfg.traits);
      var allPresent = keys.every(function (k) { return params.has(k); });
      if (allPresent) {
        var pctMap = {};
        keys.forEach(function (k) { pctMap[k] = parseInt(params.get(k), 10); });
        renderTraitResult(pctMap);
        showScreen('result');
      }
    } else if (params.has('score')) {
      var total = parseInt(params.get('score'), 10);
      if (!isNaN(total)) {
        renderBandResult(total);
        showScreen('result');
      }
    }
  } catch (e) {}
})();
