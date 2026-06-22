/* balance_scale_edges.jsx — balance-scale: рабочий пример + edge-кейсы (что доработать) */
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

function PlusMinus({ onMinus, onPlus, disabled }) {
  const btn = { display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, padding: 0, fontSize: "1.4rem" };
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button type="button" className="mech-tile" onClick={onMinus} disabled={disabled} style={btn}>−</button>
      <button type="button" className="mech-tile" onClick={onPlus} disabled={disabled} style={btn}>+</button>
    </div>
  );
}

/* ── виджет (порт): весы, +/− добавляют гири справа ──
   maxTilt — предел наклона; showDelta — показывать числовую разницу; tapRemove — тап по гире убирает */
const PX = 160, PY = 96, ARM = 104;
function rot(x, y, deg) { const a = (deg * Math.PI) / 180, dx = x - PX, dy = y - PY; return [PX + dx * Math.cos(a) - dy * Math.sin(a), PY + dx * Math.sin(a) + dy * Math.cos(a)]; }
function BalanceScale({ leftGrams, weights, maxTilt = 14, showDelta, tapRemove, maxEach = 20 }) {
  const [counts, setCounts] = useState(weights.map(() => 0)); const [graded, setGraded] = useState(false);
  const right = weights.reduce((s, w, i) => s + w * counts[i], 0);
  const diff = right - leftGrams; const correct = diff === 0; const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const tilt = Math.max(-maxTilt, Math.min(maxTilt, diff * 3));
  const adjust = (i, d) => { if (graded) return; const n = [...counts]; n[i] = Math.max(0, Math.min(maxEach, n[i] + d)); setCounts(n); setGraded(false); };
  const [lx, ly] = rot(PX - ARM, PY, tilt); const [rx, ry] = rot(PX + ARM, PY, tilt); const STR = 22;
  const pans = [{ x: lx, y: ly, label: `${leftGrams} г`, fill: "var(--sel-bg)" }, { x: rx, y: ry, label: `${right} г`, fill: "var(--paper)" }];
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.1rem", margin: "0 auto", width: "100%", maxWidth: 460 }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>Уравновесь весы: слева {leftGrams} г</p>
      <svg viewBox="0 0 320 210" style={{ width: "100%", touchAction: "none" }}>
        <line x1={PX} y1={PY} x2={PX} y2={190} stroke="var(--ink)" strokeWidth={6} />
        <polygon points={`${PX - 26},190 ${PX + 26},190 ${PX},${PY}`} fill="var(--line)" stroke="var(--ink)" strokeWidth={2} />
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={graded ? accent : "var(--ink)"} strokeWidth={6} strokeLinecap="round" />
        <circle cx={PX} cy={PY} r={6} fill="var(--ink)" />
        {pans.map((p, i) => (<g key={i}><line x1={p.x} y1={p.y} x2={p.x} y2={p.y + STR} stroke="var(--ink)" strokeWidth={1.5} /><path d={`M ${p.x - 30} ${p.y + STR} A 30 16 0 0 0 ${p.x + 30} ${p.y + STR} Z`} fill={p.fill} stroke="var(--ink)" strokeWidth={2} /><text x={p.x} y={p.y + STR + 13} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--ink)">{p.label}</text></g>))}
      </svg>
      {showDelta && right > 0 && !correct && <span className="mech-label" style={{ color: "var(--no-fg)", background: "var(--no-bg)", borderRadius: 999, padding: "3px 14px", fontWeight: 700 }}>{diff > 0 ? `перевес +${diff} г` : `не хватает ${-diff} г`}</span>}
      {showDelta && correct && <span className="mech-label" style={{ color: "var(--ok-fg)", background: "var(--ok-bg)", borderRadius: 999, padding: "3px 14px", fontWeight: 700 }}>равновесие!</span>}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        {weights.map((w, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span onClick={() => tapRemove && counts[i] > 0 && adjust(i, -1)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 40, height: 32, padding: "0 8px", borderRadius: 6, background: "var(--sel-bg)", border: "2px solid var(--sel-accent)", color: "var(--sel-fg)", fontWeight: 700, cursor: tapRemove && !graded ? "pointer" : "default" }}>{w} г{counts[i] ? ` ×${counts[i]}` : ""}</span>
            <PlusMinus onMinus={() => adjust(i, -1)} onPlus={() => adjust(i, 1)} disabled={graded} />
          </div>
        ))}
      </div>
      <button type="button" className="mech-check" disabled={right === 0 || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: accent }}>{correct ? "Верно!" : "Не уравновешено"}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><BalanceScale leftGrams={8} weights={[1, 2, 5]} /></TabletFrame>; }

/* ── EC1 · недостижимый баланс ── */
function UnreachableDemo() {
  const [bad, setBad] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={bad ? "on" : ""} onClick={() => setBad(true)}>Груз 8, гири [5]</button>
          <button className={!bad ? "on" : ""} onClick={() => setBad(false)}>Груз 8, гири [1, 2, 5]</button>
        </div>
      </div>
      <TabletFrame><BalanceScale key={bad ? "b" : "g"} leftGrams={8} weights={bad ? [5] : [1, 2, 5]} showDelta /></TabletFrame>
      <div className="demo-note">{bad
        ? "Груз 8 г, а гиря только 5: вес 5 мало, а 10 уже перевес. Ровно 8 не набрать, равновесие недостижимо (ошибка конфига)."
        : "С гирями 1, 2, 5 набирается 8 как 5 + 2 + 1, и весы уравновешиваются."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · малый наклон — разница не читается ── */
function TiltDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>Как надо (разница числом)</button>
        </div>
        <span className="mech-label" style={{ fontSize: 13 }}>Добавь чуть меньше или чуть больше нормы</span>
      </div>
      <TabletFrame><BalanceScale key={fix ? "f" : "n"} leftGrams={12} weights={[1, 2, 5]} showDelta={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Подпись «перевес +N г или не хватает N г» прямо показывает, насколько и в какую сторону промах, и наклона на глаз уже не нужно."
        : "Наклон коромысла ограничен и при «почти равновесии» едва заметен: ребёнок не понимает, перебрал он на 1 г или на 5 г."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · гири только +/−, без автоповтора ── */
function RemoveDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>Как надо (тап по гире)</button>
        </div>
      </div>
      <TabletFrame><BalanceScale key={fix ? "f" : "n"} leftGrams={40} weights={[1, 2, 5, 10]} tapRemove={fix} showDelta={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Лишнюю гирю убираешь тапом по её плашке; набор крупного веса быстрее и понятнее."
        : "Убрать гирю можно только кнопкой «−», автоповтора при удержании нет: чтобы набрать 40 г мелкими гирями, нужны десятки тапов."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-cfg", tagText: "Задание · конфиг", title: "Равновесие недостижимо набором гирь", Demo: UnreachableDemo,
    problem: "Если доступными гирями нельзя набрать ровно left_grams (груз 8 г при гире только 5 г), уравновесить весы невозможно: любой набор либо лёгкий, либо перевешивает. Ребёнок застревает, не понимая, что задача в принципе нерешаема.",
    fix: "Доработать: валидировать конфиг, left_grams обязан собираться доступными номиналами гирь; иначе не выпускать задание." },
  { tag: "t-age", tagText: "Возраст · фидбек", title: "Малый наклон, промах не читается", Demo: TiltDemo,
    problem: "Наклон коромысла ограничен (±14°) и при «почти равновесии» едва заметен. Ребёнок видит, что весы наклонены, но не понимает, насколько промахнулся, на 1 грамм или на пять, и в какую сторону.",
    fix: "Доработать: показывать числовую разницу «перевес +N г или не хватает N г» по ходу, либо делать наклон выразительнее у малых отклонений." },
  { tag: "t-touch", tagText: "Планшет · касание", title: "Гири только кнопкой «−»", Demo: RemoveDemo,
    problem: "Гиря убирается только кнопкой «−», тап по самой гире не работает, а автоповтора при удержании кнопок +/− нет. Набрать крупный вес мелкими гирями стоит десятков отдельных тапов.",
    fix: "Доработать: убирать гирю тапом по ней; добавить автоповтор при удержании или ввод количества для крупных весов." },
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
