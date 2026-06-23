/* balance_scale_edges.jsx — balance-scale: рабочий пример + edge-кейсы (что доработать) */
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
function PlusMinus({
  onMinus,
  onPlus,
  disabled
}) {
  const btn = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    padding: 0,
    fontSize: "1.4rem"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-tile",
    onClick: onMinus,
    disabled: disabled,
    style: btn
  }, "\u2212"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-tile",
    onClick: onPlus,
    disabled: disabled,
    style: btn
  }, "+"));
}

/* ── виджет (порт): весы, +/− добавляют гири справа ──
   maxTilt — предел наклона; showDelta — показывать числовую разницу; tapRemove — тап по гире убирает */
const PX = 160,
  PY = 96,
  ARM = 104;
function rot(x, y, deg) {
  const a = deg * Math.PI / 180,
    dx = x - PX,
    dy = y - PY;
  return [PX + dx * Math.cos(a) - dy * Math.sin(a), PY + dx * Math.sin(a) + dy * Math.cos(a)];
}
function BalanceScale({
  leftGrams,
  weights,
  maxTilt = 14,
  showDelta,
  tapRemove,
  maxEach = 20
}) {
  const [counts, setCounts] = useState(weights.map(() => 0));
  const [graded, setGraded] = useState(false);
  const right = weights.reduce((s, w, i) => s + w * counts[i], 0);
  const diff = right - leftGrams;
  const correct = diff === 0;
  const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const tilt = Math.max(-maxTilt, Math.min(maxTilt, diff * 3));
  const adjust = (i, d) => {
    if (graded) return;
    const n = [...counts];
    n[i] = Math.max(0, Math.min(maxEach, n[i] + d));
    setCounts(n);
    setGraded(false);
  };
  const [lx, ly] = rot(PX - ARM, PY, tilt);
  const [rx, ry] = rot(PX + ARM, PY, tilt);
  const STR = 22;
  const pans = [{
    x: lx,
    y: ly,
    label: `${leftGrams} г`,
    fill: "var(--sel-bg)"
  }, {
    x: rx,
    y: ry,
    label: `${right} г`,
    fill: "var(--paper)"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.1rem",
      margin: "0 auto",
      width: "100%",
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, "\u0423\u0440\u0430\u0432\u043D\u043E\u0432\u0435\u0441\u044C \u0432\u0435\u0441\u044B: \u0441\u043B\u0435\u0432\u0430 ", leftGrams, " \u0433"), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 320 210",
    style: {
      width: "100%",
      touchAction: "none"
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: PX,
    y1: PY,
    x2: PX,
    y2: 190,
    stroke: "var(--ink)",
    strokeWidth: 6
  }), /*#__PURE__*/React.createElement("polygon", {
    points: `${PX - 26},190 ${PX + 26},190 ${PX},${PY}`,
    fill: "var(--line)",
    stroke: "var(--ink)",
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("line", {
    x1: lx,
    y1: ly,
    x2: rx,
    y2: ry,
    stroke: graded ? accent : "var(--ink)",
    strokeWidth: 6,
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: PX,
    cy: PY,
    r: 6,
    fill: "var(--ink)"
  }), pans.map((p, i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("line", {
    x1: p.x,
    y1: p.y,
    x2: p.x,
    y2: p.y + STR,
    stroke: "var(--ink)",
    strokeWidth: 1.5
  }), /*#__PURE__*/React.createElement("path", {
    d: `M ${p.x - 30} ${p.y + STR} A 30 16 0 0 0 ${p.x + 30} ${p.y + STR} Z`,
    fill: p.fill,
    stroke: "var(--ink)",
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("text", {
    x: p.x,
    y: p.y + STR + 13,
    textAnchor: "middle",
    fontSize: 13,
    fontWeight: 700,
    fill: "var(--ink)"
  }, p.label)))), showDelta && right > 0 && !correct && /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      color: "var(--no-fg)",
      background: "var(--no-bg)",
      borderRadius: 999,
      padding: "3px 14px",
      fontWeight: 700
    }
  }, diff > 0 ? `перевес +${diff} г` : `не хватает ${-diff} г`), showDelta && correct && /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      color: "var(--ok-fg)",
      background: "var(--ok-bg)",
      borderRadius: 999,
      padding: "3px 14px",
      fontWeight: 700
    }
  }, "\u0440\u0430\u0432\u043D\u043E\u0432\u0435\u0441\u0438\u0435!"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 12
    }
  }, weights.map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => tapRemove && counts[i] > 0 && adjust(i, -1),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 40,
      height: 32,
      padding: "0 8px",
      borderRadius: 6,
      background: "var(--sel-bg)",
      border: "2px solid var(--sel-accent)",
      color: "var(--sel-fg)",
      fontWeight: 700,
      cursor: tapRemove && !graded ? "pointer" : "default"
    }
  }, w, " \u0433", counts[i] ? ` ×${counts[i]}` : ""), /*#__PURE__*/React.createElement(PlusMinus, {
    onMinus: () => adjust(i, -1),
    onPlus: () => adjust(i, 1),
    disabled: graded
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: right === 0 || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.2rem",
      minHeight: 60
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), graded && /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      color: accent
    }
  }, correct ? "Верно!" : "Не уравновешено")));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(BalanceScale, {
    leftGrams: 8,
    weights: [1, 2, 5]
  }));
}

/* ── EC1 · недостижимый баланс ── */
function UnreachableDemo() {
  const [bad, setBad] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: bad ? "on" : "",
    onClick: () => setBad(true)
  }, "\u0413\u0440\u0443\u0437 8, \u0433\u0438\u0440\u0438 [5]"), /*#__PURE__*/React.createElement("button", {
    className: !bad ? "on" : "",
    onClick: () => setBad(false)
  }, "\u0413\u0440\u0443\u0437 8, \u0433\u0438\u0440\u0438 [1, 2, 5]"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(BalanceScale, {
    key: bad ? "b" : "g",
    leftGrams: 8,
    weights: bad ? [5] : [1, 2, 5],
    showDelta: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, bad ? "Груз 8 г, а гиря только 5: вес 5 мало, а 10 уже перевес. Ровно 8 не набрать, равновесие недостижимо (ошибка конфига)." : "С гирями 1, 2, 5 набирается 8 как 5 + 2 + 1, и весы уравновешиваются."));
}

/* ── EC2 · малый наклон — разница не читается ── */
function TiltDemo() {
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
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u0440\u0430\u0437\u043D\u0438\u0446\u0430 \u0447\u0438\u0441\u043B\u043E\u043C)")), /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u0414\u043E\u0431\u0430\u0432\u044C \u0447\u0443\u0442\u044C \u043C\u0435\u043D\u044C\u0448\u0435 \u0438\u043B\u0438 \u0447\u0443\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u043E\u0440\u043C\u044B")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(BalanceScale, {
    key: fix ? "f" : "n",
    leftGrams: 12,
    weights: [1, 2, 5],
    showDelta: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Подпись «перевес +N г или не хватает N г» прямо показывает, насколько и в какую сторону промах, и наклона на глаз уже не нужно." : "Наклон коромысла ограничен и при «почти равновесии» едва заметен: ребёнок не понимает, перебрал он на 1 г или на 5 г."));
}

/* ── EC3 · гири только +/−, без автоповтора ── */
function RemoveDemo() {
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
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u0442\u0430\u043F \u043F\u043E \u0433\u0438\u0440\u0435)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(BalanceScale, {
    key: fix ? "f" : "n",
    leftGrams: 40,
    weights: [1, 2, 5, 10],
    tapRemove: fix,
    showDelta: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Лишнюю гирю убираешь тапом по её плашке; набор крупного веса быстрее и понятнее." : "Убрать гирю можно только кнопкой «−», автоповтора при удержании нет: чтобы набрать 40 г мелкими гирями, нужны десятки тапов."));
}
const CASES = [{
  tag: "t-cfg",
  tagText: "Задание · конфиг",
  title: "Равновесие недостижимо набором гирь",
  Demo: UnreachableDemo,
  problem: "Если доступными гирями нельзя набрать ровно left_grams (груз 8 г при гире только 5 г), уравновесить весы невозможно: любой набор либо лёгкий, либо перевешивает. Ребёнок застревает, не понимая, что задача в принципе нерешаема.",
  fix: "Доработать: валидировать конфиг, left_grams обязан собираться доступными номиналами гирь; иначе не выпускать задание."
}, {
  tag: "t-age",
  tagText: "Возраст · фидбек",
  title: "Малый наклон, промах не читается (предложение)",
  Demo: TiltDemo,
  problem: "Наклон коромысла ограничен (±14°) и при «почти равновесии» едва заметен. Ребёнок видит, что весы наклонены, но не понимает, насколько промахнулся, на 1 грамм или на пять, и в какую сторону.",
  fix: "Доработать: показывать числовую разницу «перевес +N г или не хватает N г» по ходу, либо делать наклон выразительнее у малых отклонений. Числовую разницу можно дать как включаемый режим подсказки."
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