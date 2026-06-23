/* match_cols_edges.jsx — match-columns: рабочий пример + edge-кейсы (что доработать) */
const { useState, useRef, useLayoutEffect, useMemo, useEffect } = React;

function IconCheck({ s = 18 }) { return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>); }
function IconX({ s = 18 }) { return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>); }

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

/* ── логика (как @math/core) ── */
function rightOptions(config) { const seen = new Set(); const out = []; for (const p of config.pairs) if (!seen.has(p.right)) { seen.add(p.right); out.push(p.right); } return out; }
function shuffledOrder(n) { const shift = n >= 2 ? Math.max(1, Math.floor(n / 2)) : 0; return Array.from({ length: n }, (_, i) => (i + shift) % n); }

/* ── виджет (tap-to-connect, прямые линии, many-to-one) ── */
const LINK_COLORS = ["#3e91d6", "#f26b4a", "#7aab2c", "#845ef7", "#e3a455", "#d6336c"];
function MatchColumns({ config, requireAll, palette, controlled }) {
  const [matchesS, setMatchesS] = useState({}); const [gradedS, setGradedS] = useState(false); const [active, setActive] = useState(null);
  const matches = controlled ? controlled.matches : matchesS;
  const graded = controlled ? controlled.graded : gradedS;
  const setMatches = controlled ? controlled.onMatches : setMatchesS;
  const setGraded = controlled ? controlled.onGraded : setGradedS;
  const opts = useMemo(() => rightOptions(config), [config]);
  const order = useMemo(() => shuffledOrder(opts.length), [opts.length]);
  const rootRef = useRef(null); const leftRefs = useRef({}); const rightRefs = useRef({});
  const [box, setBox] = useState({ w: 0, h: 0 }); const [lines, setLines] = useState([]);
  const leftCorrect = (i) => opts[matches[i]] === config.pairs[i]?.right;
  const offsetWithin = (el, root) => { let x = 0, y = 0; for (let n = el; n && n !== root; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; } return { x, y }; };
  const measure = () => {
    const root = rootRef.current; if (!root) return; const w = root.offsetWidth, h = root.offsetHeight; if (!w || !h) return; setBox({ w, h });
    const next = [];
    for (const [l, r] of Object.entries(matches)) { const lt = leftRefs.current[l], rt = rightRefs.current[r]; if (!lt || !rt) continue; const a = offsetWithin(lt, root), b = offsetWithin(rt, root); next.push({ left: Number(l), x1: a.x + lt.offsetWidth, y1: a.y + lt.offsetHeight / 2, x2: b.x, y2: b.y + rt.offsetHeight / 2 }); }
    setLines(next);
  };
  useLayoutEffect(measure, [JSON.stringify(matches), graded, opts.length]);
  useEffect(() => { const root = rootRef.current; if (!root || typeof ResizeObserver === "undefined") return; const ro = new ResizeObserver(measure); ro.observe(root); return () => ro.disconnect(); }, []);
  const linkColor = (i) => LINK_COLORS[i % LINK_COLORS.length];
  const stroke = (i) => graded ? (leftCorrect(i) ? "var(--ok-accent)" : "var(--no-accent)") : (palette ? linkColor(i) : "var(--sel-accent)");
  const tapTile = (side, index) => {
    if (graded) return;
    if (!active) { setActive({ side, index }); return; }
    if (active.side === side) { setActive(active.index === index ? null : { side, index }); return; }
    const [li, ri] = side === "left" ? [index, active.index] : [active.index, index];
    setMatches({ ...matches, [li]: ri }); setActive(null);
  };
  const rightToLefts = {}; for (const [l, r] of Object.entries(matches)) (rightToLefts[r] ??= []).push(Number(l));
  const allConnected = config.pairs.every((_, i) => matches[i] !== undefined);
  const ready = requireAll ? allConnected : Object.keys(matches).length > 0;
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.4rem" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>Соедини пример с ответом</p>
      <div ref={rootRef} className="mech-match" style={{ position: "relative", width: "100%", maxWidth: 560 }}>
        {lines.length > 0 && (
          <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "visible" }}>
            {lines.map((ln) => <line key={ln.left} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke={stroke(ln.left)} strokeWidth={4} strokeLinecap="round" />)}
          </svg>
        )}
        <div className="mech-col">
          {config.pairs.map((pair, i) => {
            const isActive = active?.side === "left" && active.index === i; const matched = matches[i] !== undefined;
            const st = graded && matched ? (leftCorrect(i) ? "correct" : "wrong") : null;
            const hint = requireAll && !graded && !matched;
            return <button key={i} type="button" ref={(el) => { if (el) leftRefs.current[i] = el; }} className="mech-tile" onClick={() => tapTile("left", i)} disabled={graded}
              data-selected={!graded && (isActive || matched) ? "true" : undefined} data-state={st ?? undefined} data-locked={graded ? "true" : undefined}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: "1.3rem", ...(hint ? { border: "3px dashed var(--warn)", background: "var(--warn-bg)" } : {}), ...(palette && !graded && matched ? { borderLeft: `10px solid ${linkColor(i)}` } : {}) }}>
              <span>{pair.left}</span>{st === "correct" && <IconCheck />}{st === "wrong" && <IconX />}</button>;
          })}
        </div>
        <div className="mech-col">
          {order.map((ri) => {
            const label = opts[ri]; if (label === undefined) return null;
            const linked = rightToLefts[ri] ?? []; const isLinked = linked.length > 0; const isActive = active?.side === "right" && active.index === ri;
            const st = graded && isLinked ? (linked.every(leftCorrect) ? "correct" : "wrong") : null;
            return <button key={ri} type="button" ref={(el) => { if (el) rightRefs.current[ri] = el; }} className="mech-tile" onClick={() => tapTile("right", ri)} disabled={graded}
              data-selected={!graded && (isActive || isLinked) ? "true" : undefined} data-state={st ?? undefined} data-locked={graded ? "true" : undefined}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, fontSize: "1.3rem" }}>
              <span>{label}</span>{palette && !graded && isLinked && <span style={{ display: "inline-flex", gap: 4 }}>{linked.map((li) => <span key={li} style={{ width: 13, height: 13, borderRadius: 3, background: linkColor(li) }} />)}</span>}{st === "correct" && <IconCheck />}{st === "wrong" && <IconX />}</button>;
          })}
        </div>
      </div>
      <button type="button" className="mech-check" disabled={!ready || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
    </div></div>
  );
}

function solve(config) { const opts = rightOptions(config); const m = {}; config.pairs.forEach((p, i) => { m[i] = opts.indexOf(p.right); }); return m; }

/* configs */
const DEFAULT = { pairs: [{ left: "2 × 3", right: "6" }, { left: "1 × 6", right: "6" }, { left: "2 × 5", right: "10" }, { left: "5 × 2", right: "10" }] };
const SIX = { pairs: [{ left: "1 + 1", right: "2" }, { left: "2 + 2", right: "4" }, { left: "3 + 3", right: "6" }, { left: "4 + 4", right: "8" }, { left: "5 + 5", right: "10" }, { left: "6 + 6", right: "12" }] };
const FOUR = { pairs: [{ left: "3 × 4", right: "12" }, { left: "2 × 9", right: "18" }, { left: "5 × 4", right: "20" }, { left: "3 × 8", right: "24" }] };

/* ── рабочий пример ── */
function Example() { return <TabletFrame><MatchColumns config={DEFAULT} /></TabletFrame>; }

/* ── EC1 · пересечение линий при многих парах ── */
function CrossingDemo() {
  const [m, setM] = useState({}); const [graded, setGraded] = useState(false); const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => { setFix(false); setM({}); setGraded(false); }}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => { setFix(true); setM(solve(SIX)); setGraded(false); }}>рекомендации (цвета)</button>
        </div>
        {!fix && <button className="btn primary" onClick={() => { setM(solve(SIX)); setGraded(false); }}>Соединить все верно</button>}
        {!fix && <button className="btn" onClick={() => { setM({}); setGraded(false); }}>Сбросить</button>}
      </div>
      <TabletFrame><MatchColumns key={fix ? "f" : "n"} config={SIX} palette={fix} controlled={{ matches: m, graded, onMatches: setM, onGraded: setGraded }} /></TabletFrame>
      <div className="demo-note">{fix
        ? "У каждой связи свой цвет (метка слева и цветной маркер у ответа): линию можно проследить даже сквозь пересечения; для «многие-к-одному» у ответа просто несколько разноцветных маркеров."
        : "Даже при верном решении 6 пар дают клубок одинаковых синих линий, глазами не разобрать, какой пример к какому ответу идёт."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · «многие-к-одному» неочевидно ── */
function ManyToOneDemo() {
  const [m, setM] = useState({}); const [graded, setGraded] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <button className="btn primary" onClick={() => { setM(solve(DEFAULT)); setGraded(false); }}>Показать верное решение</button>
        <button className="btn" onClick={() => { setM({}); setGraded(false); }}>Сбросить</button>
      </div>
      <TabletFrame><MatchColumns config={DEFAULT} controlled={{ matches: m, graded, onMatches: setM, onGraded: setGraded }} /></TabletFrame>
      <div className="demo-note">Справа всего два ответа (6 и 10), а слева четыре примера: к одному ответу должны идти две связи. Ребёнок ждёт «каждому своё» и не догадывается, что один ответ используется дважды.</div>
    </React.Fragment>
  );
}

/* ── EC3 · незавершённые связи = «неверно» ── */
function UnconnectedDemo() {
  const [fix, setFix] = useState(false);
  const [m, setM] = useState({}); const [graded, setGraded] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => { setFix(false); setM({}); setGraded(false); }}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => { setFix(true); setM({}); setGraded(false); }}>рекомендации</button>
        </div>
        {!fix && <button className="btn primary" onClick={() => { setM({ 0: 0, 1: 1 }); setGraded(true); }}>Соединить только две и проверить</button>}
      </div>
      <TabletFrame><MatchColumns key={fix ? "f" : "n"} config={FOUR} requireAll={fix} controlled={fix ? undefined : { matches: m, graded, onMatches: setM, onGraded: setGraded }} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Несоединённые примеры подсвечены пунктиром, «Проверить» заблокирована, пока не связаны все: нельзя сдать недоделанное."
        : "Две пары не соединены, но «Проверить» сработала, и несоединённые примеры засчитаны как ошибка, хотя ребёнок их просто не доделал."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-tab", tagText: "Планшет · вёрстка", title: "Линии пересекаются и путаются", Demo: CrossingDemo,
    problem: "Связи рисуются прямыми линиями между столбцами. Уже при 5–6 парах (а правый столбец ещё и перемешан) линии пересекаются в клубок, и даже верное решение выглядит хаосом, ребёнок не видит, какая связь к чему относится; на планшете тонкие линии накладываются.",
    fix: "Доработать: цветовое кодирование связей (у каждой свой цвет; работает и для «многие-к-одному»), подсвечивать активную или наведённую связь и гасить остальные. Поднимать соединённые наверх помогает только при строгом 1-к-1." },
  { tag: "t-age", tagText: "Задание · логика", title: "«Многие-к-одному» неочевидно", Demo: ManyToOneDemo,
    problem: "Один правый ответ может быть парой сразу к нескольким левым (несколько примеров с одним результатом). Ребёнок по привычке ждёт, что каждому левому идёт свой правый, соединяет один-к-одному и не понимает, что к одному ответу нужно вести две связи.",
    fix: "Доработать: явно показывать, что ответ можно использовать повторно (счётчик связей на плитке, подсказка), или для младших не давать many-to-one без объяснения." },
  { tag: "t-grade", tagText: "Задание · проверка", title: "Незавершённые связи засчитываются как «неверно»", Demo: UnconnectedDemo,
    problem: "«Проверить» доступна, как только создана хотя бы одна связь. Несоединённые примеры грейдятся как ошибочные, хотя ребёнок их просто не доделал; сигнала «соедини все» нет, и «не доделал» неотличимо от «ошибся». Уточнение: особенно это про задания, где по замыслу часть плиток остаётся несоединённой (лишние варианты или элементы без пары), там несоединённое это и есть верный ответ.",
    fix: "Доработать: блокировать «Проверить», пока не связаны все примеры, или подсвечивать несоединённые перед проверкой; отличать «не соединено» от «неверно». Для заданий, где часть плиток по замыслу остаётся без пары, сверять с задуманным ответом, а не блокировать по числу связей." },
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
