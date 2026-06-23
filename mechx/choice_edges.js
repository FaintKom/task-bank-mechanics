/* choice_edges.jsx — choice: рабочий пример + edge-кейсы, каждый на симуляторе планшета */
const {
  useState,
  useRef,
  useEffect,
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

/* ── симулятор планшета Lenovo Tab K11 (порт DevicePreview) ── */
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
      padding: 32
    }
  }, children)))));
}

/* список опций (презентационный) */
function OptionList({
  options,
  selected,
  graded,
  correct,
  onPick,
  optRefs,
  fontScale = 1,
  gap = 14,
  minH = 72,
  pad
}) {
  const correctSet = new Set(correct);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: gap,
      width: "100%",
      maxWidth: 520
    }
  }, options.map((opt, idx) => {
    const isSel = (selected || []).includes(idx);
    const isCor = correctSet.has(idx);
    const state = graded ? isCor ? "correct" : isSel ? "wrong" : undefined : undefined;
    return /*#__PURE__*/React.createElement("button", {
      key: idx,
      type: "button",
      className: "mech-option",
      ref: optRefs ? el => {
        if (el) optRefs.current[idx] = el;
      } : undefined,
      onClick: () => onPick && onPick(idx),
      disabled: graded,
      style: {
        fontSize: 1.5 * fontScale + "rem",
        minHeight: minH,
        ...(pad ? {
          padding: pad,
          boxShadow: "0 2px 0 0 var(--line)"
        } : {})
      },
      "data-selected": !graded && isSel ? "true" : undefined,
      "data-state": state,
      "data-locked": graded ? "true" : undefined
    }, /*#__PURE__*/React.createElement("span", null, opt), state === "correct" && /*#__PURE__*/React.createElement(IconCheck, {
      s: 26
    }), state === "wrong" && /*#__PURE__*/React.createElement(IconX, {
      s: 26
    }));
  }));
}
function ChoiceWidget({
  options,
  correct,
  prompt,
  initialSel = [],
  fontScale = 1
}) {
  const [sel, setSel] = useState(initialSel);
  const [graded, setGraded] = useState(false);
  const single = correct.length === 1;
  const pick = i => {
    if (graded) return;
    if (single) setSel([i]);else setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.6rem"
    }
  }, prompt && /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: 1.7 * fontScale + "rem"
    }
  }, prompt), /*#__PURE__*/React.createElement(OptionList, {
    options: options,
    selected: sel,
    graded: graded,
    correct: correct,
    onPick: pick,
    fontScale: fontScale
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: sel.length === 0 || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.3rem",
      minHeight: 66
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), graded && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-reset",
    onClick: () => {
      setSel(initialSel);
      setGraded(false);
    }
  }, "\u0415\u0449\u0451 \u0440\u0430\u0437"))));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ChoiceWidget, {
    options: ["7", "12", "15", "9"],
    correct: [1],
    prompt: "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0431\u0443\u0434\u0435\u0442 4 \xD7 3?"
  }));
}

/* ── EC1 · длинные подписи ── */
function LongLabelsDemo() {
  const [long, setLong] = useState(true);
  const short = ["12", "21", "18", "15"];
  const longs = ["число, у которого сумма всех цифр без остатка делится на три", "21", "результат умножения числа три на число семь", "на одну единицу больше семнадцати, но меньше двадцати пяти"];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !long ? "on" : "",
    onClick: () => setLong(false)
  }, "\u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0435"), /*#__PURE__*/React.createElement("button", {
    className: long ? "on" : "",
    onClick: () => setLong(true)
  }, "\u0414\u043B\u0438\u043D\u043D\u044B\u0435 \u043F\u043E\u0434\u043F\u0438\u0441\u0438"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ChoiceWidget, {
    key: long ? "l" : "s",
    options: long ? longs : short,
    correct: [1],
    prompt: "\u0412\u044B\u0431\u0435\u0440\u0438 \u0447\u0438\u0441\u043B\u043E 21"
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, long ? "Подписи переносятся на 2 строки, карточки разной высоты, столбик «дышит»." : "Короткие подписи дают ровную сетку."));
}

/* ── EC2 · двойной тап снимает выбор ── */
function DoubleTapDemo() {
  const options = ["2", "5", "6", "8"];
  const correct = [0, 2, 3];
  const [sel, setSel] = useState([]);
  const [finger, setFinger] = useState({
    x: 0,
    y: 0,
    show: false
  });
  const [ripples, setRipples] = useState([]);
  const [note, setNote] = useState("Нажмите «Воспроизвести», покажу быстрый двойной тап.");
  const [thought, setThought] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef(null);
  const optRefs = useRef({});
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
  const posOf = idx => {
    const el = optRefs.current[idx];
    const sb = stageRef.current.getBoundingClientRect();
    const ob = el.getBoundingClientRect();
    return {
      x: ob.left - sb.left + ob.width / 2,
      y: ob.top - sb.top + ob.height / 2
    };
  };
  const play = () => {
    clearAll();
    setSel([]);
    setThought(false);
    setPlaying(true);
    setNote("…");
    const p = posOf(2);
    setFinger({
      x: p.x,
      y: p.y,
      show: true
    });
    timers.current.push(setTimeout(() => {
      setSel([2]);
      ripple(p.x, p.y);
      setNote("Тап, вариант «6» выбран.");
    }, 380));
    timers.current.push(setTimeout(() => {
      setSel([]);
      ripple(p.x, p.y);
      setNote("…палец дёрнулся, ещё тап, и выбор снят.");
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
  }, /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.6rem"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.7rem"
    }
  }, "\u041E\u0442\u043C\u0435\u0442\u044C \u0432\u0441\u0435 \u0447\u0451\u0442\u043D\u044B\u0435"), /*#__PURE__*/React.createElement(OptionList, {
    options: options,
    selected: sel,
    graded: false,
    correct: correct,
    optRefs: optRefs,
    onPick: i => setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i])
  })))), ripples.map(p => /*#__PURE__*/React.createElement("span", {
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
  }, "\u0420\u0435\u0431\u0451\u043D\u043E\u043A: \xAB\u043A\u0430\u0436\u0435\u0442\u0441\u044F, \u0432\u044B\u0431\u0440\u0430\u043B!\xBB, \u0430 \u0432\u044B\u0431\u0440\u0430\u043D\u043E \u043D\u0438\u0447\u0435\u0433\u043E") : note));
}

/* ── EC3 · пустой correct_indices → тупик ── */
function EmptyCorrectDemo() {
  const options = ["7", "12", "15", "9"];
  const correct = [];
  const [sel, setSel] = useState([]);
  const [graded, setGraded] = useState(false);
  const empty = sel.length === 0;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.6rem"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.7rem"
    }
  }, "\u0412\u044B\u0431\u0435\u0440\u0438 \u0447\u0438\u0441\u043B\u043E, \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u0437\u0434\u0435\u0441\u044C \u043D\u0435\u0442"), /*#__PURE__*/React.createElement(OptionList, {
    options: options,
    selected: sel,
    graded: graded,
    correct: correct,
    onPick: i => {
      if (!graded) setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: empty || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.3rem",
      minHeight: 66
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), graded && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-reset",
    onClick: () => {
      setSel([]);
      setGraded(false);
    }
  }, "\u0415\u0449\u0451 \u0440\u0430\u0437"))))), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, graded ? "Любой выбор неверен (верных вариантов нет)." : empty ? "Пусто, «Проверить» заблокирована (нужно непустое значение)." : "Можно проверить, но это уже неверный ответ."), /*#__PURE__*/React.createElement("div", {
    className: "deadlock"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dl-node bad"
  }, "\u041F\u0443\u0441\u0442\u043E\u0439 \u0432\u044B\u0431\u043E\u0440", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400
    }
  }, "\u0435\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \xAB\u0432\u0435\u0440\u043D\u044B\u0439\xBB")), /*#__PURE__*/React.createElement("span", {
    className: "dl-arrow"
  }, "\u2192"), /*#__PURE__*/React.createElement("div", {
    className: "dl-node"
  }, "\xAB\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C\xBB", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400
    }
  }, "\u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430")), /*#__PURE__*/React.createElement("span", {
    className: "dl-arrow"
  }, "\u293E"), /*#__PURE__*/React.createElement("div", {
    className: "dl-node bad"
  }, "\u0412\u044B\u0431\u0440\u0430\u043B \u0447\u0442\u043E-\u0442\u043E", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400
    }
  }, "= \u043D\u0435\u0432\u0435\u0440\u043D\u043E"))));
}

/* стилизованная рука (силуэт) для демонстрации перекрытия экрана */
function HandSilhouette() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 300 380",
    style: {
      width: "100%",
      height: "auto",
      display: "block",
      filter: "drop-shadow(-6px -4px 10px rgba(0,0,0,.18))"
    }
  }, /*#__PURE__*/React.createElement("g", {
    fill: "#e7b08b",
    stroke: "#c98f66",
    strokeWidth: "3",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M150 384 L118 232 Q150 150 232 150 Q300 162 300 244 L300 384 Z"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "150",
    cy: "186",
    rx: "96",
    ry: "82"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "58",
    y: "34",
    width: "50",
    height: "158",
    rx: "25",
    transform: "rotate(-20 83 113)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "120",
    y: "44",
    width: "46",
    height: "120",
    rx: "23",
    transform: "rotate(-6 143 104)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "200",
    y: "118",
    width: "44",
    height: "126",
    rx: "22",
    transform: "rotate(38 222 181)"
  })));
}

/* ── EC5 · рука закрывает часть экрана ── */
function HandOcclusionDemo() {
  const [hand, setHand] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !hand ? "on" : "",
    onClick: () => setHand(false)
  }, "\u0411\u0435\u0437 \u0440\u0443\u043A\u0438"), /*#__PURE__*/React.createElement("button", {
    className: hand ? "on" : "",
    onClick: () => setHand(true)
  }, "\u0420\u0443\u043A\u0430 \u043D\u0430 \u044D\u043A\u0440\u0430\u043D\u0435"))), /*#__PURE__*/React.createElement("div", {
    className: "stage"
  }, /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ChoiceWidget, {
    options: ["7", "12", "15", "9"],
    correct: [1],
    prompt: "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0431\u0443\u0434\u0435\u0442 4 \xD7 3?"
  })), hand && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: "6%",
      bottom: "-8%",
      width: "46%",
      pointerEvents: "none",
      zIndex: 8
    }
  }, /*#__PURE__*/React.createElement(HandSilhouette, null))), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, hand ? "Правая рука тянется к нижним вариантам, кнопка «Проверить» и нижние опции под ладонью не видны." : "Без руки виден весь экран, но ребёнок взаимодействует именно рукой."));
}

/* ── EC6 · размер элементов и охранные поля ── */
function CrampedDemo() {
  const [tight, setTight] = useState(true);
  const wrapRef = useRef(null);
  const optRefs = useRef({});
  const [fp, setFp] = useState({
    x: 0,
    y: 0
  });
  useLayoutEffect(() => {
    const w = wrapRef.current,
      o = optRefs.current[1];
    if (!w || !o) return;
    setFp({
      x: w.clientWidth / 2,
      y: o.offsetTop + o.offsetHeight / 2
    });
  }, [tight]);
  const opts = ["7", "12", "15", "9"];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: tight ? "on" : "",
    onClick: () => setTight(true)
  }, "\u0422\u0435\u0441\u043D\u043E, \u043C\u0435\u043B\u043A\u043E"), /*#__PURE__*/React.createElement("button", {
    className: !tight ? "on" : "",
    onClick: () => setTight(false)
  }, "\u041A\u0440\u0443\u043F\u043D\u043E, \u043E\u0445\u0440\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u043B\u044F"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.4rem"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: (tight ? 0.95 : 1.7) + "rem"
    }
  }, "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0431\u0443\u0434\u0435\u0442 4 \xD7 3?"), /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    style: {
      position: "relative",
      width: "100%",
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement(OptionList, {
    options: opts,
    selected: [],
    graded: false,
    correct: [1],
    onPick: () => {},
    optRefs: optRefs,
    fontScale: tight ? 0.62 : 1.05,
    gap: tight ? 4 : 16,
    minH: tight ? 28 : 74,
    pad: tight ? "3px 12px" : undefined
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: fp.x,
      top: fp.y,
      width: 44,
      height: 44,
      borderRadius: "50%",
      transform: "translate(-50%,-50%)",
      background: "rgba(62,145,214,.26)",
      border: "2px solid var(--sel-accent)",
      pointerEvents: "none",
      zIndex: 4
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: fp.x + 30,
      top: fp.y,
      transform: "translateY(-50%)",
      fontSize: 11,
      fontWeight: 700,
      color: "var(--sel-fg)",
      background: "#fff",
      borderRadius: 6,
      padding: "1px 5px",
      border: "1px solid var(--sel-accent)",
      pointerEvents: "none",
      zIndex: 4
    }
  }, "\u224844px \u043F\u0430\u043B\u0435\u0446"))))), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, tight ? "Подушечка пальца (≈44px) накрывает сразу несколько мелких опций, ребёнок попадает не туда; текст к тому же не прочитать." : "Кнопки крупнее пальца, между ними зазор-«охранное поле», палец попадает в одну зону, текст читаем."));
}
const CASES = [{
  tag: "t-cfg",
  tagText: "Контент · конфиг",
  title: "Длинные подписи ломают сетку",
  Demo: LongLabelsDemo,
  problem: "Варианты идут одним столбцом без ограничения длины. Длинный текст переносится на несколько строк, карточки получаются разной высоты, столбик «прыгает», ребёнку труднее сканировать.",
  fix: "Ограничивать длину подписи (длинное выносить в текст вопроса), либо задать одинаковую минимальную высоту карточек с переносом по словам."
}, {
  tag: "t-touch",
  tagText: "Взаимодействие",
  title: "Двойной тап снимает выбор",
  Demo: DoubleTapDemo,
  problem: "В множественном выборе тап работает как переключатель. Быстрое двойное касание (частое у 6–9-летних) выбирает и тут же снимает вариант. Ребёнок отводит взгляд, уверенный, что отметил, а поле пустое.",
  fix: "Гасить второй тап в пределах ~250 мс, либо явно подтверждать снятие (анимация «снято»), чтобы случайное касание не откатывало выбор незаметно."
}, {
  tag: "t-grade",
  tagText: "Грейдинг",
  title: "Пустой correct_indices ведёт в тупик",
  Demo: EmptyCorrectDemo,
  problem: "Если верных вариантов нет (correct_indices = []), единственный «правильный» ответ это не выбрать ничего. Но «Проверить» заблокирована на пустом значении, а любой выбор грейдится неверным. Задание невозможно сдать.",
  fix: "Запрещать пустой correct_indices на уровне валидации конфига, либо разрешать подтверждать пустой ответ явной кнопкой «ничего не подходит»."
}, {
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Рука закрывает часть экрана",
  Demo: HandOcclusionDemo,
  problem: "На планшете ребёнок выбирает рукой. Правша, дотягиваясь до нижних вариантов и кнопки «Проверить», ладонью перекрывает нижнюю часть экрана и не видит ни соседние опции, ни фидбек, который появляется под пальцем.",
  fix: "Размещать ключевое (вопрос, фидбек, статус) в верхней части экрана; кнопку действия и активные зоны помещать там, где их не перекрывает ладонь; учитывать право- и леворукость."
}, {
  tag: "t-tab",
  tagText: "Планшет · размер и поля",
  title: "Мелкие элементы без охранных полей",
  Demo: CrampedDemo,
  problem: "Планшет лежит на расстоянии вытянутой руки, ребёнок тычет пальцем. Если кнопки мелкие и прижаты друг к другу, подушечка пальца (≈44px) накрывает сразу две, отсюда попадание не туда; заодно мелкий элемент несёт мелкий, нечитаемый текст.",
  fix: "Тап-цели ≥ 44–64px, между ними зазор-«охранное поле» ≥ 12–16px, чтобы палец гарантированно попадал в одну зону. Размер кнопки и кегль растут вместе; проверять на реальном устройстве с дистанции."
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