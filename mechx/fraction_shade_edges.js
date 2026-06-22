/* fraction_shade_edges.jsx — fraction-shade: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): круг из равных секторов, тап закрашивает; счёт = количество ── */
function FractionShade({
  denominator,
  targetFilled,
  liveCounter
}) {
  const [filled, setFilled] = useState([]);
  const [graded, setGraded] = useState(false);
  const SIZE = 260,
    R = SIZE / 2;
  const set = new Set(filled);
  const correct = filled.length === targetFilled;
  const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const sectorPath = k => {
    const a0 = k / denominator * 2 * Math.PI - Math.PI / 2,
      a1 = (k + 1) / denominator * 2 * Math.PI - Math.PI / 2;
    const x0 = R + R * Math.cos(a0),
      y0 = R + R * Math.sin(a0),
      x1 = R + R * Math.cos(a1),
      y1 = R + R * Math.sin(a1);
    const large = 1 / denominator > 0.5 ? 1 : 0;
    return `M ${R} ${R} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`;
  };
  const toggle = k => {
    if (graded) return;
    const next = set.has(k) ? filled.filter(x => x !== k) : [...filled, k];
    setFilled(next.sort((a, b) => a - b));
    setGraded(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.2rem",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, "\u0417\u0430\u043A\u0440\u0430\u0441\u044C ", targetFilled, " \u0438\u0437 ", denominator), /*#__PURE__*/React.createElement("svg", {
    width: SIZE,
    height: SIZE,
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    style: {
      maxWidth: "100%"
    }
  }, Array.from({
    length: denominator
  }, (_, k) => k).map(k => /*#__PURE__*/React.createElement("path", {
    key: k,
    d: sectorPath(k),
    onClick: () => toggle(k),
    fill: set.has(k) ? "var(--sel-accent)" : "var(--paper)",
    stroke: "var(--line)",
    strokeWidth: 3,
    style: {
      cursor: graded ? "default" : "pointer",
      touchAction: "none"
    }
  }))), (liveCounter || graded) && /*#__PURE__*/React.createElement("span", {
    className: "mech-readout",
    style: {
      color: graded ? accent : "var(--sel-fg)"
    }
  }, filled.length, " / ", denominator), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: filled.length === 0 || graded,
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
  }, correct ? "Верно!" : `Нужно ${targetFilled}`)));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(FractionShade, {
    denominator: 4,
    targetFilled: 3
  }));
}

/* ── EC1 · нет живого счётчика ── */
function CounterDemo() {
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
  }, "\u041A\u0430\u043A \u043D\u0430\u0434\u043E (\u0436\u0438\u0432\u043E\u0439 \u0441\u0447\u0451\u0442\u0447\u0438\u043A)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(FractionShade, {
    key: fix ? "f" : "n",
    denominator: 6,
    targetFilled: 4,
    liveCounter: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Дробь-счётчик «N / 6» обновляется при каждом тапе, и ребёнок видит, сколько уже закрасил и сколько нужно." : "Счётчик появляется только после «Проверить». По ходу ребёнок не видит, сколько частей уже закрасил, и приходится считать сектора глазами."));
}

/* ── EC2 · мелкие сектора при большом знаменателе ── */
function SmallSegmentsDemo() {
  const [big, setBig] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: big ? "on" : "",
    onClick: () => setBig(true)
  }, "\u041D\u0430 12 \u0447\u0430\u0441\u0442\u0435\u0439"), /*#__PURE__*/React.createElement("button", {
    className: !big ? "on" : "",
    onClick: () => setBig(false)
  }, "\u041D\u0430 4 \u0447\u0430\u0441\u0442\u0438"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(FractionShade, {
    key: big ? "b" : "s",
    denominator: big ? 12 : 4,
    targetFilled: big ? 5 : 3,
    liveCounter: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, big ? "На 12 секторов доли узкие, особенно у центра круга, и палец легко задевает соседний сектор и меняет не ту часть." : "На 4 части сектора крупные, попасть в нужный легко."));
}

/* ── EC3 · «закрась ноль» нельзя подтвердить ── */
function ZeroDemo() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u0417\u0430\u0434\u0430\u0447\u0430: \xAB\u043D\u0435 \u0437\u0430\u043A\u0440\u0430\u0448\u0438\u0432\u0430\u0439 \u043D\u0438\u0447\u0435\u0433\u043E\xBB (0 \u0438\u0437 4)")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(FractionShade, {
    denominator: 4,
    targetFilled: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "\u0415\u0441\u043B\u0438 \u0432\u0435\u0440\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 \u044D\u0442\u043E 0 \u0437\u0430\u043A\u0440\u0430\u0448\u0435\u043D\u043D\u044B\u0445, \u0440\u0435\u0431\u0451\u043D\u043E\u043A \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u0442\u0440\u043E\u0433\u0430\u0435\u0442, \u043D\u043E \xAB\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C\xBB \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u043D\u0430 \u043F\u0443\u0441\u0442\u043E\u043C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0438. \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \xAB\u043D\u043E\u043B\u044C\xBB \u043D\u0435\u043B\u044C\u0437\u044F, \u0437\u0430\u0434\u0430\u043D\u0438\u0435 \u0437\u0430\u0432\u0438\u0441\u0430\u0435\u0442."));
}
const CASES = [{
  tag: "t-age",
  tagText: "Возраст · фидбек",
  title: "Нет живого счётчика дроби",
  Demo: CounterDemo,
  problem: "Дробь-счётчик «N / знаменатель» показывается только после «Проверить». По ходу ребёнок не видит, сколько частей уже закрасил, и вынужден пересчитывать сектора глазами. Для 9-летнего это лишняя нагрузка и источник ошибок «закрасил на одну больше или меньше».",
  fix: "Доработать: показывать живой счётчик закрашенных долей сразу при касании, а не только в режиме проверки."
}, {
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Мелкие сектора и промах по соседней доле",
  Demo: SmallSegmentsDemo,
  problem: "При большом знаменателе (до 24) сектора круга становятся узкими, особенно у центра. Подушечка пальца задевает соседнюю долю и закрашивает не ту, а так как засчитывается количество, лишний случайный сектор молча портит ответ.",
  fix: "Доработать: увеличивать круг и зону нажатия каждой доли, расширять hit-area у центра, для больших знаменателей предпочитать форму «полоса», где доли крупнее."
}, {
  tag: "t-grade",
  tagText: "Задание · проверка",
  title: "«Закрась ноль» нельзя подтвердить",
  Demo: ZeroDemo,
  problem: "Если правильный ответ это 0 закрашенных долей, ребёнок ничего не закрашивает, но «Проверить» заблокирована на пустом значении. Подтвердить намеренный «ноль» нечем, и задание невозможно сдать.",
  fix: "Доработать: разрешать подтверждать пустой ответ явной кнопкой, либо не выпускать задания с target_filled = 0 для этой механики."
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