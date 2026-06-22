/* kit.jsx — общий рантайм демо: хост (value/display/result + Check), иконки */
const {
  useState,
  useRef,
  useCallback,
  useEffect
} = React;
const Display = {
  Input: "input",
  Graded: "graded"
};
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
function isEmpty(v) {
  if (v === null || v === undefined || v === "") return true;
  if (Array.isArray(v)) return v.length === 0 || v.every(x => x === "" || x === undefined || x === null);
  if (typeof v === "object") return Object.keys(v).length === 0;
  return false;
}

/**
 * Хост одной механики: владеет value + display, рисует «Проверить» и «Ещё раз».
 * score(config, value) → { correct } считается только в Graded.
 * canCheck(value) — опциональный предикат готовности (по умолчанию: непусто).
 */
function MechHost({
  config,
  score,
  initial = null,
  canCheck,
  render
}) {
  const [value, setValue] = useState(initial);
  const [display, setDisplay] = useState(Display.Input);
  const graded = display === Display.Graded;
  const result = graded ? score(config, value) : undefined;
  const onChange = useCallback(v => {
    setValue(v);
    setDisplay(Display.Input);
  }, []);
  const ready = canCheck ? canCheck(value) : !isEmpty(value);
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack"
  }, render({
    config,
    value,
    onChange,
    display,
    result
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-check",
    disabled: !ready || graded,
    onClick: () => setDisplay(Display.Graded)
  }, "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C"), graded && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-reset",
    onClick: () => {
      setValue(initial);
      setDisplay(Display.Input);
    }
  }, "\u0415\u0449\u0451 \u0440\u0430\u0437"))));
}
Object.assign(window, {
  Display,
  IconCheck,
  IconX,
  isEmpty,
  MechHost
});