/* slider_control_edges.jsx — slider-control: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет ползунка (порт компонента) ── */
function Slider({
  min,
  max,
  step = 1,
  target,
  tolerance = 0,
  unit,
  prompt = "Поставь ползунок на нужное число",
  showValue = true,
  bigValue
}) {
  const [value, setValue] = useState(min);
  const [graded, setGraded] = useState(false);
  const correct = Math.abs(value - target) <= tolerance;
  const accent = graded ? correct ? "var(--ok-accent)" : "var(--no-accent)" : "var(--sel-accent)";
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.6rem",
      width: "100%",
      maxWidth: 560,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, prompt, ": ", target, unit ? ` ${unit}` : ""), bigValue && /*#__PURE__*/React.createElement("span", {
    className: "mech-readout",
    style: graded ? {
      color: accent
    } : undefined
  }, value, unit ? ` ${unit}` : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      position: "relative"
    }
  }, showValue && !bigValue && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: `calc(${(value - min) / (max - min) * 100}% )`,
      top: -34,
      transform: "translateX(-50%)",
      fontFamily: "Fraunces,serif",
      fontWeight: 700,
      fontSize: "1.3rem",
      color: accent
    }
  }, value), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    step: step,
    value: value,
    disabled: graded,
    onChange: e => {
      setValue(Number(e.target.value));
      setGraded(false);
    },
    className: "mech-range",
    style: {
      accentColor: accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label"
  }, min), /*#__PURE__*/React.createElement("span", {
    className: "mech-label"
  }, max))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: graded,
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
  }, correct ? "Верно!" : `Нужно ${target}${unit ? " " + unit : ""}, у вас ${value}`)));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Slider, {
    min: 0,
    max: 10,
    step: 1,
    target: 7,
    bigValue: true
  }));
}

/* ── EC1 · точное попадание жестоко ── */
function ToleranceDemo() {
  const [fix, setFix] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !fix ? "on" : "",
    onClick: () => setFix(false)
  }, "\u0422\u043E\u0447\u043D\u043E (\u0434\u043E\u043F\u0443\u0441\u043A 0)"), /*#__PURE__*/React.createElement("button", {
    className: fix ? "on" : "",
    onClick: () => setFix(true)
  }, "\u0421 \u0434\u043E\u043F\u0443\u0441\u043A\u043E\u043C \xB15"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Slider, {
    key: fix ? "f" : "n",
    min: 0,
    max: 100,
    step: 1,
    target: 70,
    tolerance: fix ? 5 : 0,
    prompt: "\u041F\u0440\u0438\u043A\u0438\u043D\u044C, \u0433\u0434\u0435 \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E",
    bigValue: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Задача на прикидку: допуск ±5 засчитывает 65–75, и ребёнок попадает «на глаз», как и задумано." : "Шкала 0–100, попасть нужно ровно в 70. Пальцем на планшете это почти невозможно: 69 или 71 уже «неверно», хотя для прикидки это правильно."));
}

/* ── EC2 · бегунок и значение под пальцем ── */
function UnderThumbDemo() {
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
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Slider, {
    key: fix ? "f" : "n",
    min: 0,
    max: 20,
    step: 1,
    target: 13,
    bigValue: fix,
    showValue: !fix,
    prompt: "\u041F\u043E\u0441\u0442\u0430\u0432\u044C \u043F\u043E\u043B\u0437\u0443\u043D\u043E\u043A \u043D\u0430"
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Текущее значение вынесено крупно над шкалой, оно не под пальцем, видно всегда." : "Значение показано прямо над бегунком, ровно там, где палец: во время перетаскивания его закрывает рука, и ребёнок не видит, что выставил."));
}

/* ── EC3 · мелкий шаг — палец проскакивает ── */
function FineStepDemo() {
  const [fine, setFine] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: fine ? "on" : "",
    onClick: () => setFine(true)
  }, "\u0428\u0430\u0433 1 (0\u2026200)"), /*#__PURE__*/React.createElement("button", {
    className: !fine ? "on" : "",
    onClick: () => setFine(false)
  }, "\u0428\u0430\u0433 10 (0\u2026200)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Slider, {
    key: fine ? "f" : "c",
    min: 0,
    max: 200,
    step: fine ? 1 : 10,
    target: 130,
    tolerance: fine ? 0 : 0,
    prompt: "\u041F\u043E\u0441\u0442\u0430\u0432\u044C \u043F\u043E\u043B\u0437\u0443\u043D\u043E\u043A \u043D\u0430",
    bigValue: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fine ? "200 значений на узкой шкале: один пиксель равен нескольким единицам, палец проскакивает 130, поймать точное число почти нереально." : "При шаге 10 значений мало, ползунок встаёт на «круглые» числа, попасть в 130 легко."));
}
const CASES = [{
  tag: "t-age",
  tagText: "Касание · возраст",
  title: "Точное попадание жестоко к моторике",
  Demo: ToleranceDemo,
  problem: "По умолчанию tolerance = 0, то есть нужно попасть ровно в целевое число. На широкой шкале пальцем 9-летнего это почти невозможно: 69 вместо 70 уже «неверно», хотя для задачи на прикидку и округление такой ответ правильный по сути.",
  fix: "Доработать: для задач на прикидку задавать допуск (tolerance), засчитывающий близкие значения; точное попадание оставлять только там, где это действительно нужно."
}, {
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "Бегунок и значение прячутся под пальцем",
  Demo: UnderThumbDemo,
  problem: "Если текущее значение показано над самим бегунком, во время перетаскивания его закрывает палец, и ребёнок тянет «вслепую», не видит, какое число выставляет, пока не уберёт руку.",
  fix: "Доработать: выносить текущее значение крупно над шкалой или сбоку от неё (вне зоны пальца), чтобы оно было видно в процессе перетаскивания."
}, {
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Мелкий шаг, палец проскакивает значение",
  Demo: FineStepDemo,
  problem: "При большом диапазоне и шаге 1 на узкой шкале один пиксель соответствует нескольким единицам. Палец проскакивает нужное значение, ползунок «дёргается», и точное число поймать почти нереально.",
  fix: "Доработать: укрупнять шаг под диапазон (round-числа), либо давать допуск; для точного выбора добавить кнопки −/+ для тонкой подстройки рядом с ползунком."
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