/* sequence_track_edges.jsx — sequence-track: рабочий пример + edge-кейсы (что доработать) */
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
function IconX({
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
    d: "M18 6 6 18M6 6l12 12"
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

/* стартовая раскладка (реверс правильного; для палиндрома — сдвиг) */
function startOrder(items) {
  const rev = [...items].reverse();
  if (items.length > 1 && JSON.stringify(rev) !== JSON.stringify(items)) return rev;
  return items.length > 1 ? [...items.slice(1), items[0]] : [...items];
}

/* ── виджет (своп тапами) ── */
function SequenceTrack({
  items,
  startFrom,
  hintSwap,
  controlled
}) {
  const target = items;
  const [orderS, setOrderS] = useState(startFrom || startOrder(items));
  const [gradedS, setGradedS] = useState(false);
  const [sel, setSel] = useState(null);
  const order = controlled ? controlled.order : orderS;
  const graded = controlled ? controlled.graded : gradedS;
  const setOrder = controlled ? controlled.onOrder : setOrderS;
  const setGraded = controlled ? controlled.onGraded : setGradedS;
  const tap = idx => {
    if (graded) return;
    if (sel === null) {
      setSel(idx);
      return;
    }
    if (sel === idx) {
      setSel(null);
      return;
    }
    const next = [...order];
    [next[sel], next[idx]] = [next[idx], next[sel]];
    setSel(null);
    setOrder(next);
    if (!controlled) setGradedS(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.3rem"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, "\u0420\u0430\u0441\u0441\u0442\u0430\u0432\u044C \u043F\u043E \u0432\u043E\u0437\u0440\u0430\u0441\u0442\u0430\u043D\u0438\u044E"), !graded && /*#__PURE__*/React.createElement("div", {
    className: "mech-label",
    style: {
      marginTop: -4
    }
  }, hintSwap ? sel === null ? "Нажми плитку, которую хочешь переставить" : "Теперь нажми, с какой её поменять местами" : "\u00A0"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 12,
      width: "100%",
      maxWidth: 620
    }
  }, order.map((label, idx) => {
    const isSel = !graded && sel === idx;
    const st = graded ? label === target[idx] ? "correct" : "wrong" : undefined;
    return /*#__PURE__*/React.createElement("button", {
      key: idx,
      type: "button",
      className: "mech-tile",
      onClick: () => tap(idx),
      disabled: graded,
      "data-selected": isSel ? "true" : undefined,
      "data-state": st,
      "data-locked": graded ? "true" : undefined,
      style: {
        flex: "0 0 auto",
        minWidth: 84,
        fontSize: "1.6rem",
        transform: isSel ? "translateY(-8px)" : undefined,
        position: "relative"
      }
    }, hintSwap && isSel && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -14,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: 18,
        color: "var(--sel-accent)"
      }
    }, "\u21C4"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6
      }
    }, label, st === "correct" && /*#__PURE__*/React.createElement(IconCheck, null), st === "wrong" && /*#__PURE__*/React.createElement(IconX, null)));
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.2rem",
      minHeight: 60
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C")));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(SequenceTrack, {
    items: ["12", "34", "56", "78"]
  }));
}

/* ── EC1 · своп тапами неочевиден ── */
function SwapDemo() {
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
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(SequenceTrack, {
    key: fix ? "f" : "n",
    items: ["12", "34", "56", "78"],
    hintSwap: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Подсказка ведёт по шагам (сначала «нажми плитку», затем «с какой поменять»), у выбранной плитки значок ⇄, понятно, что это обмен местами." : "Тап выделяет плитку, второй тап меняет её с другой местами, но об этом нигде не сказано; ребёнок тапает и не понимает, что происходит."));
}

/* ── EC2 · старт может совпасть с верным ── */
function StartDemo() {
  // 2 плитки: реверс правильного для [12,34] = [34,12] (ок); но покажем риск на «почти решено»
  const [order, setOrder] = useState(["12", "56", "34", "78"]);
  const [graded, setGraded] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u0421\u0442\u0430\u0440\u0442\u043E\u0432\u0430\u044F \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u043A\u0430 \u0443\u0436\u0435 \u043F\u043E\u0447\u0442\u0438 \u0432\u0435\u0440\u043D\u0430\u044F")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(SequenceTrack, {
    items: ["12", "34", "56", "78"],
    startFrom: ["12", "56", "34", "78"],
    controlled: {
      order,
      graded,
      onOrder: setOrder,
      onGraded: setGraded
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "\u041F\u0435\u0440\u0435\u043C\u0435\u0448\u0438\u0432\u0430\u043D\u0438\u0435 \u043D\u0435 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0440\u0443\u0435\u0442 \xAB\u0434\u0430\u043B\u0451\u043A\u0438\u0439\xBB \u043E\u0442 \u043E\u0442\u0432\u0435\u0442\u0430 \u0441\u0442\u0430\u0440\u0442: \u0442\u0443\u0442 \u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u043E\u0434\u043D\u043E\u0433\u043E \u043E\u0431\u043C\u0435\u043D\u0430 (56 \u0438 34 \u043C\u0435\u0441\u0442\u0430\u043C\u0438). \u0414\u043B\u044F \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0445 \u0440\u044F\u0434\u043E\u0432 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u0430\u044F \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u043A\u0430 \u0438\u043D\u043E\u0433\u0434\u0430 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u0435\u0442 \u0441 \u0432\u0435\u0440\u043D\u043E\u0439 \u0438\u043B\u0438 \u043F\u043E\u0447\u0442\u0438 \u0432\u0435\u0440\u043D\u043E\u0439, \u0438 \u0437\u0430\u0434\u0430\u043D\u0438\u0435 \u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u0442\u0440\u0438\u0432\u0438\u0430\u043B\u044C\u043D\u044B\u043C."));
}

/* ── EC3 · дубли значений: верный вид ≠ зачёт ── */
function DuplicateDemo() {
  const [order, setOrder] = useState(["10", "20", "20", "30"]);
  const [graded, setGraded] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: () => {
      setOrder(["10", "20", "20", "30"]);
      setGraded(true);
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \xAB10 20 20 30\xBB"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => {
      setGraded(false);
    }
  }, "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(SequenceTrack, {
    items: ["10", "20", "20", "30"],
    startFrom: ["10", "20", "20", "30"],
    controlled: {
      order,
      graded,
      onOrder: setOrder,
      onGraded: setGraded
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "\u0414\u0432\u0435 \u043F\u043B\u0438\u0442\u043A\u0438 \xAB20\xBB \u043E\u0434\u0438\u043D\u0430\u043A\u043E\u0432\u044B. \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0438\u0434\u0451\u0442 \u043F\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C: \u043F\u043E\u0440\u044F\u0434\u043E\u043A \xAB10 20 20 30\xBB \u0437\u0430\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043D\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E \u043E\u0442 \u0442\u043E\u0433\u043E, \u043A\u0430\u043A\u0430\u044F \u0438\u0437 \u0434\u0432\u0443\u0445 \xAB20\xBB \u0433\u0434\u0435 \u0441\u0442\u043E\u0438\u0442. \u0414\u043B\u044F \u0443\u043F\u043E\u0440\u044F\u0434\u043E\u0447\u0438\u0432\u0430\u043D\u0438\u044F \u0434\u0443\u0431\u043B\u0438 \u0443\u0436\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u044E\u0442."));
}
const CASES = [{
  tag: "t-age",
  tagText: "Касание · возраст",
  title: "Непонятно, что плитки меняются местами тапами",
  Demo: SwapDemo,
  problem: "Чтобы поменять две плитки местами, нужно тапнуть одну, затем другую. Это нигде не объяснено: ребёнок тапает плитку, она «подпрыгивает», он тапает ещё, и порядок неожиданно меняется. Модель «сначала выдели, потом обменяй» не угадывается с первого раза.",
  fix: "Доработать: вести подсказкой по шагам (сначала «нажми плитку», затем «нажми, с какой поменять»), помечать выбранную плитку значком обмена, показывать предполагаемую перестановку до тапа."
}, {
  tag: "t-cfg",
  tagText: "Задание · логика",
  title: "Стартовый порядок может быть почти верным",
  Demo: StartDemo,
  problem: "Перемешивание не гарантирует, что старт далёк от ответа. На коротких рядах (3–4 плитки) случайная раскладка иногда совпадает с верной или требует одного обмена, и задание становится тривиальным или вовсе уже решённым. Не критично: это скорее тема для обсуждения, нужно ли вообще что-то с этим делать.",
  fix: "Доработать: гарантировать минимальную «дистанцию» старта от ответа (несколько перестановок), проверять, что стартовый порядок не равен верному и не решается «в один тап»."
}, {
  tag: "t-grade",
  tagText: "Задание · проверка",
  title: "Повторяющиеся значения: упорядочивание их уже принимает, вопрос про абакус",
  Demo: DuplicateDemo,
  problem: "Вопрос был: если в ряду есть одинаковые значения (две «20»), не сломается ли зачёт из-за того, что дубли «закреплены» за конкретными позициями.",
  fix: "Уточнение по коду: упорядочивание уже сверяет ответ по значениям, а не по тождеству плиток (последовательность меток === целевой), поэтому дубли засчитываются в любом их взаимном порядке, чинить здесь нечего. Случай Julia это уже другая механика: абакус, где id привязаны к разрядам, и валидная случайная расстановка бусин помечается неверной. Нужно от Julia: на какой механике собран абакус и ссылка на конкретный таск."
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