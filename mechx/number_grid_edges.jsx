/* number_grid_edges.jsx — number-grid: рабочий пример + edge-кейсы (что доработать) */
const { useState, useRef, useLayoutEffect, useEffect } = React;

function IconCheck({ s = 20 }) { return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 6 9 17l-5-5" /></svg>); }

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

/* ── логика правила (как @math/core) ── */
function isPrime(n) { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
function correctSet(config) {
  const { rows, cols, start, rule } = config;
  const cells = Array.from({ length: rows * cols }, (_, i) => start + i);
  return cells.filter((n) => {
    if (rule.kind === "multiples") return rule.of !== 0 && n % rule.of === 0;
    if (rule.kind === "divisors") return n !== 0 && rule.of % n === 0;
    return isPrime(n);
  });
}
function ruleText(config) {
  const r = config.rule;
  if (r.kind === "multiples") return `Отметь все числа, кратные ${r.of}`;
  if (r.kind === "divisors") return `Отметь все делители числа ${r.of}`;
  return "Отметь все простые числа";
}

/* ── виджет таблицы (порт компонента) ── */
function NumberGrid({ config, counter, controlled, cellRefs }) {
  const [selS, setSelS] = useState([]); const [gradedS, setGradedS] = useState(false);
  const sel = controlled ? controlled.sel : selS;
  const graded = controlled ? controlled.graded : gradedS;
  const setSel = controlled ? controlled.onSel : setSelS;
  const setGraded = controlled ? controlled.onGraded : setGradedS;
  const { rows, cols, start } = config;
  if (rows < 1 || cols < 1 || rows * cols > 200) return <div className="mech-label" style={{ fontSize: "1.4rem" }}>—</div>;
  const nums = Array.from({ length: rows * cols }, (_, i) => start + i);
  const want = new Set(correctSet(config)); const selSet = new Set(sel);
  const found = sel.filter((n) => want.has(n)).length;
  const toggle = (n) => { if (graded) return; const ns = new Set(selSet); ns.has(n) ? ns.delete(n) : ns.add(n); setSel([...ns].sort((a, b) => a - b)); if (!controlled) setGradedS(false); };
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.2rem" }}>
      <p className="mech-prompt" style={{ fontSize: "1.5rem" }}>{ruleText(config)}</p>
      {counter && <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: "1.15rem", color: found === want.size ? "var(--ok-fg)" : "var(--sel-fg)", background: found === want.size ? "var(--ok-bg)" : "var(--sel-bg)", borderRadius: 999, padding: "6px 18px" }}>Найдено: {found} из {want.size}</span>}
      <div style={{ display: "grid", gap: 6, gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, width: "100%", maxWidth: Math.min(820, cols * 74) }}>
        {nums.map((n) => {
          const isSel = selSet.has(n);
          const state = graded ? (want.has(n) ? "correct" : isSel ? "wrong" : undefined) : undefined;
          return (
            <button key={n} type="button" className="mech-tile" ref={cellRefs ? (el) => { if (el) cellRefs.current[n] = el; } : undefined}
              onClick={() => toggle(n)} disabled={graded}
              data-selected={!graded && isSel ? "true" : undefined} data-state={state} data-locked={graded ? "true" : undefined}
              style={{ aspectRatio: "1", minHeight: 56, padding: 0, fontSize: "1.15rem", boxShadow: "0 3px 0 0 var(--line)" }}>{n}</button>
          );
        })}
      </div>
      <button type="button" className="mech-check" disabled={sel.length === 0 || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><NumberGrid config={{ rows: 3, cols: 10, start: 1, rule: { kind: "multiples", of: 3 } }} /></TabletFrame>; }

/* ── EC1 · двойной тап снимает выбор ── */
function DoubleTapDemo() {
  const config = { rows: 2, cols: 5, start: 1, rule: { kind: "multiples", of: 3 } };
  const [sel, setSel] = useState([]);
  const [finger, setFinger] = useState({ x: 0, y: 0, show: false });
  const [ripples, setRipples] = useState([]);
  const [note, setNote] = useState("Нажмите «Воспроизвести», и я покажу быстрый двойной тап по клетке.");
  const [thought, setThought] = useState(false); const [playing, setPlaying] = useState(false);
  const stageRef = useRef(null); const cellRefs = useRef({}); const timers = useRef([]);
  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clearAll, []);
  const ripple = (x, y) => { const id = Math.random(); setRipples((r) => [...r, { id, x, y }]); timers.current.push(setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 560)); };
  const play = () => {
    clearAll(); setSel([]); setThought(false); setPlaying(true); setNote("…");
    const el = cellRefs.current[6]; const sb = stageRef.current.getBoundingClientRect(); const ob = el.getBoundingClientRect();
    const x = ob.left - sb.left + ob.width / 2, y = ob.top - sb.top + ob.height / 2;
    setFinger({ x, y, show: true });
    timers.current.push(setTimeout(() => { setSel([6]); ripple(x, y); setNote("Тап, клетка «6» выделена."); }, 380));
    timers.current.push(setTimeout(() => { setSel([]); ripple(x, y); setNote("…ещё тап, выделение снято."); }, 740));
    timers.current.push(setTimeout(() => { setFinger((f) => ({ ...f, show: false })); setThought(true); setNote(""); setPlaying(false); }, 1200));
  };
  return (
    <React.Fragment>
      <div className="ec-controls"><button className="btn primary" onClick={play} disabled={playing}>▶ Воспроизвести двойной тап</button></div>
      <div className="stage" ref={stageRef}>
        <TabletFrame><NumberGrid config={config} controlled={{ sel, graded: false, onSel: setSel, onGraded: () => {} }} cellRefs={cellRefs} /></TabletFrame>
        {ripples.map((p) => <span key={p.id} className="ripple" style={{ left: p.x, top: p.y }} />)}
        <span className={"finger" + (finger.show ? " on" : "")} style={{ left: finger.x, top: finger.y }} />
      </div>
      <div className="demo-note">{thought ? <span className="thought">Ребёнок: «отметил!», а клетка пустая</span> : note}</div>
    </React.Fragment>
  );
}

/* ── EC3 · объём задачи: все простые до 100 ── */
function PrimesDemo() {
  return (
    <React.Fragment>
      <div className="ec-controls"><span className="mech-label" style={{ fontSize: 13 }}>Реальная задача: «отметь все простые до 100»</span></div>
      <TabletFrame><NumberGrid counter config={{ rows: 10, cols: 10, start: 1, rule: { kind: "primes" } }} /></TabletFrame>
      <div className="demo-note">25 целей среди 100 клеток: десятки точных тапов, удержание правила в уме, и при проверке один лишний или пропущенный тап обнуляет всю работу, так что задача дорогая и демотивирующая.</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-touch", tagText: "Планшет · касание", title: "Двойной тап снимает выделение", Demo: DoubleTapDemo,
    problem: "Тап по клетке работает как переключатель. На сетке из десятков клеток быстрый двойной тап (частый у детей) выделяет и тут же снимает клетку; ребёнок уверен, что отметил, а она пустая, и это всплывёт только при проверке.",
    fix: "Доработать: гасить второй тап в пределах ~250 мс или подтверждать снятие явной анимацией, чтобы случайное касание не сбрасывало отметку незаметно." },
  { tag: "t-cfg", tagText: "Задание · методика", title: "Объём задачи: «все простые до 100»", Demo: PrimesDemo,
    problem: "Правило вроде «все простые до 100» даёт 25 целей среди 100 клеток: десятки точных тапов, постоянное удержание правила в уме и дорогая проверка, при которой одна ошибка обнуляет всю долгую работу. Для 9–10 лет это утомляет и демотивирует.",
    fix: "Доработать: дробить такие задачи на части (по десяткам), давать промежуточную проверку и подсказки, не превращать урок в один огромный многотаповый экран." },
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
