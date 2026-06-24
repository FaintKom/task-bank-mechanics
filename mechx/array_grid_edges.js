/* array_grid_edges.jsx — array-grid: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): один тап строит прямоугольник r×c от верхнего левого угла ── */
function ArrayGrid({
  maxRows,
  maxCols,
  targetRows,
  targetCols,
  commutative,
  prompt = "Построй прямоугольник"
}) {
  const [val, setVal] = useState(null);
  const [graded, setGraded] = useState(false);
  const rows = Array.from({
    length: maxRows
  }, (_, i) => i + 1);
  const cols = Array.from({
    length: maxCols
  }, (_, i) => i + 1);
  const inArr = (r, c) => val != null && r <= val.rows && c <= val.cols;
  const correct = val != null && (commutative ? val.rows === targetRows && val.cols === targetCols || val.rows === targetCols && val.cols === targetRows : val.rows === targetRows && val.cols === targetCols);
  const accent = graded ? correct ? "var(--ok-accent)" : "var(--no-accent)" : "var(--sel-accent)";
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
  }, prompt, ": ", targetRows, " \xD7 ", targetCols), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      gridTemplateColumns: `repeat(${maxCols}, minmax(0,1fr))`
    }
  }, rows.map(r => cols.map(c => {
    const on = inArr(r, c);
    return /*#__PURE__*/React.createElement("button", {
      key: `${r}-${c}`,
      type: "button",
      className: "mech-tile",
      onClick: () => {
        if (!graded) {
          setVal({
            rows: r,
            cols: c
          });
          setGraded(false);
        }
      },
      disabled: graded,
      "data-selected": !graded && on ? "true" : undefined,
      "data-state": graded && on ? correct ? "correct" : "wrong" : undefined,
      "data-locked": graded ? "true" : undefined,
      style: {
        aspectRatio: "1",
        width: maxCols > 7 ? 40 : 52,
        minHeight: 0,
        padding: 0
      }
    });
  }))), val != null && /*#__PURE__*/React.createElement("div", {
    className: "mech-readout",
    style: {
      color: graded ? accent : undefined
    }
  }, val.rows, " \xD7 ", val.cols, " = ", val.rows * val.cols), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: val == null || graded,
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
  }, correct ? "Верно!" : `Нужно ${targetRows} × ${targetCols}`)));
}

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ArrayGrid, {
    maxRows: 5,
    maxCols: 5,
    targetRows: 3,
    targetCols: 4
  }));
}

/* ── EC1 · 3×4 ≠ 4×3 ── */
function CommutativeDemo() {
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
  }, "\u0444\u043B\u0430\u0433: \u043E\u0440\u0438\u0435\u043D\u0442\u0430\u0446\u0438\u044F \u043D\u0435 \u0432\u0430\u0436\u043D\u0430")), /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u041F\u043E\u0441\u0442\u0440\u043E\u0439 4\xD73 \u043F\u0440\u0438 \u0446\u0435\u043B\u0438 3\xD74 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ArrayGrid, {
    key: fix ? "f" : "n",
    maxRows: 5,
    maxCols: 5,
    targetRows: 3,
    targetCols: 4,
    commutative: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Флаг orientationMatters=false: засчитываются обе ориентации, 4×3 принимается при цели 3×4. Для задач, где важна только площадь." : "Цель 3×4. Ребёнок строит 4×3, проверка различает ориентацию и не засчитывает. По умолчанию это правильно: для умножения порядок множителей важен."));
}

/* ── EC2 · нет превью на touch ── */
function PreviewDemo() {
  // имитация: показываем разницу «как есть» (тап сразу строит) vs «как надо» (контур-превью наведённой области)
  const [hover, setHover] = useState(null);
  const maxR = 5,
    maxC = 5;
  const rows = Array.from({
    length: maxR
  }, (_, i) => i + 1);
  const cols = Array.from({
    length: maxC
  }, (_, i) => i + 1);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "\u041D\u0430\u0432\u0435\u0434\u0438 (\u043A\u0430\u043A \u043C\u044B\u0448\u044C\u044E \u043D\u0430 \u0434\u043E\u0441\u043A\u0435), \u043D\u043E \u043D\u0430 \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043D\u0435\u0442")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement("div", {
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
  }, "\u041F\u043E\u0441\u0442\u0440\u043E\u0439 \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A: 3 \xD7 4"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6,
      gridTemplateColumns: `repeat(${maxC}, minmax(0,1fr))`
    },
    onMouseLeave: () => setHover(null)
  }, rows.map(r => cols.map(c => {
    const on = hover && r <= hover.r && c <= hover.c;
    return /*#__PURE__*/React.createElement("button", {
      key: `${r}-${c}`,
      type: "button",
      className: "mech-tile",
      onMouseEnter: () => setHover({
        r,
        c
      }),
      "data-selected": on ? "true" : undefined,
      style: {
        aspectRatio: "1",
        width: 52,
        minHeight: 0,
        padding: 0
      }
    });
  }))), /*#__PURE__*/React.createElement("span", {
    className: "mech-label"
  }, hover ? `превью: ${hover.r} × ${hover.c}` : "наведи на клетку")))), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "\u041D\u0430 \u0434\u043E\u0441\u043A\u0435 \u0438\u043B\u0438 \u043C\u044B\u0448\u044C\u044E \u0432\u0438\u0434\u043D\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u0431\u0443\u0434\u0443\u0449\u0435\u0433\u043E \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0430 \u043F\u0440\u0438 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0438. \u041D\u0430 \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u044F \u043D\u0435\u0442, \u043F\u0430\u043B\u0435\u0446 \u0441\u0440\u0430\u0437\u0443 \u0441\u0442\u0440\u043E\u0438\u0442 \u043F\u043E \u0442\u0430\u043F\u0443, \u0438 \xAB\u043F\u0440\u0438\u043C\u0435\u0440\u0438\u0442\u044C\xBB \u0440\u0430\u0437\u043C\u0435\u0440 \u0434\u043E \u043F\u043E\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u044F \u043D\u0435\u043B\u044C\u0437\u044F."));
}

/* ── EC3 · крупная сетка — мелкие клетки ── */
function BigGridDemo() {
  const [big, setBig] = useState(true);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: big ? "on" : "",
    onClick: () => setBig(true)
  }, "10 \xD7 10"), /*#__PURE__*/React.createElement("button", {
    className: !big ? "on" : "",
    onClick: () => setBig(false)
  }, "5 \xD7 5"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(ArrayGrid, {
    key: big ? "b" : "s",
    maxRows: big ? 10 : 5,
    maxCols: big ? 10 : 5,
    targetRows: 7,
    targetCols: 8
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, big ? "10×10: клетки мелкие и прижаты, тап по угловой клетке (7×8) неточен, легко построить 6×8 или 7×9 вместо нужного." : "5×5: клетки крупные, попасть в угловую легко."));
}
const CASES = [{
  tag: "t-grade",
  tagText: "Задание · логика",
  title: "3×4 и 4×3 различаются: верно для умножения, добавляем флаг для задач без порядка",
  Demo: CommutativeDemo,
  problem: "Проверка различает ориентацию: при цели 3×4 ответ 4×3 считается другим ответом. Для умножения это правильно: порядок множителей принципиально важен (Julia). Но есть задачи, где важна только площадь и порядок неважен, для них строгая проверка мешает.",
  fix: "Решение: оставляем строгую проверку по умолчанию (порядок важен для умножения) и добавляем в конфиг флаг orientationMatters (default true); при false проверка засчитывает обе ориентации, a×b и b×a. Отдельно Maksim предлагает со временем заменить эту механику на грид с выбором любой области и кастомной формулой (у Жени уже есть версия). Это более крупное решение."
}, {
  tag: "t-touch",
  tagText: "Планшет · касание",
  title: "На планшете нет превью прямоугольника",
  Demo: PreviewDemo,
  problem: "Модель «навёл, увидел будущий прямоугольник, кликнул» работает мышью, но на планшете наведения нет: палец сразу строит по тапу. Ребёнок не может «примерить» размер до построения и часто строит не тот прямоугольник с первого касания.",
  fix: "Доработать: строить по тапу с явным подтверждением и возможностью поправить край перетаскиванием, либо показывать живой размер r×c и давать переуточнить, не начиная заново."
}, {
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Крупная сетка и мелкие клетки",
  Demo: BigGridDemo,
  problem: "При сетке 10×10 клетки мелкие и стоят вплотную. Тап по нужной угловой клетке (она задаёт размер прямоугольника) неточен, палец легко строит 6×8 или 7×9 вместо 7×8.",
  fix: "Доработать: укрупнять клетки или ограничивать размер сетки под экран, увеличивать зазоры, а для больших произведений давать другой способ ввода (числа строк и столбцов)."
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