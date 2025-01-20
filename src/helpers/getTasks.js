const priorities = ["LOW", "MEDIUM", "HIGH"];
const categories = ["TODO", "INPROGRESS", "DONE"];
const tasksTitle = [
  "Провести зустріч з командою для оновлення проектних завдань",
  "Перевірити та відповісти на електронні листи",
  "Підготувати звіт про прогрес проекту для керівництва",
  "Оновити сторінку календаря зі стрічкою новин",
  "Провести технічний аудит безпеки в системі",
  "Відправити запрошення на зустріч з партнерами",
  "Організувати онлайн-конференцію для дискусії із командою",
  "Підготувати та розіслати меморандум про нові стандарти безпеки",
  "Налаштувати автоматичну систему архівування листів",
  "Оптимізувати код використовуючи нові підходи та бібліотеки",
  "Вивчити та впровадити нові функціональності Emotion's Styled для покращеної стилізації інтерфейсу",
  "Провести тренінг для команди з використання нових функцій Redux Toolkit Query",
  "Оновити документацію проекту з урахуванням внесених змін",
  "Провести онлайн-голосування для вибору нових назв для підпроектів",
  "Навчитися та впровадити нові хуки React для оптимізації логіки компонентів",
  "Переглянути результати інтерв'ю з користувачами та внести корективи у дизайн інтерфейсу",
  "Запустити новий рекламний кампанію для привертання нових користувачів",
  "Провести аналіз ефективності заходів з підтримки українських захисників та розробити план подальших дій",
  "Підготувати короткий огляд інновацій використання допоміжних бібліотек у проекті",
  "Вивчити та впровадити нові функціональності бібліотеки i18 для реалізації інтернаціоналізації",
  "Створити та підтримувати список актуальних та нагальних завдань в команді",
];

function getTasks(taskCount, owners, startMonth, endMonth) {
  const tasks = [];

  function generateRandomTime() {
    const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, "0");
    return `${hour}:${minute}`;
  }

  function generateRandomDate(startMonth, endMonth) {
    const startYear = parseInt(startMonth.split("-")[0]);
    const startMonthNum = parseInt(startMonth.split("-")[1]);
    const endYear = parseInt(endMonth.split("-")[0]);
    const endMonthNum = parseInt(endMonth.split("-")[1]);

    const randomYear =
      startYear + Math.floor(Math.random() * (endYear - startYear + 1));
    const randomMonthNum =
      startMonthNum +
      Math.floor(Math.random() * (endMonthNum - startMonthNum + 1));
    const day = String(Math.floor(Math.random() * 30) + 1).padStart(2, "0");

    return `${randomYear}-${String(randomMonthNum).padStart(2, "0")}-${day}`;
  }

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  for (let i = 0; i < taskCount; i++) {
    const title = getRandomElement(tasksTitle);
    const start = generateRandomTime();

    let end;
    do {
      end = generateRandomTime();
    } while (end <= start);

    const priority = getRandomElement(priorities);
    const date = generateRandomDate(startMonth, endMonth);
    const category = getRandomElement(categories);
    const owner = owners;

    const task = {
      title: title,
      start: start,
      end: end,
      priority: priority,
      date: date,
      category: category,
      owner: owner,
    };

    tasks.push(task);
  }
  return tasks;
}

module.exports = getTasks;
