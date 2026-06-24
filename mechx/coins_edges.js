/* coins_edges.jsx — coins: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): монеты-номиналы, +/− набирают количество ──
   liveColor — пилюля суммы краснеет при переборе по ходу; tapRemove — тап по монете убирает её; showRunningTotal: false скрывает сумму до проверки (для сложного уровня) */
function Coins({
  target,
  coins,
  unit = "₽",
  liveColor,
  tapRemove,
  maxEach = 20,
  showRunningTotal = true
}) {
  const [counts, setCounts] = useState(coins.map(() => 0));
  const [graded, setGraded] = useState(false);
  const total = coins.reduce((s, c, i) => s + c * counts[i], 0);
  const correct = total === target;
  const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const over = total > target;
  const adjust = (i, d) => {
    if (graded) return;
    const n = [...counts];
    n[i] = Math.max(0, Math.min(maxEach, n[i] + d));
    setCounts(n);
    setGraded(false);
  };
  let pillColor = "var(--sel-fg)",
    pillBg = "var(--sel-bg)";
  if (graded) {
    pillColor = correct ? "var(--ok-fg)" : "var(--no-fg)";
    pillBg = correct ? "var(--ok-bg)" : "var(--no-bg)";
  } else if (liveColor && total > 0) {
    pillColor = total === target ? "var(--ok-fg)" : over ? "var(--no-fg)" : "var(--sel-fg)";
    pillBg = total === target ? "var(--ok-bg)" : over ? "var(--no-bg)" : "var(--sel-bg)";
  }
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
  }, "\u0421\u043E\u0431\u0435\u0440\u0438 ", target, " ", unit), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 16
    }
  }, coins.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => tapRemove && counts[i] > 0 && adjust(i, -1),
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 54,
      height: 54,
      borderRadius: "50%",
      background: "var(--canvas-bg)",
      border: "3px solid var(--ink-soft)",
      color: "var(--ink)",
      fontWeight: 700,
      fontFamily: "Fraunces, Georgia, serif",
      fontSize: "1.2rem",
      cursor: tapRemove && !graded ? "pointer" : "default"
    }
  }, c), /*#__PURE__*/React.createElement("span", {
    className: "mech-label"
  }, counts[i] ? `×${counts[i]}` : "—"), /*#__PURE__*/React.createElement(PlusMinus, {
    onMinus: () => adjust(i, -1),
    onPlus: () => adjust(i, 1),
    disabled: graded
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label"
  }, "\u0421\u0443\u043C\u043C\u0430:"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "Nunito,sans-serif",
      fontWeight: 800,
      fontSize: "1.4rem",
      color: pillColor,
      background: pillBg,
      borderRadius: 999,
      padding: "4px 16px"
    }
  }, showRunningTotal || graded ? total + " " + unit : "?")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: total === 0 || graded,
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
  }, correct ? "Верно!" : over ? "Перебор" : "Не хватает")));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Coins, {
    target: 18,
    coins: [1, 2, 5, 10]
  }));
}

/* ── EC1 · сумма видна на лёгком, скрыта на сложном ── */
function SumVisibilityDemo() {
  const [fix, setFix] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !fix ? "on" : "",
    onClick: () => setFix(false)
  }, "\u043B\u0451\u0433\u043A\u0438\u0439: \u0441\u0443\u043C\u043C\u0430 \u0432\u0438\u0434\u043D\u0430"), /*#__PURE__*/React.createElement("button", {
    className: fix ? "on" : "",
    onClick: () => setFix(true)
  }, "\u0441\u043B\u043E\u0436\u043D\u044B\u0439: \u0441\u0443\u043C\u043C\u0430 \u0441\u043A\u0440\u044B\u0442\u0430")), /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u041D\u0430\u0431\u0435\u0440\u0438 \u043C\u043E\u043D\u0435\u0442\u044B \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Coins, {
    key: fix ? "f" : "n",
    target: 18,
    coins: [1, 2, 5, 10],
    showRunningTotal: !fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Сложный уровень: сумма скрыта до «Проверить» (флаг showRunningTotal=false), чтобы по ходу она не выдавала перебор. После проверки сумма и результат раскрываются." : "Начальный уровень: сумма видна по ходу как подсказка, ребёнок сам следит, хватает ли. Цветовой оценки до «Проверить» нет: верность показывается только после неё."));
}

/* ── EC2 · target недостижим номиналами ── */
function UnreachableDemo() {
  const [bad, setBad] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: bad ? "on" : "",
    onClick: () => setBad(true)
  }, "\u0426\u0435\u043B\u044C 3, \u043C\u043E\u043D\u0435\u0442\u044B [2, 5]"), /*#__PURE__*/React.createElement("button", {
    className: !bad ? "on" : "",
    onClick: () => setBad(false)
  }, "\u0426\u0435\u043B\u044C 7, \u043C\u043E\u043D\u0435\u0442\u044B [2, 5]"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Coins, {
    key: bad ? "b" : "g",
    target: bad ? 3 : 7,
    coins: [2, 5],
    liveColor: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, bad ? "Цель 3, а монеты только 2 и 5: ровно 3 не собрать никак, потому что 2 мало, а 4 уже перебор. Задание в принципе нерешаемо (ошибка конфига)." : "Цель 7 собирается как 5 + 2. Тот же набор монет, но достижимая цель."));
}

/* ── EC3 · убрать монету только кнопкой «−» ── */
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
  }, "\u0442\u0430\u043F \u043F\u043E \u043C\u043E\u043D\u0435\u0442\u0435 (\u043D\u0430 \u0416\u0435\u043D\u044E)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Coins, {
    key: fix ? "f" : "n",
    target: 18,
    coins: [1, 2, 5, 10],
    tapRemove: fix,
    liveColor: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Так работал бы тап по монете для удаления. Автоповтор удержанием берём точно, жест тапа отдали Жене как владельцу UX." : "Убрать монету можно только кнопкой «−» под номиналом; тап по самой монете ничего не делает. Плюс автоповтора при удержании нет, поэтому большую сумму набирать долго."));
}
const CASES = [{
  tag: "t-age",
  tagText: "Возраст · фидбек",
  title: "Сумма по ходу: переключатель сложности (видна на лёгком, скрыта на сложном)",
  Demo: SumVisibilityDemo,
  problem: "Текущая сумма видна всегда и её нельзя скрыть. Для начального уровня это удобная подсказка, но дальше нужны задания, где сумма не видна до «Проверить», иначе она выдаёт перебор сама.",
  fix: "Решение: делаем переключателем сложности (Julia, Mario). На начальном уровне сумма видна как подсказка, на сложном скрывается до «Проверить» (флаг showRunningTotal, по умолчанию видна). Цвет по ходу (зелёный/красный) не берём: до «Проверить» ответ не оцениваем (Maksim). Если цветовой индикатор всё же нужен, его вид решает Женя."
}, {
  tag: "t-cfg",
  tagText: "Задание · конфиг",
  title: "Цель недостижима номиналами",
  Demo: UnreachableDemo,
  problem: "Если набором номиналов нельзя получить ровно target (цель 3 при монетах 2 и 5), задание невозможно решить: любая комбинация либо не дотягивает, либо перебирает. Ребёнок застревает без понимания, что задача в принципе нерешаема.",
  fix: "Доработать: валидировать конфиг, target обязан собираться доступными номиналами; иначе не выпускать задание."
}, {
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "Управление монетами: автоповтор берём, тап по монете на Женю",
  Demo: RemoveDemo,
  problem: "Лишняя монета убирается только кнопкой «−» под номиналом, тап по самой монете ничего не делает, хотя это интуитивный жест. Плюс +/− без автоповтора: большую сумму набирать приходится десятками отдельных тапов.",
  fix: "Решение: автоповтор при удержании кнопок +/- берём (Julia: удобно и интуитивно). Удаление тапом по монете отдаём Жене как владельцу UX."
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