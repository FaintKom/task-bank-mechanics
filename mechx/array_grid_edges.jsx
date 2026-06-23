/* array_grid_edges.jsx — array-grid: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): один тап строит прямоугольник r×c от верхнего левого угла ── */
function ArrayGrid({ maxRows, maxCols, targetRows, targetCols, commutative, prompt = "Построй прямоугольник" }) {
  const [val, setVal] = useState(null); const [graded, setGraded] = useState(false);
  const rows = Array.from({ length: maxRows }, (_, i) => i + 1);
  const cols = Array.from({ length: maxCols }, (_, i) => i + 1);
  const inArr = (r, c) => val != null && r <= val.rows && c <= val.cols;
  const correct = val != null && (
    commutative
      ? (val.rows === targetRows && val.cols === targetCols) || (val.rows === targetCols && val.cols === targetRows)
      : (val.rows === targetRows && val.cols === targetCols)
  );
  const accent = graded ? (correct ? "var(--ok-accent)" : "var(--no-accent)") : "var(--sel-accent)";
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.3rem", margin: "0 auto" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>{prompt}: {targetRows} × {targetCols}</p>
      <div style={{ display: "grid", gap: 6, gridTemplateColumns: `repeat(${maxCols}, minmax(0,1fr))` }}>
        {rows.map((r) => cols.map((c) => {
          const on = inArr(r, c);
          return <button key={`${r}-${c}`} type="button" className="mech-tile" onClick={() => { if (!graded) { setVal({ rows: r, cols: c }); setGraded(false); } }} disabled={graded}
            data-selected={!graded && on ? "true" : undefined} data-state={graded && on ? (correct ? "correct" : "wrong") : undefined} data-locked={graded ? "true" : undefined}
            style={{ aspectRatio: "1", width: maxCols > 7 ? 40 : 52, minHeight: 0, padding: 0 }} />;
        }))}
      </div>
      {val != null && <div className="mech-readout" style={{ color: graded ? accent : undefined }}>{val.rows} × {val.cols} = {val.rows * val.cols}</div>}
      <button type="button" className="mech-check" disabled={val == null || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: accent }}>{correct ? "Верно!" : `Нужно ${targetRows} × ${targetCols}`}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><ArrayGrid maxRows={5} maxCols={5} targetRows={3} targetCols={4} /></TabletFrame>; }

/* ── EC1 · 3×4 ≠ 4×3 ── */
function CommutativeDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (a×b = b×a)</button>
        </div>
        <span className="mech-label" style={{ fontSize: 13 }}>Построй 4×3 при цели 3×4 и проверь</span>
      </div>
      <TabletFrame><ArrayGrid key={fix ? "f" : "n"} maxRows={5} maxCols={5} targetRows={3} targetCols={4} commutative={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Засчитываются обе ориентации: 4×3 принимается при цели 3×4, как и переместительное свойство (g4-30)."
        : "Цель 3×4. Ребёнок строит 4×3 (то же число клеток, та же площадь), но проверка различает ориентацию и считает это ошибкой, противореча правилу a×b = b×a."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · нет превью на touch ── */
function PreviewDemo() {
  // имитация: показываем разницу «как есть» (тап сразу строит) vs «как надо» (контур-превью наведённой области)
  const [hover, setHover] = useState(null);
  const maxR = 5, maxC = 5;
  const rows = Array.from({ length: maxR }, (_, i) => i + 1);
  const cols = Array.from({ length: maxC }, (_, i) => i + 1);
  return (
    <React.Fragment>
      <div className="ec-controls"><span className="mech-label" style={{ fontSize: 13 }}>Наведи (как мышью на доске), но на планшете наведения нет</span></div>
      <TabletFrame>
        <div className="mech"><div className="mech-stack" style={{ gap: "1.3rem", margin: "0 auto" }}>
          <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>Построй прямоугольник: 3 × 4</p>
          <div style={{ display: "grid", gap: 6, gridTemplateColumns: `repeat(${maxC}, minmax(0,1fr))` }} onMouseLeave={() => setHover(null)}>
            {rows.map((r) => cols.map((c) => {
              const on = hover && r <= hover.r && c <= hover.c;
              return <button key={`${r}-${c}`} type="button" className="mech-tile" onMouseEnter={() => setHover({ r, c })}
                data-selected={on ? "true" : undefined} style={{ aspectRatio: "1", width: 52, minHeight: 0, padding: 0 }} />;
            }))}
          </div>
          <span className="mech-label">{hover ? `превью: ${hover.r} × ${hover.c}` : "наведи на клетку"}</span>
        </div></div>
      </TabletFrame>
      <div className="demo-note">На доске или мышью видно превью будущего прямоугольника при наведении. На планшете наведения нет, палец сразу строит по тапу, и «примерить» размер до построения нельзя.</div>
    </React.Fragment>
  );
}

/* ── EC3 · крупная сетка — мелкие клетки ── */
function BigGridDemo() {
  const [big, setBig] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={big ? "on" : ""} onClick={() => setBig(true)}>10 × 10</button>
          <button className={!big ? "on" : ""} onClick={() => setBig(false)}>5 × 5</button>
        </div>
      </div>
      <TabletFrame><ArrayGrid key={big ? "b" : "s"} maxRows={big ? 10 : 5} maxCols={big ? 10 : 5} targetRows={7} targetCols={8} /></TabletFrame>
      <div className="demo-note">{big
        ? "10×10: клетки мелкие и прижаты, тап по угловой клетке (7×8) неточен, легко построить 6×8 или 7×9 вместо нужного."
        : "5×5: клетки крупные, попасть в угловую легко."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-grade", tagText: "Задание · логика", title: "3×4 и 4×3 считаются разными", Demo: CommutativeDemo,
    problem: "Проверка различает ориентацию: при цели 3×4 ответ 4×3 считается ошибкой, хотя это то же число клеток, та же площадь и то же произведение. Это прямо противоречит переместительному свойству умножения (g4-30), которое дети как раз изучают.",
    fix: "Доработать: засчитывать обе ориентации (a×b и b×a) по умолчанию, либо явно задавать в конфиге, важна ли ориентация для конкретной задачи." },
  { tag: "t-touch", tagText: "Планшет · касание", title: "На планшете нет превью прямоугольника", Demo: PreviewDemo,
    problem: "Модель «навёл, увидел будущий прямоугольник, кликнул» работает мышью, но на планшете наведения нет: палец сразу строит по тапу. Ребёнок не может «примерить» размер до построения и часто строит не тот прямоугольник с первого касания.",
    fix: "Доработать: строить по тапу с явным подтверждением и возможностью поправить край перетаскиванием, либо показывать живой размер r×c и давать переуточнить, не начиная заново." },
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Крупная сетка и мелкие клетки", Demo: BigGridDemo,
    problem: "При сетке 10×10 клетки мелкие и стоят вплотную. Тап по нужной угловой клетке (она задаёт размер прямоугольника) неточен, палец легко строит 6×8 или 7×9 вместо 7×8.",
    fix: "Доработать: укрупнять клетки или ограничивать размер сетки под экран, увеличивать зазоры, а для больших произведений давать другой способ ввода (числа строк и столбцов)." },
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
