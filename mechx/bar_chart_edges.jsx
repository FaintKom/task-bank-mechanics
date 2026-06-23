/* bar_chart_edges.jsx — bar-chart: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): тап по ячейке уровня задаёт высоту столбика ──
   drag — тянуть верх столбика; cellH — высота ячейки уровня */
function BarChart({ max, bars, drag, cellH = 30, prompt }) {
  const [heights, setHeights] = useState(bars.map(() => 0)); const [graded, setGraded] = useState(false);
  const [dragBar, setDragBar] = useState(null);
  const levels = Array.from({ length: max }, (_, k) => max - k);
  const correct = bars.every((b, i) => heights[i] === b.target);
  const setH = (i, L) => { if (graded) return; const n = [...heights]; n[i] = L; setHeights(n); setGraded(false); };
  const colW = drag ? 56 : 50;
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.1rem", margin: "0 auto" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>{prompt || "Построй столбики по числам"}</p>
      <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
        <div className="mech-label" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2px 0", fontVariantNumeric: "tabular-nums" }}>
          {levels.map((L) => <span key={L} style={{ height: cellH, display: "flex", alignItems: "center" }}>{L}</span>)}<span style={{ height: cellH, display: "flex", alignItems: "center" }}>0</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, borderLeft: "2px solid var(--line)", borderBottom: "2px solid var(--line)", paddingLeft: 8 }}>
          {bars.map((bar, i) => {
            const h = heights[i]; const barOk = h === bar.target;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", position: "relative" }}
                  onPointerMove={(e) => {
                    if (!drag || dragBar !== i || graded) return;
                    const wrap = e.currentTarget.getBoundingClientRect();
                    const fromTop = e.clientY - wrap.top; const L = Math.max(0, Math.min(max, Math.round(max - fromTop / cellH)));
                    setH(i, L);
                  }}
                  onPointerUp={() => setDragBar(null)} onPointerLeave={() => setDragBar(null)}>
                  {levels.map((L) => {
                    const filled = L <= h; const state = graded && filled ? (barOk ? "correct" : "wrong") : undefined;
                    const bg = state === "correct" ? "var(--ok-accent)" : state === "wrong" ? "var(--no-accent)" : filled ? "var(--sel-accent)" : "var(--paper)";
                    return <button key={L} type="button" onClick={() => !drag && setH(i, L)} disabled={graded}
                      onPointerDown={() => { if (drag && !graded) { setDragBar(i); setH(i, L); } }}
                      style={{ width: colW, height: cellH, border: "1px solid var(--line)", background: bg, padding: 0, cursor: graded ? "default" : (drag ? "ns-resize" : "pointer") }} />;
                  })}
                  {drag && !graded && h > 0 && <div style={{ position: "absolute", left: -4, right: -4, top: (max - h) * cellH - 4, height: 8, display: "flex", justifyContent: "center" }}><span style={{ width: 18, height: 8, borderRadius: 4, background: "var(--grape,#845ef7)" }} /></div>}
                </div>
                <span className="mech-label">{bar.label}{heights[i] ? ` · ${heights[i]}` : ""}</span>
              </div>
            );
          })}
        </div>
      </div>
      <button type="button" className="mech-check" disabled={heights.every((h) => h === 0) || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: correct ? "var(--ok-accent)" : "var(--no-accent)" }}>{correct ? "Верно!" : "Не совсем"}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><BarChart max={5} bars={[{ label: "Пн", target: 3 }, { label: "Вт", target: 5 }, { label: "Ср", target: 2 }]} /></TabletFrame>; }

/* ── EC1 · понижение неинтуитивно ── */
function LowerDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть (тап)</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (тянуть верх)</button>
        </div>
        <span className="mech-label" style={{ fontSize: 13 }}>Подними столбик, потом попробуй понизить</span>
      </div>
      <TabletFrame><BarChart key={fix ? "f" : "n"} max={6} bars={[{ label: "А", target: 4 }, { label: "Б", target: 2 }]} drag={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Тянешь верх столбика вверх и вниз (фиолетовая ручка), высота меняется в обе стороны естественно."
        : "Чтобы понизить столбик, нужно тапнуть по более низкой ячейке, отдельной «отмены на 1» нет, и ребёнок часто не догадывается, как уменьшить."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · высокий столбик не помещается ── */
function TallDemo() {
  const [big, setBig] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={big ? "on" : ""} onClick={() => setBig(true)}>Шкала до 12</button>
          <button className={!big ? "on" : ""} onClick={() => setBig(false)}>Шкала до 5</button>
        </div>
      </div>
      <TabletFrame><BarChart key={big ? "b" : "s"} max={big ? 12 : 5} cellH={big ? 22 : 30} bars={[{ label: "А", target: big ? 11 : 4 }, { label: "Б", target: big ? 7 : 2 }, { label: "В", target: big ? 9 : 3 }]} /></TabletFrame>
      <div className="demo-note">{big
        ? "При шкале до 12 ячейки уровней приходится делать тонкими, чтобы график влез по высоте планшета, и тап по нужному уровню становится неточным."
        : "До 5 ячейки крупные, попадать в уровень легко."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-touch", tagText: "Планшет · касание", title: "Понизить столбик неинтуитивно", Demo: LowerDemo,
    problem: "Высота задаётся тапом по уровню, а чтобы уменьшить столбик, нужно тапнуть по более низкой ячейке. Отдельной «отмены на 1» нет, и ребёнок часто не понимает, как понизить уже построенный столбик.",
    fix: "Доработать: дать тянуть верх столбика вверх и вниз (как ручку), чтобы высота менялась в обе стороны одним жестом; либо добавить явные кнопки + и −." },
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Высокая шкала и тонкие ячейки", Demo: TallDemo,
    problem: "При большом max график должен влезть по высоте экрана, поэтому ячейки уровней делаются тонкими. Тап по нужному уровню становится неточным, и ребёнок ставит столбик на 1 выше или ниже задуманного.",
    fix: "Доработать: ограничивать max под высоту экрана, укрупнять ячейки, либо вводить высоту перетаскиванием или числом для больших шкал." },
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
