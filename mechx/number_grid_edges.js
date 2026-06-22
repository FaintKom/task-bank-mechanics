/* number_grid_edges.jsx — number-grid: рабочий пример + edge-кейсы (что доработать) */
const {
  useState,
  useRef,
  useLayoutEffect,
  useEffect
} = React;
function IconCheck({
  s = 20
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
const DEV_W = 1280,
  DEV_H = 800,
  BEZEL = 26;
function TabletFrame({
  children,
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
  }, children)))));
}

/* ── логика правила (как @math/core) ── */
function isPrime(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}
function correctSet(config) {
  const {
    rows,
    cols,
    start,
    rule
  } = config;
  const cells = Array.from({
    length: rows * cols
  }, (_, i) => start + i);
  return cells.filter(n => {
    if (rule.kind === "multiples") return rule.of !== 0 && n % rule.of === 0;
    if (rule.kind === "divisors") return n !== 0 && rule.of % n === 0;
    return isPrime(n);
  });
}
function ruleText(config) {
  const r = config.rule;
  if (r.kind === "multiples") return `Отметь все числа, кратные ${r.of}`;
  if (r.kind === "divisors") return `Отметь все делители числа ${r.of}`;
  return "Отметь все простые числа";
}

/* ── виджет таблицы (порт компонента) ── */
function NumberGrid({
  config,
  counter,
  controlled,
  cellRefs
}) {
  const [selS, setSelS] = useState([]);
  const [gradedS, setGradedS] = useState(false);
  const sel = controlled ? controlled.sel : selS;
  const graded = controlled ? controlled.graded : gradedS;
  const setSel = controlled ? controlled.onSel : setSelS;
  const setGraded = controlled ? controlled.onGraded : setGradedS;
  const {
    rows,
    cols,
    start
  } = config;
  if (rows < 1 || cols < 1 || rows * cols > 200) return /*#__PURE__*/React.createElement("div", {
    className: "mech-label",
    style: {
      fontSize: "1.4rem"
    }
  }, "\u2014");
  const nums = Array.from({
    length: rows * cols
  }, (_, i) => start + i);
  const want = new Set(correctSet(config));
  const selSet = new Set(sel);
  const found = sel.filter(n => want.has(n)).length;
  const toggle = n => {
    if (graded) return;
    const ns = new Set(selSet);
    ns.has(n) ? ns.delete(n) : ns.add(n);
    setSel([...ns].sort((a, b) => a - b));
    if (!controlled) setGradedS(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.2rem"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.5rem"
    }
  }, ruleText(config)), counter && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "Nunito,sans-serif",
      fontWeight: 800,
      fontSize: "1.15rem",
      color: found === want.size ? "var(--ok-fg)" : "var(--sel-fg)",
      background: found === want.size ? "var(--ok-bg)" : "var(--sel-bg)",
      borderRadius: 999,
      padding: "6px 18px"
    }
  }, "\u041D\u0430\u0439\u0434\u0435\u043D\u043E: ", found, " \u0438\u0437 ", want.size), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
      width: "100%",
      maxWidth: Math.min(820, cols * 74)
    }
  }, nums.map(n => {
    const isSel = selSet.has(n);
    const state = graded ? want.has(n) ? "correct" : isSel ? "wrong" : undefined : undefined;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      type: "button",
      className: "mech-tile",
      ref: cellRefs ? el => {
        if (el) cellRefs.current[n] = el;
      } : undefined,
      onClick: () => toggle(n),
      disabled: graded,
      "data-selected": !graded && isSel ? "true" : undefined,
      "data-state": state,
      "data-locked": graded ? "true" : undefined,
      style: {
        aspectRatio: "1",
        minHeight: 56,
        padding: 0,
        fontSize: "1.15rem",
        boxShadow: "0 3px 0 0 var(--line)"
      }
    }, n);
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: sel.length === 0 || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.2rem",
      minHeight: 60
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C")));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(NumberGrid, {
    config: {
      rows: 3,
      cols: 10,
      start: 1,
      rule: {
        kind: "multiples",
        of: 3
      }
    }
  }));
}

/* ── EC1 · двойной тап снимает выбор ── */
function DoubleTapDemo() {
  const config = {
    rows: 2,
    cols: 5,
    start: 1,
    rule: {
      kind: "multiples",
      of: 3
    }
  };
  const [sel, setSel] = useState([]);
  const [finger, setFinger] = useState({
    x: 0,
    y: 0,
    show: false
  });
  const [ripples, setRipples] = useState([]);
  const [note, setNote] = useState("Нажмите «Воспроизвести», и я покажу быстрый двойной тап по клетке.");
  const [thought, setThought] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef(null);
  const cellRefs = useRef({});
  const timers = useRef([]);
  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearAll, []);
  const ripple = (x, y) => {
    const id = Math.random();
    setRipples(r => [...r, {
      id,
      x,
      y
    }]);
    timers.current.push(setTimeout(() => setRipples(r => r.filter(p => p.id !== id)), 560));
  };
  const play = () => {
    clearAll();
    setSel([]);
    setThought(false);
    setPlaying(true);
    setNote("…");
    const el = cellRefs.current[6];
    const sb = stageRef.current.getBoundingClientRect();
    const ob = el.getBoundingClientRect();
    const x = ob.left - sb.left + ob.width / 2,
      y = ob.top - sb.top + ob.height / 2;
    setFinger({
      x,
      y,
      show: true
    });
    timers.current.push(setTimeout(() => {
      setSel([6]);
      ripple(x, y);
      setNote("Тап, клетка «6» выделена.");
    }, 380));
    timers.current.push(setTimeout(() => {
      setSel([]);
      ripple(x, y);
      setNote("…ещё тап, выделение снято.");
    }, 740));
    timers.current.push(setTimeout(() => {
      setFinger(f => ({
        ...f,
        show: false
      }));
      setThought(true);
      setNote("");
      setPlaying(false);
    }, 1200));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: play,
    disabled: playing
  }, "\u25B6 \u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0441\u0442\u0438 \u0434\u0432\u043E\u0439\u043D\u043E\u0439 \u0442\u0430\u043F")), /*#__PURE__*/React.createElement("div", {
    className: "stage",
    ref: stageRef
  }, /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(NumberGrid, {
    config: config,
    controlled: {
      sel,
      graded: false,
      onSel: setSel,
      onGraded: () => {}
    },
    cellRefs: cellRefs
  })), ripples.map(p => /*#__PURE__*/React.createElement("span", {
    key: p.id,
    className: "ripple",
    style: {
      left: p.x,
      top: p.y
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "finger" + (finger.show ? " on" : ""),
    style: {
      left: finger.x,
      top: finger.y
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, thought ? /*#__PURE__*/React.createElement("span", {
    className: "thought"
  }, "\u0420\u0435\u0431\u0451\u043D\u043E\u043A: \xAB\u043E\u0442\u043C\u0435\u0442\u0438\u043B!\xBB, \u0430 \u043A\u043B\u0435\u0442\u043A\u0430 \u043F\u0443\u0441\u0442\u0430\u044F") : note));
}

/* ── EC3 · объём задачи: все простые до 100 ── */
function PrimesDemo() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u0420\u0435\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430: \xAB\u043E\u0442\u043C\u0435\u0442\u044C \u0432\u0441\u0435 \u043F\u0440\u043E\u0441\u0442\u044B\u0435 \u0434\u043E 100\xBB")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(NumberGrid, {
    counter: true,
    config: {
      rows: 10,
      cols: 10,
      start: 1,
      rule: {
        kind: "primes"
      }
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "25 \u0446\u0435\u043B\u0435\u0439 \u0441\u0440\u0435\u0434\u0438 100 \u043A\u043B\u0435\u0442\u043E\u043A: \u0434\u0435\u0441\u044F\u0442\u043A\u0438 \u0442\u043E\u0447\u043D\u044B\u0445 \u0442\u0430\u043F\u043E\u0432, \u0443\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0432 \u0443\u043C\u0435, \u0438 \u043F\u0440\u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435 \u043E\u0434\u0438\u043D \u043B\u0438\u0448\u043D\u0438\u0439 \u0438\u043B\u0438 \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043D\u044B\u0439 \u0442\u0430\u043F \u043E\u0431\u043D\u0443\u043B\u044F\u0435\u0442 \u0432\u0441\u044E \u0440\u0430\u0431\u043E\u0442\u0443, \u0442\u0430\u043A \u0447\u0442\u043E \u0437\u0430\u0434\u0430\u0447\u0430 \u0434\u043E\u0440\u043E\u0433\u0430\u044F \u0438 \u0434\u0435\u043C\u043E\u0442\u0438\u0432\u0438\u0440\u0443\u044E\u0449\u0430\u044F."));
}
const CASES = [{
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "Двойной тап снимает выделение",
  Demo: DoubleTapDemo,
  problem: "Тап по клетке работает как переключатель. На сетке из десятков клеток быстрый двойной тап (частый у детей) выделяет и тут же снимает клетку; ребёнок уверен, что отметил, а она пустая, и это всплывёт только при проверке.",
  fix: "Доработать: гасить второй тап в пределах ~250 мс или подтверждать снятие явной анимацией, чтобы случайное касание не сбрасывало отметку незаметно."
}, {
  tag: "t-cfg",
  tagText: "Задание · методика",
  title: "Объём задачи: «все простые до 100»",
  Demo: PrimesDemo,
  problem: "Правило вроде «все простые до 100» даёт 25 целей среди 100 клеток: десятки точных тапов, постоянное удержание правила в уме и дорогая проверка, при которой одна ошибка обнуляет всю долгую работу. Для 9–10 лет это утомляет и демотивирует.",
  fix: "Доработать: дробить такие задачи на части (по десяткам), давать промежуточную проверку и подсказки, не превращать урок в один огромный многотаповый экран."
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