const CYCLE_DAYS = 60;
const QUESTIONS_PER_DAY = 10;
const START_DATE = new Date("2026-06-23T00:00:00+08:00");

const gradeConfig = {
  grade1: {
    label: "一年级",
    mathBoost: 0,
    englishLevel: "starter",
    chineseLevel: "basic"
  },
  grade2: {
    label: "二年级预备",
    mathBoost: 8,
    englishLevel: "bridge",
    chineseLevel: "bridge"
  }
};

const facts = {
  cr450: "CR450 是中国新一代高速动车组样车，面向更高速度等级研发。这里把它作为“最新高铁明星”来设计题目，但语数英能力要求仍围绕一、二年级衔接。",
  cr400: "复兴号 CR400 系列是中国高铁 350 km/h 运营的代表车型之一。它是动车组，许多车厢都有动力，像一个配合很好的车队。",
  diesel: "东风系列内燃机车使用柴油机发电或传动，常被叫作燃油机车。它们在没有电气化线路的年代和地区很重要。",
  electric: "韶山、和谐等电力机车从接触网取电，牵引客车或货车。它们不是动车组，但也是中国铁路的重要成员。"
};

const sourceNote = [
  "题型范围参考国家中小学智慧教育平台与义务教育课程标准常见目标。",
  "英语启蒙参考 Cambridge English Pre-A1、British Council 少儿英语家庭启蒙建议，先做短时、高频、游戏化、图片语境和重复练习。",
  "题目为原创生成，不复制第一试卷网、小猿口算、同步学等第三方题库原题。"
];

const routePool = [
  ["北京南", "济南西", "南京南", "苏州北", "上海虹桥"],
  ["西安北", "郑州东", "徐州东", "南京南", "杭州东"],
  ["广州南", "长沙南", "武汉", "郑州东", "北京西"],
  ["成都东", "重庆北", "贵阳北", "桂林北", "广州南"],
  ["哈尔滨西", "长春西", "沈阳北", "天津西", "北京朝阳"],
  ["南宁东", "桂林北", "贵阳北", "重庆西", "成都东"]
];

const trainTypes = ["cr450", "cr400", "diesel", "electric"];
const trainNames = {
  cr450: "CR450 新一代动车组",
  cr400: "复兴号 CR400",
  diesel: "东风内燃机车",
  electric: "电力机车"
};

const chineseWords = [
  ["高铁", "gao tie", "高", "速", "高"],
  ["动车", "dong che", "动", "车", "力"],
  ["车站", "che zhan", "车", "站", "车"],
  ["轨道", "gui dao", "轨", "道", "车"],
  ["列车", "lie che", "列", "车", "刂"],
  ["司机", "si ji", "司", "机", "口"],
  ["检修", "jian xiu", "检", "修", "木"],
  ["信号", "xin hao", "信", "号", "亻"],
  ["车票", "che piao", "车", "票", "车"],
  ["站台", "zhan tai", "站", "台", "立"],
  ["接触网", "jie chu wang", "接", "网", "扌"],
  ["内燃机", "nei ran ji", "内", "机", "冂"]
];

const englishLetters = [
  ["A", "a", "A 像尖尖的车站屋顶"],
  ["B", "b", "B 像两节鼓鼓的车厢"],
  ["C", "c", "C 像弯弯的铁路弯道"],
  ["D", "d", "D 像车门 door 的第一个字母"],
  ["E", "e", "E 像电力 electric 的第一个字母"],
  ["F", "f", "F 像快车 fast 的第一个字母"],
  ["G", "g", "G 像绿色 green 的第一个字母"],
  ["H", "h", "H 像高铁站的两根柱子"],
  ["I", "i", "I 像一根信号杆"],
  ["J", "j", "J 像弯下去的挂钩"],
  ["K", "k", "K 像道岔分开的样子"],
  ["L", "l", "L 像站台边的直角"],
  ["M", "m", "M 像山里的铁路桥"],
  ["N", "n", "N 像新车 new 的第一个字母"],
  ["O", "o", "O 像圆圆的车轮"],
  ["P", "p", "P 像站牌 platform 的第一个字母"],
  ["Q", "q", "Q 像带小尾巴的车轮"],
  ["R", "r", "R 像红色 red 的第一个字母"],
  ["S", "s", "S 像弯弯的线路"],
  ["T", "t", "T 像火车 train 的第一个字母"],
  ["U", "u", "U 像隧道口"],
  ["V", "v", "V 像两条线路汇合"],
  ["W", "w", "W 像两座小桥"],
  ["X", "x", "X 像铁路交叉口"],
  ["Y", "y", "Y 像三岔路"],
  ["Z", "z", "Z 像折线线路"]
];

const englishRailWords = [
  ["train", "火车", "T", "This is a train.", "这是一列火车。"],
  ["door", "车门", "D", "Open the door.", "打开车门。"],
  ["seat", "座位", "S", "This is my seat.", "这是我的座位。"],
  ["red", "红色", "R", "The signal is red.", "信号灯是红色。"],
  ["green", "绿色", "G", "The signal is green.", "信号灯是绿色。"],
  ["fast", "快的", "F", "The train is fast.", "火车很快。"],
  ["new", "新的", "N", "This is a new train.", "这是一列新火车。"],
  ["old", "旧的", "O", "This is an old train.", "这是一列旧火车。"],
  ["ticket", "车票", "T", "Here is a ticket.", "这是一张车票。"],
  ["station", "车站", "S", "This is a station.", "这是一个车站。"]
];

const els = {
  todayLabel: document.querySelector("#todayLabel"),
  routeLabel: document.querySelector("#routeLabel"),
  stations: document.querySelector("#stations"),
  train: document.querySelector("#train"),
  scoreLabel: document.querySelector("#scoreLabel"),
  profileSelect: document.querySelector("#profileSelect"),
  activeGradeSelect: document.querySelector("#activeGradeSelect"),
  profileNameInput: document.querySelector("#profileNameInput"),
  profileGradeSelect: document.querySelector("#profileGradeSelect"),
  addProfileBtn: document.querySelector("#addProfileBtn"),
  activeGradeLabel: document.querySelector("#activeGradeLabel"),
  daySelect: document.querySelector("#daySelect"),
  subjectTag: document.querySelector("#subjectTag"),
  questionCount: document.querySelector("#questionCount"),
  questionArt: document.querySelector("#questionArt"),
  questionTitle: document.querySelector("#questionTitle"),
  questionText: document.querySelector("#questionText"),
  answerArea: document.querySelector("#answerArea"),
  feedback: document.querySelector("#feedback"),
  nextBtn: document.querySelector("#nextBtn"),
  factDetail: document.querySelector("#factDetail"),
  wrongCount: document.querySelector("#wrongCount"),
  wrongList: document.querySelector("#wrongList"),
  exportWrongBtn: document.querySelector("#exportWrongBtn")
};

const state = {
  profiles: [],
  activeProfileId: "",
  selectedDay: 1,
  todayQuestions: [],
  current: 0,
  correct: 0,
  answeredIds: new Set(),
  answered: false
};

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function daysBetween(start, end) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((endUtc - startUtc) / 86400000);
}

function activeCycleDay(date = new Date()) {
  const offset = daysBetween(START_DATE, date);
  return ((offset % CYCLE_DAYS) + CYCLE_DAYS) % CYCLE_DAYS + 1;
}

function profileKey() {
  return "railKidsProfiles-v1";
}

function activeProfileKey() {
  return "railKidsActiveProfile-v1";
}

function createProfile(name, grade = "grade1") {
  return {
    id: `p-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    name: name.trim().slice(0, 10) || "小小调度员",
    grade: gradeConfig[grade] ? grade : "grade1",
    createdAt: new Date().toISOString()
  };
}

function readProfiles() {
  try {
    const profiles = JSON.parse(localStorage.getItem(profileKey())) || [];
    return profiles.filter((profile) => profile && profile.id && profile.name);
  } catch {
    localStorage.removeItem(profileKey());
    return [];
  }
}

function saveProfiles() {
  localStorage.setItem(profileKey(), JSON.stringify(state.profiles));
  localStorage.setItem(activeProfileKey(), state.activeProfileId);
}

function activeProfile() {
  return state.profiles.find((profile) => profile.id === state.activeProfileId) || state.profiles[0];
}

function activeGrade() {
  return activeProfile()?.grade || "grade1";
}

function optionSet(answer, distractors) {
  const fallback = [
    "A", "B", "C", "D", "a", "b", "c", "d",
    "火车", "车站", "车票", "座位",
    "train", "door", "seat", "red", "green", "fast", "new", "old", "ticket", "station"
  ];
  const seen = new Set();
  return [answer, ...distractors, ...fallback]
    .map(String)
    .filter((item) => {
      if (seen.has(item)) return false;
      seen.add(item);
      return true;
    })
    .slice(0, 4);
}

function shuffledByKey(items, key) {
  return [...items].sort((a, b) => {
    const av = hashText(`${key}-${String(a)}`);
    const bv = hashText(`${key}-${String(b)}`);
    return av - bv;
  });
}

function hashText(text) {
  return Array.from(text).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 1000003, 7);
}

function makeChoiceQuestion({ day, slot, grade, subject, skill, train, title, text, answer, choices, tip }) {
  return {
    id: `${grade || "grade1"}-D${String(day).padStart(2, "0")}-Q${String(slot + 1).padStart(2, "0")}`,
    day,
    slot,
    grade: grade || "grade1",
    subject,
    skill,
    train,
    title,
    text: `【第${day}天任务】${text}`,
    answer: String(answer),
    choices: shuffledByKey(choices.map(String), `${day}-${slot}-${answer}`),
    tip
  };
}

function mathOptions(answer, span = 12) {
  const values = new Set([answer]);
  [answer + 10, answer - 10, answer + span, answer - span, answer + 2, answer - 2, answer + 1].forEach((value) => {
    if (value >= 0 && value <= 100) values.add(value);
  });
  let probe = answer + 3;
  while (values.size < 4) {
    if (probe >= 0 && probe <= 100) values.add(probe);
    probe = probe > answer ? answer - (probe - answer + 1) : answer + (answer - probe + 2);
  }
  return [...values].slice(0, 4).map(String);
}

function makeBeginnerEnglishLetterQuestion(day, slot, grade, train) {
  const item = englishLetters[(day - 1) % englishLetters.length];
  const next = englishLetters[day % englishLetters.length];
  const another = englishLetters[(day + 7) % englishLetters.length];
  const mode = grade === "grade2" ? (day + 1) % 4 : (day - 1) % 4;

  if (mode === 0) {
    return makeChoiceQuestion({
      day,
      slot,
      grade,
      subject: "英语",
      skill: "字母形状识别",
      train,
      title: `第${day}天 字母找同伴`,
      text: `先不背单词，只看形状。调度牌上是大写字母 ${item[0]}，哪一张卡也是 ${item[0]}？`,
      answer: item[0],
      choices: optionSet(item[0], [next[0], another[0], item[1]]),
      tip: `今天只认一个字母：${item[0]}。${item[2]}。`
    });
  }

  if (mode === 1) {
    return makeChoiceQuestion({
      day,
      slot,
      grade,
      subject: "英语",
      skill: "大小写匹配",
      train,
      title: `第${day}天 大小写配对`,
      text: `大写 ${item[0]} 的小写伙伴是哪一个？`,
      answer: item[1],
      choices: optionSet(item[1], [next[1], another[1], item[0].toLowerCase() === "l" ? "i" : "l"]),
      tip: `${item[0]} 和 ${item[1]} 是同一个字母的大小写。`
    });
  }

  if (mode === 2) {
    const railWord = englishRailWords[(day + 2) % englishRailWords.length];
    return makeChoiceQuestion({
      day,
      slot,
      grade,
      subject: "英语",
      skill: "首字母意识",
      train,
      title: `第${day}天 单词开头`,
      text: `家长读一遍 “${railWord[0]}”。这个铁路词的第一个字母已经写在单词开头：${railWord[0][0]}。请选择同一个大写字母。`,
      answer: railWord[2],
      choices: optionSet(railWord[2], [next[0], another[0], item[0]]),
      tip: `${railWord[0]} 是“${railWord[1]}”，开头字母是 ${railWord[2]}。`
    });
  }

  return makeChoiceQuestion({
    day,
    slot,
    grade,
    subject: "英语",
    skill: "字母顺序感",
    train,
    title: `第${day}天 字母排队`,
    text: `列车编号里有三个字母：${item[0]} ${next[0]} ${another[0]}。哪一个和第一个字母完全一样？`,
    answer: item[0],
    choices: optionSet(item[0], [next[0], another[0], englishLetters[(day + 13) % englishLetters.length][0]]),
    tip: `先会“找一样”，再慢慢学读音和单词。第一个字母是 ${item[0]}。`
  });
}

function makeBeginnerEnglishContextQuestion(day, slot, grade, train) {
  const item = englishRailWords[(day * 2 + slot) % englishRailWords.length];
  const next = englishRailWords[(day * 2 + slot + 1) % englishRailWords.length];
  const another = englishRailWords[(day * 2 + slot + 4) % englishRailWords.length];
  const mode = grade === "grade2" ? (day + 1) % 5 : (day - 1) % 5;

  if (mode === 0) {
    return makeChoiceQuestion({
      day,
      slot,
      grade,
      subject: "英语",
      skill: "词图匹配",
      train,
      title: `第${day}天 看图认词`,
      text: `看铁路图：今天只学一个词，“${item[0]}”表示“${item[1]}”。哪张词卡和 ${item[0]} 完全一样？`,
      answer: item[0],
      choices: optionSet(item[0], [next[0], item[0].slice(0, -1), another[0]]),
      tip: `不用一次背很多，只把 ${item[0]} 和“${item[1]}”连起来。`
    });
  }

  if (mode === 1) {
    return makeChoiceQuestion({
      day,
      slot,
      grade,
      subject: "英语",
      skill: "词义理解",
      train,
      title: `第${day}天 一个词就够`,
      text: `铁路词 “${item[0]}” 今天已经配了图。它表示什么？`,
      answer: item[1],
      choices: optionSet(item[1], [next[1], another[1], "飞机"]),
      tip: `${item[0]} = ${item[1]}。零基础先从“一个词配一个图”开始。`
    });
  }

  if (mode === 2) {
    return makeChoiceQuestion({
      day,
      slot,
      grade,
      subject: "英语",
      skill: "固定表达",
      train,
      title: `第${day}天 短句跟读`,
      text: `家长读：“${item[3]}” 意思是“${item[4]}”。哪一句和家长读的一模一样？`,
      answer: item[3],
      choices: optionSet(item[3], [next[3], item[3].replace(".", ""), another[3]]),
      tip: `先整体听熟：${item[3]}`
    });
  }

  if (mode === 3) {
    return makeChoiceQuestion({
      day,
      slot,
      grade,
      subject: "英语",
      skill: "听读对应",
      train,
      title: `第${day}天 听到就指`,
      text: `家长读 “${item[0]}”。请在四张卡里找到这个词。`,
      answer: item[0],
      choices: optionSet(item[0], [next[0], another[0], item[0].split("").reverse().join("")]),
      tip: `听读对应不要求拼写，先能从几张卡里认出 ${item[0]}。`
    });
  }

  return makeChoiceQuestion({
    day,
    slot,
    grade,
    subject: "英语",
    skill: "首字母复现",
    train,
    title: `第${day}天 字母连单词`,
    text: `词卡 “${item[0]}” 的第一个字母是 ${item[2]}。哪张卡也用 ${item[2]} 开头？`,
    answer: item[0],
    choices: optionSet(item[0], [next[0], another[0], englishRailWords[(day + 6) % englishRailWords.length][0]]),
    tip: `看到 ${item[2]}，可以想到 ${item[0]}。这是从字母走向单词的第一步。`
  });
}

function generateQuestion(day, slot, grade = "grade1") {
  const config = gradeConfig[grade] || gradeConfig.grade1;
  const train = trainTypes[(day + slot) % trainTypes.length];
  const route = routePool[(day + slot) % routePool.length];
  const word = chineseWords[(day * 3 + slot) % chineseWords.length];
  const base = day * 7 + slot * 5;
  const a = 12 + config.mathBoost + ((base * 3) % (68 - config.mathBoost));
  const b = 5 + Math.floor(config.mathBoost / 2) + ((base * 2) % 28);
  const c = 3 + Math.floor(config.mathBoost / 2) + ((base + day) % 18);
  const routeText = `${route[0]}到${route[route.length - 1]}`;

  switch (slot) {
    case 0:
      return makeChoiceQuestion({
        day,
        slot,
        grade,
        subject: "语文",
        skill: "拼音认读",
        train,
        title: `第${day}天 拼音调度`,
        text: `${trainNames[train]}今天学习“${word[0]}”。它的拼音是哪一个？`,
        answer: word[1],
        choices: optionSet(word[1], [word[1].replace("e", "en"), `gao ${word[1].split(" ")[1] || "che"}`, "dong tie", "che zhan"]),
        tip: `“${word[0]}”的拼音是 ${word[1]}。`
      });
    case 1: {
      const answer = word[4];
      return makeChoiceQuestion({
        day,
        slot,
        grade,
        subject: "语文",
        skill: "部首识字",
        train,
        title: `第${day}天 部首检修`,
        text: `在铁路词语“${word[0]}”里，和第一个字最常见的部首相关的是哪一个？`,
        answer,
        choices: optionSet(answer, ["车", "口", "木", "亻", "立", "火", "高", "力", "刂", "扌", "冂"]),
        tip: "先看字的左边或外形，再联系字义判断。"
      });
    }
    case 2:
      return makeChoiceQuestion({
        day,
        slot,
        grade,
        subject: "语文",
        skill: grade === "grade2" ? "阅读表达" : "句子表达",
        train,
        title: grade === "grade2" ? `第${day}天 阅读广播` : `第${day}天 通顺广播`,
        text: grade === "grade2"
          ? `${routeText}的${trainNames[train]}准点进站，乘客排队上车。哪句话概括得最好？`
          : `${routeText}的列车进站了。哪句话最通顺？`,
        answer: grade === "grade2" ? "列车准点进站，乘客有序上车。" : `${trainNames[train]}缓缓开进站台。`,
        choices: grade === "grade2"
          ? [
              "列车准点进站，乘客有序上车。",
              "乘客在车顶检修接触网。",
              "列车离开轨道飞上天空。",
              "站台把乘客开进列车。"
            ]
          : [
              `${trainNames[train]}缓缓开进站台。`,
              `站台缓缓开进${trainNames[train]}。`,
              `开进缓缓站台列车。`,
              `${trainNames[train]}站台进开缓缓。`
            ],
        tip: grade === "grade2" ? "概括句要抓住主要事情：列车进站，乘客上车。" : "通顺的句子一般能清楚说出“谁做什么”。"
      });
    case 3: {
      const answer = a + b;
      return makeChoiceQuestion({
        day,
        slot,
        grade,
        subject: "数学",
        skill: "100以内加法",
        train,
        title: `第${day}天 编组加法`,
        text: `${trainNames[train]}原来有 ${a} 个检修零件，又送来 ${b} 个，一共有多少个？`,
        answer,
        choices: mathOptions(answer),
        tip: `${a} + ${b} = ${answer}。`
      });
    }
    case 4: {
      const total = Math.max(a, b) + c;
      const used = Math.min(b, total - 1);
      const answer = total - used;
      return makeChoiceQuestion({
        day,
        slot,
        grade,
        subject: "数学",
        skill: "100以内减法",
        train,
        title: `第${day}天 车票减法`,
        text: `调度台有 ${total} 张模拟车票，发给同学 ${used} 张，还剩多少张？`,
        answer,
        choices: mathOptions(answer),
        tip: `${total} - ${used} = ${answer}。`
      });
    }
    case 5: {
      const first = 18 + ((day + slot) % 24);
      const second = 12 + ((day * 2 + slot) % 21);
      const more = Math.abs(first - second);
      return makeChoiceQuestion({
        day,
        slot,
        grade,
        subject: "数学",
        skill: "比多少",
        train,
        title: `第${day}天 比多少`,
        text: `甲站有 ${first} 名小乘客，乙站有 ${second} 名小乘客。人数多的一站比少的一站多多少名？`,
        answer: more,
        choices: mathOptions(more, 5),
        tip: `比多少用减法：${Math.max(first, second)} - ${Math.min(first, second)} = ${more}。`
      });
    }
    case 6: {
      const start = 20 + config.mathBoost + ((day * 4 + slot) % 45);
      const add = 6 + Math.floor(config.mathBoost / 2) + ((day + slot) % 18);
      const remove = 3 + ((day * 2 + slot) % 15);
      const answer = start + add - remove;
      return makeChoiceQuestion({
        day,
        slot,
        grade,
        subject: "数学",
        skill: "两步应用题",
        train,
        title: `第${day}天 两步应用`,
        text: `模型库有 ${start} 个车轮，上午补来 ${add} 个，下午用掉 ${remove} 个，现在有多少个？`,
        answer,
        choices: mathOptions(answer),
        tip: `先加再减：${start} + ${add} - ${remove} = ${answer}。这是二年级预备题。`
      });
    }
    case 7:
      return makeBeginnerEnglishLetterQuestion(day, slot, grade, train);
    case 8:
      return makeBeginnerEnglishContextQuestion(day, slot, grade, train);
    default: {
      const cars = 6 + (grade === "grade2" ? 2 : 0) + ((day + slot) % 10);
      const people = cars * (grade === "grade2" ? 3 : 2) + ((day * 3) % 9);
      const answer = people - cars;
      return makeChoiceQuestion({
        day,
        slot,
        grade,
        subject: "综合",
        skill: grade === "grade2" ? "乘加减综合" : "综合应用",
        train,
        title: `第${day}天 小调度员挑战`,
        text: `${routeText}的${trainNames[train]}有 ${cars} 节模拟车厢。每节先放 ${grade === "grade2" ? 3 : 2} 个座位标记，又多出 ${people - cars * (grade === "grade2" ? 3 : 2)} 个备用标记。标记总数比车厢数多多少？`,
        answer,
        choices: mathOptions(answer),
        tip: `先算标记总数 ${people}，再比车厢多多少：${people} - ${cars} = ${answer}。`
      });
    }
  }
}

function generateDayQuestions(day, grade = activeGrade()) {
  return Array.from({ length: QUESTIONS_PER_DAY }, (_, slot) => generateQuestion(day, slot, grade));
}

function pickRoute(day = state.selectedDay) {
  return routePool[(day - 1) % routePool.length];
}

function renderDaySelector() {
  const activeDay = activeCycleDay();
  els.daySelect.innerHTML = Array.from({ length: CYCLE_DAYS }, (_, index) => {
    const day = index + 1;
    const label = day === activeDay ? `第 ${day} 天（今天）` : `第 ${day} 天`;
    return `<option value="${day}">${label}</option>`;
  }).join("");
  els.daySelect.value = String(state.selectedDay);
}

function renderProfiles() {
  const profile = activeProfile();
  els.profileSelect.innerHTML = state.profiles.map((item) => {
    const gradeLabel = gradeConfig[item.grade]?.label || gradeConfig.grade1.label;
    return `<option value="${item.id}">${item.name}｜${gradeLabel}</option>`;
  }).join("");
  els.profileSelect.value = profile.id;
  els.activeGradeSelect.value = profile.grade;
  els.profileGradeSelect.value = "grade1";
  els.activeGradeLabel.textContent = gradeConfig[profile.grade]?.label || gradeConfig.grade1.label;
}

function renderRoute() {
  const route = pickRoute();
  els.routeLabel.textContent = `${route[0]} -> ${route[route.length - 1]}`;
  els.stations.innerHTML = route.map((name, index) => `<li class="${index === 0 ? "done" : ""}">${name}</li>`).join("");
}

function renderFacts(active = "cr450") {
  document.querySelectorAll(".fact-card").forEach((button) => {
    button.classList.toggle("active", button.dataset.fact === active);
  });
  els.factDetail.textContent = `${facts[active]} ${sourceNote.join(" ")}`;
}

function storageKey() {
  const profile = activeProfile();
  return `railKidsProgress-v3-${profile.id}-${profile.grade}-day-${state.selectedDay}`;
}

function wrongKey() {
  return `railKidsWrongbook-v2-${activeProfile().id}`;
}

function updateProgress() {
  const total = state.todayQuestions.length;
  els.scoreLabel.textContent = `${state.correct}/${total}`;
  const progress = total <= 1 ? 1 : state.current / (total - 1);
  const maxMove = Math.max(0, document.querySelector(".track-wrap").clientWidth - els.train.clientWidth);
  els.train.style.setProperty("--train-x", `${Math.round(maxMove * progress)}px`);
  document.querySelectorAll(".stations li").forEach((station, index) => {
    station.classList.toggle("done", index / 4 <= state.correct / Math.max(total, 1));
  });
}

function renderQuestion() {
  const question = state.todayQuestions[state.current];
  state.answered = state.answeredIds.has(question.id);
  els.subjectTag.textContent = question.subject;
  els.questionCount.textContent = `第 ${state.current + 1} 题 / 共 ${state.todayQuestions.length} 题`;
  els.questionArt.className = `question-art ${question.train}`;
  els.questionArt.dataset.label = trainNames[question.train];
  els.questionTitle.textContent = question.title;
  els.questionText.textContent = question.text;
  els.feedback.className = "feedback";
  els.feedback.textContent = state.answered ? "这题已经作答并锁定，不能重新选择。" : "每题只有一次作答机会，请想好后再选。";
  els.nextBtn.disabled = !state.answered;
  els.nextBtn.textContent = state.current === state.todayQuestions.length - 1 ? "完成任务" : "下一题";
  renderChoices(question);
  updateProgress();
}

function renderChoices(question) {
  els.answerArea.innerHTML = "";
  question.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = choice;
    button.disabled = state.answered;
    if (state.answered && choice === question.answer) button.classList.add("correct");
    button.addEventListener("click", () => checkAnswer(choice, button));
    els.answerArea.appendChild(button);
  });
}

function checkAnswer(choice, button) {
  if (state.answered) return;
  const question = state.todayQuestions[state.current];
  const isCorrect = choice === question.answer;
  state.answered = true;
  state.answeredIds.add(question.id);
  if (isCorrect) {
    state.correct += 1;
  } else {
    addWrongRecord(question, choice);
  }
  document.querySelectorAll(".choice").forEach((item) => {
    item.disabled = true;
    if (item.textContent === question.answer) item.classList.add("correct");
  });
  if (!isCorrect) button.classList.add("wrong");
  els.feedback.className = `feedback ${isCorrect ? "good" : "try"}`;
  els.feedback.textContent = `${isCorrect ? "答对了，列车准点前进！" : "这题先记到错题本里。"}${question.tip}`;
  els.nextBtn.disabled = false;
  saveProgress();
  renderWrongbook();
  updateProgress();
}

function nextQuestion() {
  if (!state.answered) return;
  if (state.current < state.todayQuestions.length - 1) {
    state.current += 1;
    saveProgress();
    renderQuestion();
    return;
  }
  renderFinish();
}

function renderFinish() {
  const total = state.todayQuestions.length;
  els.subjectTag.textContent = "到站";
  els.questionCount.textContent = `第 ${state.selectedDay} 天任务完成`;
  els.questionArt.className = "question-art cr450";
  els.questionArt.dataset.label = "调度成功";
  els.questionTitle.textContent = state.correct === total ? "满分到站！" : "列车顺利到站！";
  els.questionText.textContent = `今天答对 ${state.correct} 题，共 ${total} 题。60 天内每天 10 题，题目不会重复。`;
  els.answerArea.innerHTML = "";
  els.feedback.className = "feedback good";
  els.feedback.textContent = "可以切换训练日期继续练，也可以打开错题本复盘。";
  els.nextBtn.disabled = true;
  els.nextBtn.textContent = "已完成";
  state.current = total - 1;
  saveProgress();
  updateProgress();
}

function readWrongbook() {
  try {
    return JSON.parse(localStorage.getItem(wrongKey())) || [];
  } catch {
    localStorage.removeItem(wrongKey());
    return [];
  }
}

function addWrongRecord(question, selected) {
  const records = readWrongbook();
  const profile = activeProfile();
  const record = {
    id: `${question.id}-${Date.now()}`,
    questionId: question.id,
    profileId: profile.id,
    profileName: profile.name,
    grade: profile.grade,
    gradeLabel: gradeConfig[profile.grade]?.label || gradeConfig.grade1.label,
    date: dateKey(),
    day: question.day,
    subject: question.subject,
    skill: question.skill,
    train: question.train,
    title: question.title,
    text: question.text,
    selected,
    answer: question.answer,
    tip: question.tip
  };
  const withoutDuplicate = records.filter((item) => item.questionId !== question.id || item.selected !== selected);
  localStorage.setItem(wrongKey(), JSON.stringify([record, ...withoutDuplicate].slice(0, 80)));
}

function renderWrongbook() {
  const records = readWrongbook();
  const profile = activeProfile();
  els.wrongCount.textContent = records.length ? `${profile.name} 已记录 ${records.length} 道错题｜${weakSummary(records)}` : `${profile.name} 暂无错题`;
  els.wrongList.innerHTML = records.slice(0, 12).map((item) => `
    <article class="wrong-item">
      <strong>${item.subject}｜${item.title}</strong>
      <span>${item.profileName || profile.name}｜${item.gradeLabel || gradeConfig[item.grade]?.label || ""}｜薄弱项：${item.skill || "未标注"}</span>
      <span>${item.text}</span>
      <span>你的答案：${item.selected}；正确答案：${item.answer}</span>
    </article>
  `).join("");
}

function weakSummary(records) {
  const counts = records.reduce((acc, item) => {
    const key = item.skill || item.subject || "未标注";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill, count]) => `${skill}${count}题`)
    .join("、");
}

function saveProgress() {
  const profile = activeProfile();
  const payload = {
    profileId: profile.id,
    profileName: profile.name,
    grade: profile.grade,
    day: state.selectedDay,
    current: state.current,
    correct: state.correct,
    answeredIds: [...state.answeredIds]
  };
  localStorage.setItem(storageKey(), JSON.stringify(payload));
}

function restoreProgress() {
  const raw = localStorage.getItem(storageKey());
  state.current = 0;
  state.correct = 0;
  state.answeredIds = new Set();
  if (!raw) return;
  try {
    const payload = JSON.parse(raw);
    state.current = Math.min(payload.current || 0, state.todayQuestions.length - 1);
    state.correct = Math.min(payload.correct || 0, state.todayQuestions.length);
    state.answeredIds = new Set(payload.answeredIds || []);
  } catch {
    localStorage.removeItem(storageKey());
  }
}

function loadDay(day) {
  state.selectedDay = Number(day);
  state.todayQuestions = generateDayQuestions(state.selectedDay, activeGrade());
  restoreProgress();
  renderRoute();
  renderQuestion();
}

function switchProfile(profileId) {
  if (!state.profiles.some((profile) => profile.id === profileId)) return;
  state.activeProfileId = profileId;
  saveProfiles();
  renderProfiles();
  loadDay(state.selectedDay);
  renderWrongbook();
}

function changeActiveGrade(grade) {
  if (!gradeConfig[grade]) return;
  const profile = activeProfile();
  profile.grade = grade;
  saveProfiles();
  renderProfiles();
  loadDay(state.selectedDay);
  renderWrongbook();
}

function addProfile() {
  const name = els.profileNameInput.value.trim();
  const grade = els.profileGradeSelect.value;
  if (!name) {
    els.profileNameInput.focus();
    return;
  }
  const profile = createProfile(name, grade);
  state.profiles.push(profile);
  state.activeProfileId = profile.id;
  els.profileNameInput.value = "";
  saveProfiles();
  renderProfiles();
  loadDay(state.selectedDay);
  renderWrongbook();
}

function initProfiles() {
  state.profiles = readProfiles();
  if (!state.profiles.length) {
    state.profiles = [createProfile("小小调度员", "grade1")];
  }
  const savedActiveId = localStorage.getItem(activeProfileKey());
  state.activeProfileId = state.profiles.some((profile) => profile.id === savedActiveId)
    ? savedActiveId
    : state.profiles[0].id;
  saveProfiles();
  renderProfiles();
}

function exportWrongbook() {
  const records = readWrongbook();
  const profile = activeProfile();
  const payload = {
    exportedAt: new Date().toISOString(),
    profile,
    storageKey: wrongKey(),
    total: records.length,
    weakSummary: weakSummary(records),
    records
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rail-kids-wrongbook-${profile.name}-${dateKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function init() {
  const now = new Date();
  initProfiles();
  state.selectedDay = activeCycleDay(now);
  els.todayLabel.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  renderDaySelector();
  renderFacts();
  loadDay(state.selectedDay);
  renderWrongbook();
  document.querySelectorAll(".fact-card").forEach((button) => {
    button.addEventListener("click", () => renderFacts(button.dataset.fact));
  });
  els.profileSelect.addEventListener("change", () => switchProfile(els.profileSelect.value));
  els.activeGradeSelect.addEventListener("change", () => changeActiveGrade(els.activeGradeSelect.value));
  els.daySelect.addEventListener("change", () => loadDay(els.daySelect.value));
  els.addProfileBtn.addEventListener("click", addProfile);
  els.profileNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addProfile();
  });
  els.nextBtn.addEventListener("click", nextQuestion);
  els.exportWrongBtn.addEventListener("click", exportWrongbook);
  window.addEventListener("resize", updateProgress);
}

init();
