/* angle_edges.jsx — angle: рабочий пример + edge-кейсы (что доработать) */
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
const CX = 170,
  CY = 175,
  R = 140,
  RAD = Math.PI / 180;
const at = (deg, r) => [CX + r * Math.cos(deg * RAD), CY - r * Math.sin(deg * RAD)];

/* ── виджет (порт): полукруг-транспортир, тап по отметке = угол ──
   step — шаг отметок; hitR — радиус зоны; drag — крутить луч; readout — крупное число */
function Angle({
  target,
  step = 15,
  hitR = 14,
  drag,
  readout,
  prompt
}) {
  const [value, setValue] = useState(null);
  const [graded, setGraded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef(null);
  const correct = value != null && value === target;
  const setColor = graded ? correct ? "var(--ok-accent)" : "var(--no-accent)" : "var(--sel-accent)";
  let s = step > 0 ? step : 15;
  if (180 / s > 60) s = 15;
  const marks = [];
  for (let d = 0; d <= 180; d += s) marks.push(d);
  const [bx, by] = at(0, R);
  const set = value != null ? at(value, R) : null;
  const tgt = at(target, R);
  const labelled = d => s % 30 === 0 ? d % 30 === 0 : d / s % 2 === 0;
  const angleFromPt = e => {
    const r = svgRef.current.getBoundingClientRect();
    const sx = DEV_W ? r.width / 340 : 1;
    const px = (e.clientX - r.left) / r.width * 340,
      py = (e.clientY - r.top) / r.height * 210;
    let a = Math.atan2(CY - py, px - CX) / RAD;
    if (a < 0) a = 0;
    if (a > 180) a = 180;
    return Math.max(0, Math.min(180, Math.round(a / s) * s));
  };
  const onMove = e => {
    if (drag && dragging && !graded) setValue(angleFromPt(e));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1rem",
      margin: "0 auto",
      width: "100%",
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, prompt || `Построй угол ${target}°`), /*#__PURE__*/React.createElement("svg", {
    ref: svgRef,
    viewBox: "0 0 340 210",
    style: {
      width: "100%",
      touchAction: "none"
    },
    onPointerMove: onMove,
    onPointerUp: () => setDragging(false),
    onPointerLeave: () => setDragging(false)
  }, /*#__PURE__*/React.createElement("path", {
    d: `M ${at(0, R)[0]} ${at(0, R)[1]} A ${R} ${R} 0 0 0 ${at(180, R)[0]} ${at(180, R)[1]}`,
    fill: "none",
    stroke: "var(--ink)",
    strokeWidth: 3
  }), marks.map(d => {
    const [x1, y1] = at(d, R - 8);
    const [x2, y2] = at(d, R);
    const [lx, ly] = at(d, R - 26);
    return /*#__PURE__*/React.createElement("g", {
      key: d
    }, /*#__PURE__*/React.createElement("line", {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      stroke: "var(--line)",
      strokeWidth: 2
    }), labelled(d) && /*#__PURE__*/React.createElement("text", {
      x: lx,
      y: ly,
      textAnchor: "middle",
      dominantBaseline: "central",
      fontSize: 12,
      fontWeight: 700,
      fill: "var(--ink)"
    }, d));
  }), graded && /*#__PURE__*/React.createElement("line", {
    x1: CX,
    y1: CY,
    x2: tgt[0],
    y2: tgt[1],
    stroke: "var(--ok-accent)",
    strokeWidth: 3,
    strokeDasharray: "6 5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: CX,
    y1: CY,
    x2: bx,
    y2: by,
    stroke: "var(--ink)",
    strokeWidth: 4,
    strokeLinecap: "round"
  }), set && /*#__PURE__*/React.createElement("line", {
    x1: CX,
    y1: CY,
    x2: set[0],
    y2: set[1],
    stroke: setColor,
    strokeWidth: 5,
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: CX,
    cy: CY,
    r: 5,
    fill: "var(--ink)"
  }), drag ? set && !graded && /*#__PURE__*/React.createElement("circle", {
    cx: set[0],
    cy: set[1],
    r: 20,
    fill: "var(--sel-accent)",
    opacity: dragging ? 0.5 : 0.25,
    stroke: "var(--sel-accent)",
    strokeWidth: 2,
    style: {
      cursor: "grab"
    },
    onPointerDown: e => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
    }
  }) : marks.map(d => {
    const [x, y] = at(d, R + 8);
    return /*#__PURE__*/React.createElement("g", {
      key: `t${d}`
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: 3,
      fill: "var(--ink-mute)"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: hitR,
      fill: "transparent",
      style: {
        cursor: graded ? "default" : "pointer"
      },
      onClick: () => !graded && setValue(d)
    }));
  }), drag && !set && !graded && marks.filter(d => d === target || d % 45 === 0).map(d => {
    const [x, y] = at(d, R + 8);
    return /*#__PURE__*/React.createElement("circle", {
      key: `seed${d}`,
      cx: x,
      cy: y,
      r: hitR,
      fill: "transparent",
      style: {
        cursor: "pointer"
      },
      onClick: () => setValue(d)
    });
  })), readout && value != null && /*#__PURE__*/React.createElement("span", {
    className: "mech-readout",
    style: {
      color: graded ? setColor : "var(--sel-fg)"
    }
  }, value, "\xB0"), /*#__PURE__*/React.createElement("button", {
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
      color: setColor
    }
  }, correct ? "Верно!" : `Нужно ${target}°`)));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Angle, {
    target: 60
  }));
}

/* ── EC1 · тап-отметки меньше 44px ── */
function HitAreaDemo() {
  const [fine, setFine] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: fine ? "on" : "",
    onClick: () => setFine(true)
  }, "\u0428\u0430\u0433 5\xB0"), /*#__PURE__*/React.createElement("button", {
    className: !fine ? "on" : "",
    onClick: () => setFine(false)
  }, "\u0428\u0430\u0433 30\xB0"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Angle, {
    key: fine ? "f" : "c",
    target: fine ? 65 : 60,
    step: fine ? 5 : 30,
    readout: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fine ? "При шаге 5° на дуге до 37 отметок, их зоны (~28px) стоят вплотную, и палец 9-летнего легко попадает в соседний градус." : "При шаге 30° отметки просторные, попасть легко."));
}

/* ── EC2 · луч нельзя крутить, только тап ── */
function DragDemo() {
  const [fix, setFix] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !fix ? "on" : "",
    onClick: () => setFix(false)
  }, "\u041A\u0430\u043A \u0435\u0441\u0442\u044C (\u0442\u0430\u043F)"), /*#__PURE__*/React.createElement("button", {
    className: fix ? "on" : "",
    onClick: () => setFix(true)
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u043A\u0440\u0443\u0442\u0438\u0442\u044C \u043B\u0443\u0447)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Angle, {
    key: fix ? "f" : "n",
    target: 75,
    step: 5,
    drag: fix,
    readout: true,
    hitR: fix ? 22 : 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Схвати кончик подвижного луча и крути, угол меняется плавно и снапится к шагу. (Первый тап по дуге задаёт стартовый луч.) Естественно, как транспортиром." : "Сейчас угол задаётся только тапом по нужной отметке, а «покрутить» луч, как настоящим транспортиром, нельзя."));
}

/* ── EC3 · вырожденные углы 0° и 180° ── */
function DegenerateDemo() {
  const [t, setT] = useState(180);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: t === 180 ? "on" : "",
    onClick: () => setT(180)
  }, "\u0423\u0433\u043E\u043B 180\xB0"), /*#__PURE__*/React.createElement("button", {
    className: t === 0 ? "on" : "",
    onClick: () => setT(0)
  }, "\u0423\u0433\u043E\u043B 0\xB0"), /*#__PURE__*/React.createElement("button", {
    className: t === 60 ? "on" : "",
    onClick: () => setT(60)
  }, "\u0423\u0433\u043E\u043B 60\xB0"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Angle, {
    key: t,
    target: t,
    step: 15,
    readout: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, t === 60 ? "Обычный угол: два луча явно расходятся, видно, что построено." : `Угол ${t}°: подвижный луч ${t === 0 ? "сливается с базовым" : "образует с базовым прямую"}, поэтому визуально неочевидно, что угол вообще выставлен, ребёнок не уверен, засчитается ли.`));
}
const CASES = [{
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Отметки градусов меньше 44px",
  Demo: HitAreaDemo,
  problem: "При мелком шаге (5°) на полукруге до 37 отметок, и зоны нажатия (~28px) встают вплотную. Палец ребёнка попадает в соседний градус, угол уходит на 5–10°, хотя построен почти верно.",
  fix: "Доработать: увеличить зоны нажатия до ≥44px, для мелкого шага сделать крупнее транспортир или ввод через перетаскивание луча."
}, {
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "Луч нельзя крутить, только тап",
  Demo: DragDemo,
  problem: "Угол задаётся только тапом по отметке. Покрутить подвижный луч вокруг вершины, как настоящим транспортиром, нельзя, а это самый естественный жест и он лучше формирует представление об измерении угла.",
  fix: "Доработать: сделать подвижный луч перетаскиваемым, крутишь вокруг вершины, угол снапится к шагу. Тап по отметке оставить как дополнительный способ."
}, {
  tag: "t-grade",
  tagText: "Задание · логика",
  title: "Вырожденные углы 0° и 180°",
  Demo: DegenerateDemo,
  problem: "При 0° подвижный луч сливается с базовым, при 180° образует с ним прямую линию. В обоих случаях визуально неочевидно, что угол выставлен, и ребёнок не уверен, отметил он что-то или нет.",
  fix: "Доработать: подсвечивать сектор угла (заливку между лучами) и всегда показывать число градусов, чтобы 0° и 180° читались как осознанный ответ, а не «ничего не построено»."
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