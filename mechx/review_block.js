/* review_block.jsx — блок «Статус по макету» из data.js (по data-mech), общий для всех страниц механик */
(function () {
  const mount = document.getElementById("review");
  if (!mount || !window.MECH_DATA) return;
  const m = window.MECH_DATA.find(x => x.id === mount.dataset.mech);
  if (!m) return;

  if (!m.designStatus) return;
  const DSTATUS = {
    resolved: ["Решено макетом", "#0EB16A", "#E6F7F0"],
    fixed: ["Исправлено", "#0A7D52", "#E2F4EC"],
    partial: ["Частично", "#B26A00", "#FBF1DE"],
    open: ["Открыто", "#E5484D", "#FBEAEA"],
    confirmed: ["Подтверждено макетом", "#C2410C", "#FBEDE3"],
    unverifiable: ["Не проверить на макете", "#5B6470", "#EEF0F2"],
    inaccuracy: ["Поправить наш текст", "#5800E5", "#EEE9FB"]
  };
  function Chip({
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
  function DesignStatus() {
    const ds = m.designStatus;
    if (!ds) return null;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
      style: {
        marginTop: "34px"
      }
    }, "\u0421\u0442\u0430\u0442\u0443\u0441 \u043F\u043E \u043C\u0430\u043A\u0435\u0442\u0443"), /*#__PURE__*/React.createElement("div", {
      className: "h2sub"
    }, "\u0421\u0432\u0435\u0440\u043A\u0430 \u043D\u0430\u0448\u0438\u0445 \u0437\u0430\u043C\u0435\u0447\u0430\u043D\u0438\u0439 \u0441 \u0434\u0438\u0437\u0430\u0439\u043D\u043E\u043C \xB7 ", ds.src, " \xB7 ", ds.date), /*#__PURE__*/React.createElement("div", {
      className: "intro"
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: 0
      }
    }, ds.summary), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: "none",
        padding: 0,
        margin: "14px 0 0"
      }
    }, ds.items.map((it, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        padding: "9px 0",
        borderTop: i ? "1px solid #ECECF0" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "0 0 auto",
        marginTop: "2px"
      }
    }, /*#__PURE__*/React.createElement(Chip, {
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
    })))))));
  }
  ReactDOM.createRoot(mount).render(/*#__PURE__*/React.createElement(DesignStatus, null));
})();