/* angle_edges.jsx — angle: рабочий пример + edge-кейсы (что доработать) */
const { useState, useRef, useLayoutEffect } = React;

const DEV_W = 1280, DEV_H = 800, BEZEL = 26;
function TabletFrame({ children, maxScale = 0.92 }) {
  const tw = DEV_W + BEZEL * 2, th = DEV_H + BEZEL * 2;
  const ref = useRef(null); const [scale, setScale] = useState(0.6);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const upd = () => setScale(Math.min(el.clientWidth / tw, maxScale));
    const ro = new ResizeObserver(upd); ro.observe(el); upd();
    return () => ro.disconnect();
  }, [tw, maxScale]);
  return (
    <div className="tablet-host">
      <div className="tablet-cap"><b>Lenovo Tab K11</b> · 1280 × 800 CSS px · {Math.round(scale * 100)}%</div>
      <div ref={ref} style={{ position: "relative", width: "100%", height: th * scale }}>
        <div className="tablet" style={{ width: tw, height: th, padding: BEZEL, transform: `scale(${scale})` }}>
          <span className="tablet-cam" />
          <div className="device-screen" style={{ width: DEV_W, height: DEV_H, overflow: "hidden", borderRadius: 16 }}>
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", padding: 28 }}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CX = 170, CY = 175, R = 140, RAD = Math.PI / 180;
const at = (deg, r) => [CX + r * Math.cos(deg * RAD), CY - r * Math.sin(deg * RAD)];

/* ── виджет (порт): полукруг-транспортир, тап по отметке = угол ──
   step — шаг отметок; hitR — радиус зоны; drag — крутить луч; readout — крупное число */
function Angle({ target, step = 15, hitR = 14, drag, readout, prompt }) {
  const [value, setValue] = useState(null); const [graded, setGraded] = useState(false);
  const [dragging, setDragging] = useState(false); const svgRef = useRef(null);
  const correct = value != null && value === target;
  const setColor = graded ? (correct ? "var(--ok-accent)" : "var(--no-accent)") : "var(--sel-accent)";
  let s = step > 0 ? step : 15; if (180 / s > 60) s = 15;
  const marks = []; for (let d = 0; d <= 180; d += s) marks.push(d);
  const [bx, by] = at(0, R); const set = value != null ? at(value, R) : null; const tgt = at(target, R);
  const labelled = (d) => (s % 30 === 0 ? d % 30 === 0 : (d / s) % 2 === 0);
  const angleFromPt = (e) => {
    const r = svgRef.current.getBoundingClientRect(); const sx = DEV_W ? r.width / 340 : 1;
    const px = (e.clientX - r.left) / r.width * 340, py = (e.clientY - r.top) / r.height * 210;
    let a = Math.atan2(CY - py, px - CX) / RAD; if (a < 0) a = 0; if (a > 180) a = 180;
    return Math.max(0, Math.min(180, Math.round(a / s) * s));
  };
  const onMove = (e) => { if (drag && dragging && !graded) setValue(angleFromPt(e)); };
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1rem", margin: "0 auto", width: "100%", maxWidth: 460 }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>{prompt || `Построй угол ${target}°`}</p>
      <svg ref={svgRef} viewBox="0 0 340 210" style={{ width: "100%", touchAction: "none" }}
        onPointerMove={onMove} onPointerUp={() => setDragging(false)} onPointerLeave={() => setDragging(false)}>
        <path d={`M ${at(0, R)[0]} ${at(0, R)[1]} A ${R} ${R} 0 0 0 ${at(180, R)[0]} ${at(180, R)[1]}`} fill="none" stroke="var(--ink)" strokeWidth={3} />
        {marks.map((d) => { const [x1, y1] = at(d, R - 8); const [x2, y2] = at(d, R); const [lx, ly] = at(d, R - 26); return (<g key={d}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line)" strokeWidth={2} />{labelled(d) && <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="var(--ink)">{d}</text>}</g>); })}
        {graded && <line x1={CX} y1={CY} x2={tgt[0]} y2={tgt[1]} stroke="var(--ok-accent)" strokeWidth={3} strokeDasharray="6 5" />}
        <line x1={CX} y1={CY} x2={bx} y2={by} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
        {set && <line x1={CX} y1={CY} x2={set[0]} y2={set[1]} stroke={setColor} strokeWidth={5} strokeLinecap="round" />}
        <circle cx={CX} cy={CY} r={5} fill="var(--ink)" />
        {drag
          ? (set && !graded && <circle cx={set[0]} cy={set[1]} r={20} fill="var(--sel-accent)" opacity={dragging ? 0.5 : 0.25} stroke="var(--sel-accent)" strokeWidth={2} style={{ cursor: "grab" }} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); }} />)
          : marks.map((d) => { const [x, y] = at(d, R + 8); return (<g key={`t${d}`}><circle cx={x} cy={y} r={3} fill="var(--ink-mute)" /><circle cx={x} cy={y} r={hitR} fill="transparent" style={{ cursor: graded ? "default" : "pointer" }} onClick={() => !graded && setValue(d)} /></g>); })}
        {drag && !set && !graded && marks.filter((d) => d === target || d % 45 === 0).map((d) => { const [x, y] = at(d, R + 8); return <circle key={`seed${d}`} cx={x} cy={y} r={hitR} fill="transparent" style={{ cursor: "pointer" }} onClick={() => setValue(d)} />; })}
      </svg>
      {readout && value != null && <span className="mech-readout" style={{ color: graded ? setColor : "var(--sel-fg)" }}>{value}°</span>}
      <button type="button" className="mech-check" disabled={value == null || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: setColor }}>{correct ? "Верно!" : `Нужно ${target}°`}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><Angle target={60} /></TabletFrame>; }

/* ── EC1 · тап-отметки меньше 44px ── */
function HitAreaDemo() {
  const [fine, setFine] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={fine ? "on" : ""} onClick={() => setFine(true)}>Шаг 5°</button>
          <button className={!fine ? "on" : ""} onClick={() => setFine(false)}>Шаг 30°</button>
        </div>
      </div>
      <TabletFrame><Angle key={fine ? "f" : "c"} target={fine ? 65 : 60} step={fine ? 5 : 30} readout /></TabletFrame>
      <div className="demo-note">{fine
        ? "При шаге 5° на дуге до 37 отметок, их зоны (~28px) стоят вплотную, и палец 9-летнего легко попадает в соседний градус."
        : "При шаге 30° отметки просторные, попасть легко."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · луч нельзя крутить, только тап ── */
function DragDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть (тап)</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (крутить луч)</button>
        </div>
      </div>
      <TabletFrame><Angle key={fix ? "f" : "n"} target={75} step={5} drag={fix} readout hitR={fix ? 22 : 14} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Схвати кончик подвижного луча и крути, угол меняется плавно и снапится к шагу. (Первый тап по дуге задаёт стартовый луч.) Естественно, как транспортиром."
        : "Сейчас угол задаётся только тапом по нужной отметке, а «покрутить» луч, как настоящим транспортиром, нельзя."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · вырожденные углы 0° и 180° ── */
function DegenerateDemo() {
  const [t, setT] = useState(180);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={t === 180 ? "on" : ""} onClick={() => setT(180)}>Угол 180°</button>
          <button className={t === 0 ? "on" : ""} onClick={() => setT(0)}>Угол 0°</button>
          <button className={t === 60 ? "on" : ""} onClick={() => setT(60)}>Угол 60°</button>
        </div>
      </div>
      <TabletFrame><Angle key={t} target={t} step={15} readout /></TabletFrame>
      <div className="demo-note">{t === 60
        ? "Обычный угол: два луча явно расходятся, видно, что построено."
        : `Угол ${t}°: подвижный луч ${t === 0 ? "сливается с базовым" : "образует с базовым прямую"}, поэтому визуально неочевидно, что угол вообще выставлен, ребёнок не уверен, засчитается ли.`}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Отметки градусов меньше 44px", Demo: HitAreaDemo,
    problem: "При мелком шаге (5°) на полукруге до 37 отметок, и зоны нажатия (~28px) встают вплотную. Палец ребёнка попадает в соседний градус, угол уходит на 5–10°, хотя построен почти верно.",
    fix: "Доработать: увеличить зоны нажатия до ≥44px, для мелкого шага сделать крупнее транспортир или ввод через перетаскивание луча." },
  { tag: "t-touch", tagText: "Планшет · касание", title: "Луч нельзя крутить, только тап", Demo: DragDemo,
    problem: "Угол задаётся только тапом по отметке. Покрутить подвижный луч вокруг вершины, как настоящим транспортиром, нельзя, а это самый естественный жест и он лучше формирует представление об измерении угла.",
    fix: "Доработать: сделать подвижный луч перетаскиваемым, крутишь вокруг вершины, угол снапится к шагу. Тап по отметке оставить как дополнительный способ." },
  { tag: "t-grade", tagText: "Задание · логика", title: "Вырожденные углы 0° и 180°", Demo: DegenerateDemo,
    problem: "При 0° подвижный луч сливается с базовым, при 180° образует с ним прямую линию. В обоих случаях визуально неочевидно, что угол выставлен, и ребёнок не уверен, отметил он что-то или нет.",
    fix: "Доработать: подсвечивать сектор угла (заливку между лучами) и всегда показывать число градусов, чтобы 0° и 180° читались как осознанный ответ, а не «ничего не построено»." },
];

function Cases() {
  return (
    <React.Fragment>
      {CASES.map((c, i) => {
        const D = c.Demo;
        return (
          <article className="ec" key={i}>
            <span className={"ec-tag " + c.tag}>{c.tagText}</span>
            <h3>{c.title}</h3>
            <div className="ec-cols">
              <p className="problem">{c.problem}</p>
              <div className="fix"><b>Как чинить:</b> {c.fix}</div>
            </div>
            <D />
          </article>
        );
      })}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("example")).render(<Example />);
ReactDOM.createRoot(document.getElementById("cases")).render(<Cases />);
