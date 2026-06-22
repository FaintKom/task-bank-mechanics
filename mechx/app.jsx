/* app.jsx — данные разбора (оригиналы) + двухколоночный рендер: слева анализ, справа живое демо */
const REGISTRY = {
  "choice": ChoiceDemo, "text-with-slots": TextWithSlotsDemo, "number-line": NumberLineDemo,
  "number-grid": NumberGridDemo, "clock": ClockDemo, "bar-chart": BarChartDemo, "ruler": RulerDemo,
  "angle": AngleDemo, "drag-drop-set": DragDropSetDemo, "sequence-track": SequenceTrackDemo,
  "match-columns": MatchColumnsDemo, "fraction-shade": FractionShadeDemo, "column-add": ColumnAddDemo,
  "table-grid": TableGridDemo, "array-grid": ArrayGridDemo, "base10-blocks": Base10BlocksDemo,
  "balance-scale": BalanceScaleDemo, "coins": CoinsDemo, "slider-control": SliderControlDemo,
  "coordinate-grid": CoordinateGridDemo,
};

const STATUS = { approved: ["Утверждено", "b-approved"], done: ["Готово", "b-done"], issues: ["Есть замечания", "b-issues"], mockup: ["Макет", "b-mockup"] };
const FIT = { ok: ["хорошо", "f-ok", "d-ok"], warn: ["с нюансами", "f-warn", "d-warn"], bad: ["риск", "f-bad", "d-bad"] };
const TAGMAP = { cfg: ["t-cfg", "Контент, конфиг"], touch: ["t-touch", "Взаимодействие"], grade: ["t-grade", "Грейдинг"], view: ["t-view", "Отображение"] };
const DSTATUS = {
  resolved: ["Решено макетом", "#0EB16A", "#E6F7F0"],
  fixed: ["Исправлено", "#0A7D52", "#E2F4EC"],
  partial: ["Частично", "#B26A00", "#FBF1DE"],
  open: ["Открыто", "#E5484D", "#FBEAEA"],
  confirmed: ["Подтверждено макетом", "#C2410C", "#FBEDE3"],
  unverifiable: ["Не проверить на макете", "#5B6470", "#EEF0F2"],
  inaccuracy: ["Поправить наш текст", "#5800E5", "#EEE9FB"],
};

const M = window.MECH_DATA;

/* матрица */
(function renderMatrix() {
  const tb = document.querySelector("#matrix tbody");
  M.forEach((m) => {
    const fit = FIT[m.fit];
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td><a href="#m-${m.id}" style="text-decoration:none;color:inherit"><span class="mname">${m.name}</span><br><span class="mid">${m.id}</span></a></td>` +
      `<td>${m.grade}</td>` +
      `<td><span class="fitword ${fit[1]}"><i class="dot ${fit[2]}"></i>${m.riskTitle}</span></td>` +
      `<td>${m.edge[0][1]}</td>`;
    tb.appendChild(tr);
  });
})();

function Bullets({ cls, items }) {
  return <ul className={cls}>{items.map((x, i) => <li key={i} dangerouslySetInnerHTML={{ __html: x }} />)}</ul>;
}
function EdgeList({ items }) {
  return (
    <ul>
      {items.map(([t, x], i) => {
        const tg = TAGMAP[t];
        return <li key={i}><span className={"tag " + tg[0]}>{tg[1]}</span><span dangerouslySetInnerHTML={{ __html: x }} /></li>;
      })}
    </ul>
  );
}

function DStatusChip({ st }) {
  const d = DSTATUS[st] || DSTATUS.open;
  return <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 700, lineHeight: "1.5", padding: "2px 9px", borderRadius: "999px", color: d[1], background: d[2], whiteSpace: "nowrap" }}>{d[0]}</span>;
}
function DesignStatusBlock({ ds }) {
  return (
    <div className="block">
      <div className="bt review">Статус по макету · {ds.src} · {ds.date}</div>
      <p style={{ margin: "0 0 10px", fontSize: "14px" }}>{ds.summary}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {ds.items.map((it, i) => (
          <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "8px 0", borderTop: i ? "1px solid #ECECF0" : "none" }}>
            <span style={{ flex: "0 0 auto", marginTop: "2px" }}><DStatusChip st={it.st} /></span>
            <span>
              <span dangerouslySetInnerHTML={{ __html: it.t }} />
              {it.n && <span style={{ display: "block", color: "#6B7280", fontSize: "13px", marginTop: "3px" }} dangerouslySetInnerHTML={{ __html: it.n }} />}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MechRow({ m, i }) {
  const st = STATUS[m.status]; const Demo = REGISTRY[m.id];
  return (
    <article className="mrow" id={"m-" + m.id}>
      <div className="mcol-text">
        <div className="mech-head">
          <span className="num">{String(i + 1).padStart(2, "0")}</span>
          <h3>{m.name}</h3>
          <span className="mid">{m.id}</span>
          <span className={"badge " + st[1]}>{st[0]}</span>
        </div>
        <p className="lead">{m.lead}</p>
        <div className="gradeline"><span className="lbl">Возраст</span><span>{m.grade}</span></div>
        <div className="codebehind" dangerouslySetInnerHTML={{ __html: m.code }} />
        <div className="block"><div className="bt good">Сильные стороны UX</div><Bullets cls="good" items={m.good} /></div>
        <div className="block"><div className="bt risk">UX-риск · {m.riskTitle}</div><Bullets cls="risk" items={m.risk} /></div>
        <div className="block"><div className="bt edge">Edge-кейсы для проверки</div><EdgeList items={m.edge} /></div>
        {m.review && (
          <div className="block">
            <div className="bt review">Рекомендации ревью</div>
            <ul className="review">
              {m.review.math && <li><b>Методист по математике.</b> {m.review.math}</li>}
              {m.review.lxd && <li><b>Детский UX.</b> {m.review.lxd}</li>}
            </ul>
          </div>
        )}
        {m.designStatus && <DesignStatusBlock ds={m.designStatus} />}
      </div>
      <div className="mcol-demo">
        <div className="demo-wrap">
          <div className="demo-cap">Живой пример · поиграйте и нажмите «Проверить»</div>
          {Demo ? <Demo /> : <div className="mech"><span className="mech-label">демо нет</span></div>}
        </div>
      </div>
    </article>
  );
}

function Cards() {
  return <React.Fragment>{M.map((m, i) => <MechRow key={m.id} m={m} i={i} />)}</React.Fragment>;
}

ReactDOM.createRoot(document.getElementById("cards")).render(<Cards />);
