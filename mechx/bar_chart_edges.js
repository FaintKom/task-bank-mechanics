/* bar_chart_edges.jsx — bar-chart: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): тап по ячейке уровня задаёт высоту столбика ──
   drag — тянуть верх столбика; cellH — высота ячейки уровня */
function BarChart({
  max,
  bars,
  drag,
  cellH = 30,
  prompt
}) {
  const [heights, setHeights] = useState(bars.map(() => 0));
  const [graded, setGraded] = useState(false);
  const [dragBar, setDragBar] = useState(null);
  const levels = Array.from({
    length: max
  }, (_, k) => max - k);
  const correct = bars.every((b, i) => heights[i] === b.target);
  const setH = (i, L) => {
    if (graded) return;
    const n = [...heights];
    n[i] = L;
    setHeights(n);
    setGraded(false);
  };
  const colW = drag ? 56 : 50;
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.1rem",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, prompt || "Построй столбики по числам"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "stretch",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-label",
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "2px 0",
      fontVariantNumeric: "tabular-nums"
    }
  }, levels.map(L => /*#__PURE__*/React.createElement("span", {
    key: L,
    style: {
      height: cellH,
      display: "flex",
      alignItems: "center"
    }
  }, L)), /*#__PURE__*/React.createElement("span", {
    style: {
      height: cellH,
      display: "flex",
      alignItems: "center"
    }
  }, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 10,
      borderLeft: "2px solid var(--line)",
      borderBottom: "2px solid var(--line)",
      paddingLeft: 8
    }
  }, bars.map((bar, i) => {
    const h = heights[i];
    const barOk = h === bar.target;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        position: "relative"
      },
      onPointerMove: e => {
        if (!drag || dragBar !== i || graded) return;
        const wrap = e.currentTarget.getBoundingClientRect();
        const fromTop = e.clientY - wrap.top;
        const L = Math.max(0, Math.min(max, Math.round(max - fromTop / cellH)));
        setH(i, L);
      },
      onPointerUp: () => setDragBar(null),
      onPointerLeave: () => setDragBar(null)
    }, levels.map(L => {
      const filled = L <= h;
      const state = graded && filled ? barOk ? "correct" : "wrong" : undefined;
      const bg = state === "correct" ? "var(--ok-accent)" : state === "wrong" ? "var(--no-accent)" : filled ? "var(--sel-accent)" : "var(--paper)";
      return /*#__PURE__*/React.createElement("button", {
        key: L,
        type: "button",
        onClick: () => !drag && setH(i, L),
        disabled: graded,
        onPointerDown: () => {
          if (drag && !graded) {
            setDragBar(i);
            setH(i, L);
          }
        },
        style: {
          width: colW,
          height: cellH,
          border: "1px solid var(--line)",
          background: bg,
          padding: 0,
          cursor: graded ? "default" : drag ? "ns-resize" : "pointer"
        }
      });
    }), drag && !graded && h > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: -4,
        right: -4,
        top: (max - h) * cellH - 4,
        height: 8,
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 8,
        borderRadius: 4,
        background: "var(--grape,#845ef7)"
      }
    }))), /*#__PURE__*/React.createElement("span", {
      className: "mech-label"
    }, bar.label, heights[i] ? ` · ${heights[i]}` : ""));
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: heights.every(h => h === 0) || graded,
    onClick: () => setGraded(true),
    style: {
      fontSize: "1.2rem",
      minHeight: 60
    }
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), graded && /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      color: correct ? "var(--ok-accent)" : "var(--no-accent)"
    }
  }, correct ? "Верно!" : "Не совсем")));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(BarChart, {
    max: 5,
    bars: [{
      label: "Пн",
      target: 3
    }, {
      label: "Вт",
      target: 5
    }, {
      label: "Ср",
      target: 2
    }]
  }));
}

/* ── EC1 · понижение неинтуитивно ── */
function LowerDemo() {
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
  }, "\u041A\u0430\u043A \u043D\u0430\u0434\u043E (\u0442\u044F\u043D\u0443\u0442\u044C \u0432\u0435\u0440\u0445)")), /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u041F\u043E\u0434\u043D\u0438\u043C\u0438 \u0441\u0442\u043E\u043B\u0431\u0438\u043A, \u043F\u043E\u0442\u043E\u043C \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u043F\u043E\u043D\u0438\u0437\u0438\u0442\u044C")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(BarChart, {
    key: fix ? "f" : "n",
    max: 6,
    bars: [{
      label: "А",
      target: 4
    }, {
      label: "Б",
      target: 2
    }],
    drag: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Тянешь верх столбика вверх и вниз (фиолетовая ручка), высота меняется в обе стороны естественно." : "Чтобы понизить столбик, нужно тапнуть по более низкой ячейке, отдельной «отмены на 1» нет, и ребёнок часто не догадывается, как уменьшить."));
}

/* ── EC2 · target=0 засчитывается без касания ── */
function ZeroBarDemo() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u0423 \u0441\u0442\u043E\u043B\u0431\u0438\u043A\u0430 \xAB\u0421\u0440\xBB \u043E\u0442\u0432\u0435\u0442 0, \u043F\u043E\u0441\u0442\u0440\u043E\u0439 \u0442\u043E\u043B\u044C\u043A\u043E \u041F\u043D \u0438 \u0412\u0442, \u043F\u0440\u043E\u0432\u0435\u0440\u044C")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(BarChart, {
    max: 5,
    bars: [{
      label: "Пн",
      target: 3
    }, {
      label: "Вт",
      target: 4
    }, {
      label: "Ср",
      target: 0
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "\u041D\u0435\u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0439 \u0441\u0442\u043E\u043B\u0431\u0438\u043A \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043D\u0443\u043B\u0451\u043C. \u0415\u0441\u043B\u0438 target=0, \u043E\u043D \u0437\u0430\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432\u0435\u0440\u043D\u044B\u043C, \u0445\u043E\u0442\u044F \u0440\u0435\u0431\u0451\u043D\u043E\u043A \u043A \u043D\u0435\u043C\u0443 \u0432\u043E\u043E\u0431\u0449\u0435 \u043D\u0435 \u043F\u0440\u0438\u043A\u043E\u0441\u043D\u0443\u043B\u0441\u044F, \u0438 \u043D\u0435\u0442 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F, \u0447\u0442\u043E \u043D\u043E\u043B\u044C \u0432\u044B\u0431\u0440\u0430\u043D \u043E\u0441\u043E\u0437\u043D\u0430\u043D\u043D\u043E."));
}

/* ── EC3 · высокий столбик не помещается ── */
function TallDemo() {
  const [big, setBig] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: big ? "on" : "",
    onClick: () => setBig(true)
  }, "\u0428\u043A\u0430\u043B\u0430 \u0434\u043E 12"), /*#__PURE__*/React.createElement("button", {
    className: !big ? "on" : "",
    onClick: () => setBig(false)
  }, "\u0428\u043A\u0430\u043B\u0430 \u0434\u043E 5"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(BarChart, {
    key: big ? "b" : "s",
    max: big ? 12 : 5,
    cellH: big ? 22 : 30,
    bars: [{
      label: "А",
      target: big ? 11 : 4
    }, {
      label: "Б",
      target: big ? 7 : 2
    }, {
      label: "В",
      target: big ? 9 : 3
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, big ? "При шкале до 12 ячейки уровней приходится делать тонкими, чтобы график влез по высоте планшета, и тап по нужному уровню становится неточным." : "До 5 ячейки крупные, попадать в уровень легко."));
}
const CASES = [{
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "Понизить столбик неинтуитивно",
  Demo: LowerDemo,
  problem: "Высота задаётся тапом по уровню, а чтобы уменьшить столбик, нужно тапнуть по более низкой ячейке. Отдельной «отмены на 1» нет, и ребёнок часто не понимает, как понизить уже построенный столбик.",
  fix: "Доработать: дать тянуть верх столбика вверх и вниз (как ручку), чтобы высота менялась в обе стороны одним жестом; либо добавить явные кнопки + и −."
}, {
  tag: "t-grade",
  tagText: "Задание · проверка",
  title: "Нулевой столбик проходит без действия",
  Demo: ZeroBarDemo,
  problem: "Незаполненный столбик считается нулём. Если правильный ответ для столбика равен 0, он засчитывается верным, хотя ребёнок к нему не прикасался: невозможно отличить осознанный «ноль» от «просто не дошёл».",
  fix: "Доработать: требовать подтверждения нулевого столбика (например, отметку «0») или показывать, что столбик ещё не тронут, отдельно от значения 0."
}, {
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Высокая шкала и тонкие ячейки",
  Demo: TallDemo,
  problem: "При большом max график должен влезть по высоте экрана, поэтому ячейки уровней делаются тонкими. Тап по нужному уровню становится неточным, и ребёнок ставит столбик на 1 выше или ниже задуманного.",
  fix: "Доработать: ограничивать max под высоту экрана, укрупнять ячейки, либо вводить высоту перетаскиванием или числом для больших шкал."
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