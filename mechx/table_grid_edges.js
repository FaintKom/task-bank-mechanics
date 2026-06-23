/* table_grid_edges.jsx — table-grid: рабочий пример + edge-кейсы (что доработать) */
const {
  useState,
  useRef,
  useLayoutEffect
} = React;
function IconCheck({
  s = 18
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }));
}
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
      padding: 28
    }
  }, children), overlay))));
}
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
const key = (r, c) => `${r}-${c}`;
function cellMatches(exp, got) {
  if (got == null) return false;
  const a = Number(exp.replace(",", ".")),
    b = Number(got.replace(",", "."));
  if (!Number.isNaN(a) && !Number.isNaN(b) && got.trim() !== "") return a === b;
  return exp.trim() === got.trim();
}

/* ── виджет таблицы (порт компонента) ── */
function TableGrid({
  config,
  counter,
  autoAdvance,
  scroll
}) {
  const [entries, setEntries] = useState({});
  const [graded, setGraded] = useState(false);
  const blanks = [];
  config.rows.forEach((row, r) => row.cells.forEach((cell, c) => {
    if (cell.blank) blanks.push(key(r, c));
  }));
  const refs = useRef({});
  const filled = blanks.filter(k => (entries[k] ?? "").trim() !== "").length;
  const set = (r, c, raw) => {
    setEntries(e => ({
      ...e,
      [key(r, c)]: raw
    }));
    setGraded(false);
    if (autoAdvance && raw !== "") {
      const idx = blanks.indexOf(key(r, c));
      const next = blanks[idx + 1];
      if (next && refs.current[next]) setTimeout(() => refs.current[next].focus(), 0);
    }
  };
  const headers = config.headers ?? [];
  const td = {
    border: "2px solid var(--line)",
    minWidth: 92,
    height: 70
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.1rem"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, config.prompt), counter && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "Nunito,sans-serif",
      fontWeight: 800,
      fontSize: "1.1rem",
      color: filled === blanks.length ? "var(--ok-fg)" : "var(--sel-fg)",
      background: filled === blanks.length ? "var(--ok-bg)" : "var(--sel-bg)",
      borderRadius: 999,
      padding: "5px 16px"
    }
  }, "\u0417\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043E: ", filled, " \u0438\u0437 ", blanks.length), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: scroll ? "100%" : "fit-content",
      overflowX: scroll ? "auto" : "visible",
      paddingBottom: scroll ? 8 : 0
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      borderCollapse: "collapse",
      fontFamily: "Fraunces, Georgia, serif",
      margin: "0 auto"
    }
  }, headers.length > 0 && /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, headers.map((h, c) => /*#__PURE__*/React.createElement("th", {
    key: c,
    style: {
      ...td,
      padding: "6px 12px",
      fontSize: "1.5rem",
      fontWeight: 700,
      background: "var(--paper)",
      color: "var(--ink)"
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, config.rows.map((row, r) => /*#__PURE__*/React.createElement("tr", {
    key: r
  }, row.cells.map((cell, c) => {
    if (!cell.blank) return /*#__PURE__*/React.createElement("td", {
      key: c,
      style: {
        ...td,
        textAlign: "center",
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "var(--ink)"
      }
    }, cell.value);
    const st = graded ? cellMatches(cell.value, entries[key(r, c)]) ? "correct" : "wrong" : undefined;
    return /*#__PURE__*/React.createElement("td", {
      key: c,
      style: {
        ...td,
        padding: 0
      }
    }, /*#__PURE__*/React.createElement("input", {
      ref: el => {
        if (el) refs.current[key(r, c)] = el;
      },
      inputMode: "numeric",
      disabled: graded,
      value: entries[key(r, c)] ?? "",
      onChange: e => set(r, c, e.target.value),
      "data-state": st,
      className: "mech-field",
      style: {
        width: "100%",
        minWidth: 92,
        height: 70,
        padding: 0,
        boxShadow: "none",
        borderRadius: 0,
        border: "none",
        background: "transparent",
        fontSize: "1.5rem"
      }
    }));
  })))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: filled === 0 || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.2rem",
      minHeight: 60
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C")));
}

/* конфиги */
const MULT = {
  prompt: "Заполни таблицу умножения",
  headers: ["×", "2", "3"],
  rows: [{
    cells: [{
      blank: false,
      value: "4"
    }, {
      blank: false,
      value: "8"
    }, {
      blank: true,
      value: "12"
    }]
  }, {
    cells: [{
      blank: false,
      value: "5"
    }, {
      blank: true,
      value: "10"
    }, {
      blank: false,
      value: "15"
    }]
  }]
};
function wideConfig() {
  const headers = ["×", ...Array.from({
    length: 15
  }, (_, i) => String(i + 2))];
  const cells = [{
    blank: false,
    value: "8"
  }, ...Array.from({
    length: 15
  }, (_, i) => ({
    blank: i % 2 === 0,
    value: String(8 * (i + 2))
  }))];
  return {
    prompt: "Заполни строку умножения на 8",
    headers,
    rows: [{
      cells
    }]
  };
}
function manyBlanks() {
  return {
    prompt: "Заполни всю таблицу умножения",
    headers: ["×", "2", "3", "4", "5"],
    rows: [3, 4, 6].map(m => ({
      cells: [{
        blank: false,
        value: String(m)
      }, ...[2, 3, 4, 5].map(k => ({
        blank: true,
        value: String(m * k)
      }))]
    }))
  };
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(TableGrid, {
    config: MULT
  }));
}

/* ── EC1 · широкая таблица не влезает ── */
function WideDemo() {
  const [wide, setWide] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: wide ? "on" : "",
    onClick: () => setWide(true)
  }, "\u0428\u0438\u0440\u043E\u043A\u0430\u044F (\xD72\u202612)"), /*#__PURE__*/React.createElement("button", {
    className: !wide ? "on" : "",
    onClick: () => setWide(false)
  }, "\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u0430\u044F"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(TableGrid, {
    key: wide ? "w" : "c",
    config: wide ? wideConfig() : MULT,
    scroll: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, wide ? "12 столбцов не влезают в экран, таблица уезжает за край, появляется горизонтальный скролл. Первый столбец-«ключ» и дальние ячейки не видны одновременно." : "Компактная таблица помещается целиком, весь контекст перед глазами."));
}

/* ── EC2 · клавиатура закрывает нижние строки ── */
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
  }, /*#__PURE__*/React.createElement(TableGrid, {
    config: manyBlanks()
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, kbd ? "Системная клавиатура заняла нижнюю половину, нижние строки таблицы и кнопка «Проверить» под ней не видны, и ребёнок вводит «вслепую»." : "Видна вся таблица, но при касании любой ячейки снизу появится клавиатура."));
}

/* ── EC3 · нет авто-перехода между пропусками ── */
function AutoAdvanceDemo() {
  const [adv, setAdv] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !adv ? "on" : "",
    onClick: () => setAdv(false)
  }, "\u041A\u0430\u043A \u0435\u0441\u0442\u044C"), /*#__PURE__*/React.createElement("button", {
    className: adv ? "on" : "",
    onClick: () => setAdv(true)
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u0430\u0432\u0442\u043E-\u043F\u0435\u0440\u0435\u0445\u043E\u0434)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(TableGrid, {
    key: adv ? "a" : "n",
    autoAdvance: adv,
    config: manyBlanks()
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, adv ? "После ввода фокус сам прыгает к следующему пропуску, и ребёнок печатает подряд, не ища глазами и пальцем каждую клетку." : "Фокус не переходит, каждый из 12 пропусков нужно отдельно найти и тапнуть. На планшете долго и легко пропустить ячейку."));
}
const CASES = [{
  tag: "t-tab",
  tagText: "Планшет · вёрстка",
  title: "Широкая таблица не влезает в экран",
  Demo: WideDemo,
  problem: "Таблицы умножения или разрядов бывают широкими. Когда столбцов много, таблица не помещается на экран планшета, появляется горизонтальный скролл, и ребёнок не видит одновременно столбец-«ключ» (×, заголовки) и дальние ячейки, теряет связь строки со столбцом.",
  fix: "Доработать: ограничивать ширину (переносить или дробить таблицу), фиксировать первый столбец и шапку при скролле, масштабировать под экран, не давать «широкие» конфиги для планшета."
}, {
  tag: "t-tab",
  tagText: "Планшет · клавиатура",
  title: "Клавиатура закрывает нижние строки",
  Demo: KeyboardDemo,
  problem: "Пропуски это числовые поля, они вызывают системную клавиатуру. На планшете она занимает нижнюю половину экрана и закрывает нижние строки таблицы и кнопку «Проверить», и ребёнок заполняет нижние ячейки «вслепую».",
  fix: "Доработать: подскролливать активную ячейку над клавиатурой; держать ключевые строки и действие в верхней половине; не верстать таблицу впритык к низу."
}, {
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "Нет авто-перехода между пропусками",
  Demo: AutoAdvanceDemo,
  problem: "Фокус не переходит к следующему пропуску сам, каждую из десятка ячеек нужно отдельно найти глазами и тапнуть. На планшете это медленно, утомительно и провоцирует пропустить ячейку (см. кейс выше).",
  fix: "Доработать: авто-переход к следующему пропуску после ввода (по строкам, слева направо), чтобы ребёнок печатал подряд, не охотясь за каждой клеткой."
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