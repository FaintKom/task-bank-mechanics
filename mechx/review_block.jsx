/* review_block.jsx — блок «Рекомендации ревью» из data.js (по data-mech), общий для всех страниц механик */
(function () {
  const mount = document.getElementById("review");
  if (!mount || !window.MECH_DATA) return;
  const m = window.MECH_DATA.find((x) => x.id === mount.dataset.mech);
  if (!m) return;

  // «Разбор UX» прямо на странице механики: сильные стороны, риск, педагогический вердикт.
  (function buildAnalysis() {
    const ped = (window.MECH_PEDAGOGY || {})[m.id];
    const VERDICT = { ok: ["учит", "#1B8E62", "#E4F6EE"], warn: ["частично", "#B26A00", "#FBF0DC"], bad: ["судит", "#C0334E", "#FBE6EB"] };
    const sub = (text, color) => '<div style="display:block;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin:18px 0 8px;color:' + color + '">' + text + "</div>";
    const list = (items) => (!items || !items.length) ? "" : '<ul style="margin:0;padding-left:20px;color:#475067">' + items.map((t) => '<li style="margin:0 0 7px;max-width:70ch">' + t + "</li>").join("") + "</ul>";
    let html = "<h2>Разбор UX</h2><div class=\"h2sub\">Сильные стороны, риск и чему учит</div><div class=\"intro\">";
    if (m.grade) html += '<p style="margin-top:0"><b>Возраст.</b> ' + m.grade + "</p>";
    if (m.good && m.good.length) html += sub("Сильные стороны UX", "#1B8E62") + list(m.good);
    if (m.risk && m.risk.length) html += sub("UX-риск · " + (m.riskTitle || ""), "#C0334E") + list(m.risk);
    if (ped) {
      const v = VERDICT[ped.v] || VERDICT.warn;
      html += sub("Чему учит", "#5800E5") + "<p><b>Навык.</b> " + ped.skill + "</p>";
      html += '<p><span style="display:inline-block;font-size:11px;font-weight:700;line-height:1.5;padding:2px 9px;border-radius:999px;margin-right:8px;color:' + v[1] + ";background:" + v[2] + ';white-space:nowrap">' + v[0] + "</span>" + ped.risk + "</p>";
    }
    html += "</div>";
    const section = document.createElement("section");
    section.id = "analysis";
    section.innerHTML = html;
    const casesEl = document.getElementById("cases");
    const anchor = casesEl ? casesEl.closest("section") : mount.closest("section");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(section, anchor);
  })();

  if (!m.review && !m.designStatus) return;

  const DSTATUS = {
    resolved: ["Решено макетом", "#0EB16A", "#E6F7F0"],
    fixed: ["Исправлено", "#0A7D52", "#E2F4EC"],
    partial: ["Частично", "#B26A00", "#FBF1DE"],
    open: ["Открыто", "#E5484D", "#FBEAEA"],
    confirmed: ["Подтверждено макетом", "#C2410C", "#FBEDE3"],
    unverifiable: ["Не проверить на макете", "#5B6470", "#EEF0F2"],
    inaccuracy: ["Поправить наш текст", "#5800E5", "#EEE9FB"],
  };
  function Chip({ st }) {
    const d = DSTATUS[st] || DSTATUS.open;
    return (
      <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, lineHeight: "1.5", padding: "2px 9px", borderRadius: "999px", color: d[1], background: d[2], whiteSpace: "nowrap" }}>{d[0]}</span>
    );
  }

  function DesignStatus() {
    const ds = m.designStatus;
    if (!ds) return null;
    return (
      <React.Fragment>
        <h2 style={{ marginTop: "34px" }}>Статус по макету</h2>
        <div className="h2sub">Сверка наших замечаний с дизайном · {ds.src} · {ds.date}</div>
        <div className="intro">
          <p style={{ marginTop: 0 }}>{ds.summary}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0" }}>
            {ds.items.map((it, i) => (
              <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "9px 0", borderTop: i ? "1px solid #ECECF0" : "none" }}>
                <span style={{ flex: "0 0 auto", marginTop: "2px" }}><Chip st={it.st} /></span>
                <span>
                  <span dangerouslySetInnerHTML={{ __html: it.t }} />
                  {it.n && <span style={{ display: "block", color: "#6B7280", fontSize: "13px", marginTop: "3px" }} dangerouslySetInnerHTML={{ __html: it.n }} />}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </React.Fragment>
    );
  }

  function ReviewBlock() {
    return (
      <React.Fragment>
        {m.review && (
          <div className="intro">
            {m.review.math && <p><b>Методист по математике.</b> {m.review.math}</p>}
            {m.review.lxd && <p><b>Детский UX.</b> {m.review.lxd}</p>}
          </div>
        )}
        <DesignStatus />
      </React.Fragment>
    );
  }
  ReactDOM.createRoot(mount).render(<ReviewBlock />);
})();
