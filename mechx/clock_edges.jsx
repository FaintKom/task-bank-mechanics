/* clock_edges.jsx — clock: рабочий пример + edge-кейсы (что доработать) */
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

const C = 130, TAU = Math.PI * 2;
const at = (f, r) => { const a = f * TAU - Math.PI / 2; return [C + Math.cos(a) * r, C + Math.sin(a) * r]; };
const pad = (m) => String(m).padStart(2, "0");
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

/* ── виджет (порт): час тапом по цифре, минуты тапом по точке обода ──
   hitR — радиус невидимой зоны; mode: "both" | "hour" | "minute"; liveReadout — табло до проверки */
function Clock({ targetHour, targetMinute, hitR = 16, mode = "both", liveReadout }) {
  const [v, setV] = useState({ hour: null, minute: null }); const [graded, setGraded] = useState(false);
  const needHour = mode !== "minute", needMinute = mode !== "hour";
  const correct = (!needHour || v.hour === targetHour) && (!needMinute || v.minute === targetMinute);
  const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const handColor = graded ? accent : "var(--ink)";
  const set = (next) => { if (!graded) { setV(next); setGraded(false); } };
  const hr = v.hour != null ? at((v.hour % 12) / 12 + (v.minute || 0) / 720, 58) : null;
  const mn = v.minute != null ? at(v.minute / 60, 92) : null;
  const ready = (!needHour || v.hour != null) && (!needMinute || v.minute != null);
  const promptText = mode === "hour" ? `Поставь часовую стрелку на ${targetHour}` : mode === "minute" ? `Поставь минутную стрелку на ${pad(targetMinute)}` : `Покажи время ${targetHour}:${pad(targetMinute)}`;
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.1rem", margin: "0 auto" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>{promptText}</p>
      <svg viewBox="0 0 260 260" style={{ width: "100%", maxWidth: 280, touchAction: "none" }}>
        <circle cx={C} cy={C} r={108} fill="var(--paper)" stroke="var(--ink)" strokeWidth={3} />
        {MINUTES.map((m) => { const [x1, y1] = at(m / 60, 103); const [x2, y2] = at(m / 60, 108); return <line key={m} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line)" strokeWidth={2} />; })}
        {HOURS.map((h) => { const [x, y] = at(h / 12, 86); return <text key={h} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={22} fontWeight={700} fill="var(--ink)">{h}</text>; })}
        {needMinute && mn && <line x1={C} y1={C} x2={mn[0]} y2={mn[1]} stroke={handColor} strokeWidth={4} strokeLinecap="round" />}
        {needHour && hr && <line x1={C} y1={C} x2={hr[0]} y2={hr[1]} stroke={handColor} strokeWidth={6} strokeLinecap="round" />}
        <circle cx={C} cy={C} r={5} fill="var(--ink)" />
        {needHour && HOURS.map((h) => { const [x, y] = at(h / 12, 86); return <circle key={`h${h}`} cx={x} cy={y} r={hitR} fill="transparent" style={{ cursor: graded ? "default" : "pointer" }} onClick={() => set({ ...v, hour: h })} />; })}
        {needMinute && MINUTES.map((m) => { const [x, y] = at(m / 60, 112); return (<g key={`m${m}`}><circle cx={x} cy={y} r={3} fill="var(--ink-mute)" /><circle cx={x} cy={y} r={hitR} fill="transparent" style={{ cursor: graded ? "default" : "pointer" }} onClick={() => set({ ...v, minute: m })} /></g>); })}
      </svg>
      {(liveReadout || graded) && ready && <span className="mech-readout" style={{ color: graded ? accent : "var(--sel-fg)" }}>{mode === "minute" ? `:${pad(v.minute)}` : mode === "hour" ? `${v.hour}:__` : `${v.hour}:${pad(v.minute)}`}</span>}
      <button type="button" className="mech-check" disabled={!ready || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: accent }}>{correct ? "Верно!" : "Не совсем"}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><Clock targetHour={3} targetMinute={0} /></TabletFrame>; }

/* ── EC1 · тап-зоны меньше 44px ── */
function HitAreaDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть (~28px)</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (≥44px)</button>
        </div>
      </div>
      <TabletFrame><Clock key={fix ? "f" : "n"} targetHour={3} targetMinute={40} hitR={fix ? 24 : 14} liveReadout /></TabletFrame>
      <div className="demo-note">{fix
        ? "Зоны минутных точек и часов увеличены до норматива, попасть в нужную отметку легко."
        : "Минутные точки и часовые зоны меньше 44px и стоят близко у центра и обода, поэтому на планшете палец 9-летнего часто попадает в соседнюю отметку."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · нет живого табло времени ── */
function ReadoutDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (живое табло)</button>
        </div>
      </div>
      <TabletFrame><Clock key={fix ? "f" : "n"} targetHour={7} targetMinute={15} hitR={22} liveReadout={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Цифровое «7:15» обновляется по мере выставления стрелок, ребёнок сверяет своё время с заданным до проверки."
        : "Цифровое табло появляется только после «Проверить». По ходу ребёнок не видит, какое время выставил стрелками."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · нельзя тренировать одну стрелку (запрос методиста) ── */
function SingleHandDemo() {
  const [mode, setMode] = useState("minute");
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={mode === "minute" ? "on" : ""} onClick={() => setMode("minute")}>Только минутная</button>
          <button className={mode === "hour" ? "on" : ""} onClick={() => setMode("hour")}>Только часовая</button>
          <button className={mode === "both" ? "on" : ""} onClick={() => setMode("both")}>Обе</button>
        </div>
      </div>
      <TabletFrame><Clock key={mode} targetHour={9} targetMinute={35} hitR={22} mode={mode} liveReadout /></TabletFrame>
      <div className="demo-note">{mode === "both"
        ? "Сейчас механика всегда требует обе стрелки сразу."
        : `Запрос методиста: режим «${mode === "minute" ? "только минутная" : "только часовая"}», тренировать одну стрелку отдельно, не выставляя вторую.`}</div>
    </React.Fragment>
  );
}

/* ── EC4 · стрелки нельзя крутить, только тап ──
   DragClock: схвати кончик стрелки и крути вокруг центра; угол снапится к шагу (час / 5 мин) */
function DragClock({ targetHour, targetMinute, minuteStep = 5 }) {
  const [v, setV] = useState({ hour: 12, minute: 0 }); const [graded, setGraded] = useState(false);
  const [drag, setDrag] = useState(null); const svgRef = useRef(null);
  const correct = v.hour === targetHour && v.minute === targetMinute;
  const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const handColor = graded ? accent : "var(--ink)";
  const fracToHour = (f) => { const h = Math.round(f * 12) % 12; return h === 0 ? 12 : h; };
  const fracToMin = (f) => (Math.round((f * 60) / minuteStep) * minuteStep) % 60;
  const angleAt = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const a = Math.atan2(e.clientY - cy, e.clientX - cx) + Math.PI / 2;
    let f = a / TAU; if (f < 0) f += 1; return f;
  };
  const onMove = (e) => {
    if (!drag || graded) return;
    const f = angleAt(e);
    if (drag === "hour") setV((s) => ({ ...s, hour: fracToHour(f) }));
    else setV((s) => ({ ...s, minute: fracToMin(f) }));
  };
  const hr = at((v.hour % 12) / 12 + v.minute / 720, 58); const mn = at(v.minute / 60, 92);
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.1rem", margin: "0 auto" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>Покажи время {targetHour}:{pad(targetMinute)}</p>
      <svg ref={svgRef} viewBox="0 0 260 260" style={{ width: "100%", maxWidth: 280, touchAction: "none" }}
        onPointerMove={onMove} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}>
        <circle cx={C} cy={C} r={108} fill="var(--paper)" stroke="var(--ink)" strokeWidth={3} />
        {MINUTES.map((m) => { const [x1, y1] = at(m / 60, 103); const [x2, y2] = at(m / 60, 108); return <line key={m} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line)" strokeWidth={2} />; })}
        {HOURS.map((h) => { const [x, y] = at(h / 12, 86); return <text key={h} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={22} fontWeight={700} fill="var(--ink)">{h}</text>; })}
        <line x1={C} y1={C} x2={mn[0]} y2={mn[1]} stroke={handColor} strokeWidth={4} strokeLinecap="round" />
        <line x1={C} y1={C} x2={hr[0]} y2={hr[1]} stroke={handColor} strokeWidth={6} strokeLinecap="round" />
        {/* перетаскиваемые кончики */}
        {!graded && <circle cx={mn[0]} cy={mn[1]} r={20} fill="var(--sel-accent)" opacity={drag === "minute" ? 0.5 : 0.22} stroke="var(--sel-accent)" strokeWidth={2} style={{ cursor: "grab" }} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag("minute"); setGraded(false); }} />}
        {!graded && <circle cx={hr[0]} cy={hr[1]} r={22} fill="var(--grape, #845ef7)" opacity={drag === "hour" ? 0.5 : 0.22} stroke="var(--sel-accent)" strokeWidth={2} style={{ cursor: "grab" }} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag("hour"); setGraded(false); }} />}
        <circle cx={C} cy={C} r={5} fill="var(--ink)" />
      </svg>
      <span className="mech-readout" style={{ color: graded ? accent : "var(--sel-fg)" }}>{v.hour}:{pad(v.minute)}</span>
      <button type="button" className="mech-check" disabled={graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: accent }}>{correct ? "Верно!" : "Не совсем"}</span>}
    </div></div>
  );
}
function RotateHandsDemo() {
  const [mode, setMode] = useState("tap");
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={mode === "tap" ? "on" : ""} onClick={() => setMode("tap")}>Как есть (тап)</button>
          <button className={mode === "drag" ? "on" : ""} onClick={() => setMode("drag")}>Крутить (шаг 5)</button>
          <button className={mode === "precise" ? "on" : ""} onClick={() => setMode("precise")}>Крутить поминутно</button>
        </div>
      </div>
      {mode === "tap"
        ? <TabletFrame><Clock targetHour={3} targetMinute={40} hitR={22} liveReadout /></TabletFrame>
        : <TabletFrame><DragClock key={mode} targetHour={3} targetMinute={mode === "precise" ? 37 : 40} minuteStep={mode === "precise" ? 1 : 5} /></TabletFrame>}
      <div className="demo-note">{mode === "tap"
        ? "Сейчас стрелки выставляются только тапом по нужной отметке, покрутить стрелку, как на настоящих часах, нельзя."
        : mode === "drag"
        ? "Схвати цветной кончик стрелки и крути вокруг центра: стрелка следует за пальцем и встаёт на ближайшую отметку (час или 5 минут)."
        : "Поминутный режим: минутная стрелка снапится к каждой минуте (цель 3:37), можно выставлять точное время, не кратное 5."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-touch", tagText: "Планшет · касание", title: "Стрелки нельзя крутить, только тап", Demo: RotateHandsDemo,
    problem: "Время выставляется только тапом по нужной отметке. Покрутить стрелку вокруг центра, как на настоящих часах, нельзя, а это самый естественный и интуитивный для ребёнка жест, и он же тренирует чувство движения стрелок.",
    fix: "Доработать: сделать стрелки перетаскиваемыми, чтобы схватить кончик, крутить вокруг центра, а угол сам снапился к шагу. Плюс отдельный поминутный режим (шаг 1 минута) для точного времени, не кратного 5. Тап по отметке оставить как дополнительный способ." },
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Тап-зоны стрелок меньше 44px", Demo: HitAreaDemo,
    problem: "Час ставится тапом по цифре (зона ≈32px), минуты тапом по точке обода (≈28px). Это меньше норматива 44px, а зоны ещё и стоят близко у центра и по ободу, поэтому на планшете палец ребёнка часто попадает в соседнюю отметку.",
    fix: "Доработать: увеличить невидимые зоны нажатия до ≥44px, развести часовые и минутные зоны, чтобы они не перекрывались." },
  { tag: "t-age", tagText: "Возраст · фидбек", title: "Нет живого табло времени", Demo: ReadoutDemo,
    problem: "Цифровое табло «Ч:ММ» показывается только после «Проверить». По ходу ребёнок не видит, какое время он выставил стрелками, и не может сверить его с заданным до проверки.",
    fix: "Доработать: показывать живое цифровое время по мере выставления стрелок, это и опора чтения часов, и самопроверка." },
  { tag: "t-cfg", tagText: "Задание · охват", title: "Нельзя тренировать одну стрелку", Demo: SingleHandDemo,
    problem: "Механика всегда требует выставить и час, и минуты сразу. Но методисту нужно отрабатывать стрелки по отдельности, сначала только минутную, потом только часовую, а такого режима в механике нет.",
    fix: "Доработать (запрос методиста): добавить в конфиг режим «только минутная, только часовая или обе», чтобы можно было дать задание на одну стрелку, не выставляя вторую." },
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
