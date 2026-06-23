/* drag_drop_edges.jsx — drag-drop-set: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (tap-to-place) ── */
function DragDropSet({
  config,
  requireAll,
  controlled,
  compact,
  growSelected
}) {
  const [placedS, setPlacedS] = useState({});
  const [gradedS, setGradedS] = useState(false);
  const [sel, setSel] = useState(null);
  const placed = controlled ? controlled.placed : placedS;
  const graded = controlled ? controlled.graded : gradedS;
  const setPlaced = controlled ? controlled.onPlaced : setPlacedS;
  const setGraded = controlled ? controlled.onGraded : setGradedS;
  const tray = config.items.map((it, i) => ({
    it,
    i
  })).filter(({
    i
  }) => placed[i] === undefined);
  const tapItem = i => {
    if (graded) return;
    if (placed[i] !== undefined) {
      const p = {
        ...placed
      };
      delete p[i];
      setPlaced(p);
      return;
    }
    setSel(s => s === i ? null : i);
  };
  const tapZone = zone => {
    if (graded || sel == null) return;
    setPlaced({
      ...placed,
      [sel]: zone
    });
    setSel(null);
  };
  const renderItem = (i, inZone) => {
    const it = config.items[i];
    const isSel = sel === i;
    const isCor = graded && inZone && placed[i] === it.zone;
    const isWrong = graded && inZone && placed[i] !== it.zone;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "mech-item",
      onClick: () => tapItem(i),
      disabled: graded,
      "data-selected": !graded && isSel ? "true" : undefined,
      "data-state": isCor ? "correct" : isWrong ? "wrong" : undefined,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: compact ? "1rem" : "1.2rem",
        padding: compact ? ".4rem .8rem" : ".5rem 1rem",
        transition: "transform .15s",
        ...(growSelected && !graded && isSel ? {
          transform: "scale(1.7)",
          zIndex: 5,
          boxShadow: "0 8px 18px rgba(0,0,0,.22)"
        } : {})
      }
    }, /*#__PURE__*/React.createElement("span", null, it.label), isCor && /*#__PURE__*/React.createElement(IconCheck, null), isWrong && /*#__PURE__*/React.createElement(IconX, null));
  };
  const ready = requireAll ? tray.length === 0 : Object.keys(placed).length > 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-stack",
    style: {
      gap: "1.1rem"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "mech-prompt",
    style: {
      fontSize: "1.4rem"
    }
  }, config.prompt), !graded && /*#__PURE__*/React.createElement("div", {
    className: "mech-label",
    style: {
      marginTop: -4
    }
  }, sel === null ? "Нажми карточку, потом группу" : "Теперь нажми нужную группу"), /*#__PURE__*/React.createElement("div", {
    className: "mech-tray",
    style: requireAll && !graded && tray.length > 0 ? {
      borderColor: "var(--warn)",
      background: "var(--warn-bg)"
    } : undefined
  }, tray.length === 0 ? /*#__PURE__*/React.createElement("span", {
    className: "mech-label"
  }, "\u2014") : tray.map(({
    i
  }) => renderItem(i, false))), /*#__PURE__*/React.createElement("div", {
    className: "mech-zones"
  }, config.zones.map((zone, zi) => {
    const here = config.items.map((_, i) => i).filter(i => placed[i] === zone);
    return /*#__PURE__*/React.createElement("div", {
      key: zi,
      className: "mech-zone",
      onClick: () => tapZone(zone),
      "data-dragover": !graded && sel !== null ? "true" : undefined,
      style: {
        cursor: graded ? "default" : "pointer"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mech-zone-label",
      style: {
        fontSize: compact ? "1rem" : "1.25rem"
      }
    }, zone), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 52
      }
    }, here.map(i => renderItem(i, true))));
  })), /*#__PURE__*/React.createElement("button", {
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

/* ── опорный палец удалён ── */

const EVEN_ODD = {
  prompt: "Разложи числа по группам",
  zones: ["Чётные", "Нечётные"],
  items: [{
    label: "2",
    zone: "Чётные"
  }, {
    label: "3",
    zone: "Нечётные"
  }, {
    label: "4",
    zone: "Чётные"
  }, {
    label: "7",
    zone: "Нечётные"
  }]
};
const PLACES = {
  prompt: "Разложи разряды по классам",
  zones: ["Единицы", "Десятки", "Сотни", "Тысячи"],
  items: [{
    label: "5 ед",
    zone: "Единицы"
  }, {
    label: "3 дес",
    zone: "Десятки"
  }, {
    label: "8 сот",
    zone: "Сотни"
  }, {
    label: "2 тыс",
    zone: "Тысячи"
  }, {
    label: "7 ед",
    zone: "Единицы"
  }, {
    label: "1 дес",
    zone: "Десятки"
  }, {
    label: "6 сот",
    zone: "Сотни"
  }, {
    label: "9 тыс",
    zone: "Тысячи"
  }]
};

/* ── рабочий пример ── */
function Example() {
  return /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(DragDropSet, {
    config: EVEN_ODD
  }));
}

/* ── EC1 · карточка в лотке = «неверно» ── */
function UnplacedDemo() {
  const [fix, setFix] = useState(false);
  const [placed, setPlaced] = useState({});
  const [graded, setGraded] = useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", {
    className: !fix ? "on" : "",
    onClick: () => {
      setFix(false);
      setPlaced({});
      setGraded(false);
    }
  }, "\u041A\u0430\u043A \u0435\u0441\u0442\u044C"), /*#__PURE__*/React.createElement("button", {
    className: fix ? "on" : "",
    onClick: () => {
      setFix(true);
      setPlaced({});
      setGraded(false);
    }
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438")), !fix && /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: () => {
      setPlaced({
        0: "Чётные",
        1: "Нечётные"
      });
      setGraded(true);
    }
  }, "\u0420\u0430\u0437\u043B\u043E\u0436\u0438\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u0432\u0435 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(DragDropSet, {
    key: fix ? "f" : "n",
    config: EVEN_ODD,
    requireAll: fix,
    controlled: fix ? undefined : {
      placed,
      graded,
      onPlaced: setPlaced,
      onGraded: setGraded
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Лоток подсвечен, «Проверить» заблокирована, пока в нём остались карточки: недоразложенное сдать нельзя." : "Две карточки остались в лотке, но «Проверить» сработала, и они засчитаны как ошибка, хотя ребёнок их просто не разложил."));
}

/* ── EC2 · карточка прячется под пальцем ── */
function UnderFingerDemo() {
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
  }, "\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 (\u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0442\u044C)"))), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(DragDropSet, {
    key: fix ? "f" : "n",
    config: EVEN_ODD,
    growSelected: fix
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, fix ? "Нажми карточку: при переносе она увеличивается, становится больше пальца и остаётся видной, пока её не опустят в зону." : "Нажми карточку: при переносе она не меняется и едет под пальцем, на планшете её закрывает ладонь, ребёнок тащит «вслепую»."));
}

/* ── EC3 · много карточек и тесные зоны ── */
function CrampedDemo() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ec-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label",
    style: {
      fontSize: 13
    }
  }, "8 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A \xB7 4 \u0437\u043E\u043D\u044B")), /*#__PURE__*/React.createElement(TabletFrame, null, /*#__PURE__*/React.createElement(DragDropSet, {
    config: PLACES,
    compact: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "demo-note"
  }, "8 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A \u0438 4 \u0437\u043E\u043D\u044B \u043D\u0430 \u043E\u0434\u043D\u043E\u043C \u044D\u043A\u0440\u0430\u043D\u0435: \u0437\u043E\u043D\u044B \u0443\u0437\u043A\u0438\u0435, \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043C\u0435\u043B\u043A\u0438\u0435, \u0446\u0435\u043B\u044C \u0434\u043B\u044F \xAB\u0431\u0440\u043E\u0441\u043A\u0430\xBB \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0430\u044F, \u043D\u0430 \u043F\u043B\u0430\u043D\u0448\u0435\u0442\u0435 \u043B\u0435\u0433\u043A\u043E \u043F\u0440\u043E\u043C\u0430\u0445\u043D\u0443\u0442\u044C\u0441\u044F \u043C\u0438\u043C\u043E \u043D\u0443\u0436\u043D\u043E\u0439 \u0433\u0440\u0443\u043F\u043F\u044B."));
}
const CASES = [{
  tag: "t-grade",
  tagText: "Задание · проверка",
  title: "Неразложенные карточки сразу идут в ошибку",
  Demo: UnplacedDemo,
  problem: "«Проверить» доступна, как только разложена хотя бы одна карточка. Карточки, оставшиеся в лотке, грейдятся как ошибочные, хотя ребёнок их просто не разложил. «Не доделал» неотличимо от «положил не туда», и сигнала «разложи все» нет. Уточнение: особенно это про задания, где часть карточек по замыслу остаётся неразложенной (лишние карточки), там оставить их в лотке это и есть верный ответ.",
  fix: "Доработать: блокировать «Проверить», пока лоток не пуст, или подсвечивать оставшиеся карточки перед проверкой; отличать «не разложено» от «неверно». Для заданий, где часть карточек по замыслу лишняя, сверять с задуманным распределением, а не блокировать по непустому лотку."
}, {
  tag: "t-age",
  tagText: "Касание · возраст",
  title: "Карточка прячется под пальцем",
  Demo: UnderFingerDemo,
  problem: "При перетаскивании карточка едет ровно под пальцем и полностью скрыта ладонью. Ребёнок тащит «вслепую», не видит ни что несёт, ни попал ли в нужную зону.",
  fix: "Доработать: при перетаскивании увеличивать карточку (чтобы она была больше пальца и оставалась видной) и держать её поверх, пока не опустят в зону."
}, {
  tag: "t-tab",
  tagText: "Планшет · эргономика",
  title: "Много карточек и тесные зоны",
  Demo: CrampedDemo,
  problem: "При 8+ карточках и 3–4 зонах всё сжимается: карточки мелкие, зоны узкие, цель для «броска» маленькая. На планшете легко уронить карточку мимо нужной группы или задеть соседнюю.",
  fix: "Доработать: ограничивать число карточек и зон на экран, увеличивать зоны-цели и зазоры между ними, дробить большую сортировку на этапы."
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