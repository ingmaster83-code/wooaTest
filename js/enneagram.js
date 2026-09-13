/**
 * 에니어그램 성격 테스트 엔진
 * 유형별 4문항씩 총 36문항, 각 문항에 "그렇다/아니다"로 답하고 "그렇다" 개수가 가장 많은 유형이 결과가 된다.
 */
(function () {
  var QUESTIONS = [
    { type: 1, text: '보고서에 오타 하나 있으면 다른 건 다 좋아도 계속 눈에 밟힌다.' },
    { type: 1, text: '새치기하는 사람을 보면 그냥 못 넘어가고 한마디 하고 싶어진다.' },
    { type: 1, text: '작은 실수 하나에도 며칠 동안 자책하게 된다.' },
    { type: 1, text: '물건 정리든 일처리든, 나만의 "이렇게 해야 맞다"는 기준이 확실하다.' },

    { type: 2, text: '친구 표정이 조금만 안 좋아도 "무슨 일 있어?"부터 물어본다.' },
    { type: 2, text: '누가 나한테 의지할 때 묘하게 뿌듯함을 느낀다.' },
    { type: 2, text: '남의 부탁을 먼저 들어주다가 정작 내 할 일을 놓칠 때가 있다.' },
    { type: 2, text: '누군가 나를 서운해하면 그날 하루가 다 신경 쓰인다.' },

    { type: 3, text: '목표를 세우면 그걸 이룰 때까지 머릿속에서 안 떠난다.' },
    { type: 3, text: '일을 못한다는 평가를 받는 건 상상만 해도 싫다.' },
    { type: 3, text: '게임이든 뭐든 지고 있으면 갑자기 진지해진다.' },
    { type: 3, text: '노력했어도 결과가 안 나오면 스스로 인정을 못 한다.' },

    { type: 4, text: '다들 좋다는 것도 나한테는 왠지 안 끌릴 때가 많다.' },
    { type: 4, text: '노래 하나에 감정이 훅 올라왔다가 훅 가라앉는다.' },
    { type: 4, text: '무리에 있어도 나만 다른 세상에 있는 느낌이 들 때가 있다.' },
    { type: 4, text: '가사나 영상 하나에 꽂히면 하루 종일 그 생각만 한다.' },

    { type: 5, text: '관심 생긴 주제는 새벽까지 파도 안 질린다.' },
    { type: 5, text: '감정 얘기보다 사실과 정보로 대화하는 게 훨씬 편하다.' },
    { type: 5, text: '모임에 가면 끼어들기보다 한 발 물러서서 지켜보게 된다.' },
    { type: 5, text: '궁금한 게 생기면 완전히 이해될 때까지 검색을 멈추지 못한다.' },

    { type: 6, text: '여행 가기 전에 온갖 최악의 상황부터 시뮬레이션해본다.' },
    { type: 6, text: '새로운 사람보다 오래 믿어온 사람이 훨씬 편하다.' },
    { type: 6, text: '중요한 결정 앞에서는 몇 번이고 다시 확인해야 마음이 놓인다.' },
    { type: 6, text: '"어떻게 될지 모른다"는 상황 자체가 스트레스다.' },

    { type: 7, text: '다음엔 또 뭐 재밌는 거 없나 항상 찾아보게 된다.' },
    { type: 7, text: '우울해지려고 하면 얼른 다른 재밌는 걸로 넘어가버린다.' },
    { type: 7, text: '한 가지만 오래 하면 금방 다른 게 궁금해진다.' },
    { type: 7, text: '지루한 순간이 오면 나도 모르게 딴짓을 시작한다.' },

    { type: 8, text: '일이 내 손을 벗어나 돌아가면 답답해서 못 견딘다.' },
    { type: 8, text: '힘들어도 티 내는 것보다 혼자 버티는 게 낫다고 생각한다.' },
    { type: 8, text: '누가 억울한 일 당하는 걸 보면 나도 모르게 나서게 된다.' },
    { type: 8, text: '말투가 세다는 얘기를 종종 듣는다.' },

    { type: 9, text: '누가 싸우려고 하면 일단 말리고 보는 편이다.' },
    { type: 9, text: '"아무거나 괜찮아"라는 말을 자주 하게 된다.' },
    { type: 9, text: '다 같이 편안한 분위기면 그것만으로도 만족스럽다.' },
    { type: 9, text: '속으론 다른 생각이 있어도 굳이 말 안 하고 넘어갈 때가 많다.' }
  ];

  var RESULTS = {
    1: { emoji: '⚖️', title: '1번 유형 · 개혁가', desc: '원칙과 기준이 뚜렷하고, 무엇이든 제대로 해내고 싶어하는 타입이에요. 스스로에게 엄격한 만큼 신뢰할 수 있는 사람이라는 평가를 받아요.', strengths: [{ h: '이런 강점이 있어요', p: '높은 책임감, 정확함, 옳은 일을 하려는 곧은 신념' }], growth: { h: '이럴 때 조심하세요', p: '완벽에 대한 기준이 너무 높아 스스로를 지치게 할 수 있어요' } },
    2: { emoji: '💗', title: '2번 유형 · 조력가', desc: '주변 사람들을 살피고 먼저 도움의 손길을 내미는 타입이에요. 따뜻한 마음으로 관계 속에서 의미를 찾아요.', strengths: [{ h: '이런 강점이 있어요', p: '따뜻한 배려심, 뛰어난 공감력, 헌신적인 태도' }], growth: { h: '이럴 때 조심하세요', p: '남을 챙기다 정작 자기 자신의 욕구를 놓칠 수 있어요' } },
    3: { emoji: '🏆', title: '3번 유형 · 성취자', desc: '목표를 세우면 반드시 이뤄내는 추진력 있는 타입이에요. 성과와 인정을 통해 스스로의 가치를 확인해요.', strengths: [{ h: '이런 강점이 있어요', p: '강한 목표의식, 뛰어난 실행력, 상황에 맞는 유연한 대처' }], growth: { h: '이럴 때 조심하세요', p: '성과에만 집착하다 정작 자신의 감정을 돌보지 못할 수 있어요' } },
    4: { emoji: '🎭', title: '4번 유형 · 개인주의자', desc: '풍부한 감성과 자기만의 색깔을 가진 타입이에요. 남들과 다른 특별함을 소중히 여기고 깊은 감정을 느껴요.', strengths: [{ h: '이런 강점이 있어요', p: '풍부한 감수성, 독창적인 시각, 진정성 있는 표현력' }], growth: { h: '이럴 때 조심하세요', p: '감정 기복이 크거나, 남들과 비교하며 우울해질 수 있어요' } },
    5: { emoji: '🔍', title: '5번 유형 · 탐구자', desc: '깊이 있게 관찰하고 분석하는 걸 좋아하는 타입이에요. 혼자만의 시간 속에서 지식과 통찰을 쌓아가요.', strengths: [{ h: '이런 강점이 있어요', p: '깊은 통찰력, 객관적인 시각, 독립적인 사고력' }], growth: { h: '이럴 때 조심하세요', p: '생각에만 머물다 실제 행동이나 관계에서 거리를 둘 수 있어요' } },
    6: { emoji: '🛡️', title: '6번 유형 · 충성가', desc: '신중하게 상황을 살피고 안전을 중요하게 여기는 타입이에요. 믿을 수 있는 사람, 안정적인 관계를 소중히 여겨요.', strengths: [{ h: '이런 강점이 있어요', p: '신중한 판단력, 위기 대비 능력, 관계에 대한 성실함' }], growth: { h: '이럴 때 조심하세요', p: '불안이 커지면 결정을 계속 미루거나 걱정에 휩싸일 수 있어요' } },
    7: { emoji: '🎈', title: '7번 유형 · 열정가', desc: '늘 새로운 경험과 즐거움을 찾아다니는 밝은 에너지의 타입이에요. 긍정적인 태도로 삶을 다채롭게 만들어가요.', strengths: [{ h: '이런 강점이 있어요', p: '넘치는 호기심, 긍정적인 에너지, 뛰어난 순발력' }], growth: { h: '이럴 때 조심하세요', p: '힘든 감정을 회피하다 정작 마주해야 할 문제를 미룰 수 있어요' } },
    8: { emoji: '🦁', title: '8번 유형 · 도전자', desc: '강하고 주도적으로 상황을 이끄는 타입이에요. 부당한 일에 목소리를 내는 정의로운 면모가 있어요.', strengths: [{ h: '이런 강점이 있어요', p: '강한 추진력, 확실한 자기주장, 약자를 보호하려는 의리' }], growth: { h: '이럴 때 조심하세요', p: '너무 강하게 밀어붙이다 주변 사람이 부담을 느낄 수 있어요' } },
    9: { emoji: '🕊️', title: '9번 유형 · 평화주의자', desc: '온화하고 조화로운 분위기를 만드는 타입이에요. 갈등보다는 평화를 택하며 주변을 편안하게 해줘요.', strengths: [{ h: '이런 강점이 있어요', p: '뛰어난 포용력, 안정적인 태도, 사람들을 편안하게 하는 힘' }], growth: { h: '이럴 때 조심하세요', p: '갈등을 피하려다 자기 의견을 말하지 못하고 참을 수 있어요' } }
  };

  var state = { idx: 0, counts: {} };

  // 문항마다 실제 페이지 이동(?q=N)으로 진행 — [[wooagosa_segment_reload_removed]] 참고
  var STORAGE_KEY = 'quiz_progress_' + location.pathname;

  function saveState() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function loadState() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function goToQuestionPage(idx) {
    var url = new URL(location.href);
    url.searchParams.set('q', String(idx + 1));
    location.href = url.toString();
  }

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
    el.choiceA.textContent = '그렇다';
    el.choiceB.textContent = '아니다';
    el.progressFill.style.width = Math.round((state.idx / QUESTIONS.length) * 100) + '%';
    el.progressLabel.textContent = (state.idx + 1) + ' / ' + QUESTIONS.length;
    el.backBtn.disabled = state.idx === 0;
  }

  function answer(isYes) {
    state.history[state.idx] = isYes;
    if (isYes) state.counts[QUESTIONS[state.idx].type]++;
    state.idx++;
    if (state.idx >= QUESTIONS.length) {
      finish();
    } else {
      saveState();
      goToQuestionPage(state.idx);
    }
  }

  function goBack() {
    if (state.idx === 0) return;
    state.idx--;
    var wasYes = state.history[state.idx];
    if (wasYes) state.counts[QUESTIONS[state.idx].type]--;
    saveState();
    goToQuestionPage(state.idx);
  }

  function finish() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    var bestType = 1, bestCount = -1;
    for (var t = 1; t <= 9; t++) {
      if (state.counts[t] > bestCount) { bestCount = state.counts[t]; bestType = t; }
    }
    renderResult(bestType);
    showScreen('result');
    try {
      var url = new URL(location.href);
      url.searchParams.delete('q');
      url.searchParams.set('type', bestType);
      history.replaceState(null, '', url.toString());
    } catch (e) {}
    if (window.gtag) gtag('event', 'quiz_result', { test: '에니어그램', type: bestType });
  }

  function renderResult(type) {
    var r = RESULTS[type];
    el.resultArea.innerHTML =
      '<div class="result-emoji">' + r.emoji + '</div>' +
      '<div class="result-title">' + r.title + '</div>' +
      '<p class="result-desc">' + r.desc + '</p>' +
      '<div class="result-trait-grid">' +
      r.strengths.map(function (s) { return '<div class="result-trait-card"><h4>' + s.h + '</h4><p>' + s.p + '</p></div>'; }).join('') +
      '<div class="result-trait-card"><h4>' + r.growth.h + '</h4><p>' + r.growth.p + '</p></div>' +
      '</div>';
  }

  function start() {
    state = { idx: 0, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }, history: [] };
    saveState();
    goToQuestionPage(0);
  }

  function retry() { showScreen('start'); }

  el.startBtn.addEventListener('click', start);
  el.choiceA.addEventListener('click', function () { answer(true); });
  el.choiceB.addEventListener('click', function () { answer(false); });
  el.backBtn.addEventListener('click', goBack);
  if (el.retryBtn) el.retryBtn.addEventListener('click', retry);

  try {
    var params = new URLSearchParams(location.search);
    if (params.has('q')) {
      // 문제 버튼(다음/이전)으로 이동해온 재방문 — 조용히 해당 문항부터 이어서 진행
      var saved = loadState();
      if (saved && saved.idx < QUESTIONS.length) {
        state = saved;
        showScreen('quiz');
        renderQuestion();
      } else {
        showScreen('start');
      }
    } else {
      var t = parseInt(params.get('type'), 10);
      if (RESULTS[t]) {
        renderResult(t);
        showScreen('result');
      }
    }
  } catch (e) {}
})();
