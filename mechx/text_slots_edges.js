/* text_slots_edges.jsx — text-with-slots: рабочий пример + edge-кейсы на планшете */
const {
  useState,
  useRef,
  useLayoutEffect
} = React;
function IconCheck({
  s = 22
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }));
}
function IconX({
  s = 22
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }));
}

/* ── симулятор планшета ── */
const DEV_W = 1280,
  DEV_H = 800,
  BEZEL = 26;
function TabletFrame({
  children,
  overlay,
  maxScale = 0.92
}) {
  const tw = DEV_W + BEZEL * 2,
    th = DEV_H + BEZEL * 2;
  const ref = useRef(null);
  const [scale, setScale] = useState(0.6);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const upd = () => setScale(Math.min(el.clientWidth / tw, maxScale));
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    upd();
    return () => ro.disconnect();
  }, [tw, maxScale]);
  return /*#__PURE__*/React.createElement("div", {
    className: "tablet-host"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tablet-cap"
  }, /*#__PURE__*/React.createElement("b", null, "Lenovo Tab K11"), " \xB7 1280 \xD7 800 CSS px \xB7 ", Math.round(scale * 100), "%"), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: "relative",
      width: "100%",
      height: th * scale
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tablet",
    style: {
      width: tw,
      height: th,
      padding: BEZEL,
      transform: `scale(${scale})`
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tablet-cam"
  }), /*#__PURE__*/React.createElement("div", {
    className: "device-screen",
    style: {
      width: DEV_W,
      height: DEV_H,
      overflow: "hidden",
      borderRadius: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      padding: 32
    }
  }, children), overlay))));
}

/* ── логика слота (как @math/core) ── */
function slotCorrect(slot, raw) {
  if (raw === undefined) return false;
  const v = String(raw);
  if (v.trim() === "") return false;
  if (slot.type === "number") {
    const n = Number(v.replace(",", "."));
    return !Number.isNaN(n) && n === slot.answer;
  }
  return v === slot.answer;
}
function parseTemplate(t) {
  const parts = [];
  const re = /\{(\d+)\}/g;
  let last = 0,
    m;
  while ((m = re.exec(t)) !== null) {
    if (m.index > last) parts.push({
      type: "text",
      c: t.slice(last, m.index)
    });
    parts.push({
      type: "slot",
      i: parseInt(m[1], 10)
    });
    last = re.lastIndex;
  }
  if (last < t.length) parts.push({
    type: "text",
    c: t.slice(last)
  });
  return parts;
}

/* ── поля слотов ── */
function NumberField({
  value,
  onChange,
  disabled,
  state,
  hint,
  w = 140
}) {
  return /*#__PURE__*/React.createElement("input", {
    className: "mech-field",
    inputMode: "decimal",
    disabled: disabled,
    value: value,
    onChange: e => onChange(e.target.value),
    "data-state": state,
    placeholder: "?",
    autoComplete: "off",
    style: {
      width: w,
      height: 64,
      fontSize: "1.6rem",
      margin: "0 8px",
      verticalAlign: "middle",
      ...(hint ? {
        border: "3px dashed var(--warn)",
        background: "var(--warn-bg)"
      } : {})
    }
  });
}
function SelectField({
  options,
  value,
  onChange,
  disabled,
  state
}) {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-block",
      verticalAlign: "middle",
      margin: "0 8px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-field",
    "data-state": state,
    disabled: disabled,
    onClick: () => setOpen(o => !o),
    style: {
      width: "auto",
      minWidth: 130,
      height: 64,
      fontSize: "1.6rem",
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "0 20px",
      cursor: disabled ? "default" : "pointer"
    }
  }, value || "?", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: ".7em",
      opacity: .5
    }
  }, "\u25BE")), open && !disabled && /*#__PURE__*/React.createElement("div", {
    className: "tws-pop"
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o,
    type: "button",
    className: "tws-opt",
    onClick: () => {
      onChange(o);
      setOpen(false);
    }
  }, o))));
}
function Chips({
  options,
  value,
  onChange,
  disabled,
  state
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 8,
      verticalAlign: "middle",
      margin: "0 8px"
    }
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o,
    type: "button",
    className: "mech-tile",
    disabled: disabled,
    onClick: () => onChange(o),
    "data-selected": value === o ? "true" : undefined,
    "data-state": state && value === o ? state : undefined,
    style: {
      padding: "8px 18px",
      fontSize: "1.4rem",
      minHeight: 56,
      boxShadow: "0 3px 0 0 var(--line)"
    }
  }, o)));
}

/* ── виджет ── */
function TWSWidget({
  template,
  slots,
  mode = "dropdown",
  initial,
  controlled,
  requireAll,
  fontSize = "1.7rem",
  maxWidth = 700
}) {
  const [valS, setValS] = useState(initial || slots.map(() => ""));
  const [gradedS, setGradedS] = useState(false);
  const value = controlled ? controlled.value : valS;
  const graded = controlled ? controlled.graded : gradedS;
  const setVal = next => {
    if (controlled) controlled.onValue(next);else setValS(next);
  };
  const setGraded = g => {
    if (controlled) controlled.onGraded(g);else setGradedS(g);
  };
  const setSlot = (i, v) => {
    const n = [...value];
    n[i] = v;
    setVal(n);
    if (!controlled) setGradedS(false);
  };
  const parts = parseTemplate(template);
  const allFilled = slots.every((_, i) => String(value[i] ?? "").trim() !== "");
  const ready = requireAll ? allFilled : value.some(v => String(v ?? "").trim() !== "");
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.8rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-readout",
    style: {
      fontSize,
      lineHeight: 2,
      textAlign: "center",
      maxWidth,
      fontWeight: 700
    }
  }, parts.map((p, idx) => {
    if (p.type === "text") return /*#__PURE__*/React.createElement("span", {
      key: idx
    }, p.c);
    const slot = slots[p.i];
    const raw = value[p.i];
    const state = graded ? slotCorrect(slot, raw) ? "correct" : "wrong" : undefined;
    if (slot.type === "choice") {
      return mode === "chips" ? /*#__PURE__*/React.createElement(Chips, {
        key: idx,
        options: slot.options,
        value: raw,
        onChange: v => setSlot(p.i, v),
        disabled: graded,
        state: state
      }) : /*#__PURE__*/React.createElement(SelectField, {
        key: idx,
        options: slot.options,
        value: raw,
        onChange: v => setSlot(p.i, v),
        disabled: graded,
        state: state
      });
    }
    return /*#__PURE__*/React.createElement(NumberField, {
      key: idx,
      value: raw ?? "",
      onChange: v => setSlot(p.i, v),
      disabled: graded,
      state: state,
      hint: requireAll && !graded && String(raw ?? "").trim() === ""
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: !ready || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.3rem",
      minHeight: 66
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), graded && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-reset",
    onClick: () => {
      setVal(slots.map(() => ""));
      setGraded(false);
    }
  }, "\u0415\u0449\u0451 \u0440\u0430\u0437"))));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(TWSWidget, {
    template: "\u0412 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0435 \u0431\u044B\u043B\u043E 1250 {0}, \u043F\u0440\u0438\u0432\u0435\u0437\u043B\u0438 \u0435\u0449\u0451 940. \u0422\u0435\u043F\u0435\u0440\u044C \u0442\u0430\u043C {1} \u043A\u043D\u0438\u0433.",
    slots: [{
      type: "choice",
      options: ["книг", "ананасов", "машин"],
      answer: "книг"
    }, {
      type: "number",
      answer: 2190
    }],
    fontSize: "1.5rem"
  }));
}

/* ── EC1 · свободный числовой ввод ── */
function FreeInputDemo() {
  const slot = {
    type: "number",
    answer: 2190
  };
  const [val, setVal] = useState("");
  const [graded, setGraded] = useState(false);
  const presets = [["2190", "чисто"], ["2 190", "пробел-разделитель"], ["2190,0", "запятая"], ["2 190 ", "пробел в конце"]];
  const ok = slotCorrect(slot, val);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, presets.map(([p, label]) => /*#__PURE__*/React.createElement("button", {
    key: p,
    className: "btn",
    onClick: () => {
      setVal(p);
      setGraded(true);
    }
  }, "\u0412\u0432\u0435\u0441\u0442\u0438 \xAB", p.trim() === p ? p : p, "\xBB ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5
    }
  }, "\xB7 ", label)))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(TWSWidget, {
    template: "1250 + 940 = {0}",
    slots: [slot],
    controlled: {
      value: [val],
      graded,
      onValue: n => {
        setVal(n[0]);
        setGraded(false);
      },
      onGraded: setGraded
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, graded ? ok ? "«" + val + "» распозналось как 2190, это верно." : "«" + val + "» даёт через Number() " + (Number.isNaN(Number(String(val).replace(",", "."))) ? "NaN" : Number(String(val).replace(",", "."))) + ", поэтому ответ неверный, хотя число подходящее." : "Нажмите вариант ввода и посмотрите, как парсер его примет."));
}

/* ── EC2 · клавиатура перекрывает поле ── */
function FakeKeyboard() {
  const rows = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], [",", "0", "⌫"]];
  return /*#__PURE__*/React.createElement("div", {
    className: "kbd"
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    className: "kbd-row",
    key: i
  }, r.map(k => /*#__PURE__*/React.createElement("div", {
    className: "kbd-key",
    key: k
  }, k)))));
}
function KeyboardDemo() {
  const [kbd, setKbd] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !kbd ? "on" : "",
    onClick: () => setKbd(false)
  }, "\u041A\u043B\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430 \u0441\u043A\u0440\u044B\u0442\u0430"), /*#__PURE__*/React.createElement("button", {
    className: kbd ? "on" : "",
    onClick: () => setKbd(true)
  }, "\u041A\u043B\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0430"))), /*#__PURE__*/React.createElement(TabletFrame, {
    overlay: kbd ? /*#__PURE__*/React.createElement(FakeKeyboard, null) : null
  }, /*#__PURE__*/React.createElement(TWSWidget, {
    template: "\u0423 \u041C\u0430\u0448\u0438 \u0431\u044B\u043B\u043E 100 \u20BD. \u041E\u043D\u0430 \u043A\u0443\u043F\u0438\u043B\u0430 \u0442\u0435\u0442\u0440\u0430\u0434\u044C \u0437\u0430 40 \u20BD \u0438 \u0440\u0443\u0447\u043A\u0443 \u0437\u0430 15 \u20BD. \u0412\u0441\u0435\u0433\u043E \u043F\u043E\u0442\u0440\u0430\u0442\u0438\u043B\u0430 {0} \u20BD. \u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u043A\u0443\u043F\u043A\u0438 \u0443 \u043D\u0435\u0451 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C {1} \u20BD. \u0417\u0430\u0432\u0442\u0440\u0430 \u043C\u0430\u043C\u0430 \u0434\u0430\u0441\u0442 \u0435\u0449\u0451 30 \u20BD, \u0438 \u0441\u0442\u0430\u043D\u0435\u0442 {2} \u20BD.",
    slots: [{
      type: "number",
      answer: 55
    }, {
      type: "number",
      answer: 45
    }, {
      type: "number",
      answer: 75
    }],
    fontSize: "1.5rem",
    maxWidth: 760
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, kbd ? "Клавиатура закрыла нижние строки задания вместе с пропусками «осталось» и «станет», и ребёнок не видит, что вводит и куда." : "Видны все три строки и пропуски, но при касании любого поля низ закроется клавиатурой."));
}

/* ── EC3 · можно проверить, не заполнив все пропуски ── */
function EmptySlotDemo() {
  const [fix, setFix] = useState(false);
  const slots = [{
    type: "number",
    answer: 12
  }, {
    type: "number",
    answer: 7
  }];
  const [value, setValue] = useState(["", ""]);
  const [graded, setGraded] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !fix ? "on" : "",
    onClick: () => setFix(false)
  }, "\u041A\u0430\u043A \u0435\u0441\u0442\u044C"), /*#__PURE__*/React.createElement("button", {
    className: fix ? "on" : "",
    onClick: () => setFix(true)
  }, "\u041A\u0430\u043A \u043D\u0430\u0434\u043E")), !fix && /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: () => {
      setValue(["12", ""]);
      setGraded(true);
    }
  }, "\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0435\u0440\u0432\u043E\u0435 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), !fix && /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => {
      setValue(["", ""]);
      setGraded(false);
    }
  }, "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C")), fix ? /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(TWSWidget, {
    template: "{0} + {1} = 19",
    slots: slots,
    requireAll: true
  })) : /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(TWSWidget, {
    template: "{0} + {1} = 19",
    slots: slots,
    controlled: {
      value,
      graded,
      onValue: n => {
        setValue(n);
        setGraded(false);
      },
      onGraded: setGraded
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Пустые поля подсвечены, «Проверить» заблокирована, пока не заполнены все пропуски, и пропустить поле нельзя." : graded ? "Второе поле осталось пустым, но «Проверить» всё равно сработала, и пустой пропуск засчитался как ошибка. Предупреждения «заполни все поля» не было." : "Заполните только первое поле и нажмите «Проверить», второе остаётся пустым."));
}

/* ── EC4 · нельзя разнести по строкам/шагам ── */
function StackedIdeal() {
  const Row = ({
    a
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: "nowrap"
    }
  }, a), /*#__PURE__*/React.createElement("span", {
    className: "mech-field",
    style: {
      width: 110,
      height: 60,
      fontSize: "1.5rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--ink-mute)"
    }
  }, "?"));
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.6rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-readout",
    style: {
      fontSize: "1.6rem",
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Row, {
    a: "24 + 16 ="
  }), /*#__PURE__*/React.createElement(Row, {
    a: "40 \xF7 8 ="
  }), /*#__PURE__*/React.createElement(Row, {
    a: "5 \xD7 5 ="
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: true,
    style: {
      fontSize: "1.3rem",
      minHeight: 66
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C")));
}
function MultilineDemo() {
  const [ideal, setIdeal] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !ideal ? "on" : "",
    onClick: () => setIdeal(false)
  }, "\u041A\u0430\u043A \u0443\u043C\u0435\u0435\u0442 \u043C\u0435\u0445\u0430\u043D\u0438\u043A\u0430"), /*#__PURE__*/React.createElement("button", {
    className: ideal ? "on" : "",
    onClick: () => setIdeal(true)
  }, "\u041A\u0430\u043A \u043D\u0443\u0436\u043D\u043E (\u043F\u043E \u0448\u0430\u0433\u0430\u043C)"))), /*#__PURE__*/React.createElement(TabletFrame, null, ideal ? /*#__PURE__*/React.createElement(StackedIdeal, null) : /*#__PURE__*/React.createElement(TWSWidget, {
    template: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 24 + 16 = {0}. \u041F\u043E\u0442\u043E\u043C {0} \xF7 8 = {1}. \u0418 \u043D\u0430\u043A\u043E\u043D\u0435\u0446 {1} \xD7 5 = {2}.",
    slots: [{
      type: "number",
      answer: 40
    }, {
      type: "number",
      answer: 5
    }, {
      type: "number",
      answer: 25
    }],
    fontSize: "1.6rem",
    maxWidth: 620
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, ideal ? "Как было бы понятно ребёнку: каждый шаг отдельной строкой. Но механика так не умеет, переносов и шагов в шаблоне нет." : "Три шага слиты в один абзац: формулы разрываются переносом (например, «× 5 =» в конце строки, а ответ на следующей), шаги путаются."));
}

/* ── EC5 · выпадашка vs чипы ── */
function DropdownDemo() {
  const [mode, setMode] = useState("dropdown");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: mode === "dropdown" ? "on" : "",
    onClick: () => setMode("dropdown")
  }, "\u0412\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A"), /*#__PURE__*/React.createElement("button", {
    className: mode === "chips" ? "on" : "",
    onClick: () => setMode("chips")
  }, "\u0427\u0438\u043F\u044B (\u043A\u0430\u043A \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(TWSWidget, {
    key: mode,
    template: "\u041F\u043E\u0441\u0442\u0430\u0432\u044C \u0437\u043D\u0430\u043A: 12 {0} 7 = 19",
    slots: [{
      type: "choice",
      options: ["+", "−", "×", "÷"],
      answer: "+"
    }],
    mode: mode,
    fontSize: "1.7rem"
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, mode === "dropdown" ? "Выпадающий список: нужно открыть, просмотреть и выбрать (3 действия), поповер может вылезти за край экрана." : "Чипы: все варианты сразу видны, выбор это один тап. Крупные тап-цели, ничего не открывается."));
}
const CASES = [{
  tag: "t-grade",
  tagText: "Грейдинг · ввод",
  title: "Свободный числовой ввод хрупок",
  Demo: FreeInputDemo,
  problem: "Поле принимает любой текст. Парсер делает Number(значение с заменой запятой на точку): «2190» и «2190,0» проходят, но «2 190» с пробелом-разделителем разрядов даёт NaN, поэтому ответ неверный, хотя ребёнок написал правильное число. Лишние символы молча валят ответ.",
  fix: "Нормализовать ввод перед проверкой (убирать обычные и неразрывные пробелы), либо ограничивать клавиатуру только цифрами и разрешёнными знаками; подсказывать формат."
}, {
  tag: "t-tab",
  tagText: "Планшет · клавиатура",
  title: "Клавиатура перекрывает поле и фидбек",
  Demo: KeyboardDemo,
  problem: "Числовой пропуск вызывает системную клавиатуру. На планшете она занимает нижнюю половину экрана. В многострочном задании это закрывает нижние строки текста вместе с их пропусками, кнопку «Проверить» и место, где появится результат, и ребёнок не видит, что и куда вводит.",
  fix: "Держать активный слот и действие в верхней половине; при фокусе подскрол­ливать текущий пропуск над клавиатурой; не размещать критичное в нижней зоне."
}, {
  tag: "t-grade",
  tagText: "Задание · проверка",
  title: "Можно проверить, не заполнив все пропуски",
  Demo: EmptySlotDemo,
  problem: "«Проверить» становится доступна, как только заполнен хотя бы один пропуск. Ребёнок может не заметить и пропустить поле (особенно если оно перенеслось на другую строку или ушло под клавиатуру), нажать «Проверить», и пустое поле засчитается как ошибка. Сигнала «остались незаполненные поля» нет.",
  fix: "Доработать: блокировать «Проверить», пока не заполнены все пропуски, или подсвечивать пустые поля перед проверкой; отличать «не заполнено» от «ошибка»."
}, {
  tag: "t-cfg",
  tagText: "Контент · вёрстка",
  title: "Шаги нельзя разнести по строкам",
  Demo: MultilineDemo,
  problem: "Шаблон это одна сплошная строка: нельзя вставить перенос или разбить задание на шаги. Многошаговую задачу приходится лить одним абзацем, формулы переносятся по словам как попало (часть равенства в конце строки, ответ на следующей), и шаги сливаются. Для 9-летнего это трудно прочесть и удержать.",
  fix: "Добавить в шаблон поддержку переносов и шагов (каждый шаг своя строка); для многошаговых заданий выкладывать действия столбиком, а не сплошным текстом."
}, {
  tag: "t-touch",
  tagText: "Взаимодействие",
  title: "Выпадашка вместо вариантов на виду",
  Demo: DropdownDemo,
  problem: "Выбор реализован системным выпадающим списком: открыть, просмотреть и выбрать (три действия), список мелкий, поповер может вылезти за край экрана у крайних слотов. Для 6–9 лет это лишняя когнитивная и моторная нагрузка.",
  fix: "Для коротких наборов показывать варианты сразу чипами (один тап, всё на виду, крупные цели). Выпадашку оставить только для длинных списков."
}];
function Cases() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, CASES.map((c, i) => {
    const D = c.Demo;
    return /*#__PURE__*/React.createElement("article", {
      className: "ec",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "ec-tag " + c.tag
    }, c.tagText), /*#__PURE__*/React.createElement("h3", null, c.title), /*#__PURE__*/React.createElement("div", {
      className: "ec-cols"
    }, /*#__PURE__*/React.createElement("p", {
      className: "problem"
    }, c.problem), /*#__PURE__*/React.createElement("div", {
      className: "fix"
    }, /*#__PURE__*/React.createElement("b", null, "\u041A\u0430\u043A \u0447\u0438\u043D\u0438\u0442\u044C:"), " ", c.fix)), /*#__PURE__*/React.createElement(D, null));
  }));
}
ReactDOM.createRoot(document.getElementById("example")).render(/*#__PURE__*/React.createElement(Example, null));
ReactDOM.createRoot(document.getElementById("cases")).render(/*#__PURE__*/React.createElement(Cases, null));