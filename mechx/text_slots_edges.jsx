/* text_slots_edges.jsx — text-with-slots: рабочий пример + edge-кейсы на планшете */
const { useState, useRef, useLayoutEffect } = React;

function IconCheck({ s = 22 }) { return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 6 9 17l-5-5" /></svg>); }
function IconX({ s = 22 }) { return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M18 6 6 18M6 6l12 12" /></svg>); }

/* ── симулятор планшета ── */
const DEV_W = 1280, DEV_H = 800, BEZEL = 26;
function TabletFrame({ children, overlay, maxScale = 0.92 }) {
  const tw = DEV_W + BEZEL * 2, th = DEV_H + BEZEL * 2;
  const ref = useRef(null); const [scale, setScale] = useState(0.6);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const upd = () => setScale(Math.min(el.clientWidth / tw, maxScale));
    const ro = new ResizeObserver(upd); ro.observe(el); upd();
    return () => ro.disconnect();
  }, [tw, maxScale]);
  return (
    <div className="tablet-host">
      <div className="tablet-cap"><b>Lenovo Tab K11</b> · 1280 × 800 CSS px · {Math.round(scale * 100)}%</div>
      <div ref={ref} style={{ position: "relative", width: "100%", height: th * scale }}>
        <div className="tablet" style={{ width: tw, height: th, padding: BEZEL, transform: `scale(${scale})` }}>
          <span className="tablet-cam" />
          <div className="device-screen" style={{ width: DEV_W, height: DEV_H, overflow: "hidden", borderRadius: 16 }}>
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", padding: 32 }}>{children}</div>
            {overlay}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── логика слота (как @math/core) ── */
function slotCorrect(slot, raw) {
  if (raw === undefined) return false;
  const v = String(raw); if (v.trim() === "") return false;
  if (slot.type === "number") { const n = Number(v.replace(",", ".")); return !Number.isNaN(n) && n === slot.answer; }
  return v === slot.answer;
}
function parseTemplate(t) {
  const parts = []; const re = /\{(\d+)\}/g; let last = 0, m;
  while ((m = re.exec(t)) !== null) { if (m.index > last) parts.push({ type: "text", c: t.slice(last, m.index) }); parts.push({ type: "slot", i: parseInt(m[1], 10) }); last = re.lastIndex; }
  if (last < t.length) parts.push({ type: "text", c: t.slice(last) });
  return parts;
}

/* ── поля слотов ── */
function NumberField({ value, onChange, disabled, state, hint, w = 140 }) {
  return <input className="mech-field" inputMode="decimal" disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} data-state={state}
    placeholder="?" autoComplete="off" style={{ width: w, height: 64, fontSize: "1.6rem", margin: "0 8px", verticalAlign: "middle", ...(hint ? { border: "3px dashed var(--warn)", background: "var(--warn-bg)" } : {}) }} />;
}
function SelectField({ options, value, onChange, disabled, state }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", verticalAlign: "middle", margin: "0 8px" }}>
      <button type="button" className="mech-field" data-state={state} disabled={disabled} onClick={() => setOpen((o) => !o)}
        style={{ width: "auto", minWidth: 130, height: 64, fontSize: "1.6rem", display: "inline-flex", alignItems: "center", gap: 10, padding: "0 20px", cursor: disabled ? "default" : "pointer" }}>
        {value || "?"}<span style={{ fontSize: ".7em", opacity: .5 }}>▾</span>
      </button>
      {open && !disabled && <div className="tws-pop">{options.map((o) => <button key={o} type="button" className="tws-opt" onClick={() => { onChange(o); setOpen(false); }}>{o}</button>)}</div>}
    </span>
  );
}
function Chips({ options, value, onChange, disabled, state }) {
  return (
    <span style={{ display: "inline-flex", gap: 8, verticalAlign: "middle", margin: "0 8px" }}>
      {options.map((o) => <button key={o} type="button" className="mech-tile" disabled={disabled} onClick={() => onChange(o)}
        data-selected={value === o ? "true" : undefined} data-state={state && value === o ? state : undefined}
        style={{ padding: "8px 18px", fontSize: "1.4rem", minHeight: 56, boxShadow: "0 3px 0 0 var(--line)" }}>{o}</button>)}
    </span>
  );
}

/* ── виджет ── */
function TWSWidget({ template, slots, mode = "dropdown", initial, controlled, requireAll, fontSize = "1.7rem", maxWidth = 700 }) {
  const [valS, setValS] = useState(initial || slots.map(() => ""));
  const [gradedS, setGradedS] = useState(false);
  const value = controlled ? controlled.value : valS;
  const graded = controlled ? controlled.graded : gradedS;
  const setVal = (next) => { if (controlled) controlled.onValue(next); else setValS(next); };
  const setGraded = (g) => { if (controlled) controlled.onGraded(g); else setGradedS(g); };
  const setSlot = (i, v) => { const n = [...value]; n[i] = v; setVal(n); if (!controlled) setGradedS(false); };
  const parts = parseTemplate(template);
  const allFilled = slots.every((_, i) => String(value[i] ?? "").trim() !== "");
  const ready = requireAll ? allFilled : value.some((v) => String(v ?? "").trim() !== "");
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.8rem" }}>
      <div className="mech-readout" style={{ fontSize, lineHeight: 2, textAlign: "center", maxWidth, fontWeight: 700 }}>
        {parts.map((p, idx) => {
          if (p.type === "text") return <span key={idx}>{p.c}</span>;
          const slot = slots[p.i]; const raw = value[p.i];
          const state = graded ? (slotCorrect(slot, raw) ? "correct" : "wrong") : undefined;
          if (slot.type === "choice") {
            return mode === "chips"
              ? <Chips key={idx} options={slot.options} value={raw} onChange={(v) => setSlot(p.i, v)} disabled={graded} state={state} />
              : <SelectField key={idx} options={slot.options} value={raw} onChange={(v) => setSlot(p.i, v)} disabled={graded} state={state} />;
          }
          return <NumberField key={idx} value={raw ?? ""} onChange={(v) => setSlot(p.i, v)} disabled={graded} state={state} hint={requireAll && !graded && String(raw ?? "").trim() === ""} />;
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <button type="button" className="mech-check" disabled={!ready || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.3rem", minHeight: 66 }}>Проверить</button>
        {graded && <button type="button" className="mech-reset" onClick={() => { setVal(slots.map(() => "")); setGraded(false); }}>Ещё раз</button>}
      </div>
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() {
  return <TabletFrame><TWSWidget template="В библиотеке было 1250 {0}, привезли ещё 940. Теперь там {1} книг."
    slots={[{ type: "choice", options: ["книг", "ананасов", "машин"], answer: "книг" }, { type: "number", answer: 2190 }]} fontSize="1.5rem" /></TabletFrame>;
}

/* ── EC1 · свободный числовой ввод ── */
function FreeInputDemo() {
  const slot = { type: "number", answer: 2190 };
  const [val, setVal] = useState(""); const [graded, setGraded] = useState(false);
  const presets = [["2190", "чисто"], ["2 190", "пробел-разделитель"], ["2190,0", "запятая"], ["2 190 ", "пробел в конце"]];
  const ok = slotCorrect(slot, val);
  return (
    <React.Fragment>
      <div className="ec-controls">
        {presets.map(([p, label]) => <button key={p} className="btn" onClick={() => { setVal(p); setGraded(true); }}>Ввести «{p.trim() === p ? p : p}» <span style={{ opacity: .5 }}>· {label}</span></button>)}
      </div>
      <TabletFrame><TWSWidget template="1250 + 940 = {0}" slots={[slot]} controlled={{ value: [val], graded, onValue: (n) => { setVal(n[0]); setGraded(false); }, onGraded: setGraded }} /></TabletFrame>
      <div className="demo-note">{graded ? (ok ? "«" + val + "» распозналось как 2190, это верно." : "«" + val + "» даёт через Number() " + (Number.isNaN(Number(String(val).replace(",", "."))) ? "NaN" : Number(String(val).replace(",", "."))) + ", поэтому ответ неверный, хотя число подходящее.") : "Нажмите вариант ввода и посмотрите, как парсер его примет."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · клавиатура перекрывает поле ── */
function FakeKeyboard() {
  const rows = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], [",", "0", "⌫"]];
  return (
    <div className="kbd">
      {rows.map((r, i) => <div className="kbd-row" key={i}>{r.map((k) => <div className="kbd-key" key={k}>{k}</div>)}</div>)}
    </div>
  );
}
function KeyboardDemo() {
  const [kbd, setKbd] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!kbd ? "on" : ""} onClick={() => setKbd(false)}>Клавиатура скрыта</button>
          <button className={kbd ? "on" : ""} onClick={() => setKbd(true)}>Клавиатура открыта</button>
        </div>
      </div>
      <TabletFrame overlay={kbd ? <FakeKeyboard /> : null}>
        <TWSWidget template="У Маши было 100 ₽. Она купила тетрадь за 40 ₽ и ручку за 15 ₽. Всего потратила {0} ₽. После покупки у неё осталось {1} ₽. Завтра мама даст ещё 30 ₽, и станет {2} ₽."
          slots={[{ type: "number", answer: 55 }, { type: "number", answer: 45 }, { type: "number", answer: 75 }]} fontSize="1.5rem" maxWidth={760} />
      </TabletFrame>
      <div className="demo-note">{kbd ? "Клавиатура закрыла нижние строки задания вместе с пропусками «осталось» и «станет», и ребёнок не видит, что вводит и куда." : "Видны все три строки и пропуски, но при касании любого поля низ закроется клавиатурой."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · можно проверить, не заполнив все пропуски ── */
function EmptySlotDemo() {
  const [fix, setFix] = useState(false);
  const slots = [{ type: "number", answer: 12 }, { type: "number", answer: 7 }];
  const [value, setValue] = useState(["", ""]); const [graded, setGraded] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации</button>
        </div>
        {!fix && <button className="btn primary" onClick={() => { setValue(["12", ""]); setGraded(true); }}>Заполнить только первое и проверить</button>}
        {!fix && <button className="btn" onClick={() => { setValue(["", ""]); setGraded(false); }}>Сбросить</button>}
      </div>
      {fix
        ? <TabletFrame><TWSWidget template="{0} + {1} = 19" slots={slots} requireAll /></TabletFrame>
        : <TabletFrame><TWSWidget template="{0} + {1} = 19" slots={slots} controlled={{ value, graded, onValue: (n) => { setValue(n); setGraded(false); }, onGraded: setGraded }} /></TabletFrame>}
      <div className="demo-note">{fix
        ? "Пустые поля подсвечены, «Проверить» заблокирована, пока не заполнены все пропуски, и пропустить поле нельзя."
        : (graded ? "Второе поле осталось пустым, но «Проверить» всё равно сработала, и пустой пропуск засчитался как ошибка. Предупреждения «заполни все поля» не было." : "Заполните только первое поле и нажмите «Проверить», второе остаётся пустым.")}</div>
    </React.Fragment>
  );
}

/* ── EC4 · нельзя разнести по строкам/шагам ── */
function StackedIdeal() {
  const Row = ({ a }) => (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><span style={{ whiteSpace: "nowrap" }}>{a}</span><span className="mech-field" style={{ width: 110, height: 60, fontSize: "1.5rem", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-mute)" }}>?</span></div>);
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.6rem" }}>
      <div className="mech-readout" style={{ fontSize: "1.6rem", display: "flex", flexDirection: "column", gap: 16 }}>
        <Row a="24 + 16 =" /><Row a="40 ÷ 8 =" /><Row a="5 × 5 =" />
      </div>
      <button type="button" className="mech-check" disabled style={{ fontSize: "1.3rem", minHeight: 66 }}>Проверить</button>
    </div></div>
  );
}
function MultilineDemo() {
  const [ideal, setIdeal] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!ideal ? "on" : ""} onClick={() => setIdeal(false)}>Как умеет механика</button>
          <button className={ideal ? "on" : ""} onClick={() => setIdeal(true)}>Как нужно (по шагам)</button>
        </div>
      </div>
      <TabletFrame>
        {ideal
          ? <StackedIdeal />
          : <TWSWidget template="Сначала 24 + 16 = {0}. Потом {0} ÷ 8 = {1}. И наконец {1} × 5 = {2}."
              slots={[{ type: "number", answer: 40 }, { type: "number", answer: 5 }, { type: "number", answer: 25 }]} fontSize="1.6rem" maxWidth={620} />}
      </TabletFrame>
      <div className="demo-note">{ideal
        ? "Как было бы понятно ребёнку: каждый шаг отдельной строкой. Но механика так не умеет, переносов и шагов в шаблоне нет."
        : "Три шага слиты в один абзац: формулы разрываются переносом (например, «× 5 =» в конце строки, а ответ на следующей), шаги путаются."}</div>
    </React.Fragment>
  );
}

/* ── EC5 · выпадашка vs чипы ── */
function DropdownDemo() {
  const [mode, setMode] = useState("dropdown");
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={mode === "dropdown" ? "on" : ""} onClick={() => setMode("dropdown")}>Выпадающий список</button>
          <button className={mode === "chips" ? "on" : ""} onClick={() => setMode("chips")}>Чипы (как варианты)</button>
        </div>
      </div>
      <TabletFrame><TWSWidget key={mode} template="Поставь знак: 12 {0} 7 = 19"
        slots={[{ type: "choice", options: ["+", "−", "×", "÷"], answer: "+" }]} mode={mode} fontSize="1.7rem" /></TabletFrame>
      <div className="demo-note">{mode === "dropdown" ? "Выпадающий список: нужно открыть, просмотреть и выбрать (3 действия), поповер может вылезти за край экрана." : "Чипы: все варианты сразу видны, выбор это один тап. Крупные тап-цели, ничего не открывается."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-grade", tagText: "Грейдинг · ввод", title: "Свободный числовой ввод хрупок", Demo: FreeInputDemo,
    problem: "Поле принимает любой текст. Парсер делает Number(значение с заменой запятой на точку): «2190» и «2190,0» проходят, но «2 190» с пробелом-разделителем разрядов даёт NaN, поэтому ответ неверный, хотя ребёнок написал правильное число. Лишние символы молча валят ответ.",
    fix: "Нормализовать ввод перед проверкой (убирать обычные и неразрывные пробелы), либо ограничивать клавиатуру только цифрами и разрешёнными знаками; подсказывать формат." },
  { tag: "t-tab", tagText: "Планшет · клавиатура", title: "Клавиатура перекрывает поле и фидбек", Demo: KeyboardDemo,
    problem: "Числовой пропуск вызывает системную клавиатуру. На планшете она занимает нижнюю половину экрана. В многострочном задании это закрывает нижние строки текста вместе с их пропусками, кнопку «Проверить» и место, где появится результат, и ребёнок не видит, что и куда вводит.",
    fix: "Держать активный слот и действие в верхней половине; при фокусе подскрол­ливать текущий пропуск над клавиатурой; не размещать критичное в нижней зоне." },
  { tag: "t-grade", tagText: "Задание · проверка", title: "Можно проверить, не заполнив все пропуски", Demo: EmptySlotDemo,
    problem: "«Проверить» становится доступна, как только заполнен хотя бы один пропуск. Ребёнок может не заметить и пропустить поле (особенно если оно перенеслось на другую строку или ушло под клавиатуру), нажать «Проверить», и пустое поле засчитается как ошибка. Сигнала «остались незаполненные поля» нет.",
    fix: "Доработать: блокировать «Проверить», пока не заполнены все пропуски, или подсвечивать пустые поля перед проверкой; отличать «не заполнено» от «ошибка»." },
  { tag: "t-cfg", tagText: "Контент · вёрстка", title: "Шаги нельзя разнести по строкам", Demo: MultilineDemo,
    problem: "Шаблон это одна сплошная строка: нельзя вставить перенос или разбить задание на шаги. Многошаговую задачу приходится лить одним абзацем, формулы переносятся по словам как попало (часть равенства в конце строки, ответ на следующей), и шаги сливаются. Для 9-летнего это трудно прочесть и удержать.",
    fix: "Добавить в шаблон поддержку переносов и шагов (каждый шаг своя строка); для многошаговых заданий выкладывать действия столбиком, а не сплошным текстом." },
  { tag: "t-touch", tagText: "Взаимодействие", title: "Выпадашка вместо чипов: оставляем выпадашку везде", Demo: DropdownDemo,
    problem: "Выбор реализован системным выпадающим списком: открыть, просмотреть и выбрать (три действия), список мелкий, поповер может вылезти за край экрана у крайних слотов. Для 6–9 лет это лишняя когнитивная и моторная нагрузка.",
    fix: "Решение: не делаем (Maksim и Julia). Чипы вместо выпадающего списка сейчас лишнее усложнение, оставляем выпадашку везде. Демо ниже показывает, как выглядели бы чипы, на случай если вернёмся к вопросу." },
];

function Cases() {
  return (
    <React.Fragment>
      {CASES.map((c, i) => {
        const D = c.Demo;
        return (
          <article className="ec" key={i}>
            <span className={"ec-tag " + c.tag}>{c.tagText}</span>
            <h3>{c.title}</h3>
            <div className="ec-cols">
              <p className="problem">{c.problem}</p>
              <div className="fix"><b>Как чинить:</b> {c.fix}</div>
            </div>
            <D />
          </article>
        );
      })}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("example")).render(<Example />);
ReactDOM.createRoot(document.getElementById("cases")).render(<Cases />);
