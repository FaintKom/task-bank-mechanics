// library.js — единый источник истины по механикам (превью + описание + спецификация).
// Classic script (no JSX, no build). Подключается на 20 страницах механик одной строкой:
//   <script src="mechx/library.js"></script>
// Скрипт сам определяет механику по имени файла, рисует секции «Эталон-дизайн» и
// «Описание и спецификация» сразу после <header class="cover"> и не трогает
// существующие «Рабочий пример» и «Edge-кейсы». Палитра берётся из :root страницы.
//
// Эталон превью это макеты Figma (assets/previews/<id>/), отрисованные в пропорции
// 1280×800 (Lenovo Tab K11, целевое устройство ученика). Где официального макета нет,
// эталоном служит рабочий React-пример ниже на странице.
(function () {
  "use strict";

  // file -> {n, id, name}. Имена файлов точно совпадают с файлами (кириллица + пробелы).
  var MECHS = [
    { n: "01", id: "choice",          file: "Механика 01 - Выбор ответа.html" },
    { n: "02", id: "text-with-slots", file: "Механика 02 - Текст с пропусками.html" },
    { n: "03", id: "number-line",     file: "Механика 03 - Числовая прямая.html" },
    { n: "04", id: "number-grid",     file: "Механика 04 - Числовая таблица.html" },
    { n: "05", id: "table-grid",      file: "Механика 05 - Заполни таблицу.html" },
    { n: "06", id: "match-columns",   file: "Механика 06 - Сопоставление.html" },
    { n: "07", id: "column-add",      file: "Механика 07 - Сложение в столбик.html" },
    { n: "08", id: "drag-drop-set",   file: "Механика 08 - Перетаскивание по группам.html" },
    { n: "09", id: "sequence-track",  file: "Механика 09 - Упорядочивание.html" },
    { n: "10", id: "slider-control",  file: "Механика 10 - Ползунок.html" },
    { n: "11", id: "array-grid",      file: "Механика 11 - Прямоугольный массив.html" },
    { n: "12", id: "base10-blocks",   file: "Механика 12 - Блоки разрядов.html" },
    { n: "13", id: "fraction-shade",  file: "Механика 13 - Закрась части.html" },
    { n: "14", id: "clock",           file: "Механика 14 - Часы.html" },
    { n: "15", id: "coins",           file: "Механика 15 - Монеты.html" },
    { n: "16", id: "balance-scale",   file: "Механика 16 - Весы и гири.html" },
    { n: "17", id: "ruler",           file: "Механика 17 - Линейка.html" },
    { n: "18", id: "angle",           file: "Механика 18 - Угол.html" },
    { n: "19", id: "bar-chart",       file: "Механика 19 - Построй диаграмму.html" },
    { n: "20", id: "coordinate-grid", file: "Механика 20 - Координатная сетка.html" }
  ];

  // id -> контент библиотеки. fig = canonical-файл в assets/previews/<id>/ (null = макета нет).
  // vers = [[файл, подпись], …] версии композиции. score из data.js (с разметкой <b>).
  // warn = расхождение макета и кода (амбер). info = принятое решение / пояснение (фиолетовый).
  var LIBRARY = {
    "choice": {
      fig: "single.jpg",
      figName: "Single choice",
      cap: "Одиночный выбор: выбран вариант «12», кнопка «Проверить» активна.",
      vers: [],
      desc: "Вопрос с 2–6 вариантами-кнопками в столбик. Один верный индекс задаёт одиночный выбор, несколько верных задают множественный. Выбор подтверждается отдельной кнопкой «Проверить» (защита от случайного касания).",
      use: "Все классы. В g4: сравнение, делимость, округление, выбор формулы.",
      score: "<b>score:</b> точное совпадение множеств: выбранные === все correct_indices. Частичного зачёта нет.",
      note: "Опции min-h 68px. В Graded верные подсвечены зелёным, ошибки ребёнка коралловым.",
      info: "В Figma макет это только одиночный выбор (столбик кнопок). Код поддерживает и множественный выбор (несколько correct_indices), но отдельного макета на него нет. Сетку «Multiple choice» из Figma команда относит к механике «Числовая таблица» (№04), не сюда."
    },
    "text-with-slots": {
      fig: "dropdown.jpg",
      figName: "Drop-down",
      cap: "Пропуск-выпадашка и числовое поле в одной строке; снизу экранная клавиатура.",
      vers: [["equation.jpg", "Ввод в уравнении"]],
      desc: "Строка текста со встроенными пропусками {0}, {1}, … Числовой пропуск это нативное поле (inputMode=decimal), пропуск-выбор это Radix Select (выпадашка). Слоты остаются inline в тексте и переносятся вместе со словами.",
      use: "Все классы. Ядро g4: уравнения, разрядные слагаемые, многошаговые ответы.",
      score: "<b>score:</b> верно, когда все слоты верны. Число парсится с запятой как разделителем, пустое значение или NaN неверны, «0» валидно. Поразрядная подсветка слотов в Graded.",
      note: "Поразрядный фидбек: при ошибке коралловый только неверный слот, верные сохраняются.",
      info: "Команда оставляет нативный Radix Select везде: переход на крупные чипы-кнопки признан лишним усложнением и не берётся (Maksim, Julia)."
    },
    "number-line": {
      fig: "active.jpg",
      figName: "Number line",
      cap: "Ось 0–10, маркер-указатель под осью (в сборке это кружок с зелёным гало).",
      vers: [["v3.jpg", "Композиция (v3)"], ["v4.jpg", "Композиция (v4)"]],
      desc: "Горизонтальная ось (SVG). Поверх делений лежат невидимые тап-кнопки шириной не меньше 44px. Маркер это кружок, в Graded на нужном делении раскрывается зелёное гало.",
      use: "g4: размещение, сравнение и округление чисел. Для больших чисел нужен крупный шаг.",
      score: "<b>score:</b> value === target (точное равенство). Деление вне сетки шага недостижимо. Рендерится 2..60 делений, иначе заглушка «—».",
      warn: "Макет и код расходятся. В макете маркер это домик-указатель под осью и зелёная заливка отрезка, плюс есть режимы отрезка (два маркера), ответа через уравнение и с картинкой. В сборке это один кружок с кольцом-гало и только точное размещение. Свести с командой дизайна."
    },
    "number-grid": {
      fig: "active.jpg",
      figName: "Multiple choice",
      cap: "Вопрос с сеткой числовых вариантов; выбрано несколько, кнопка «Проверить».",
      vers: [["v3.jpg", "Композиция (v3)"]],
      desc: "Таблица идущих подряд чисел. Тап по клетке выделяет её или снимает выделение. Клетки квадратные, min-h 56px.",
      use: "g4: делители, кратные, простые до 100 (g4-28). Сетка 10×10 на планшете плотная.",
      score: "<b>score:</b> множество выбранных === множеству правила (точно). primes: 1 не простое. divisors: включает 1 и само число. Рендер до 200 клеток, иначе «—».",
      warn: "В Figma макет назван «Multiple choice» и показан как вопрос с сеткой числовых вариантов-ответов (множественный выбор). В коде это таблица идущих подряд чисел с выбором по правилу (кратные, делители, простые). Модель ввода одна (тап по клеткам сетки), но источник чисел разный, свести с командой дизайна."
    },
    "table-grid": {
      fig: "active.jpg",
      figName: "Table",
      cap: "Таблица с готовыми значениями и пустыми ячейками для ввода.",
      vers: [["q2.jpg", "Таблица умножения"], ["q2-alt.jpg", "Таблица умножения (вариант)"]],
      desc: "Таблица с готовыми значениями и пустыми ячейками. Пропуск это нативное поле (inputMode=numeric). Зачёт наступает, когда все пропуски верны.",
      use: "g4: таблицы умножения и разрядов, машины вход-выход, блок-схемы (g4-49).",
      score: "<b>score:</b> все blank-ячейки совпадают. Сравнение числовое (запятая или точка), иначе по тексту. Пустое значение неверно. Поклеточная подсветка."
    },
    "match-columns": {
      fig: "active.jpg",
      figName: "Match columns",
      cap: "Два столбца, соединение перетаскиванием-ниточкой.",
      vers: [],
      desc: "Два столбца. Соединение тапом (пример, затем ответ) или перетаскиванием-ниточкой. Связки это прямые линии (SVG). Правый столбец без повторов, перемешан, поддерживает связь многие-к-одному.",
      use: "g4: сопоставление выражения и значения, факта и результата (g4-30,46).",
      score: "<b>score:</b> для каждого левого подключённая правая плитка по значению === pairs[i].right. Левый без связи считается неверным. Линии прямые.",
      warn: "Левый элемент без связи грейдится как ошибка, хотя ребёнок мог просто не успеть. Прямые линии при 6+ парах пересекаются и путают (в редизайне их разводили дугами)."
    },
    "column-add": {
      fig: "active.jpg",
      figName: "Column Add",
      cap: "Сложение столбиком, ответ по разрядам в отдельные поля.",
      vers: [["v3.jpg", "Композиция (v3)"], ["v4.jpg", "Композиция (v4)"]],
      desc: "Сложение двух чисел столбиком. Ответ вводится в нативные поля по разрядам (inputMode=numeric, maxLength 1, системная клавиатура). Авто-перехода фокуса между разрядами нет.",
      use: "g4: сложение в столбик с переходом через разряд (g4-12). Только сложение.",
      score: "<b>component:</b> каждый разряд подсвечивается отдельно (digit[j] === ожидаемая). <b>score:</b> сверяет ответ как целое число === a+b. Рендер 1..8 колонок.",
      note: "Поразрядная подсветка сильная. Места для «1 в уме» в макете нет, фокус между полями переключается вручную."
    },
    "drag-drop-set": {
      fig: "active.jpg",
      figName: "Drag&Drop",
      cap: "Карточки и зоны-группы; карточка в состоянии перетаскивания.",
      vers: [],
      desc: "Карточки и 2–4 зоны-группы. Два способа ввода: перетаскивание (pointer-events) и tap-tap (тап по карточке, затем тап по группе). tap-tap дружелюбен к слабой моторике.",
      use: "g4: разряды по классам, чётные и нечётные, делимость (g4-03,29).",
      score: "<b>score:</b> все items в верной зоне (item.zone). Карточка, оставленная в лотке, считается неверной. touch-action:none на карточке.",
      warn: "Забытая в лотке карточка грейдится как ошибка, неотличимо от настоящей ошибки. Авто-возврата неверной карточки в лоток нет."
    },
    "sequence-track": {
      fig: "active.jpg",
      figName: "Sequence",
      cap: "Ряд плиток, выбранная приподнята для обмена местами.",
      vers: [["v2.jpg", "Композиция (v2)"], ["v3.jpg", "Композиция (v3)"], ["v4.jpg", "Композиция (v4)"]],
      desc: "Ряд плиток. Тап выделяет плитку, тап по второй меняет их местами. Стартовый порядок детерминирован (реверс правильного). Обмен тапами надёжнее перетаскивания.",
      use: "g4: упорядочивание 3–5 чисел по возрастанию или убыванию (g4-09).",
      score: "<b>score:</b> JSON.stringify(value) === stringify(items), это точный порядок. В Graded плитка зелёная, если стоит в своей итоговой позиции.",
      info: "Статус механики в данных «mockup»: нужно довести до готового."
    },
    "slider-control": {
      fig: "active.jpg",
      cap: "«Поставь ползунок на нужное число», трек 0–10 с делениями и бегунком.",
      vers: [],
      desc: "Нативный input[type=range]. Текущее значение показывается крупно и живо. Подписи min и max под шкалой.",
      use: "g4: прикидка и округление с допуском, размещение на шкале (g4-34,35).",
      score: "<b>score:</b> |value − target| ≤ tolerance (по умолчанию 0, то есть точно). step по умолчанию 1."
    },
    "array-grid": {
      fig: "active.jpg",
      figName: "Grid",
      cap: "«Создай прямоугольник с периметром 16 единиц», углы перетаскиваются по сетке.",
      vers: [["v3.jpg", "Композиция (v3)"], ["v4.jpg", "Композиция (v4)"]],
      desc: "Сетка клеток. В сборке один тап строит прямоугольник r×c от верхнего левого угла, под сеткой живёт подпись «r × c = произведение».",
      use: "g4: модель площади для умножения, распределительное свойство (g4-21,30).",
      score: "<b>score:</b> rows === target_rows и cols === target_cols (точно). Коммутативность не принимается: 3×4 не то же самое, что 4×3. Рендер до 150 клеток.",
      warn: "В макете задача «построй прямоугольник с заданным периметром»: углы перетаскиваются, проверяется периметр, произведения r×c нет. В коде это модель площади: тап строит r×c, проверяются стороны. Это разные модели, свести с командой дизайна."
    },
    "base10-blocks": {
      fig: "active.jpg",
      cap: "«Собери число двести тридцать четыре», степперы +/− по разрядам: сотни, десятки, единицы.",
      vers: [],
      desc: "Три колонки блоков (сотни, десятки, единицы). Кнопки +/− (48px) набирают число, текущая сумма живая, «нужно» показывается в Graded.",
      use: "1–3 класс (состав числа). g4 работает до 1 000 000, а блоки только до сотен.",
      score: "<b>score:</b> hundreds·100 + tens·10 + ones === target. Любой состав засчитывается (23 десятка = 230). Потолок 15 на разряд, target 0–999."
    },
    "fraction-shade": {
      fig: "active.jpg",
      figName: "Fraction Shade",
      cap: "Фигура из равных частей, тап закрашивает часть.",
      vers: [["v3.jpg", "Композиция (v3)"], ["v4.jpg", "Композиция (v4)"]],
      desc: "Фигура из равных частей: круг, полоса или рамка (ten-frame). Тап закрашивает часть. Счётчик «N/denominator» и «нужно» показываются только в Graded.",
      use: "Дроби (позже) или счёт до 20 в форме рамки (1–2 класс). Вне ядра g4-т1.",
      score: "<b>score:</b> число закрашенных === target_filled. Какие именно части, неважно. Рендер denominator 1..24, иначе «—». Рамка: 5 в ряд."
    },
    "clock": {
      fig: "active.jpg",
      figName: "Clock",
      cap: "Аналоговый циферблат, час и минуты ставятся тапом.",
      vers: [["active-alt.jpg", "Другое время"]],
      desc: "Аналоговый циферблат (SVG). Час ставится тапом по зоне над цифрой (Ø≈32px), минуты тапом по точке на ободе (Ø≈28px). Это два отдельных действия.",
      use: "Младшие классы (1–3). В g4-т1 темы времени нет.",
      score: "<b>score:</b> hour === target_hour и minute === target_minute (оба точно). Минуты кратны 5. Табло «H:MM» и «нужно» только в Graded.",
      warn: "Тап-зоны 28–32px ниже норматива 44px, самая перегруженная по моторике механика. Требование «поставь и час, и минуты» нужно проговорить явно."
    },
    "coins": {
      fig: "active.jpg",
      cap: "«Собери 18 рублей» монетами разного номинала (1, 2, 5, 10), под каждой степпер +/−.",
      vers: [],
      desc: "Ряд монет-номиналов, под каждой кнопки +/− (44px). Текущая сумма живая, цвет (зелёный или коралловый) и «нужно» показываются в Graded.",
      use: "1–3 класс (деньги). Вне ядра g4-т1.",
      score: "<b>score:</b> сумма монет === target. Любой набор. Потолок 20 на номинал, coins 1..8 шт., unit по умолчанию ₽."
    },
    "balance-scale": {
      fig: null,
      desc: "Рычажные весы (SVG): слева груз, справа чаша. Кнопки +/− (44px) добавляют гири, коромысло наклоняется живо (до ±14°), это самопроверка через физику.",
      use: "2–3 класс (масса, состав числа). Вне ядра g4-т1.",
      score: "<b>score:</b> сумма гирь справа === left_grams. Любая комбинация. Потолок 20 на номинал, weights 1..6 шт.",
      info: "Официального макета в Figma нет. Эталон это рабочий React-пример ниже на странице."
    },
    "ruler": {
      fig: null,
      desc: "Линейка со шкалой (SVG), предмет лежит от 0 до своей длины. Невидимые тап-кнопки не меньше 40px на делениях. В Graded раскрывается верное деление.",
      use: "Младшие классы (2–3, измерение). Вне ядра g4-т1.",
      score: "<b>score:</b> value === length (точно). Предмет всегда от нуля. Рендер max 1..60, иначе «—». Подписи каждые 5 единиц.",
      info: "Официального макета в Figma нет. Эталон это рабочий React-пример ниже на странице."
    },
    "angle": {
      fig: "active.jpg",
      figName: "Angle",
      cap: "Транспортир-полукруг, подвижный луч задаёт угол.",
      vers: [],
      desc: "Транспортир-полукруг (SVG): базовый луч на 0°, тап по точке-отметке (Ø≈28px) задаёт угол. Подвижный луч показывает угол живо. В Graded появляется пунктирный зелёный луч на target.",
      use: "Геометрия 4–5 класс. В g4-т1 углов нет.",
      score: "<b>score:</b> value === target_deg (точно). Шаг step (по умолчанию 15°), если 180/step > 60, происходит откат к 15.",
      warn: "Отметки ≈28px это самые мелкие тап-цели в наборе, при шаге 5° их до 37 на дуге, очень тесно."
    },
    "bar-chart": {
      fig: "active.jpg",
      figName: "Graph",
      cap: "Столбчатая диаграмма, тап по ячейке задаёт высоту столбика.",
      vers: [["v3.jpg", "Композиция (v3)"], ["v4.jpg", "Композиция (v4)"]],
      desc: "Столбчатая диаграмма. Тап по ячейке уровня задаёт высоту столбика. Чтобы понизить, нужен тап по более низкой ячейке.",
      use: "Кросс-предметно (работа с данными). Вне числового блока g4-т1.",
      score: "<b>score:</b> каждый столбик value[i] === target. Незаданный столбик = 0. Рендер: max 1..20, столбиков 1..12, иначе «—».",
      warn: "Понижение неинтуитивно: отмены на один уровень нет, ребёнок может не догадаться тапнуть нижнюю ячейку."
    },
    "coordinate-grid": {
      fig: "active.jpg",
      cap: "«Построй график по координатам x, y»: точки на сетке соединяются в ломаную.",
      vers: [],
      desc: "Координатная плоскость (SVG) с осями X и Y. Тап по узлу (Ø≈34px) ставит точку. В Graded раскрывается нужный узел зелёным гало.",
      use: "4–5 класс и позже. В g4-т1 координатной плоскости нет.",
      score: "<b>score:</b> x === target_x и y === target_y (точно). Рендер (x_max+1)(y_max+1) ≤ 200, иначе «—».",
      warn: "В макете строится график-ломаная по нескольким парам (x, y): точки на сетке соединяются линией, как в графике функции (слева плейсхолдер «image» под картинку-условие). В коде это постановка одной точки на узле (x === target_x, y === target_y), без линии и без таблицы координат. Это разные задачи, свести с командой дизайна."
    }
  };

  // ---- helpers ----
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  var here = "";
  try { here = decodeURIComponent(location.pathname.split("/").pop() || ""); }
  catch (e) { here = location.pathname.split("/").pop() || ""; }

  var mech = null;
  for (var i = 0; i < MECHS.length; i++) {
    if (MECHS[i].file === here) { mech = MECHS[i]; break; }
  }

  // Данные доступны другим страницам (например, обзору) независимо от текущего файла.
  window.LIBRARY = LIBRARY;
  window.LIBRARY_MECHS = MECHS;

  if (!mech || !LIBRARY[mech.id]) return; // не страница механики (обзор/аудит) — выходим

  var d = LIBRARY[mech.id];
  var base = "assets/previews/" + mech.id + "/";

  // ---- styles (namespaced .lib-*, цвета из :root страницы) ----
  var css = [
    '.lib-sec{margin:0 0 8px;}',
    '.lib-figname{max-width:880px;margin:10px auto 0;text-align:center;font-size:12px;color:var(--ink-soft);}',
    '.lib-figname b{display:inline-block;font-family:"SFMono-Regular",Consolas,monospace;font-weight:600;color:var(--ink-soft);background:#F3F2F6;border:1px solid var(--line);border-radius:6px;padding:2px 8px;margin-left:4px;}',
    '.lib-shot{max-width:880px;margin:18px auto 0;border:1px solid var(--line);border-radius:18px;',
      'overflow:hidden;background:#fff;box-shadow:0 10px 30px rgba(16,24,40,.08);}',
    '.lib-shot img{display:block;width:100%;height:auto;aspect-ratio:1280/800;object-fit:cover;background:#fff;}',
    '.lib-cap{max-width:880px;margin:10px auto 0;font-size:13px;color:var(--ink-soft);text-align:center;}',
    '.lib-vers{max-width:880px;margin:16px auto 0;display:flex;flex-wrap:wrap;gap:12px;justify-content:center;}',
    '.lib-thumb{border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;cursor:pointer;',
      'width:150px;transition:border-color .15s,box-shadow .15s;}',
    '.lib-thumb:hover,.lib-thumb.on{border-color:var(--purple);box-shadow:0 0 0 2px rgba(88,0,229,.14);}',
    '.lib-thumb img{display:block;width:100%;height:auto;aspect-ratio:1280/800;object-fit:cover;}',
    '.lib-thumb span{display:block;font-size:11px;color:var(--ink-soft);text-align:center;padding:5px 6px;border-top:1px solid var(--line);}',
    '.lib-nofig{max-width:760px;margin:16px auto 0;padding:22px 24px;border:1px dashed var(--line);border-radius:14px;',
      'background:#fff;text-align:center;color:var(--ink-soft);font-size:14px;}',
    '.lib-nofig b{color:var(--ink);}',
    '.lib-desc{font-size:15px;color:var(--ink);max-width:72ch;margin:0 0 18px;}',
    '.lib-kv{display:grid;grid-template-columns:160px 1fr;gap:0;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff;}',
    '.lib-kv>dt{padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;',
      'color:var(--purple);background:var(--info-bg);border-top:1px solid var(--line);}',
    '.lib-kv>dd{padding:12px 16px;margin:0;font-size:14px;color:var(--ink);border-top:1px solid var(--line);}',
    '.lib-kv>dt:first-of-type,.lib-kv>dd:first-of-type{border-top:none;}',
    '.lib-kv code,.lib-kv .mid{font-family:"SFMono-Regular",Consolas,monospace;font-size:12.5px;color:var(--ink-soft);}',
    '.lib-kv b{color:var(--purple-deep);}',
    '.lib-flag{margin:16px 0 0;padding:13px 16px;border-radius:10px;font-size:13.5px;line-height:1.55;}',
    '.lib-flag.warn{background:var(--warn-bg);color:#6e4400;border:1px solid #EBD7A8;}',
    '.lib-flag.warn b{color:var(--warn);}',
    '.lib-flag.info{background:var(--info-bg);color:var(--purple-deep);}',
    '.lib-flag .lf-h{font-weight:700;}',
    '@media (max-width:760px){.lib-kv{grid-template-columns:1fr;}.lib-kv>dt{border-top:1px solid var(--line);}',
      '.lib-thumb{width:130px;}}'
  ].join("");
  var style = document.createElement("style");
  style.setAttribute("data-mech-lib", "");
  style.textContent = css;
  document.head.appendChild(style);

  // ---- build: section 1, Эталон-дизайн ----
  function buildPreview() {
    var sec = el("section", "lib-sec");
    sec.appendChild(el("h2", null, "Эталон-дизайн"));
    sec.appendChild(el("div", "h2sub", d.fig ? "Текущий макет Figma" : "Рабочий пример как эталон"));
    if (d.figName) sec.appendChild(el("div", "lib-figname", 'Figma: <b>' + d.figName + '</b>'));

    if (!d.fig) {
      sec.appendChild(el("div", "lib-nofig",
        "<b>Официального макета в Figma пока нет.</b><br>Эталоном служит рабочий React-пример ниже на странице, в разделе «Как работает»."));
      return sec;
    }

    var shot = el("figure", "lib-shot");
    var img = el("img");
    img.src = base + d.fig;
    img.alt = "Макет механики «" + (document.title || mech.id) + "»";
    img.loading = "lazy";
    shot.appendChild(img);
    sec.appendChild(shot);
    if (d.cap) sec.appendChild(el("figcaption", "lib-cap", d.cap));

    // версии композиции + canonical как первый thumbnail для переключения
    var all = [[d.fig, "Эталон"]].concat(d.vers || []);
    if (all.length > 1) {
      var strip = el("div", "lib-vers");
      all.forEach(function (v, idx) {
        var t = el("div", "lib-thumb" + (idx === 0 ? " on" : ""));
        var ti = el("img"); ti.src = base + v[0]; ti.alt = v[1]; ti.loading = "lazy";
        t.appendChild(ti);
        t.appendChild(el("span", null, v[1]));
        t.addEventListener("click", function () {
          img.src = base + v[0];
          if (d.cap && idx === 0) { /* keep */ }
          var caps = sec.querySelector(".lib-cap");
          if (caps) caps.textContent = idx === 0 ? (d.cap || "") : v[1];
          strip.querySelectorAll(".lib-thumb").forEach(function (n) { n.classList.remove("on"); });
          t.classList.add("on");
        });
        strip.appendChild(t);
      });
      sec.appendChild(strip);
    }
    return sec;
  }

  // ---- build: section 2, Описание и спецификация ----
  function buildSpec() {
    var sec = el("section", "lib-sec");
    sec.appendChild(el("h2", null, "Описание и спецификация"));
    sec.appendChild(el("div", "h2sub", "Что это и как устроено"));
    if (d.desc) sec.appendChild(el("p", "lib-desc", d.desc));

    var kv = el("dl", "lib-kv");
    function row(k, v) { kv.appendChild(el("dt", null, k)); kv.appendChild(el("dd", null, v)); }
    if (d.use) row("Когда использовать", d.use);
    if (d.score) row("Проверка", d.score);
    if (d.note) row("Особенности", d.note);
    row("Код", '<span class="mid">@math/core/mechanics/' + mech.id +
      '</span> · <span class="mid">components/mechanics/' + mech.id + '/' + mech.id + '.tsx</span>');
    sec.appendChild(kv);

    if (d.warn) sec.appendChild(el("div", "lib-flag warn",
      '<span class="lf-h">⚠ Макет и код расходятся.</span> ' + d.warn));
    if (d.info) sec.appendChild(el("div", "lib-flag info", d.info));
    return sec;
  }

  function mount() {
    var host = document.querySelector(".wrap") || document.body;
    var header = host.querySelector("header.cover");
    var s1 = buildPreview();
    var s2 = buildSpec();
    if (header && header.parentNode) {
      // insert s2 then s1 after header => final order: header, s1, s2
      header.insertAdjacentElement("afterend", s2);
      header.insertAdjacentElement("afterend", s1);
    } else {
      host.insertBefore(s2, host.firstChild);
      host.insertBefore(s1, host.firstChild);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
