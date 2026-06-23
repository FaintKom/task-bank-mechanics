/* number_line_edges.jsx — number-line: рабочий пример + edge-кейсы на планшете */
const { useState, useRef, useLayoutEffect } = React;

function IconCheck({ s = 22 }) { return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 6 9 17l-5-5" /></svg>); }

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
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", padding: 32 }}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const round = (v) => Math.round(v * 1e6) / 1e6;

/* ── виджет числовой прямой (порт компонента) ── */
function NumberLine({ config, fingerAt, handAt, queryAt, readout, preset = null }) {
  const [value, setValue] = useState(preset);
  const [graded, setGraded] = useState(false);
  const { from, to, step, target, unit } = config;
  const correct = value != null && value === target;

  const ticks = [];
  if (step > 0 && from < to) { for (let v = from; v <= to + 1e-9 && ticks.length <= 61; v += step) ticks.push(round(v)); }
  const invalid = ticks.length < 2 || ticks.length > 60;

  const W = 1000, PAD = 50, Y = 46;
  const x = (v) => PAD + ((v - from) / (to - from)) * (W - 2 * PAD);
  const pct = (v) => (x(v) / W) * 100;
  const markerColor = graded ? (correct ? "var(--ok-accent)" : "var(--no-accent)") : "var(--sel-accent)";
  const labelEvery = ticks.length > 22 ? 5 : ticks.length > 12 ? 2 : 1;

  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.6rem" }}>
      <p className="mech-prompt" style={{ fontSize: "1.6rem" }}>Отметь число {target}{unit ? ` ${unit}` : ""}</p>
      {readout && value != null && <p className="mech-readout" style={{ margin: 0, color: "var(--sel-fg)" }}>Вы отметили: {value}{unit ? ` ${unit}` : ""}</p>}
      {invalid ? (
        <div style={{ width: "100%", maxWidth: 760, height: 150, display: "flex", alignItems: "center", justifyContent: "center", border: "3px dashed var(--line)", borderRadius: 18, background: "var(--paper)" }}>
          <span className="mech-label" style={{ fontSize: "1.4rem" }}>—  (делений {ticks.length > 60 ? ">60" : "<2"}, ось не построена)</span>
        </div>
      ) : (
        <div style={{ position: "relative", width: "100%", maxWidth: 820 }}>
          <svg viewBox={`0 0 ${W} 130`} style={{ width: "100%", touchAction: "none", overflow: "visible" }}>
            <line x1={PAD} y1={Y} x2={W - PAD} y2={Y} stroke="var(--line)" strokeWidth={4} />
            {ticks.map((t, i) => (
              <g key={t}>
                <line x1={x(t)} y1={Y - 12} x2={x(t)} y2={Y + 12} stroke="var(--line)" strokeWidth={4} />
                {i % labelEvery === 0 && <text x={x(t)} y={Y + 46} textAnchor="middle" fontSize={26} fontWeight={700} fill="var(--ink)" style={{ fontVariantNumeric: "tabular-nums" }}>{t}{unit ? ` ${unit}` : ""}</text>}
              </g>
            ))}
            {graded && <circle cx={x(target)} cy={Y} r={17} fill="none" stroke="var(--ok-accent)" strokeWidth={4} />}
            {value != null && <circle cx={x(value)} cy={Y} r={13} fill={markerColor} />}
            {fingerAt != null && <circle cx={x(fingerAt)} cy={Y} r={22} fill="rgba(62,145,214,.26)" stroke="var(--sel-accent)" strokeWidth={3} />}
            {queryAt != null && (<g><text x={x(queryAt)} y={Y - 24} textAnchor="middle" fontSize={32} fontWeight={800} fill="var(--no-accent)">?</text></g>)}
            {handAt != null && (
              <g fill="#e7b08b" stroke="#c98f66" strokeWidth={3} strokeLinejoin="round" style={{ filter: "drop-shadow(-4px 4px 7px rgba(0,0,0,.28))" }}>
                <rect x={x(handAt) - 24} y={Y - 12} width={48} height={130} rx={24} />
                <ellipse cx={x(handAt)} cy={Y + 140} rx={78} ry={52} />
              </g>
            )}
          </svg>
          <div style={{ position: "absolute", inset: 0 }}>
            {ticks.map((t) => (
              <button key={t} type="button" disabled={graded} onClick={() => { setValue(t); setGraded(false); }}
                style={{ position: "absolute", left: `${pct(t)}%`, top: 0, bottom: 0, transform: "translateX(-50%)", width: `max(44px, ${(100 / ticks.length) * 0.9}%)`, background: "transparent", border: "none", cursor: graded ? "default" : "pointer", touchAction: "none" }} />
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <button type="button" className="mech-check" disabled={value == null || graded || invalid} onClick={() => setGraded(true)} style={{ fontSize: "1.3rem", minHeight: 66 }}>Проверить</button>
        {graded && <button type="button" className="mech-reset" onClick={() => { setValue(null); setGraded(false); }}>Ещё раз</button>}
      </div>
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><NumberLine config={{ from: 0, to: 10, step: 1, target: 7 }} /></TabletFrame>; }

/* опорный палец (силуэт) для «как надо» */
function FingerTipSkin() {
  return (
    <svg width="70" height="120" viewBox="0 0 70 120" style={{ display: "block", filter: "drop-shadow(-3px 3px 6px rgba(0,0,0,.25))" }}>
      <g fill="#e7b08b" stroke="#c98f66" strokeWidth="3" strokeLinejoin="round">
        <rect x="18" y="2" width="34" height="86" rx="17" />
        <ellipse cx="35" cy="98" rx="34" ry="22" />
      </g>
    </svg>
  );
}

/* «рекомендации»: тянешь по горизонтали где угодно, над точкой — лупа с числом */
function DragAxis({ from, to, step, target }) {
  const [val, setVal] = useState(null);
  const [down, setDown] = useState(false);
  const [pt, setPt] = useState(null);
  const ref = useRef(null);
  const ticks = []; for (let v = from; v <= to + 1e-9; v += step) ticks.push(round(v));
  const W = 1000, PAD = 60, Y = 70;
  const xf = (v) => (PAD + ((v - from) / (to - from)) * (W - 2 * PAD)) / W;
  const valFrom = (f) => { const raw = from + ((f - PAD / W) / ((W - 2 * PAD) / W)) * (to - from); const s = Math.round((raw - from) / step) * step + from; return Math.max(from, Math.min(to, round(s))); };
  const upd = (e) => { const r = ref.current.getBoundingClientRect(); const fx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); setPt({ x: e.clientX - r.left, y: e.clientY - r.top }); setVal(valFrom(fx)); };
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.2rem" }}>
      <p className="mech-prompt" style={{ fontSize: "1.6rem" }}>Отметь число {target}</p>
      {val != null && <p className="mech-readout" style={{ margin: 0, color: "var(--sel-fg)" }}>Вы отметили: {val}</p>}
      <div ref={ref} onPointerDown={(e) => { ref.current.setPointerCapture(e.pointerId); setDown(true); upd(e); }}
        onPointerMove={(e) => { if (down) upd(e); }} onPointerUp={() => { setDown(false); setPt(null); }}
        style={{ position: "relative", width: "100%", maxWidth: 820, height: 250, touchAction: "none", cursor: "pointer" }}>
        <svg viewBox={`0 0 ${W} 150`} style={{ width: "100%", overflow: "visible", position: "absolute", top: 30, left: 0 }}>
          <line x1={PAD} y1={Y} x2={W - PAD} y2={Y} stroke="var(--line)" strokeWidth={4} />
          {ticks.map((t) => (<g key={t}><line x1={xf(t) * W} y1={Y - 12} x2={xf(t) * W} y2={Y + 12} stroke="var(--line)" strokeWidth={4} /><text x={xf(t) * W} y={Y + 44} textAnchor="middle" fontSize={26} fontWeight={700} fill="var(--ink)">{t}</text></g>))}
          {val != null && <circle cx={xf(val) * W} cy={Y} r={13} fill="var(--sel-accent)" />}
        </svg>
        {/* зона перетаскивания */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, height: 80, border: "2px dashed var(--line)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-mute)", fontSize: 13, fontWeight: 600, pointerEvents: "none" }}>тяни в любом месте, палец не закрывает число</div>
        {/* лупа над точкой */}
        {val != null && (
          <div style={{ position: "absolute", left: `${xf(val) * 100}%`, top: 0, transform: "translateX(-50%)", zIndex: 5, pointerEvents: "none" }}>
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#fff", border: "4px solid var(--sel-accent)", boxShadow: "0 8px 20px rgba(0,0,0,.18)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: "2.3rem", color: "var(--sel-fg)", lineHeight: 1 }}>{val}</span>
              <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>{round(val - step)} · {val} · {round(val + step)}</span>
            </div>
            <div style={{ width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: "13px solid var(--sel-accent)", margin: "0 auto" }} />
          </div>
        )}
        {/* опорный палец там, где реально касаются */}
        {down && pt && <div style={{ position: "absolute", left: pt.x, top: pt.y, transform: "translate(-50%,-6%)", pointerEvents: "none", zIndex: 6 }}><FingerTipSkin /></div>}
      </div>
    </div></div>
  );
}

/* ── EC1 · палец закрывает деление, нет числового подтверждения ── */
function FingerConfirmDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (лупа и тяни)</button>
        </div>
      </div>
      {fix
        ? <TabletFrame><DragAxis from={0} to={10} step={1} target={7} /></TabletFrame>
        : <TabletFrame><NumberLine config={{ from: 0, to: 10, step: 1, target: 7 }} preset={7} handAt={7} /></TabletFrame>}
      <div className="demo-note">{fix
        ? "Тянешь палец по горизонтали в любом месте (в стороне от прямой), над точкой видна лупа с увеличенным числом, плюс крупное «Вы отметили: N». Палец не закрывает деление."
        : "Палец закрыл деление 7: в момент тапа не видно ни деления, ни метки, и нигде не написано, какое число выбрано."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · плотные деления, палец накрывает соседние ── */
function DenseDemo() {
  const [dense, setDense] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={dense ? "on" : ""} onClick={() => setDense(true)}>Шаг 1 (0…30)</button>
          <button className={!dense ? "on" : ""} onClick={() => setDense(false)}>Шаг 5 (0…30)</button>
        </div>
      </div>
      <TabletFrame><NumberLine key={dense ? "d" : "s"} config={{ from: 0, to: 30, step: dense ? 1 : 5, target: 15 }} fingerAt={dense ? 15 : undefined} /></TabletFrame>
      <div className="demo-note">{dense ? "31 деление: подушечка пальца (синий круг ≈44px) накрывает сразу 14, 15 и 16, точно попасть невозможно." : "При шаге 5 деления далеко друг от друга, попасть легко."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · неподписанные деления — счёт штрихов ── */
function UnlabeledDemo() {
  return (
    <React.Fragment>
      <div className="ec-controls"><span className="mech-label" style={{ fontSize: 13 }}>Цель это 13</span></div>
      <TabletFrame><NumberLine config={{ from: 0, to: 20, step: 1, target: 13 }} queryAt={13} /></TabletFrame>
      <div className="demo-note">Подписаны только чётные (0, 2, … 20). Цель 13 стоит на неподписанном штрихе: ребёнок считает штрихи от 12, легко сбиться, и выбранное значение нигде не подтверждается.</div>
    </React.Fragment>
  );
}

/* ── EC4 · большие числа: шаг и подписи ── */
function BigNumbersDemo() {
  const [mode, setMode] = useState("fine");
  const cfg = mode === "fine" ? { from: 0, to: 1000000, step: 10000, target: 700000 }
    : { from: 0, to: 1000000, step: 100000, target: 700000 };
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={mode === "fine" ? "on" : ""} onClick={() => setMode("fine")}>Шаг 10 000</button>
          <button className={mode === "coarse" ? "on" : ""} onClick={() => setMode("coarse")}>Шаг 100 000</button>
        </div>
      </div>
      <TabletFrame><NumberLine key={mode} config={cfg} /></TabletFrame>
      <div className="demo-note">{mode === "fine" ? "Числа до 1 000 000 при шаге 10 000 дают 100 делений, больше лимита 60: ось вообще не строится («—»)." : "При шаге 100 000 делений 11, но подписи (100000…1000000) длинные и налезают друг на друга."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-touch", tagText: "Планшет · касание", title: "Палец закрывает деление, нет подтверждения", Demo: FingerConfirmDemo,
    problem: "На числовой прямой ребёнок пальцем накрывает ту самую точку, в которую целится: в момент тапа не видно ни деления, ни вставшей метки. А числового подтверждения «вы выбрали N» механика не показывает, поэтому после касания ребёнок не уверен, какое число отметил.",
    fix: "Показывать крупное числовое значение выбранной метки (живое «Вы отметили: N»); смещать маркер или подпись из-под пальца или давать «лупу» над точкой касания." },
  { tag: "t-tab", tagText: "Планшет · размер и поля", title: "Плотные деления, палец накрывает соседние", Demo: DenseDemo,
    problem: "При мелком шаге делений много, и тап-зоны (минимум 44px) встают вплотную. Подушечка пальца ребёнка накрывает сразу 2–3 соседних деления, попасть точно в нужное нельзя, а промах на соседнее засчитывается как неверно.",
    fix: "Ограничивать число делений на ширину экрана; крупный шаг или прокрутка и зум оси; держать зазор между активными зонами ≥ размера пальца." },
  { tag: "t-age", tagText: "Возраст · чтение шкалы", title: "Неподписанные деления и счёт штрихов", Demo: UnlabeledDemo,
    problem: "Чтобы не налезали подписи, ось подписывает не каждое деление. Если цель попадает на неподписанный штрих, 9-летний считает штрихи от ближайшей подписи, и это частый источник ошибки «на одно», особенно без числового подтверждения выбранного значения.",
    fix: "Подписывать ключевые и целевые деления; показывать значение метки числом; не делать шаг подписей слишком крупным для целевых чисел." },
  { tag: "t-cfg", tagText: "Контент · вёрстка", title: "Большие числа: либо пусто, либо подписи налезают", Demo: BigNumbersDemo,
    problem: "Методология работает с числами до 1 000 000, но ось рисует максимум 60 делений: мелкий шаг даёт больше лимита, поэтому появляется пустая заглушка «—». Крупный шаг укладывается, но длинные подписи (100000…1000000) наезжают друг на друга и не читаются.",
    fix: "Для крупных диапазонов нужен отдельный режим: подписывать не все деления, сокращать (100k, 1М), либо использовать прикидку с допуском (как slider), а не точное попадание." },
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
