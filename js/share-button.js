/**
 * 결과 화면의 "공유하기" 버튼 공용 핸들러.
 * 각 테스트 엔진이 결과가 확정되면 history.replaceState로 현재 URL에 결과를 담아두므로,
 * 이 버튼은 그냥 현재 페이지 URL을 공유/복사하기만 하면 된다.
 */
(function () {
  function init() {
    var btn = document.getElementById('quizShareBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var url = location.href;
      var title = document.title;
      if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {});
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          var orig = btn.textContent;
          btn.textContent = '✅ 링크 복사됨!';
          setTimeout(function () { btn.textContent = orig; }, 1800);
        }).catch(function () {
          prompt('아래 링크를 복사하세요', url);
        });
        return;
      }
      prompt('아래 링크를 복사하세요', url);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
