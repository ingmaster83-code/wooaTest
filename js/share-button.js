/**
 * 결과 화면의 "공유하기" 버튼 공용 핸들러.
 * 각 테스트 엔진이 결과가 확정되면 history.replaceState로 현재 URL에 결과를 담아두고,
 * window.QUIZ_RESULT_SUMMARY에 내 결과 한 줄 요약을 남긴다 (엔진별 renderResult에서 설정).
 * 이 요약을 공유 텍스트에 넣어야 카톡 등에 붙여넣었을 때 "나 이렇게 나왔어" 느낌이 산다.
 */
(function () {
  function getTestName() {
    var h1 = document.querySelector('.hero h1');
    if (h1) return h1.textContent.trim();
    return document.title.split(' - ')[0].split(' | ')[0].trim();
  }

  function buildShareText() {
    var name = getTestName();
    var summary = window.QUIZ_RESULT_SUMMARY;
    if (summary) {
      return '[' + name + '] 내 결과: ' + summary + '\n나도 해보러 가기 →';
    }
    return name + ' 해보러 가기 →';
  }

  function init() {
    var btn = document.getElementById('quizShareBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var url = location.href;
      var text = buildShareText();
      if (navigator.share) {
        navigator.share({ title: getTestName(), text: text, url: url }).catch(function () {});
        return;
      }
      var payload = text + '\n' + url;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payload).then(function () {
          var orig = btn.textContent;
          btn.textContent = '✅ 복사 완료! 붙여넣기 해보세요';
          setTimeout(function () { btn.textContent = orig; }, 1800);
        }).catch(function () {
          prompt('아래 내용을 복사하세요', payload);
        });
        return;
      }
      prompt('아래 내용을 복사하세요', payload);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
