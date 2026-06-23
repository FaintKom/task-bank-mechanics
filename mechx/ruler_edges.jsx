/* ruler_edges.jsx — ruler: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): предмет от start до start+length; тап по делению = ответ ──
   hitW — ширина зоны; start — начало предмета (по умолчанию 0); readout — крупное подтверждение */
function Ruler({ length, max, unit = "см", start = 0, hitW = 40, readout, prompt }) {
  const [value, setValue] = useState(null); const [graded, setGraded] = useState(false);
  const answer = start === 0 ? length : length; // ученик указывает длину предмета
  const correct = value != null && value === answer;
  const objColor = graded ? (correct ? "var(--ok-accent)" : "var(--no-accent)") : "var(--sel-accent)";
  const W = 1000, PAD = 30, RY = 78;
  const x = (n) => PAD + (n / max) * (W - 2 * PAD); const pct = (n) => (x(n) / W) * 100;
  const ticks = Array.from({ length: max + 1 }, (_, i) => i);
  const objStart = start, objEnd = start + length;
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1rem", margin: "0 auto", width: "100%", maxWidth: 480 }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>{prompt || "Какой длины предмет?"}</p>
      <div style={{ position: "relative", width: "100%" }}>
        <svg viewBox={`0 0 ${W} 160`} style={{ width: "100%", touchAction: "none" }}>
          <rect x={x(objStart)} y={30} width={x(objEnd) - x(objStart)} height={28} rx={4} fill={objColor} opacity={0.5} />
          <rect x={PAD} y={RY} width={W - 2 * PAD} height={56} rx={6} fill="var(--paper)" stroke="var(--ink)" strokeWidth={2} />
          {ticks.map((n) => (
            <g key={n}>
              <line x1={x(n)} y1={RY} x2={x(n)} y2={RY + (n % 5 === 0 ? 22 : 13)} stroke="var(--ink)" strokeWidth={2} />
              {n % 5 === 0 && <text x={x(n)} y={RY + 46} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--ink)">{n}</text>}
            </g>
          ))}
          {graded && <line x1={x(answer)} y1={20} x2={x(answer)} y2={RY + 30} stroke="var(--ok-accent)" strokeWidth={3} />}
          {value != null && <line x1={x(value)} y1={20} x2={x(value)} y2={RY + 30} stroke={objColor} strokeWidth={3} />}
        </svg>
        <div style={{ position: "absolute", inset: 0 }}>
          {ticks.map((n) => (
            <button key={n} type="button" disabled={graded} onClick={() => { setValue(n); setGraded(false); }}
              style={{ position: "absolute", left: `${pct(n)}%`, top: 0, bottom: 0, transform: "translateX(-50%)", width: `max(${hitW}px, ${(100 / ticks.length) * 0.9}%)`, background: "transparent", border: "none", cursor: graded ? "default" : "pointer", touchAction: "none" }} />
          ))}
        </div>
      </div>
      {readout && value != null && <span className="mech-readout" style={{ color: graded ? objColor : "var(--sel-fg)" }}>{value} {unit}</span>}
      <button type="button" className="mech-check" disabled={value == null || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: objColor }}>{correct ? "Верно!" : `Нужно ${answer} ${unit}`}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><Ruler length={6} max={12} /></TabletFrame>; }

/* ── EC1 · тап-цель < 44px, плотные деления ── */
function HitAreaDemo() {
  const [dense, setDense] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={dense ? "on" : ""} onClick={() => setDense(true)}>Линейка до 30</button>
          <button className={!dense ? "on" : ""} onClick={() => setDense(false)}>Линейка до 12</button>
        </div>
      </div>
      <TabletFrame><Ruler key={dense ? "d" : "s"} length={dense ? 17 : 6} max={dense ? 30 : 12} readout /></TabletFrame>
      <div className="demo-note">{dense
        ? "На линейке до 30 деления встают плотно, а зона нажатия около 40px (ниже норматива 44px): палец легко попадает на соседнее деление, и ответ уходит «на один»."
        : "До 12 деления просторные, попасть в нужное легко."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · предмет всегда от нуля ── */
function FromZeroDemo() {
  const [shifted, setShifted] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!shifted ? "on" : ""} onClick={() => setShifted(false)}>От нуля (умеет)</button>
          <button className={shifted ? "on" : ""} onClick={() => setShifted(true)}>Со сдвига (не умеет)</button>
        </div>
      </div>
      <TabletFrame><Ruler key={shifted ? "s" : "z"} length={6} max={14} start={shifted ? 3 : 0} prompt={shifted ? "Какой длины предмет? (лежит от 3)" : "Какой длины предмет?"} readout /></TabletFrame>
      <div className="demo-note">{shifted
        ? "Если предмет лежит не от нуля (от 3 до 9), измерять надо разностью 9−3=6. Но механика всегда считает ответом конечное деление и не умеет задания «со сдвигом», а методисту они нужны."
        : "Сейчас предмет всегда лежит от нуля: ребёнок просто читает конечное деление, разность считать не нужно."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · палец закрывает деление, нет подтверждения ── */
function ConfirmDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (крупное число)</button>
        </div>
      </div>
      <TabletFrame><Ruler key={fix ? "f" : "n"} length={8} max={15} hitW={fix ? 48 : 40} readout={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Выбранная длина крупно подписана числом: палец закрыл деление, но ребёнок видит, какое значение поставил."
        : "Палец закрывает конец предмета и деление, в которое целится, а числового подтверждения выбранного значения нет, поэтому непонятно, что именно отмечено."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Плотные деления, цель меньше 44px", Demo: HitAreaDemo,
    problem: "На длинной линейке (до 30+) деления встают вплотную, а зона нажатия около 40px, это ниже норматива 44px. Палец ребёнка задевает соседнее деление, и ответ уходит «на один», хотя длина определена верно.",
    fix: "Доработать: линейка должна масштабироваться под длину и экран, чтобы зона нажатия каждого деления оставалась ≥44px; методисту нужно дать возможность настраивать масштаб линейки под конкретную задачу." },
  { tag: "t-cfg", tagText: "Задание · охват", title: "Предмет всегда лежит от нуля", Demo: FromZeroDemo,
    problem: "Предмет всегда начинается с 0, и ответом считается конечное деление, ребёнок просто читает число, не измеряя. Задания «измерь со сдвига» (предмет от 3 до 9, длина 6), которые учат измерять разностью, механика не поддерживает.",
    fix: "Доработать: разрешить произвольное начало предмета и считать ответом длину (конец − начало), чтобы можно было давать задания на измерение разностью." },
  { tag: "t-touch", tagText: "Планшет · касание", title: "Палец закрывает деление без подтверждения", Demo: ConfirmDemo,
    problem: "Ребёнок отмечает конец предмета пальцем, и палец закрывает и сам конец, и деление, в которое целится. Числового подтверждения выбранного значения нет, поэтому неясно, какую длину он указал.",
    fix: "Доработать: показывать крупное число выбранной длины (живой readout) или выносить метку из-под пальца. Можно также предложить мини-лупу, которая показывает деление под пальцем крупно, чтобы выбранное значение было видно." },
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
