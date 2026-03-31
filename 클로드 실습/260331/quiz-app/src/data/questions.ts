export type Category = '한국사' | '과학' | '지리' | '일반상식';

export interface Question {
  id: number;
  category: Category;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation: string;
}

export const questions: Question[] = [
  // ───────────────────────── 한국사 ─────────────────────────
  {
    id: 1,
    category: '한국사',
    question: '고려를 건국한 인물은 누구인가요?',
    options: ['왕건', '궁예', '견훤', '이성계'],
    answerIndex: 0,
    explanation: '왕건은 918년 고려를 건국하고 초대 왕(태조)이 되었습니다.',
  },
  {
    id: 2,
    category: '한국사',
    question: '조선을 건국한 해는 언제인가요?',
    options: ['1388년', '1392년', '1400년', '1410년'],
    answerIndex: 1,
    explanation: '이성계는 1392년에 고려를 무너뜨리고 조선을 건국했습니다.',
  },
  {
    id: 3,
    category: '한국사',
    question: '훈민정음을 창제한 왕은 누구인가요?',
    options: ['태종', '세종대왕', '성종', '중종'],
    answerIndex: 1,
    explanation: '세종대왕은 1443년 훈민정음을 창제하여 1446년 반포했습니다.',
  },
  {
    id: 4,
    category: '한국사',
    question: '임진왜란이 발생한 해는 언제인가요?',
    options: ['1582년', '1592년', '1600년', '1612년'],
    answerIndex: 1,
    explanation: '1592년 일본의 침략으로 임진왜란이 발생했습니다.',
  },
  {
    id: 5,
    category: '한국사',
    question: '3·1 운동이 일어난 연도는?',
    options: ['1915년', '1917년', '1919년', '1921년'],
    answerIndex: 2,
    explanation: '1919년 3월 1일 전국적인 독립 만세 운동인 3·1 운동이 일어났습니다.',
  },
  {
    id: 6,
    category: '한국사',
    question: '한국전쟁(6·25)이 발발한 해는 언제인가요?',
    options: ['1948년', '1949년', '1950년', '1953년'],
    answerIndex: 2,
    explanation: '1950년 6월 25일 북한의 남침으로 한국전쟁이 발발했습니다.',
  },
  {
    id: 7,
    category: '한국사',
    question: '신라의 삼국통일을 이룬 왕은 누구인가요?',
    options: ['무열왕', '문무왕', '진흥왕', '선덕여왕'],
    answerIndex: 1,
    explanation: '문무왕은 676년 당나라 세력을 몰아내고 삼국통일을 완성했습니다.',
  },
  {
    id: 8,
    category: '한국사',
    question: '대한민국 정부가 수립된 해는?',
    options: ['1945년', '1946년', '1947년', '1948년'],
    answerIndex: 3,
    explanation: '1948년 8월 15일 대한민국 정부가 공식 수립되었습니다.',
  },
  {
    id: 9,
    category: '한국사',
    question: '고구려를 건국한 인물은 누구인가요?',
    options: ['온조', '주몽(동명성왕)', '박혁거세', '김수로'],
    answerIndex: 1,
    explanation: '주몽(동명성왕)은 기원전 37년 고구려를 건국했습니다.',
  },
  {
    id: 10,
    category: '한국사',
    question: '조선의 최고 교육기관은 무엇인가요?',
    options: ['향교', '서원', '성균관', '국자감'],
    answerIndex: 2,
    explanation: '성균관은 조선시대 최고 국립 교육기관으로 유학을 가르쳤습니다.',
  },

  // ───────────────────────── 과학 ─────────────────────────
  {
    id: 11,
    category: '과학',
    question: '물의 화학식은 무엇인가요?',
    options: ['CO₂', 'H₂O', 'NaCl', 'O₂'],
    answerIndex: 1,
    explanation: '물은 수소 원자 2개와 산소 원자 1개로 이루어진 H₂O입니다.',
  },
  {
    id: 12,
    category: '과학',
    question: '빛의 속도는 약 얼마인가요?',
    options: ['30만 km/s', '3만 km/s', '3억 m/s', '30만 m/s'],
    answerIndex: 0,
    explanation: '빛의 속도는 진공에서 약 30만 km/s(약 3×10⁸ m/s)입니다.',
  },
  {
    id: 13,
    category: '과학',
    question: '원소 주기율표에서 원소 번호 1번은 무엇인가요?',
    options: ['헬륨', '리튬', '수소', '산소'],
    answerIndex: 2,
    explanation: '수소(H)는 원자번호 1번으로 가장 가벼운 원소입니다.',
  },
  {
    id: 14,
    category: '과학',
    question: '지구 대기 중 가장 풍부한 기체 원소는 무엇인가요?',
    options: ['산소', '이산화탄소', '수소', '질소'],
    answerIndex: 3,
    explanation: '지구 대기의 약 78%를 차지하는 질소(N₂)가 가장 풍부합니다.',
  },
  {
    id: 15,
    category: '과학',
    question: 'DNA의 이중나선 구조를 밝힌 과학자는 누구인가요?',
    options: ['아인슈타인·보어', '왓슨·크릭', '다윈·멘델', '파스퇴르·코흐'],
    answerIndex: 1,
    explanation: '1953년 왓슨과 크릭이 X선 회절 자료를 토대로 DNA 이중나선 구조를 규명했습니다.',
  },
  {
    id: 16,
    category: '과학',
    question: '뉴턴의 운동 제1법칙은 무엇인가요?',
    options: ['가속도 법칙', '작용·반작용 법칙', '관성의 법칙', '만유인력의 법칙'],
    answerIndex: 2,
    explanation: '뉴턴 제1법칙(관성의 법칙): 외력이 없으면 물체는 현재 상태를 유지합니다.',
  },
  {
    id: 17,
    category: '과학',
    question: '태양계에서 가장 큰 행성은 무엇인가요?',
    options: ['토성', '목성', '천왕성', '해왕성'],
    answerIndex: 1,
    explanation: '목성은 지름이 지구의 약 11배로 태양계 최대 행성입니다.',
  },
  {
    id: 18,
    category: '과학',
    question: '세포의 에너지 생산을 담당하는 세포소기관은 무엇인가요?',
    options: ['리보솜', '골지체', '미토콘드리아', '소포체'],
    answerIndex: 2,
    explanation: '미토콘드리아는 ATP를 생성하는 세포 에너지 공장입니다.',
  },
  {
    id: 19,
    category: '과학',
    question: '주기율표를 처음 만든 과학자는 누구인가요?',
    options: ['라부아지에', '멘델레예프', '퀴리', '패러데이'],
    answerIndex: 1,
    explanation: '러시아 화학자 멘델레예프가 1869년 원소 주기율표를 처음 발표했습니다.',
  },
  {
    id: 20,
    category: '과학',
    question: '소리의 속도는 공기 중(20°C 기준)에서 약 얼마인가요?',
    options: ['약 340 m/s', '약 1,500 m/s', '약 3,000 m/s', '약 100 m/s'],
    answerIndex: 0,
    explanation: '20°C 공기에서 소리의 속도는 약 340 m/s입니다.',
  },

  // ───────────────────────── 지리 ─────────────────────────
  {
    id: 21,
    category: '지리',
    question: '세계에서 가장 긴 강은 무엇인가요?',
    options: ['아마존강', '나일강', '양쯔강', '미시시피강'],
    answerIndex: 1,
    explanation: '나일강은 약 6,650 km로 세계에서 가장 긴 강으로 알려져 있습니다.',
  },
  {
    id: 22,
    category: '지리',
    question: '세계에서 가장 높은 산은 무엇인가요?',
    options: ['K2', '에베레스트', '칸첸중가', '로체'],
    answerIndex: 1,
    explanation: '에베레스트(8,849 m)는 해발 기준 세계 최고봉입니다.',
  },
  {
    id: 23,
    category: '지리',
    question: '대한민국의 수도는 어디인가요?',
    options: ['부산', '인천', '서울', '수원'],
    answerIndex: 2,
    explanation: '서울은 대한민국의 수도이자 최대 도시입니다.',
  },
  {
    id: 24,
    category: '지리',
    question: '세계에서 가장 넓은 나라는 어디인가요?',
    options: ['캐나다', '중국', '미국', '러시아'],
    answerIndex: 3,
    explanation: '러시아는 약 1,710만 km²로 세계 최대 면적의 국가입니다.',
  },
  {
    id: 25,
    category: '지리',
    question: '아프리카 북부에 위치한 세계 최대 열대 사막은?',
    options: ['고비 사막', '아라비아 사막', '사하라 사막', '나미브 사막'],
    answerIndex: 2,
    explanation: '사하라 사막은 약 900만 km²로 세계 최대 열대 사막입니다.',
  },
  {
    id: 26,
    category: '지리',
    question: '일본의 수도는 어디인가요?',
    options: ['오사카', '교토', '도쿄', '요코하마'],
    answerIndex: 2,
    explanation: '도쿄(東京)는 일본의 수도이자 세계 최대 도시권 중 하나입니다.',
  },
  {
    id: 27,
    category: '지리',
    question: '세계에서 가장 인구가 많은 나라는 어디인가요? (2023년 기준)',
    options: ['인도', '중국', '미국', '인도네시아'],
    answerIndex: 0,
    explanation: '인도는 2023년 기준 약 14억 명을 넘어 세계 최다 인구 국가가 되었습니다.',
  },
  {
    id: 28,
    category: '지리',
    question: '남아메리카에서 가장 긴 산맥은 무엇인가요?',
    options: ['로키 산맥', '안데스 산맥', '알프스 산맥', '히말라야 산맥'],
    answerIndex: 1,
    explanation: '안데스 산맥은 약 7,000 km로 세계에서 가장 긴 대륙 산맥입니다.',
  },
  {
    id: 29,
    category: '지리',
    question: '세계에서 가장 깊은 호수는 무엇인가요?',
    options: ['카스피해', '슈피리어호', '바이칼호', '탕가니카호'],
    answerIndex: 2,
    explanation: '바이칼호는 최대 수심 1,642 m로 세계에서 가장 깊은 호수입니다.',
  },
  {
    id: 30,
    category: '지리',
    question: '프랑스의 수도는 어디인가요?',
    options: ['리옹', '마르세유', '보르도', '파리'],
    answerIndex: 3,
    explanation: '파리는 프랑스의 수도이자 최대 도시입니다.',
  },

  // ───────────────────────── 일반상식 ─────────────────────────
  {
    id: 31,
    category: '일반상식',
    question: '올림픽은 몇 년마다 열리나요?',
    options: ['2년', '3년', '4년', '5년'],
    answerIndex: 2,
    explanation: '하계·동계 올림픽 모두 4년마다 개최됩니다.',
  },
  {
    id: 32,
    category: '일반상식',
    question: 'UN(국제연합)의 본부는 어느 도시에 있나요?',
    options: ['워싱턴 D.C.', '제네바', '뉴욕', '파리'],
    answerIndex: 2,
    explanation: 'UN 본부는 미국 뉴욕 맨해튼에 위치해 있습니다.',
  },
  {
    id: 33,
    category: '일반상식',
    question: '셰익스피어의 4대 비극에 해당하지 않는 작품은?',
    options: ['햄릿', '오셀로', '리어왕', '한여름 밤의 꿈'],
    answerIndex: 3,
    explanation: '한여름 밤의 꿈은 희극입니다. 4대 비극은 햄릿, 오셀로, 리어왕, 맥베스입니다.',
  },
  {
    id: 34,
    category: '일반상식',
    question: '음악에서 빠른 템포를 나타내는 용어는 무엇인가요?',
    options: ['아다지오', '안단테', '알레그로', '라르고'],
    answerIndex: 2,
    explanation: '알레그로(Allegro)는 빠른 템포를 나타내는 음악 용어입니다.',
  },
  {
    id: 35,
    category: '일반상식',
    question: '1년은 몇 초인가요?',
    options: ['약 3,153만 초', '약 1,200만 초', '약 8,640만 초', '약 5,000만 초'],
    answerIndex: 0,
    explanation: '1년(365일) = 365×24×3600 = 31,536,000초(약 3,153만 초)입니다.',
  },
  {
    id: 36,
    category: '일반상식',
    question: '노벨상은 누가 만들었나요?',
    options: ['아인슈타인', '알프레드 노벨', '퀴리 부인', '다이너마이트 스미스'],
    answerIndex: 1,
    explanation: '다이너마이트를 발명한 스웨덴인 알프레드 노벨의 유언에 따라 설립되었습니다.',
  },
  {
    id: 37,
    category: '일반상식',
    question: '인체에서 가장 넓은 기관(organ)은 무엇인가요? (면적 기준)',
    options: ['간', '뇌', '폐', '피부'],
    answerIndex: 3,
    explanation: '피부는 평균 1.7~2.0 m²로 인체에서 가장 넓은 기관입니다.',
  },
  {
    id: 38,
    category: '일반상식',
    question: '모나리자를 그린 화가는 누구인가요?',
    options: ['미켈란젤로', '라파엘로', '레오나르도 다 빈치', '보티첼리'],
    answerIndex: 2,
    explanation: '레오나르도 다 빈치가 1503~1519년경 모나리자를 그렸습니다.',
  },
  {
    id: 39,
    category: '일반상식',
    question: '인터넷 주소 앞에 붙는 "https"에서 "s"는 무엇을 의미하나요?',
    options: ['Speed', 'Secure', 'Simple', 'Standard'],
    answerIndex: 1,
    explanation: 'HTTPS의 S는 Secure로, SSL/TLS 암호화가 적용된 안전한 연결을 뜻합니다.',
  },
  {
    id: 40,
    category: '일반상식',
    question: '혈액형 중 어떤 혈액형이 ABO식 적혈구 수혈의 "만능 공혈자"로 불리나요?',
    options: ['A형', 'B형', 'AB형', 'O형'],
    answerIndex: 3,
    explanation: 'O형 적혈구는 ABO 항원이 없어 모든 혈액형에 수혈 가능한 만능 공혈자입니다.',
  },
];

export type GameMode = Category | '전체';

export const CATEGORIES: Category[] = ['한국사', '과학', '지리', '일반상식'];

export function getQuestionsByCategory(category: Category): Question[] {
  return questions.filter((q) => q.category === category);
}

export function getAllQuestionsShuffled(): Question[] {
  const arr = [...questions];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
