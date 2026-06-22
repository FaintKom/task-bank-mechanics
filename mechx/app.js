/* app.jsx — данные разбора (оригиналы) + двухколоночный рендер: слева анализ, справа живое демо */
const REGISTRY = {
  "choice": ChoiceDemo,
  "text-with-slots": TextWithSlotsDemo,
  "number-line": NumberLineDemo,
  "number-grid": NumberGridDemo,
  "clock": ClockDemo,
  "bar-chart": BarChartDemo,
  "ruler": RulerDemo,
  "angle": AngleDemo,
  "drag-drop-set": DragDropSetDemo,
  "sequence-track": SequenceTrackDemo,
  "match-columns": MatchColumnsDemo,
  "fraction-shade": FractionShadeDemo,
  "column-add": ColumnAddDemo,
  "table-grid": TableGridDemo,
  "array-grid": ArrayGridDemo,
  "base10-blocks": Base10BlocksDemo,
  "balance-scale": BalanceScaleDemo,
  "coins": CoinsDemo,
  "slider-control": SliderControlDemo,
  "coordinate-grid": CoordinateGridDemo
};
const STATUS = {
  approved: ["Утверждено", "b-approved"],
  done: ["Готово", "b-done"],
  issues: ["Есть замечания", "b-issues"],
  mockup: ["Макет", "b-mockup"]
};
const FIT = {
  ok: ["хорошо", "f-ok", "d-ok"],
  warn: ["с нюансами", "f-warn", "d-warn"],
  bad: ["риск", "f-bad", "d-bad"]
};
const TAGMAP = {
  cfg: ["t-cfg", "Контент, конфиг"],
  touch: ["t-touch", "Взаимодействие"],
  grade: ["t-grade", "Грейдинг"],
  view: ["t-view", "Отображение"]
};
const DSTATUS = {
  resolved: ["Решено макетом", "#0EB16A", "#E6F7F0"],
  fixed: ["Исправлено", "#0A7D52", "#E2F4EC"],
  partial: ["Частично", "#B26A00", "#FBF1DE"],
  open: ["Открыто", "#E5484D", "#FBEAEA"],
  confirmed: ["Подтверждено макетом", "#C2410C", "#FBEDE3"],
  unverifiable: ["Не проверить на макете", "#5B6470", "#EEF0F2"],
  inaccuracy: ["Поправить наш текст", "#5800E5", "#EEE9FB"]
};
const M = window.MECH_DATA;

/* матрица */
(function renderMatrix() {
  const tb = document.querySelector("#matrix tbody");
  M.forEach(m => {
    const fit = FIT[m.fit];
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><a href="#m-${m.id}" style="text-decoration:none;color:inherit"><span class="mname">${m.name}</span><br><span class="mid">${m.id}</span></a></td>` + `<td>${m.grade}</td>` + `<td><span class="fitword ${fit[1]}"><i class="dot ${fit[2]}"></i>${m.riskTitle}</span></td>` + `<td>${m.edge[0][1]}</td>`;
    tb.appendChild(tr);
  });
})();
function Bullets({
  cls,
  items
}) {
  return /*#__PURE__*/React.createElement("ul", {
    className: cls
  }, items.map((x, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    dangerouslySetInnerHTML: {
      __html: x
    }
  })));
}
function EdgeList({
  items
}) {
  return /*#__PURE__*/React.createElement("ul", null, items.map(([t, x], i) => {
    const tg = TAGMAP[t];
    return /*#__PURE__*/React.createElement("li", {
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag " + tg[0]
    }, tg[1]), /*#__PURE__*/React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: x
      }
    }));
  }));
}
function DStatusChip({
  st
}) {
  const d = DSTATUS[st] || DSTATUS.open;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      fontSize: "11px",
      fontWeight: 700,
      lineHeight: "1.5",
      padding: "2px 9px",
      borderRadius: "999px",
      color: d[1],
      background: d[2],
      whiteSpace: "nowrap"
    }
  }, d[0]);
}
function DesignStatusBlock({
  ds
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bt review"
  }, "\u0421\u0442\u0430\u0442\u0443\u0441 \u043F\u043E \u043C\u0430\u043A\u0435\u0442\u0443 \xB7 ", ds.src, " \xB7 ", ds.date), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 10px",
      fontSize: "14px"
    }
  }, ds.summary), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0
    }
  }, ds.items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: "10px",
      alignItems: "flex-start",
      padding: "8px 0",
      borderTop: i ? "1px solid #ECECF0" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "0 0 auto",
      marginTop: "2px"
    }
  }, /*#__PURE__*/React.createElement(DStatusChip, {
    st: it.st
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: it.t
    }
  }), it.n && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: "#6B7280",
      fontSize: "13px",
      marginTop: "3px"
    },
    dangerouslySetInnerHTML: {
      __html: it.n
    }
  }))))));
}
function MechRow({
  m,
  i
}) {
  const st = STATUS[m.status];
  const Demo = REGISTRY[m.id];
  return /*#__PURE__*/React.createElement("article", {
    className: "mrow",
    id: "m-" + m.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcol-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mech-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("h3", null, m.name), /*#__PURE__*/React.createElement("span", {
    className: "mid"
  }, m.id), /*#__PURE__*/React.createElement("span", {
    className: "badge " + st[1]
  }, st[0])), /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, m.lead), /*#__PURE__*/React.createElement("div", {
    className: "gradeline"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "\u0412\u043E\u0437\u0440\u0430\u0441\u0442"), /*#__PURE__*/React.createElement("span", null, m.grade)), /*#__PURE__*/React.createElement("div", {
    className: "codebehind",
    dangerouslySetInnerHTML: {
      __html: m.code
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bt good"
  }, "\u0421\u0438\u043B\u044C\u043D\u044B\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u044B UX"), /*#__PURE__*/React.createElement(Bullets, {
    cls: "good",
    items: m.good
  })), /*#__PURE__*/React.createElement("div", {
    className: "block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bt risk"
  }, "UX-\u0440\u0438\u0441\u043A \xB7 ", m.riskTitle), /*#__PURE__*/React.createElement(Bullets, {
    cls: "risk",
    items: m.risk
  })), /*#__PURE__*/React.createElement("div", {
    className: "block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bt edge"
  }, "Edge-\u043A\u0435\u0439\u0441\u044B \u0434\u043B\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438"), /*#__PURE__*/React.createElement(EdgeList, {
    items: m.edge
  })), m.review && /*#__PURE__*/React.createElement("div", {
    className: "block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bt review"
  }, "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u0440\u0435\u0432\u044C\u044E"), /*#__PURE__*/React.createElement("ul", {
    className: "review"
  }, m.review.math && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "\u041C\u0435\u0442\u043E\u0434\u0438\u0441\u0442 \u043F\u043E \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u043A\u0435."), " ", m.review.math), m.review.lxd && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "\u0414\u0435\u0442\u0441\u043A\u0438\u0439 UX."), " ", m.review.lxd))), m.designStatus && /*#__PURE__*/React.createElement(DesignStatusBlock, {
    ds: m.designStatus
  })), /*#__PURE__*/React.createElement("div", {
    className: "mcol-demo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "demo-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "demo-cap"
  }, "\u0416\u0438\u0432\u043E\u0439 \u043F\u0440\u0438\u043C\u0435\u0440 \xB7 \u043F\u043E\u0438\u0433\u0440\u0430\u0439\u0442\u0435 \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C\xBB"), Demo ? /*#__PURE__*/React.createElement(Demo, null) : /*#__PURE__*/React.createElement("div", {
    className: "mech"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mech-label"
  }, "\u0434\u0435\u043C\u043E \u043D\u0435\u0442")))));
}
function Cards() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, M.map((m, i) => /*#__PURE__*/React.createElement(MechRow, {
    key: m.id,
    m: m,
    i: i
  })));
}
ReactDOM.createRoot(document.getElementById("cards")).render(/*#__PURE__*/React.createElement(Cards, null));