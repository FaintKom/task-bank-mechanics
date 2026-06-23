/* column_add_edges.jsx — column-add: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт компонента) ── */
function ColumnAdd({
  a,
  b,
  carryRow,
  autoAdvance
}) {
  const n = Math.max(String(a).length, String(b).length, String(a + b).length);
  const [digits, setDigits] = useState(Array(n).fill(""));
  const [carry, setCarry] = useState(Array(n).fill(""));
  const [graded, setGraded] = useState(false);
  const refs = useRef({});
  const aStr = String(a),
    bStr = String(b),
    sumStr = String(a + b);
  const cols = Array.from({
    length: n
  }, (_, j) => j);
  const charAt = (s, j) => {
    const idx = s.length - 1 - (n - 1 - j);
    return idx >= 0 ? s[idx] : "";
  };
  const set = (j, ch) => {
    const d = ch.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[j] = d;
    setDigits(next);
    setGraded(false);
    if (autoAdvance && d !== "" && j > 0 && refs.current[j - 1]) setTimeout(() => refs.current[j - 1].focus(), 0);
  };
  const cell = {
    width: 60,
    height: 74,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.1rem",
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    fontFamily: "Fraunces, Georgia, serif"
  };
  const ready = digits.some(d => d !== "");
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
      fontSize: "1.4rem"
    }
  }, "\u0421\u043B\u043E\u0436\u0438 \u0432 \u0441\u0442\u043E\u043B\u0431\u0438\u043A"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "stretch",
      fontFamily: "Fraunces, Georgia, serif"
    }
  }, carryRow && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      fontSize: 13,
      fontWeight: 700,
      color: "var(--warn)",
      textAlign: "right",
      paddingRight: 6
    }
  }, "\u043F\u0435\u0440\u0435\u043D\u043E\u0441"), cols.map(j => /*#__PURE__*/React.createElement("input", {
    key: j,
    inputMode: "numeric",
    maxLength: 1,
    disabled: graded,
    value: carry[j],
    onChange: e => {
      const v = e.target.value.replace(/[^0-9]/g, "").slice(-1);
      const nx = [...carry];
      nx[j] = v;
      setCarry(nx);
    },
    style: {
      width: 60,
      height: 40,
      textAlign: "center",
      fontSize: "1.2rem",
      fontWeight: 700,
      color: "var(--warn)",
      border: "2px dashed var(--warn)",
      borderRadius: 8,
      background: "var(--warn-bg)",
      outline: "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44
    }
  }), cols.map(j => /*#__PURE__*/React.createElement("div", {
    key: j,
    style: {
      ...cell,
      color: "var(--ink)"
    }
  }, charAt(aStr, j)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cell,
      width: 44,
      color: "var(--ink-soft)"
    }
  }, "+"), cols.map(j => /*#__PURE__*/React.createElement("div", {
    key: j,
    style: {
      ...cell,
      color: "var(--ink)"
    }
  }, charAt(bStr, j)))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      background: "var(--ink)",
      borderRadius: 2,
      margin: "4px 0 4px 50px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44
    }
  }), cols.map(j => {
    const expected = charAt(sumStr, j);
    const st = graded ? (digits[j] ?? "") === expected ? "correct" : "wrong" : undefined;
    return /*#__PURE__*/React.createElement("input", {
      key: j,
      ref: el => {
        if (el) refs.current[j] = el;
      },
      inputMode: "numeric",
      maxLength: 1,
      disabled: graded,
      value: digits[j] ?? "",
      onChange: e => set(j, e.target.value),
      "data-state": st,
      className: "mech-field",
      style: {
        width: 60,
        height: 74,
        padding: 0,
        fontSize: "2.1rem"
      }
    });
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: !ready || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.2rem",
      minHeight: 60
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C")));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ColumnAdd, {
    a: 27,
    b: 45
  }));
}

/* ── EC1 · негде записать перенос «1 в уме» ── */
function CarryDemo() {
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
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u0441\u0442\u0440\u043E\u043A\u0430 \u043F\u0435\u0440\u0435\u043D\u043E\u0441\u043E\u0432)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ColumnAdd, {
    key: fix ? "f" : "n",
    a: 27,
    b: 45,
    carryRow: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Появилась строка для переносов, и «1 в уме» (от 7+5=12 остаётся 1) можно записать, как учат в тетради." : "7 + 5 = 12, и переносить «1» в десятки нужно в уме. Записать перенос негде, и его легко потерять (частая ошибка возраста)."));
}

/* ── EC2 · нет авто-перехода по разрядам (справа налево) ── */
function AutoAdvanceDemo() {
  const [adv, setAdv] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !adv ? "on" : "",
    onClick: () => setAdv(false)
  }, "\u041A\u0430\u043A \u0435\u0441\u0442\u044C"), /*#__PURE__*/React.createElement("button", {
    className: adv ? "on" : "",
    onClick: () => setAdv(true)
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u0430\u0432\u0442\u043E-\u043F\u0435\u0440\u0435\u0445\u043E\u0434)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ColumnAdd, {
    key: adv ? "a" : "n",
    a: 348,
    b: 276,
    autoAdvance: adv
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, adv ? "После ввода цифры фокус сам прыгает в соседний разряд слева, как и считают столбик, справа налево." : "Фокус не переходит, каждую клетку ответа нужно отдельно тапнуть, и ничто не ведёт ребёнка справа налево, как при счёте столбиком."));
}

/* ── EC3 · только сложение ── */
function OnlyAddDemo() {
  const ops = ["+", "−", "×"];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, ops.map(o => /*#__PURE__*/React.createElement("span", {
    key: o,
    style: {
      width: 46,
      height: 46,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      fontFamily: "Fraunces,serif",
      fontSize: "1.5rem",
      fontWeight: 700,
      border: "2px solid var(--line)",
      background: o === "+" ? "var(--ok-bg)" : "#fff",
      color: o === "+" ? "var(--ok-fg)" : "var(--fog)",
      textDecoration: o === "+" ? "none" : "line-through"
    }
  }, o)), /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \xAB+\xBB")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ColumnAdd, {
    a: 27,
    b: 45
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "\u041C\u0435\u0445\u0430\u043D\u0438\u043A\u0430 \u0434\u0435\u043B\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u043B\u043E\u0436\u0435\u043D\u0438\u0435. \u0412\u044B\u0447\u0438\u0442\u0430\u043D\u0438\u0435 \u043F\u043E\u0445\u043E\u0436\u0435 \u043F\u043E \u0432\u0451\u0440\u0441\u0442\u043A\u0435, \u043D\u043E \u0443\u043C\u043D\u043E\u0436\u0435\u043D\u0438\u0435 \u0438 \u043E\u0441\u043E\u0431\u0435\u043D\u043D\u043E \u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0441\u0442\u043E\u043B\u0431\u0438\u043A\u043E\u043C (\xAB\u0443\u0433\u043E\u043B\u043E\u043A\xBB) \u044D\u0442\u043E \u043F\u0440\u0438\u043D\u0446\u0438\u043F\u0438\u0430\u043B\u044C\u043D\u043E \u0434\u0440\u0443\u0433\u043E\u0439 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441, \u0430 \u043D\u0435 \xAB\u0440\u0435\u0436\u0438\u043C\xBB \u044D\u0442\u043E\u0433\u043E \u0432\u0438\u0434\u0436\u0435\u0442\u0430."));
}
const CASES = [{
  tag: "t-age",
  tagText: "Возраст · метод",
  title: "Негде записать перенос «1 в уме»",
  Demo: CarryDemo,
  problem: "При сложении с переходом через разряд (7 + 5 = 12) единицу нужно перенести в следующий разряд. В тетради её записывают сверху, а здесь места для переноса нет, поэтому ребёнок держит «1» в уме и часто теряет её, особенно в многоразрядных примерах.",
  fix: "Доработать: добавить строку для переносов над разрядами (как в тетради), чтобы ребёнок фиксировал «1 в уме», а не держал в голове."
}, {
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "Нет авто-перехода по разрядам",
  Demo: AutoAdvanceDemo,
  problem: "Столбик считают справа налево, разряд за разрядом. Но фокус сам не переходит, и каждую клетку ответа нужно отдельно найти и тапнуть. На планшете это медленно и сбивает естественный порядок счёта.",
  fix: "Доработать: авто-переход фокуса в соседний разряд (справа налево) после ввода цифры, чтобы ребёнок печатал в том же порядке, в каком считает."
}, {
  tag: "t-cfg",
  tagText: "Задание · охват",
  title: "Только сложение двух чисел",
  Demo: OnlyAddDemo,
  problem: "Механика умеет лишь сложение двух слагаемых. Вычитание с заёмом ещё ложится на ту же столбиковую вёрстку, а умножение и тем более деление «уголком» это совсем другой интерфейс. Для ядровых навыков 4 класса (−, ×, ÷ в столбик) механик просто нет.",
  fix: "Доработать: отдельные механики под каждую операцию: вычитание (близко к этой вёрстке), умножение и деление столбиком (тут «уголок» это принципиально другой layout). Не пытаться уместить всё в один виджет."
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