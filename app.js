const CYCLE_DAYS = 60;
const QUESTIONS_PER_DAY = 10;
const START_DATE = new Date("2026-06-23T00:00:00+08:00");

const facts = {
  cr450: "CR450 是中国新一代高速动车组样车，面向更高速度等级研发。这里把它作为“最新高铁明星”来设计题目，但语数英能力要求仍围绕一、二年级衔接。",
  cr400: "复兴号 CR400 系列是中国高铁 350 km/h 运营的代表车型之一。它是动车组，许多车厢都有动力，像一个配合很好的车队。",
  diesel: "东风系列内燃机车使用柴油机发电或传动，常被叫作燃油机车。它们在没有电气化线路的年代和地区很重要。",
  electric: "韶山、和谐等电力机车从接触网取电，牵引客车或货车。它们不是动车组，但也是中国铁路的重要成员。"
};

const sourceNote = [
  "题型范围参考国家中小学智慧教育平台与义务教育课程标准常见目标。",
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

const englishWords = [
  ["train", "火车"],
  ["station", "车站"],
  ["ticket", "车票"],
  ["fast", "快的"],
  ["slow", "慢的"],
  ["old", "旧的"],
  ["new", "新的"],
  ["green", "绿色"],
  ["red", "红色"],
  ["number", "数字"],
  ["door", "车门"],
  ["seat", "座位"]
];

const els = {
  todayLabel: document.querySelector("#todayLabel"),
  routeLabel: document.querySelector("#routeLabel"),
  stations: document.querySelector("#stations"),
  train: document.querySelector("#train"),
  scoreLabel: document.querySelector("#scoreLabel"),
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

function optionSet(answer, distractors) {
  return [answer, ...distractors.filter((item) => item !== answer)].slice(0, 4);
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

function makeChoiceQuestion({ day, slot, subject, skill, train, title, text, answer, choices, tip }) {
  return {
    id: `D${String(day).padStart(2, "0")}-Q${String(slot + 1).padStart(2, "0")}`,
    day,
    slot,
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

function generateQuestion(day, slot) {
  const train = trainTypes[(day + slot) % trainTypes.length];
  const route = routePool[(day + slot) % routePool.length];
  const word = chineseWords[(day * 3 + slot) % chineseWords.length];
  const english = englishWords[(day * 5 + slot) % englishWords.length];
  const base = day * 7 + slot * 5;
  const a = 12 + ((base * 3) % 68);
  const b = 5 + ((base * 2) % 28);
  const c = 3 + ((base + day) % 18);
  const routeText = `${route[0]}到${route[route.length - 1]}`;

  switch (slot) {
    case 0:
      return makeChoiceQuestion({
        day,
        slot,
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
        subject: "语文",
        skill: "句子表达",
        train,
        title: `第${day}天 通顺广播`,
        text: `${routeText}的列车进站了。哪句话最通顺？`,
        answer: `${trainNames[train]}缓缓开进站台。`,
        choices: [
          `${trainNames[train]}缓缓开进站台。`,
          `站台缓缓开进${trainNames[train]}。`,
          `开进缓缓站台列车。`,
          `${trainNames[train]}站台进开缓缓。`
        ],
        tip: "通顺的句子一般能清楚说出“谁做什么”。"
      });
    case 3: {
      const answer = a + b;
      return makeChoiceQuestion({
        day,
        slot,
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
      const start = 20 + ((day * 4 + slot) % 45);
      const add = 6 + ((day + slot) % 18);
      const remove = 3 + ((day * 2 + slot) % 15);
      const answer = start + add - remove;
      return makeChoiceQuestion({
        day,
        slot,
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
      return makeChoiceQuestion({
        day,
        slot,
        subject: "英语",
        skill: "英语词汇",
        train,
        title: `第${day}天 单词广播`,
        text: `列车广播出现单词 “${english[0]}”。它的中文意思是什么？`,
        answer: english[1],
        choices: optionSet(english[1], ["火车", "车站", "车票", "快的", "慢的", "新的", "旧的", "绿色", "座位"]),
        tip: `${english[0]} 的意思是“${english[1]}”。`
      });
    case 8:
      return makeChoiceQuestion({
        day,
        slot,
        subject: "英语",
        skill: "英语句型",
        train,
        title: `第${day}天 句子启蒙`,
        text: `想说“这是一列火车”，哪一句最合适？`,
        answer: "This is a train.",
        choices: ["This is a train.", "This are train.", "I am station.", "Train is this a."],
        tip: "This is a train. 可以表示“这是一列火车”。"
      });
    default: {
      const cars = 6 + ((day + slot) % 10);
      const people = cars * 2 + ((day * 3) % 9);
      const answer = people - cars;
      return makeChoiceQuestion({
        day,
        slot,
        subject: "综合",
        skill: "综合应用",
        train,
        title: `第${day}天 小调度员挑战`,
        text: `${routeText}的${trainNames[train]}有 ${cars} 节模拟车厢。每节先放 2 个座位标记，又多出 ${people - cars * 2} 个备用标记。标记总数比车厢数多多少？`,
        answer,
        choices: mathOptions(answer),
        tip: `先算标记总数 ${people}，再比车厢多多少：${people} - ${cars} = ${answer}。`
      });
    }
  }
}

function generateDayQuestions(day) {
  return Array.from({ length: QUESTIONS_PER_DAY }, (_, slot) => generateQuestion(day, slot));
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
  return `railKidsProgress-v2-day-${state.selectedDay}`;
}

function wrongKey() {
  return "railKidsWrongbook-v1";
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
  const record = {
    id: `${question.id}-${Date.now()}`,
    questionId: question.id,
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
  els.wrongCount.textContent = records.length ? `已记录 ${records.length} 道错题｜${weakSummary(records)}` : "暂无错题";
  els.wrongList.innerHTML = records.slice(0, 12).map((item) => `
    <article class="wrong-item">
      <strong>${item.subject}｜${item.title}</strong>
      <span>薄弱项：${item.skill || "未标注"}</span>
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
  const payload = {
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
  state.todayQuestions = generateDayQuestions(state.selectedDay);
  restoreProgress();
  renderRoute();
  renderQuestion();
}

function exportWrongbook() {
  const records = readWrongbook();
  const payload = {
    exportedAt: new Date().toISOString(),
    storageKey: wrongKey(),
    total: records.length,
    weakSummary: weakSummary(records),
    records
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rail-kids-wrongbook-${dateKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function init() {
  const now = new Date();
  state.selectedDay = activeCycleDay(now);
  els.todayLabel.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  renderDaySelector();
  renderFacts();
  loadDay(state.selectedDay);
  renderWrongbook();
  document.querySelectorAll(".fact-card").forEach((button) => {
    button.addEventListener("click", () => renderFacts(button.dataset.fact));
  });
  els.daySelect.addEventListener("change", () => loadDay(els.daySelect.value));
  els.nextBtn.addEventListener("click", nextQuestion);
  els.exportWrongBtn.addEventListener("click", exportWrongbook);
  window.addEventListener("resize", updateProgress);
}

init();
