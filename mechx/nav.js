// Shared inter-page navigation for the offline bundle.
// Classic script (no JSX, no build step). Injects a namespaced top bar into .wrap
// on every page, detects the current page by filename, marks the active section,
// and adds prev/next between the 20 mechanic pages. All hrefs are relative, so it
// works from the unpacked archive over file:// and over a local server alike.
(function () {
  "use strict";

  // Main page (главная) first. Filenames match the files exactly (Cyrillic + spaces)
  // and are used directly as relative hrefs.
  var SECTIONS = [
    { file: "Механики - обзор.html", label: "Обзор" }
  ];

  var MECHS = [
    { n: "01", name: "Выбор ответа",              file: "Механика 01 - Выбор ответа.html" },
    { n: "02", name: "Текст с пропусками",        file: "Механика 02 - Текст с пропусками.html" },
    { n: "03", name: "Числовая прямая",           file: "Механика 03 - Числовая прямая.html" },
    { n: "04", name: "Числовая таблица",          file: "Механика 04 - Числовая таблица.html" },
    { n: "05", name: "Заполни таблицу",           file: "Механика 05 - Заполни таблицу.html" },
    { n: "06", name: "Сопоставление",             file: "Механика 06 - Сопоставление.html" },
    { n: "07", name: "Сложение в столбик",        file: "Механика 07 - Сложение в столбик.html" },
    { n: "08", name: "Перетаскивание по группам", file: "Механика 08 - Перетаскивание по группам.html" },
    { n: "09", name: "Упорядочивание",            file: "Механика 09 - Упорядочивание.html" },
    { n: "10", name: "Ползунок",                  file: "Механика 10 - Ползунок.html" },
    { n: "11", name: "Прямоугольный массив",      file: "Механика 11 - Прямоугольный массив.html" },
    { n: "12", name: "Блоки разрядов",            file: "Механика 12 - Блоки разрядов.html" },
    { n: "13", name: "Закрась части",             file: "Механика 13 - Закрась части.html" },
    { n: "14", name: "Часы",                      file: "Механика 14 - Часы.html" },
    { n: "15", name: "Монеты",                    file: "Механика 15 - Монеты.html" },
    { n: "16", name: "Весы и гири",               file: "Механика 16 - Весы и гири.html" },
    { n: "17", name: "Линейка",                   file: "Механика 17 - Линейка.html" },
    { n: "18", name: "Угол",                      file: "Механика 18 - Угол.html" },
    { n: "19", name: "Построй диаграмму",         file: "Механика 19 - Построй диаграмму.html" },
    { n: "20", name: "Координатная сетка",        file: "Механика 20 - Координатная сетка.html" }
  ];

  // Current file name, decoded (pathname is percent-encoded under file:// and http).
  var here = "";
  try {
    here = decodeURIComponent(location.pathname.split("/").pop() || "");
  } catch (e) {
    here = location.pathname.split("/").pop() || "";
  }

  // Self-contained, namespaced styles. Palette is hardcoded so the bar looks right
  // on the обзор / аудит pages too, which do not load mech-theme.css.
  var css = [
    '#mech-nav{font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;',
      'display:flex;flex-wrap:wrap;align-items:center;gap:10px 20px;justify-content:space-between;',
      'margin:0 0 38px;padding:10px 14px;border:1px solid #E6E4EA;border-radius:14px;background:#fff;',
      'box-shadow:0 6px 18px rgba(16,24,40,.05);}',
    '#mech-nav .mnav-sections{display:flex;flex-wrap:wrap;align-items:center;gap:4px;}',
    '#mech-nav .mnav-brand{font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;',
      'color:#B0AAB6;margin:0 10px 0 4px;white-space:nowrap;}',
    '#mech-nav .mnav-tab{font-size:13.5px;font-weight:600;color:#475067;text-decoration:none;',
      'padding:7px 13px;border-radius:9px;white-space:nowrap;transition:background .15s,color .15s;}',
    '#mech-nav .mnav-tab:hover{background:#F2F2F3;color:#101828;}',
    '#mech-nav .mnav-tab.mnav-on{background:#5800E5;color:#fff;}',
    '#mech-nav .mnav-seq{display:flex;align-items:center;gap:6px;}',
    '#mech-nav .mnav-step{display:inline-flex;align-items:center;gap:6px;max-width:240px;',
      'text-decoration:none;color:#5800E5;font-weight:600;font-size:13px;padding:7px 12px;',
      'border-radius:9px;border:1px solid #E6E4EA;white-space:nowrap;transition:background .15s,border-color .15s;}',
    '#mech-nav .mnav-step:hover{background:#F4F1FE;border-color:#5800E5;}',
    '#mech-nav .mnav-step .mnav-nm{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;}',
    '#mech-nav .mnav-step .mnav-arr{flex:none;color:#B0AAB6;font-weight:700;}',
    '#mech-nav .mnav-step:hover .mnav-arr{color:#5800E5;}',
    '#mech-nav .mnav-step.mnav-off{visibility:hidden;}',
    '#mech-nav .mnav-pos{font-size:12px;font-weight:700;color:#101828;font-variant-numeric:tabular-nums;',
      'padding:0 6px;white-space:nowrap;}',
    '@media (max-width:640px){#mech-nav{margin-bottom:26px;}#mech-nav .mnav-step .mnav-nm{display:none;}',
      '#mech-nav .mnav-step{max-width:none;padding:7px 11px;}}'
  ].join("");

  var style = document.createElement("style");
  style.setAttribute("data-mech-nav", "");
  style.textContent = css;
  document.head.appendChild(style);

  // Build the bar.
  var nav = document.createElement("nav");
  nav.id = "mech-nav";
  nav.setAttribute("aria-label", "Навигация по разбору механик");

  var sections = document.createElement("div");
  sections.className = "mnav-sections";

  var brand = document.createElement("span");
  brand.className = "mnav-brand";
  brand.textContent = "Task Bank";
  sections.appendChild(brand);

  SECTIONS.forEach(function (s) {
    var a = document.createElement("a");
    a.className = "mnav-tab" + (s.file === here ? " mnav-on" : "");
    a.href = s.file;
    a.textContent = s.label;
    if (s.file === here) { a.setAttribute("aria-current", "page"); }
    sections.appendChild(a);
  });
  nav.appendChild(sections);

  // Prev/next cluster, only on the 20 mechanic pages.
  var idx = -1;
  for (var i = 0; i < MECHS.length; i++) {
    if (MECHS[i].file === here) { idx = i; break; }
  }

  if (idx !== -1) {
    var seq = document.createElement("div");
    seq.className = "mnav-seq";

    var prev = document.createElement("a");
    prev.className = "mnav-step mnav-prev" + (idx > 0 ? "" : " mnav-off");
    if (idx > 0) {
      prev.href = MECHS[idx - 1].file;
      prev.title = "Механика " + MECHS[idx - 1].n + ": " + MECHS[idx - 1].name;
    }
    var prevArr = document.createElement("span");
    prevArr.className = "mnav-arr";
    prevArr.textContent = "←";
    var prevNm = document.createElement("span");
    prevNm.className = "mnav-nm";
    prevNm.textContent = idx > 0 ? MECHS[idx - 1].name : "";
    prev.appendChild(prevArr);
    prev.appendChild(prevNm);
    seq.appendChild(prev);

    var pos = document.createElement("span");
    pos.className = "mnav-pos";
    pos.textContent = MECHS[idx].n + " / 20";
    seq.appendChild(pos);

    var next = document.createElement("a");
    next.className = "mnav-step mnav-next" + (idx < MECHS.length - 1 ? "" : " mnav-off");
    if (idx < MECHS.length - 1) {
      next.href = MECHS[idx + 1].file;
      next.title = "Механика " + MECHS[idx + 1].n + ": " + MECHS[idx + 1].name;
    }
    var nextNm = document.createElement("span");
    nextNm.className = "mnav-nm";
    nextNm.textContent = idx < MECHS.length - 1 ? MECHS[idx + 1].name : "";
    var nextArr = document.createElement("span");
    nextArr.className = "mnav-arr";
    nextArr.textContent = "→";
    next.appendChild(nextNm);
    next.appendChild(nextArr);
    seq.appendChild(next);

    nav.appendChild(seq);
  }

  function mount() {
    var host = document.querySelector(".wrap") || document.body;
    host.insertBefore(nav, host.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
