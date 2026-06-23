/* ruler_edges.jsx — ruler: рабочий пример + edge-кейсы (что доработать) */
const {
  useState,
  useRef,
  useLayoutEffect
} = React;
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

/* ── виджет (порт): предмет от start до start+length; тап по делению = ответ ──
   hitW — ширина зоны; start — начало предмета (по умолчанию 0); readout — крупное подтверждение */
function Ruler({
  length,
  max,
  unit = "см",
  start = 0,
  hitW = 40,
  readout,
  prompt
}) {
  const [value, setValue] = useState(null);
  const [graded, setGraded] = useState(false);
  const answer = start === 0 ? length : length; // ученик указывает длину предмета
  const correct = value != null && value === answer;
  const objColor = graded ? correct ? "var(--ok-accent)" : "var(--no-accent)" : "var(--sel-accent)";
  const W = 1000,
    PAD = 30,
    RY = 78;
  const x = n => PAD + n / max * (W - 2 * PAD);
  const pct = n => x(n) / W * 100;
  const ticks = Array.from({
    length: max + 1
  }, (_, i) => i);
  const objStart = start,
    objEnd = start + length;
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1rem",
      margin: "0 auto",
      width: "100%",
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, prompt || "Какой длины предмет?"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} 160`,
    style: {
      width: "100%",
      touchAction: "none"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: x(objStart),
    y: 30,
    width: x(objEnd) - x(objStart),
    height: 28,
    rx: 4,
    fill: objColor,
    opacity: 0.5
  }), /*#__PURE__*/React.createElement("rect", {
    x: PAD,
    y: RY,
    width: W - 2 * PAD,
    height: 56,
    rx: 6,
    fill: "var(--paper)",
    stroke: "var(--ink)",
    strokeWidth: 2
  }), ticks.map(n => /*#__PURE__*/React.createElement("g", {
    key: n
  }, /*#__PURE__*/React.createElement("line", {
    x1: x(n),
    y1: RY,
    x2: x(n),
    y2: RY + (n % 5 === 0 ? 22 : 13),
    stroke: "var(--ink)",
    strokeWidth: 2
  }), n % 5 === 0 && /*#__PURE__*/React.createElement("text", {
    x: x(n),
    y: RY + 46,
    textAnchor: "middle",
    fontSize: 18,
    fontWeight: 700,
    fill: "var(--ink)"
  }, n))), graded && /*#__PURE__*/React.createElement("line", {
    x1: x(answer),
    y1: 20,
    x2: x(answer),
    y2: RY + 30,
    stroke: "var(--ok-accent)",
    strokeWidth: 3
  }), value != null && /*#__PURE__*/React.createElement("line", {
    x1: x(value),
    y1: 20,
    x2: x(value),
    y2: RY + 30,
    stroke: objColor,
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0
    }
  }, ticks.map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    type: "button",
    disabled: graded,
    onClick: () => {
      setValue(n);
      setGraded(false);
    },
    style: {
      position: "absolute",
      left: `${pct(n)}%`,
      top: 0,
      bottom: 0,
      transform: "translateX(-50%)",
      width: `max(${hitW}px, ${100 / ticks.length * 0.9}%)`,
      background: "transparent",
      border: "none",
      cursor: graded ? "default" : "pointer",
      touchAction: "none"
    }
  })))), readout && value != null && /*#__PURE__*/React.createElement("span", {
    className: "mech-readout",
    style: {
      color: graded ? objColor : "var(--sel-fg)"
    }
  }, value, " ", unit), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: value == null || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.2rem",
      minHeight: 60
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), graded && /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      color: objColor
    }
  }, correct ? "Верно!" : `Нужно ${answer} ${unit}`)));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Ruler, {
    length: 6,
    max: 12
  }));
}

/* ── EC1 · тап-цель < 44px, плотные деления ── */
function HitAreaDemo() {
  const [dense, setDense] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: dense ? "on" : "",
    onClick: () => setDense(true)
  }, "\u041B\u0438\u043D\u0435\u0439\u043A\u0430 \u0434\u043E 30"), /*#__PURE__*/React.createElement("button", {
    className: !dense ? "on" : "",
    onClick: () => setDense(false)
  }, "\u041B\u0438\u043D\u0435\u0439\u043A\u0430 \u0434\u043E 12"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Ruler, {
    key: dense ? "d" : "s",
    length: dense ? 17 : 6,
    max: dense ? 30 : 12,
    readout: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, dense ? "На линейке до 30 деления встают плотно, а зона нажатия около 40px (ниже норматива 44px): палец легко попадает на соседнее деление, и ответ уходит «на один»." : "До 12 деления просторные, попасть в нужное легко."));
}

/* ── EC2 · предмет всегда от нуля ── */
function FromZeroDemo() {
  const [shifted, setShifted] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !shifted ? "on" : "",
    onClick: () => setShifted(false)
  }, "\u041E\u0442 \u043D\u0443\u043B\u044F (\u0443\u043C\u0435\u0435\u0442)"), /*#__PURE__*/React.createElement("button", {
    className: shifted ? "on" : "",
    onClick: () => setShifted(true)
  }, "\u0421\u043E \u0441\u0434\u0432\u0438\u0433\u0430 (\u043D\u0435 \u0443\u043C\u0435\u0435\u0442)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Ruler, {
    key: shifted ? "s" : "z",
    length: 6,
    max: 14,
    start: shifted ? 3 : 0,
    prompt: shifted ? "Какой длины предмет? (лежит от 3)" : "Какой длины предмет?",
    readout: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, shifted ? "Если предмет лежит не от нуля (от 3 до 9), измерять надо разностью 9−3=6. Но механика всегда считает ответом конечное деление и не умеет задания «со сдвигом», а методисту они нужны." : "Сейчас предмет всегда лежит от нуля: ребёнок просто читает конечное деление, разность считать не нужно."));
}

/* ── EC3 · палец закрывает деление, нет подтверждения ── */
function ConfirmDemo() {
  const [fix, setFix] = useState(false);
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
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u043A\u0440\u0443\u043F\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Ruler, {
    key: fix ? "f" : "n",
    length: 8,
    max: 15,
    hitW: fix ? 48 : 40,
    readout: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Выбранная длина крупно подписана числом: палец закрыл деление, но ребёнок видит, какое значение поставил." : "Палец закрывает конец предмета и деление, в которое целится, а числового подтверждения выбранного значения нет, поэтому непонятно, что именно отмечено."));
}
const CASES = [{
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Плотные деления, цель меньше 44px",
  Demo: HitAreaDemo,
  problem: "На длинной линейке (до 30+) деления встают вплотную, а зона нажатия около 40px, это ниже норматива 44px. Палец ребёнка задевает соседнее деление, и ответ уходит «на один», хотя длина определена верно.",
  fix: "Доработать: зона нажатия ≥44px, для длинных линеек крупнее масштаб или прокрутка; не сжимать деления так, что соседние перекрываются пальцем."
}, {
  tag: "t-cfg",
  tagText: "Задание · охват",
  title: "Предмет всегда лежит от нуля",
  Demo: FromZeroDemo,
  problem: "Предмет всегда начинается с 0, и ответом считается конечное деление, ребёнок просто читает число, не измеряя. Задания «измерь со сдвига» (предмет от 3 до 9, длина 6), которые учат измерять разностью, механика не поддерживает.",
  fix: "Доработать: разрешить произвольное начало предмета и считать ответом длину (конец − начало), чтобы можно было давать задания на измерение разностью."
}, {
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "Палец закрывает деление без подтверждения",
  Demo: ConfirmDemo,
  problem: "Ребёнок отмечает конец предмета пальцем, и палец закрывает и сам конец, и деление, в которое целится. Числового подтверждения выбранного значения нет, поэтому неясно, какую длину он указал.",
  fix: "Доработать: показывать крупное число выбранной длины (живой readout) или выносить метку из-под пальца."
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