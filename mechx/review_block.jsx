/* review_block.jsx — блок «Статус по макету» из data.js (по data-mech), общий для всех страниц механик */
(function () {
  const mount = document.getElementById("review");
  if (!mount || !window.MECH_DATA) return;
  const m = window.MECH_DATA.find((x) => x.id === mount.dataset.mech);
  if (!m) return;

  if (!m.designStatus) return;

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

  ReactDOM.createRoot(mount).render(<DesignStatus />);
})();
