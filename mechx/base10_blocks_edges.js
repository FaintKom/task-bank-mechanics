/* base10_blocks_edges.jsx — base10-blocks: рабочий пример + edge-кейсы (что доработать) */
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
    width: 46,
    height: 46,
    padding: 0,
    fontSize: "1.5rem"
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

/* ── виджет (порт): блоки сотни/десятки/единицы, max 0–999 ── */
const GLYPH = {
  hundreds: {
    w: 26,
    h: 26
  },
  tens: {
    w: 8,
    h: 26
  },
  ones: {
    w: 11,
    h: 11
  }
};
function Base10({
  target,
  columns,
  maxEach = 15
}) {
  const COLS = columns || [{
    place: "hundreds",
    label: "Сотни"
  }, {
    place: "tens",
    label: "Десятки"
  }, {
    place: "ones",
    label: "Единицы"
  }];
  const [v, setV] = useState({
    hundreds: 0,
    tens: 0,
    ones: 0
  });
  const [graded, setGraded] = useState(false);
  const total = v.hundreds * 100 + v.tens * 10 + v.ones;
  const correct = total === target;
  const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const adjust = (place, d) => {
    if (graded) return;
    setV({
      ...v,
      [place]: Math.min(maxEach, Math.max(0, v[place] + d))
    });
    setGraded(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.3rem",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, "\u0421\u043E\u0431\u0435\u0440\u0438 \u0447\u0438\u0441\u043B\u043E ", target), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 16
    }
  }, COLS.map(({
    place,
    label
  }) => {
    const g = GLYPH[place] || GLYPH.ones;
    return /*#__PURE__*/React.createElement("div", {
      key: place,
      style: {
        display: "flex",
        width: 104,
        flexDirection: "column",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        minHeight: 116,
        flexDirection: "column-reverse",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "flex-start",
        gap: 4
      }
    }, Array.from({
      length: v[place] || 0
    }, (_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: g.w,
        height: g.h,
        background: "var(--sel-accent)",
        border: "1px solid var(--paper)",
        borderRadius: 3
      }
    }))), /*#__PURE__*/React.createElement("span", {
      className: "mech-readout",
      style: {
        fontSize: "1.5rem"
      }
    }, v[place] || 0), /*#__PURE__*/React.createElement("span", {
      className: "mech-label"
    }, label), /*#__PURE__*/React.createElement(PlusMinus, {
      onMinus: () => adjust(place, -1),
      onPlus: () => adjust(place, 1),
      disabled: graded
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label"
  }, "\u041F\u043E\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C:"), /*#__PURE__*/React.createElement("span", {
    className: "mech-readout",
    style: graded ? {
      color: accent
    } : undefined
  }, total)), /*#__PURE__*/React.createElement("button", {
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
  }, correct ? "Верно!" : `Нужно ${target}`)));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Base10, {
    target: 234
  }));
}

/* ── EC1 · потолок сотен против чисел до миллиона ── */
function CeilingDemo() {
  const [big, setBig] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !big ? "on" : "",
    onClick: () => setBig(false)
  }, "\u0427\u0438\u0441\u043B\u043E 234"), /*#__PURE__*/React.createElement("button", {
    className: big ? "on" : "",
    onClick: () => setBig(true)
  }, "\u0427\u0438\u0441\u043B\u043E 24 500"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Base10, {
    key: big ? "b" : "n",
    target: big ? 24500 : 234
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, big ? "Цель 24 500, а у блоков только сотни, десятки и единицы (максимум 999). Тысяч и десятков тысяч в наборе нет, собрать число невозможно." : "Число 234 укладывается в сотни, десятки и единицы, а механика работает только до 999."));
}

/* ── EC2 · перегруз блоков ── */
function OverflowDemo() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u0421\u043E\u0431\u0435\u0440\u0438 999, \u0434\u043E\u0431\u0430\u0432\u044C \u043F\u043E 9 \u0432 \u043A\u0430\u0436\u0434\u044B\u0439 \u0440\u0430\u0437\u0440\u044F\u0434")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Base10, {
    target: 999
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "\u0411\u043B\u0438\u0437\u043A\u043E \u043A \u0446\u0435\u043B\u0438 (999 = 9+9+9 \u0431\u043B\u043E\u043A\u043E\u0432, \u043F\u043B\u044E\u0441 \u043F\u0435\u0440\u0435\u0433\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0430) \u0440\u0430\u0437\u0440\u044F\u0434 \u043D\u0430\u0431\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0434\u0435\u0441\u044F\u0442\u043A\u0430\u043C\u0438 \u0431\u043B\u043E\u043A\u043E\u0432, \u0441\u0442\u043E\u043F\u043A\u0438 \u043F\u0435\u0440\u0435\u043F\u043E\u043B\u043D\u044F\u044E\u0442\u0441\u044F \u043F\u043E \u0432\u044B\u0441\u043E\u0442\u0435, \u0441\u0447\u0438\u0442\u0430\u0442\u044C \u0438 \u043F\u043E\u043F\u0430\u0434\u0430\u0442\u044C \u043A\u043D\u043E\u043F\u043A\u0430\u043C\u0438 \u0442\u044F\u0436\u0435\u043B\u043E."));
}

/* ── EC3 · набор только по одному тапу ── */
function NoRepeatDemo() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u041D\u0430\u0436\u043C\u0438 \xAB+\xBB \u0432 \u0441\u043E\u0442\u043D\u044F\u0445 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0440\u0430\u0437")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(Base10, {
    target: 734
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "\u041A\u043D\u043E\u043F\u043A\u0438 +/\u2212 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u044E\u0442 \u0440\u043E\u0432\u043D\u043E \u043F\u043E \u043E\u0434\u043D\u043E\u043C\u0443 \u0431\u043B\u043E\u043A\u0443 \u0437\u0430 \u0442\u0430\u043F \u0438 \u0431\u0435\u0437 \u0430\u0432\u0442\u043E\u043F\u043E\u0432\u0442\u043E\u0440\u0430 \u043F\u0440\u0438 \u0443\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0438. \u0427\u0442\u043E\u0431\u044B \u043D\u0430\u0431\u0440\u0430\u0442\u044C 7 \u0441\u043E\u0442\u0435\u043D, 3 \u0434\u0435\u0441\u044F\u0442\u043A\u0430 \u0438 4 \u0435\u0434\u0438\u043D\u0438\u0446\u044B, \u043D\u0443\u0436\u043D\u043E 14 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u044B\u0445 \u0442\u0430\u043F\u043E\u0432, \u0438 \u0434\u043B\u044F \u0431\u043E\u043B\u044C\u0448\u0438\u0445 \u0447\u0438\u0441\u0435\u043B \u044D\u0442\u043E \u0443\u0442\u043E\u043C\u0438\u0442\u0435\u043B\u044C\u043D\u043E."));
}
const CASES = [{
  tag: "t-cfg",
  tagText: "Задание · охват",
  title: "Блоки только до сотен (макс 999)",
  Demo: CeilingDemo,
  problem: "В наборе есть сотни, десятки, единицы, потолок 999. А методология 4 класса работает с числами до 1 000 000 (разряды и классы тысяч). Тысячи и выше блоками не собрать, и инструмент остаётся «начальной школой» и не покрывает ядровую тему разрядов.",
  fix: "Доработать: добавить разряды тысяч, десятков и сотен тысяч (классы), либо честно ограничить применение механики числами до 999 и не давать её на большие разряды."
}, {
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Стопки блоков переполняются",
  Demo: OverflowDemo,
  problem: "Любой состав числа засчитывается (это плюс), но при наборе близко к лимиту (до 15 блоков на разряд, перегруппировка) стопки забиваются десятками мелких блоков, их трудно сосчитать глазами, а столбец переполняется по высоте экрана.",
  fix: "Доработать: визуально группировать блоки (по 5 или по 10), сворачивать десяток единиц в «палочку-десяток» автоматически, ограничивать высоту стопки."
}, {
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "Набор только по одному тапу",
  Demo: NoRepeatDemo,
  problem: "Кнопки +/− меняют разряд ровно на единицу за тап и без автоповтора при удержании. Набрать многоразрядное число это десяток-полтора отдельных тапов, на планшете долго и провоцирует проскочить нужное.",
  fix: "Доработать: автоповтор при удержании, ввод количества числом, или перетаскивание блоков пачкой, чтобы набор не превращался в серию однообразных тапов."
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