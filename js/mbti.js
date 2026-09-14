/**
 * MBTI 성격유형검사 엔진
 * 시작화면 -> 24문항 -> 채점 -> 결과화면(16유형) 흐름을 하나의 페이지 안에서 처리한다.
 */
(function () {
  var QUESTIONS = [
    { axis: 'EI', text: '금요일 저녁, 단톡방에 "지금 다 모여있는데 콜?" 알림이 떴다.', a: '"가는 중!" 바로 답장하고 나갈 준비', b: '"오늘은 컨디션이..." 고민부터 시작', av: 'E', bv: 'I' },
    { axis: 'EI', text: '새로 들어간 알바 첫날, 쉬는 시간에 직원들이 다 같이 모여있다.', a: '먼저 말 걸면서 자연스럽게 낀다', b: '조용히 핸드폰 보면서 분위기부터 파악', av: 'E', bv: 'I' },
    { axis: 'EI', text: '하루 종일 사람들 만나고 집에 온 밤, 나는', a: '아직 에너지 남아서 통화라도 하고 싶다', b: '방문 닫고 아무 말도 하기 싫다', av: 'E', bv: 'I' },
    { axis: 'EI', text: '친구가 "나 소개팅 나가는데 한 명 더 필요해, 같이 갈래?" 물어본다.', a: '"오 콜, 재밌겠다"', b: '"음... 낯선 사람 앞에서 뭘 해"', av: 'E', bv: 'I' },
    { axis: 'EI', text: '카페에서 혼자 공부하는데 옆자리 사람이 "여기 와이파이 비번 아세요?" 물어본다.', a: '알려주면서 자연스럽게 몇 마디 더 나눈다', b: '비번만 짧게 알려주고 다시 이어폰을 낀다', av: 'E', bv: 'I' },
    { axis: 'EI', text: '단체 여행 숙소, "2인실이랑 4인실 중에 골라" 한다.', a: '4인실! 다 같이 얘기하면서 노는 게 낫지', b: '2인실. 혼자만의 시간이 좀 필요해', av: 'E', bv: 'I' },
    { axis: 'EI', text: '줌 수업 중 교수님이 "질문 있는 사람?"이라고 물어본다.', a: '바로 마이크 켜고 물어본다', b: '채팅창에 조용히 남기거나 그냥 넘어간다', av: 'E', bv: 'I' },
    { axis: 'EI', text: '명절에 친척들이 잔뜩 모인 자리에서 나는', a: '여기저기 인사 다니고 대화를 주도한다', b: '구석에서 조용히 있다가 눈치껏 빠진다', av: 'E', bv: 'I' },
    { axis: 'EI', text: '스트레스 받는 일이 있을 때 나는', a: '친구 불러서 술 한 잔 하며 다 털어놓는다', b: '혼자 방에서 넷플릭스 보며 삭힌다', av: 'E', bv: 'I' },
    { axis: 'EI', text: '새 학기 첫날, 자기소개 시간이 다가온다.', a: '오히려 신나서 재밌게 소개할 준비를 한다', b: '순서 오기 전까지 심장이 벌렁벌렁한다', av: 'E', bv: 'I' },

    { axis: 'SN', text: '이케아에서 산 조립가구 상자를 열었다.', a: '설명서 1페이지부터 순서대로 따라간다', b: '대충 훑어보고 감으로 조립을 시작한다', av: 'S', bv: 'N' },
    { axis: 'SN', text: '친구가 "나 어제 좀 이상한 꿈 꿨어" 하며 얘기를 시작한다.', a: '"그래서 꿈에 정확히 뭐가 나왔는데?"', b: '"오 그거 무슨 의미일까?"', av: 'S', bv: 'N' },
    { axis: 'SN', text: '새로운 동네로 이사가서 맛집을 찾아야 한다.', a: '리뷰 많고 검증된 곳부터 찾아본다', b: '골목 안쪽 감성 있어 보이는 곳에 끌린다', av: 'S', bv: 'N' },
    { axis: 'SN', text: '상사가 "다음 분기 계획 한번 짜봐"라고 한다.', a: '예산, 일정 같은 구체적 숫자부터 정리', b: '큰 방향과 아이디어부터 스케치한다', av: 'S', bv: 'N' },
    { axis: 'SN', text: 'SF 영화를 보고 극장을 나오는 길, 나는', a: '"그 장면 CG 어떻게 만든 거지?" 궁금하다', b: '"그 결말이 뭘 의미하는 거지?" 궁금하다', av: 'S', bv: 'N' },
    { axis: 'SN', text: '친구가 사업 아이디어를 얘기하며 "어때?"라고 물어본다.', a: '"초기 비용이랑 수익구조는 어떻게 돼?"', b: '"오 근데 그게 되면 완전 새로운 시장 아냐?"', av: 'S', bv: 'N' },
    { axis: 'SN', text: '낯선 동네에서 길을 잃었다.', a: '지도앱을 켜서 정확한 경로를 확인한다', b: '일단 감으로 걷다가 누군가에게 물어본다', av: 'S', bv: 'N' },
    { axis: 'SN', text: '소설을 읽을 때 나를 더 몰입시키는 건', a: '배경 묘사와 디테일한 설정', b: '숨겨진 복선과 상징', av: 'S', bv: 'N' },
    { axis: 'SN', text: '친구가 최근 힘든 일을 털어놓는다.', a: '"그래서 정확히 무슨 일이 있었는데?"', b: '"그 상황이 너한테 어떤 의미였을 것 같아?"', av: 'S', bv: 'N' },
    { axis: 'SN', text: '팀플에서 내가 주로 맡는 역할은', a: '자료 조사하고 팩트체크하는 담당', b: '컨셉이랑 큰 그림을 잡는 담당', av: 'S', bv: 'N' },

    { axis: 'TF', text: '친구가 "나 헤어졌어..."라고 톡을 보냈다.', a: '"왜? 무슨 일 있었는데?" 상황부터 물어본다', b: '"헐... 괜찮아? 많이 힘들었겠다"부터', av: 'T', bv: 'F' },
    { axis: 'TF', text: '팀플 조원이 마감을 어겼다.', a: '왜 늦었는지, 앞으로 어떻게 할지 논리적으로 짚는다', b: '"무슨 사정이 있었나 보다" 먼저 이해하려 한다', av: 'T', bv: 'F' },
    { axis: 'TF', text: '가족이 "이 옷 어때?" 물어보는데 솔직히 별로다.', a: '"음... 다른 것도 한번 보자" 솔직하게 말한다', b: '"괜찮은데?" 일단 기분부터 생각한다', av: 'T', bv: 'F' },
    { axis: 'TF', text: '방금 본 영화의 리뷰를 남긴다면 나는', a: '스토리 구성과 개연성을 평가한다', b: '캐릭터 감정선에 얼마나 몰입했는지를 쓴다', av: 'T', bv: 'F' },
    { axis: 'TF', text: '친구랑 다퉜다가 화해하려는 순간, 나는', a: '"그때 이게 문제였잖아, 정리하고 넘어가자"', b: '"미안해, 우리 그냥 화해하자"', av: 'T', bv: 'F' },
    { axis: 'TF', text: '상사가 내 기획안을 논리적으로 반박한다.', a: '반박 포인트를 이해하고 곧 수긍한다', b: '순간 기분이 상하는 게 먼저 느껴진다', av: 'T', bv: 'F' },
    { axis: 'TF', text: '친구가 고민을 얘기하며 조언을 구한다.', a: '객관적으로 상황을 분석해서 답을 준다', b: '"그랬구나, 힘들었겠다" 공감부터 한다', av: 'T', bv: 'F' },
    { axis: 'TF', text: '논쟁적인 뉴스를 볼 때 나는', a: '양쪽 논리를 따져보고 판단한다', b: '관련된 사람들 감정에 더 눈이 간다', av: 'T', bv: 'F' },
    { axis: 'TF', text: '나를 잘 아는 사람이 나에 대해 자주 하는 말은', a: '"너 진짜 쿨하고 솔직해"', b: '"너 진짜 다정하고 배려심 많아"', av: 'T', bv: 'F' },
    { axis: 'TF', text: '같이 일하는 사람을 평가할 때 나에게 더 중요한 건', a: '능력과 결과물', b: '팀워크와 배려', av: 'T', bv: 'F' },

    { axis: 'JP', text: '여행 가기 3일 전, 나는', a: '이미 짐도 계획도 다 끝났다', b: '"아 맞다 여행 가지" 이제서야 실감난다', av: 'J', bv: 'P' },
    { axis: 'JP', text: '친구가 "이번 주말에 뭐해?" 물어본다.', a: '이미 계획이 다 잡혀있다', b: '"그날 봐서" 라고 답한다', av: 'J', bv: 'P' },
    { axis: 'JP', text: '과제 마감이 일주일 남았다.', a: '오늘부터 조금씩 시작한다', b: '마감 전날 밤에 몰아서 한다', av: 'J', bv: 'P' },
    { axis: 'JP', text: '친구들과 여행 계획을 짜는 중이다.', a: '시간표 짜듯 일정을 딱딱 정한다', b: '"가서 발길 닿는 대로 하자"고 한다', av: 'J', bv: 'P' },
    { axis: 'JP', text: '갑자기 약속이 취소됐다는 연락을 받았다.', a: '살짝 당황, 남는 시간에 뭘 할지 다시 계획한다', b: '"오히려 좋아" 하며 즉흥적으로 논다', av: 'J', bv: 'P' },
    { axis: 'JP', text: '옷장을 열어보면 나는', a: '계절별, 색깔별로 각 잡혀 있는 편', b: '뭐가 어디 있는지 나만 아는 편', av: 'J', bv: 'P' },
    { axis: 'JP', text: '시험 공부 스타일은', a: '계획표를 짜서 순서대로 진행한다', b: '그때그때 끌리는 과목부터 한다', av: 'J', bv: 'P' },
    { axis: 'JP', text: '새로운 일을 시작할 때 나는', a: '완벽한 계획을 세운 뒤 시작한다', b: '일단 시작하고 가면서 수정한다', av: 'J', bv: 'P' },
    { axis: 'JP', text: '친구가 갑자기 "지금 당장 놀러 가자!" 한다.', a: '"지금? 준비할 시간 좀..."', b: '"콜! 지금 바로 나갈게"', av: 'J', bv: 'P' },
    { axis: 'JP', text: '나의 하루는 보통', a: '계획한 대로 흘러가는 편이다', b: '예상 못한 일들로 가득한 편이다', av: 'J', bv: 'P' }
  ];

  var RESULTS = {
    INTJ: { emoji: '🧠', title: '전략가', tagline: '치밀하게 그림을 그리는 사람', desc: '머릿속에 이미 완성된 계획이 있는 타입이에요. 남들이 아직 고민할 때 당신은 이미 세 수 앞을 내다보고 있어요. 효율과 논리를 중요하게 여기고, 스스로 세운 기준이 뚜렷해서 어지간해서는 흔들리지 않아요.', strengths: [{ h: '이런 게 강점이에요', p: '큰 그림을 보는 눈, 흔들리지 않는 계획성, 독립적인 문제 해결 능력' }], growth: { h: '이럴 때 조심하세요', p: '완벽한 계획에 집착하다 시작이 늦어지거나, 감정 표현에 서툴러 오해를 살 수 있어요' }, match: 'ENFP, ENTP' },
    INTP: { emoji: '🔬', title: '논리학자', tagline: '궁금한 건 끝까지 파고드는 사람', desc: '"왜?"라는 질문을 달고 사는 타입이에요. 흥미로운 주제를 만나면 밤새 파고들고, 남들이 당연하게 여기는 것도 한 번 더 뒤집어 생각해봐요. 형식보다 본질, 겉모습보다 원리에 끌려요.', strengths: [{ h: '이런 게 강점이에요', p: '깊이 있는 분석력, 참신한 아이디어, 열린 마음으로 받아들이는 태도' }], growth: { h: '이럴 때 조심하세요', p: '생각만 하다 실행이 늦어지거나, 관심 없는 일엔 뒷심이 부족할 수 있어요' }, match: 'ENTJ, ENFJ' },
    ENTJ: { emoji: '👑', title: '지휘관', tagline: '일단 나서서 이끄는 사람', desc: '목표가 정해지면 망설임 없이 사람들을 모으고 움직이는 타입이에요. 리더 역할이 자연스럽고, 비효율적인 걸 그냥 넘어가지 못해요. 결단력 있고 자신감 있게 밀어붙이는 스타일이에요.', strengths: [{ h: '이런 게 강점이에요', p: '강한 추진력, 명확한 목표 설정, 사람을 움직이는 카리스마' }], growth: { h: '이럴 때 조심하세요', p: '너무 직진하다 주변 감정을 놓치거나, 밀어붙이는 태도가 부담스러울 수 있어요' }, match: 'INTP, INFP' },
    ENTP: { emoji: '💡', title: '변론가', tagline: '아이디어가 끊이지 않는 사람', desc: '새로운 생각이 떠오르면 눈이 반짝이는 타입이에요. 토론을 즐기고, "이렇게 하면 어떨까?"라는 말을 자주 해요. 틀에 박힌 방식보다 새로운 시도를 좋아하고, 순발력이 뛰어나요.', strengths: [{ h: '이런 게 강점이에요', p: '기발한 발상, 순발력 있는 대화, 변화에 대한 열린 태도' }], growth: { h: '이럴 때 조심하세요', p: '아이디어만 벌여놓고 마무리가 약하거나, 논쟁을 즐기다 상대를 지치게 할 수 있어요' }, match: 'INFJ, INTJ' },
    INFJ: { emoji: '🌙', title: '옹호자', tagline: '조용히 깊게 생각하는 사람', desc: '겉으론 차분하지만 속으론 늘 뭔가를 고민하는 타입이에요. 사람들의 마음을 잘 알아채고, 의미 있는 일에 진심을 다해요. 이상과 신념이 뚜렷하고, 소수의 사람과 깊은 관계를 맺는 걸 선호해요.', strengths: [{ h: '이런 게 강점이에요', p: '깊은 공감 능력, 통찰력, 신념을 지키는 꾸준함' }], growth: { h: '이럴 때 조심하세요', p: '혼자 너무 많이 짊어지거나, 완벽한 이상과 현실 사이에서 지칠 수 있어요' }, match: 'ENTP, ENFP' },
    INFP: { emoji: '🌊', title: '중재자', tagline: '마음이 여리고 따뜻한 사람', desc: '겉으로 잘 드러내지 않아도 속엔 풍부한 감정과 이야기가 가득한 타입이에요. 자기만의 가치관이 뚜렷하고, 그걸 지키는 게 무엇보다 중요해요. 창의적인 상상을 즐기고 진정성 있는 관계를 원해요.', strengths: [{ h: '이런 게 강점이에요', p: '풍부한 상상력, 깊은 진정성, 타인의 감정을 살피는 세심함' }], growth: { h: '이럴 때 조심하세요', p: '비판에 쉽게 상처받거나, 갈등 상황을 피하다 문제가 커질 수 있어요' }, match: 'ENFJ, ENTJ' },
    ENFJ: { emoji: '🌟', title: '주인공', tagline: '사람들을 챙기고 이끄는 사람', desc: '주변 사람들의 성장과 행복에 진심인 타입이에요. 사람들의 감정을 잘 읽고, 자연스럽게 분위기를 이끌어요. 따뜻하면서도 리더십이 있어서 주변에 사람이 많이 모여요.', strengths: [{ h: '이런 게 강점이에요', p: '따뜻한 리더십, 뛰어난 공감력, 사람들을 성장시키는 힘' }], growth: { h: '이럴 때 조심하세요', p: '남을 챙기느라 정작 자기 자신을 돌보지 못할 수 있어요' }, match: 'INFP, ISFP' },
    ENFP: { emoji: '🎉', title: '활동가', tagline: '에너지 넘치고 자유로운 사람', desc: '새로운 사람, 새로운 경험에 눈이 반짝이는 타입이에요. 아이디어가 샘솟고 그걸 실행에 옮기는 추진력도 있어요. 즉흥적이지만 사람에 대한 진심은 늘 진짜예요.', strengths: [{ h: '이런 게 강점이에요', p: '뜨거운 열정, 뛰어난 공감력, 사람을 끌어당기는 에너지' }], growth: { h: '이럴 때 조심하세요', p: '벌여놓은 일이 많아 마무리가 약해지거나, 루틴한 일을 지루해할 수 있어요' }, match: 'INTJ, INFJ' },
    ISTJ: { emoji: '📋', title: '현실주의자', tagline: '약속은 반드시 지키는 사람', desc: '한번 정한 원칙은 끝까지 지키는 타입이에요. 책임감이 강하고, 맡은 일은 꼼꼼하게 끝까지 해내요. 화려하지 않아도 묵묵히 제 몫을 다하는 믿음직한 사람이에요.', strengths: [{ h: '이런 게 강점이에요', p: '강한 책임감, 꼼꼼한 일처리, 흔들리지 않는 신뢰감' }], growth: { h: '이럴 때 조심하세요', p: '새로운 방식에 적응이 느리거나, 감정 표현에 서툴러 딱딱해 보일 수 있어요' }, match: 'ESFP, ESTP' },
    ISFJ: { emoji: '🤲', title: '수호자', tagline: '조용히 챙겨주는 사람', desc: '말없이 주변 사람들을 세심하게 챙기는 타입이에요. 남이 부탁하기 전에 먼저 알아채고 도와줘요. 안정적이고 따뜻한 분위기를 만드는 걸 좋아하고, 신뢰를 소중히 여겨요.', strengths: [{ h: '이런 게 강점이에요', p: '세심한 배려, 꾸준한 성실함, 따뜻한 헌신' }], growth: { h: '이럴 때 조심하세요', p: '자기 욕구는 뒤로 미루다 지치거나, 거절을 잘 못해 부담이 쌓일 수 있어요' }, match: 'ESTP, ESFP' },
    ESTJ: { emoji: '📊', title: '경영자', tagline: '체계적으로 일을 처리하는 사람', desc: '해야 할 일이 있으면 계획부터 딱 세우고 실행하는 타입이에요. 규칙과 순서를 중요하게 여기고, 조직을 효율적으로 운영하는 데 재능이 있어요. 말과 행동에 책임을 지는 사람이에요.', strengths: [{ h: '이런 게 강점이에요', p: '강한 실행력, 명확한 판단, 조직을 이끄는 관리 능력' }], growth: { h: '이럴 때 조심하세요', p: '융통성이 부족해 보이거나, 자기 기준을 남에게 강요할 수 있어요' }, match: 'ISFP, ISTP' },
    ESFJ: { emoji: '🤝', title: '사교가', tagline: '분위기를 살리는 사람', desc: '사람들과 어울리며 에너지를 얻는 타입이에요. 주변 사람들의 필요를 잘 챙기고, 화목한 분위기를 만드는 데 진심이에요. 배려심 많고 협조적이라 어디서든 환영받아요.', strengths: [{ h: '이런 게 강점이에요', p: '따뜻한 배려, 뛰어난 협동심, 분위기를 살리는 사교성' }], growth: { h: '이럴 때 조심하세요', p: '남의 평가에 예민하거나, 갈등을 너무 피하려다 스트레스가 쌓일 수 있어요' }, match: 'ISTP, ISFP' },
    ISTP: { emoji: '🔧', title: '장인', tagline: '손으로 직접 해결하는 사람', desc: '말보다 행동으로 보여주는 타입이에요. 문제가 생기면 이론보다 실제로 만져보고 해결하는 걸 좋아해요. 침착하고 현실적이며, 필요할 때 순간적인 판단력이 뛰어나요.', strengths: [{ h: '이런 게 강점이에요', p: '뛰어난 실전 감각, 침착한 문제 해결력, 독립적인 성향' }], growth: { h: '이럴 때 조심하세요', p: '감정 표현이 적어 무심해 보이거나, 장기 계획을 세우는 걸 귀찮아할 수 있어요' }, match: 'ESFJ, ESTJ' },
    ISFP: { emoji: '🎨', title: '예술가', tagline: '자기만의 감성이 뚜렷한 사람', desc: '조용하지만 자기만의 세계가 확실한 타입이에요. 아름다운 것, 감성적인 것에 예민하게 반응하고, 남들 시선보다 자기 마음이 이끄는 대로 움직여요. 부드럽지만 심지가 굳어요.', strengths: [{ h: '이런 게 강점이에요', p: '섬세한 감수성, 유연한 적응력, 자연스러운 예술적 감각' }], growth: { h: '이럴 때 조심하세요', p: '갈등을 피하려다 속마음을 숨기거나, 비판에 예민하게 반응할 수 있어요' }, match: 'ENFJ, ESTJ' },
    ESTP: { emoji: '⚡', title: '사업가', tagline: '지금 이 순간을 즐기는 사람', desc: '일단 몸으로 부딪혀보는 타입이에요. 새로운 자극과 재미를 좋아하고, 위기 상황에서도 순발력 있게 대처해요. 눈치가 빠르고 현실적이라 어떤 상황에서도 잘 적응해요.', strengths: [{ h: '이런 게 강점이에요', p: '빠른 순발력, 대담한 실행력, 뛰어난 현실 감각' }], growth: { h: '이럴 때 조심하세요', p: '즉흥적인 결정이 리스크를 키우거나, 장기적인 계획을 지루해할 수 있어요' }, match: 'ISFJ, ISTJ' },
    ESFP: { emoji: '🎤', title: '엔터테이너', tagline: '함께 있으면 즐거운 사람', desc: '어디서든 분위기 메이커 역할을 하는 타입이에요. 사람들과 어울리고 즐거운 순간을 만드는 걸 좋아해요. 밝고 긍정적인 에너지로 주변을 환하게 만들어요.', strengths: [{ h: '이런 게 강점이에요', p: '넘치는 활력, 뛰어난 사교성, 긍정적인 분위기 메이킹' }], growth: { h: '이럴 때 조심하세요', p: '즉흥적으로 움직이다 계획이 흐트러지거나, 진지한 상황을 어색해할 수 있어요' }, match: 'ISTJ, ISFJ' }
  };

  var meta = window.MBTI_TEST_META || { name: 'MBTI 성격유형검사', resultUrlBase: 'mbti.html' };

  var state = { idx: 0, counts: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }, history: [] };

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
      saveState();
      goToQuestionPage(state.idx);
    }
  }

  function goBack() {
    if (state.idx === 0) return;
    var last = state.history.pop();
    state.counts[last]--;
    state.idx--;
    saveState();
    goToQuestionPage(state.idx);
  }

  function finish() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    var code =
      (state.counts.E >= state.counts.I ? 'E' : 'I') +
      (state.counts.S >= state.counts.N ? 'S' : 'N') +
      (state.counts.T >= state.counts.F ? 'T' : 'F') +
      (state.counts.J >= state.counts.P ? 'J' : 'P');
    renderResult(code);
    showScreen('result');
    try {
      var url = new URL(location.href);
      url.searchParams.delete('q');
      url.searchParams.set('type', code);
      history.replaceState(null, '', url.toString());
    } catch (e) {}
    if (window.gtag) gtag('event', 'mbti_result', { type: code });
  }

  function renderResult(code) {
    var r = RESULTS[code];
    window.QUIZ_RESULT_SUMMARY = r.emoji + ' ' + code + ' · ' + r.title;
    el.resultArea.innerHTML =
      '<div class="result-emoji">' + r.emoji + '</div>' +
      '<div class="result-type-label">' + code + '</div>' +
      '<div class="result-title">' + r.title + '</div>' +
      '<p style="color:var(--purple-dk);font-weight:700;margin:-.5rem 0 1rem;">' + r.tagline + '</p>' +
      '<p class="result-desc">' + r.desc + '</p>' +
      '<div class="result-trait-grid">' +
      r.strengths.map(function (s) { return '<div class="result-trait-card"><h4>' + s.h + '</h4><p>' + s.p + '</p></div>'; }).join('') +
      '<div class="result-trait-card"><h4>' + r.growth.h + '</h4><p>' + r.growth.p + '</p></div>' +
      '<div class="result-trait-card"><h4>💜 잘 맞는 유형</h4><p>' + r.match + '</p></div>' +
      '</div>';
  }

  function start() {
    state = { idx: 0, counts: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }, history: [] };
    saveState();
    goToQuestionPage(0);
  }

  function retry() {
    showScreen('start');
  }

  el.startBtn.addEventListener('click', start);
  el.choiceA.addEventListener('click', function () { answer(QUESTIONS[state.idx].av); });
  el.choiceB.addEventListener('click', function () { answer(QUESTIONS[state.idx].bv); });
  el.backBtn.addEventListener('click', goBack);
  if (el.retryBtn) el.retryBtn.addEventListener('click', retry);

  // URL에 ?type=XXXX 있으면 결과 바로 보여주기 (공유 링크로 들어온 경우)
  // ?q=N 있으면 다음/이전 버튼으로 이동해온 재방문 — 조용히 해당 문항부터 이어서 진행
  try {
    var params = new URLSearchParams(location.search);
    if (params.has('q')) {
      var saved = loadState();
      if (saved && saved.idx < QUESTIONS.length) {
        state = saved;
        showScreen('quiz');
        renderQuestion();
      } else {
        showScreen('start');
      }
    } else {
      var t = (params.get('type') || '').toUpperCase();
      if (RESULTS[t]) {
        renderResult(t);
        showScreen('result');
      }
    }
  } catch (e) {}
})();
