# wooaTest 프로젝트 지침

## 프로젝트 개요
- **사이트명:** 우아테스트 (WooaTest)
- **URL:** https://wooatest.wooahouse.com
- **배포:** GitHub Pages

## 기술 스택
- 순수 HTML / CSS / JS (프레임워크 없음), EN 페이지 없음 (KO only)
- 퀴즈 엔진 공용화: `js/quiz-likert-engine.js` (척도형, mode: 'band'|'traits'), `js/quiz-axis-engine.js` (양자택일 축-조합형, MBTI/동물상 등), `js/quiz-answer-engine.js` (정답형 퀴즈: IQ·신조어·맞춤법·사자성어, 틀린 문제 해설 표시), 미니게임 `js/game-reaction.js`·`game-memory.js`·`game-color.js`
- 문항별 실제 페이지 이동(`?q=N`)으로 진행 — 광고 재노출용. `location.reload()` 사용 금지 ([[wooagosa_segment_reload_removed]] 패턴과 동일 이유)
- 각 테스트는 `js/data-{slug}.js`(문항/결과 데이터) + `{slug}.html`(레이아웃, engine 스크립트 로드) 쌍으로 구성

## 카테고리 (index.html)
🧬 성격 유형 · 🧩 지능·스타일 · 💕 연애 · 🎉 밈·트렌드 · 💙 마음 상태(정신건강 자가진단, 전문 진단 대체 아님 고지 필수) · 💼 직장·진로 · 🍀 라이프스타일 · 🎮 두뇌·미니게임 · 📝 퀴즈·상식

## 작업 규칙
- 새 테스트 추가 시 index.html 카드, sitemap.xml 업데이트 필수
- 정신건강 관련 테스트는 결과 하위 band에 상담전화(정신건강 상담전화 1577-0199, 자살예방상담전화 109) 안내 포함
- 성격장애/반사회적 성향 계열(나르시시스트, 소시오패스 등)은 "진단이 아닌 재미 참고용" 톤 유지, 낙인 표현 지양
- 문항은 자체 제작(경쟁사 문항 그대로 복사 금지), 참고는 주제·카테고리 구조만

## 테스트 일괄 생성 (2026-11-25~)
- 신규 28개(꼰대·영포티·아재력·MZ·도파민·집순이·미루기·퇴사충동·눈치·스트레스·외로움·HSP·감정노동·완벽주의·공감·회복탄력성·금사빠·연애의존·홀랜드 직업흥미·학습유형·행동유형·호르몬·집중·연락·갈등·우정·소비·여행)는 `C:\개인\wooahouse\wooatest_gen\` 의 정의(defs_*.py)와 `gen.py --apply`로 생성했다. 정의를 고치고 다시 실행하면 data-*.js·{slug}.html·index 카드·sitemap이 갱신된다(이미 있는 카드/URL은 중복 추가하지 않음).
- 각 페이지 FAQ는 9~10개(테스트별 5개 + 공통 4개 + 마음 상태 1개)이며 FAQPage JSON-LD 포함. 광고 슬롯은 기존 퀴즈 페이지와 동일(상단 배너 1 + 본문 1 + 사이드바).
- 2차(2026-11-25): 정답형 퀴즈 4(iqlogic·slangquiz·spellingquiz·idiomquiz, 각 30문제), axis 4(리더십·커피·RPG 3축·육아, 30문항), 미니게임 3(반응속도·숫자기억·색구별). 모든 신규 테스트 문항 수 30~60. 정의는 wooatest_gen/defs_quiz.py·defs_batch2.py.
