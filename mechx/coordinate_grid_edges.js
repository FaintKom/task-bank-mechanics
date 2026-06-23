/* coordinate_grid_edges.jsx — coordinate-grid: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): тап по узлу сетки ставит точку (x,y) ──
   cell — размер клетки; hitR — радиус зоны; guide — подсветка строки/столбца выбора */
function CoordinateGrid({
  xMax,
  yMax,
  targetX,
  targetY,
  cell = 40,
  hitR,
  guide,
  prompt
}) {
  const [v, setV] = useState(null);
  const [graded, setGraded] = useState(false);
  const PAD_L = 36,
    PAD_B = 34,
    PAD_T = 16,
    PAD_R = 16;
  const W = PAD_L + xMax * cell + PAD_R,
    H = PAD_T + yMax * cell + PAD_B;
  const sx = x => PAD_L + x * cell;
  const sy = y => PAD_T + (yMax - y) * cell;
  const xs = Array.from({
    length: xMax + 1
  }, (_, i) => i);
  const ys = Array.from({
    length: yMax + 1
  }, (_, i) => i);
  const correct = v && v.x === targetX && v.y === targetY;
  const mc = graded ? correct ? "var(--ok-accent)" : "var(--no-accent)" : "var(--sel-accent)";
  const hr = hitR || Math.min(cell * 0.42, 22);
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1rem",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, prompt || `Отметь точку (${targetX}; ${targetY})`), /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: {
      width: "100%",
      maxWidth: Math.min(420, W),
      touchAction: "none"
    }
  }, guide && v && /*#__PURE__*/React.createElement("rect", {
    x: sx(0),
    y: sy(v.y) - 1,
    width: sx(xMax) - sx(0),
    height: 2,
    fill: "var(--sel-accent)",
    opacity: 0.3
  }), guide && v && /*#__PURE__*/React.createElement("rect", {
    x: sx(v.x) - 1,
    y: sy(yMax),
    width: 2,
    height: sy(0) - sy(yMax),
    fill: "var(--sel-accent)",
    opacity: 0.3
  }), xs.map(x => /*#__PURE__*/React.createElement("line", {
    key: `vx${x}`,
    x1: sx(x),
    y1: sy(yMax),
    x2: sx(x),
    y2: sy(0),
    stroke: "var(--line)",
    strokeWidth: 1.5
  })), ys.map(y => /*#__PURE__*/React.createElement("line", {
    key: `hy${y}`,
    x1: sx(0),
    y1: sy(y),
    x2: sx(xMax),
    y2: sy(y),
    stroke: "var(--line)",
    strokeWidth: 1.5
  })), /*#__PURE__*/React.createElement("line", {
    x1: sx(0),
    y1: sy(0),
    x2: sx(xMax),
    y2: sy(0),
    stroke: "var(--ink)",
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("line", {
    x1: sx(0),
    y1: sy(0),
    x2: sx(0),
    y2: sy(yMax),
    stroke: "var(--ink)",
    strokeWidth: 3
  }), /*#__PURE__*/React.createElement("text", {
    x: sx(xMax) + 4,
    y: sy(0) + 5,
    fontSize: 15,
    fontWeight: 700,
    fill: "var(--ink-soft)"
  }, "x"), /*#__PURE__*/React.createElement("text", {
    x: sx(0) - 5,
    y: sy(yMax) - 5,
    fontSize: 15,
    fontWeight: 700,
    fill: "var(--ink-soft)"
  }, "y"), xs.map(x => /*#__PURE__*/React.createElement("text", {
    key: `xl${x}`,
    x: sx(x),
    y: sy(0) + 22,
    textAnchor: "middle",
    fontSize: 14,
    fontWeight: 700,
    fill: "var(--ink-soft)"
  }, x)), ys.filter(y => y > 0).map(y => /*#__PURE__*/React.createElement("text", {
    key: `yl${y}`,
    x: sx(0) - 14,
    y: sy(y) + 5,
    textAnchor: "middle",
    fontSize: 14,
    fontWeight: 700,
    fill: "var(--ink-soft)"
  }, y)), graded && /*#__PURE__*/React.createElement("circle", {
    cx: sx(targetX),
    cy: sy(targetY),
    r: 11,
    fill: "none",
    stroke: "var(--ok-accent)",
    strokeWidth: 3
  }), v && /*#__PURE__*/React.createElement("circle", {
    cx: sx(v.x),
    cy: sy(v.y),
    r: 9,
    fill: mc
  }), xs.map(x => ys.map(y => /*#__PURE__*/React.createElement("g", {
    key: `n${x}-${y}`
  }, /*#__PURE__*/React.createElement("circle", {
    cx: sx(x),
    cy: sy(y),
    r: 2.5,
    fill: "var(--line)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: sx(x),
    cy: sy(y),
    r: hr,
    fill: "transparent",
    onClick: () => !graded && setV({
      x,
      y
    }),
    style: {
      cursor: graded ? "default" : "pointer",
      touchAction: "none"
    }
  }))))), v && /*#__PURE__*/React.createElement("span", {
    className: "mech-readout",
    style: {
      color: graded ? mc : "var(--sel-fg)",
      fontSize: "1.5rem"
    }
  }, "(", v.x, "; ", v.y, ")"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: !v || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.2rem",
      minHeight: 60
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), graded && /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      color: mc
    }
  }, correct ? "Верно!" : `Нужно (${targetX}; ${targetY})`)));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(CoordinateGrid, {
    xMax: 6,
    yMax: 6,
    targetX: 3,
    targetY: 4
  }));
}

/* ── EC1 · путаница порядка координат ── */
function OrderDemo() {
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
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 \u043E\u0441\u0435\u0439)")), /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u0426\u0435\u043B\u044C (4; 1), \u043B\u0435\u0433\u043A\u043E \u043F\u0435\u0440\u0435\u043F\u0443\u0442\u0430\u0442\u044C \u0441 (1; 4)")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(CoordinateGrid, {
    key: fix ? "f" : "n",
    xMax: 6,
    yMax: 6,
    targetX: 4,
    targetY: 1,
    guide: fix,
    prompt: fix ? "Сначала x = 4 (вправо), потом y = 1 (вверх)" : "Отметь точку (4; 1)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Подпись «сначала x вправо, потом y вверх» и подсветка строки или столбца выбранной точки помогают удержать порядок (x; y)." : "Классическая ошибка: перепутать координаты и отметить (1; 4) вместо (4; 1), а механика никак не помогает удержать порядок «сначала x, потом y»."));
}

/* ── EC2 · мелкие узлы на крупной сетке ── */
function DenseDemo() {
  const [big, setBig] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: big ? "on" : "",
    onClick: () => setBig(true)
  }, "\u0421\u0435\u0442\u043A\u0430 12\xD712"), /*#__PURE__*/React.createElement("button", {
    className: !big ? "on" : "",
    onClick: () => setBig(false)
  }, "\u0421\u0435\u0442\u043A\u0430 6\xD76"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(CoordinateGrid, {
    key: big ? "b" : "s",
    xMax: big ? 12 : 6,
    yMax: big ? 12 : 6,
    cell: big ? 24 : 40,
    targetX: big ? 9 : 3,
    targetY: big ? 7 : 4
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, big ? "На сетке 12×12 клетки мелкие, узлы стоят близко, зона нажатия меньше 44px, палец легко попадает в соседний узел (точка уходит на (8;7) вместо (9;7))." : "На 6×6 узлы просторные, попасть точно легко."));
}

/* ── EC3 · точка (0;0) и оси ── */
function OriginDemo() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u0426\u0435\u043B\u044C, \u043D\u0430\u0447\u0430\u043B\u043E \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442 (0; 0)")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(CoordinateGrid, {
    xMax: 6,
    yMax: 6,
    targetX: 0,
    targetY: 0,
    prompt: "\u041E\u0442\u043C\u0435\u0442\u044C \u0442\u043E\u0447\u043A\u0443 (0; 0)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "\u0423\u0437\u0435\u043B (0; 0) \u043B\u0435\u0436\u0438\u0442 \u043F\u0440\u044F\u043C\u043E \u043D\u0430 \u043F\u0435\u0440\u0435\u0441\u0435\u0447\u0435\u043D\u0438\u0438 \u043E\u0441\u0435\u0439 \u0438 \u0441\u043B\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0441 \u0438\u0445 \u0442\u043E\u043B\u0441\u0442\u044B\u043C\u0438 \u043B\u0438\u043D\u0438\u044F\u043C\u0438, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u043F\u043E\u043F\u0430\u0441\u0442\u044C \u0432 \u043D\u0435\u0433\u043E \u0438 \u043F\u043E\u043D\u044F\u0442\u044C, \u0447\u0442\u043E \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u043E \u0438\u043C\u0435\u043D\u043D\u043E \u043D\u0430\u0447\u0430\u043B\u043E \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442, \u0442\u0440\u0443\u0434\u043D\u0435\u0435, \u0447\u0435\u043C \u0432 \u043E\u0431\u044B\u0447\u043D\u044B\u0439 \u0443\u0437\u0435\u043B."));
}
const CASES = [{
  tag: "t-age",
  tagText: "Возраст · логика",
  title: "Легко перепутать порядок (x; y)",
  Demo: OrderDemo,
  problem: "Координатная пара читается «сначала x, потом y», но это частая ошибка возраста: ребёнок отмечает (1; 4) вместо (4; 1). Механика не помогает удержать порядок, узлы одинаковы, никакой опоры «куда сначала» нет.",
  fix: "Доработать: подписать оси, ясно обозначить, где x, а где y, чтобы у ребёнка была опора и он не путал порядок (x; y)."
}, {
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Мелкие узлы на крупной сетке",
  Demo: DenseDemo,
  problem: "На большой сетке (12×12) узлы стоят близко, а зона нажатия меньше 44px. Палец ребёнка попадает в соседний узел, точка уходит на (8; 7) вместо (9; 7), хотя место определено верно.",
  fix: "Доработать: зона нажатия ≥44px, ограничивать размер сетки под экран или давать зум и прокрутку для крупных координат."
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