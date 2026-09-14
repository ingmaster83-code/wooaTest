# wooaTest 프로젝트 지침

## 프로젝트 개요
- **사이트명:** 우아테스트 (WooaTest)
- **URL:** https://wooatest.wooahouse.com
- **배포:** GitHub Pages

## 기술 스택
- 순수 HTML / CSS / JS (프레임워크 없음), EN 페이지 없음 (KO only)
- 퀴즈 엔진 공용화: `js/quiz-likert-engine.js` (척도형, mode: 'band'|'traits'), `js/quiz-axis-engine.js` (양자택일 축-조합형, MBTI/동물상 등)
- 문항별 실제 페이지 이동(`?q=N`)으로 진행 — 광고 재노출용. `location.reload()` 사용 금지 ([[wooagosa_segment_reload_removed]] 패턴과 동일 이유)
- 각 테스트는 `js/data-{slug}.js`(문항/결과 데이터) + `{slug}.html`(레이아웃, engine 스크립트 로드) 쌍으로 구성

## 카테고리 (index.html)
🧬 성격 유형 · 🧩 지능·스타일 · 💕 연애 · 🎉 밈·트렌드 · 💙 마음 상태(정신건강 자가진단, 전문 진단 대체 아님 고지 필수)

## 작업 규칙
- 새 테스트 추가 시 index.html 카드, sitemap.xml 업데이트 필수
- 정신건강 관련 테스트는 결과 하위 band에 상담전화(정신건강 상담전화 1577-0199, 자살예방상담전화 109) 안내 포함
- 성격장애/반사회적 성향 계열(나르시시스트, 소시오패스 등)은 "진단이 아닌 재미 참고용" 톤 유지, 낙인 표현 지양
- 문항은 자체 제작(경쟁사 문항 그대로 복사 금지), 참고는 주제·카테고리 구조만
