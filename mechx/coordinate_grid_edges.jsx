/* coordinate_grid_edges.jsx — coordinate-grid: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): тап по узлу сетки ставит точку (x,y) ──
   cell — размер клетки; hitR — радиус зоны; guide — подсветка строки/столбца выбора */
function CoordinateGrid({ xMax, yMax, targetX, targetY, cell = 40, hitR, guide, prompt }) {
  const [v, setV] = useState(null); const [graded, setGraded] = useState(false);
  const PAD_L = 36, PAD_B = 34, PAD_T = 16, PAD_R = 16;
  const W = PAD_L + xMax * cell + PAD_R, H = PAD_T + yMax * cell + PAD_B;
  const sx = (x) => PAD_L + x * cell; const sy = (y) => PAD_T + (yMax - y) * cell;
  const xs = Array.from({ length: xMax + 1 }, (_, i) => i); const ys = Array.from({ length: yMax + 1 }, (_, i) => i);
  const correct = v && v.x === targetX && v.y === targetY;
  const mc = graded ? (correct ? "var(--ok-accent)" : "var(--no-accent)") : "var(--sel-accent)";
  const hr = hitR || Math.min(cell * 0.42, 22);
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1rem", margin: "0 auto" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>{prompt || `Отметь точку (${targetX}; ${targetY})`}</p>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: Math.min(420, W), touchAction: "none" }}>
        {guide && v && <rect x={sx(0)} y={sy(v.y) - 1} width={sx(xMax) - sx(0)} height={2} fill="var(--sel-accent)" opacity={0.3} />}
        {guide && v && <rect x={sx(v.x) - 1} y={sy(yMax)} width={2} height={sy(0) - sy(yMax)} fill="var(--sel-accent)" opacity={0.3} />}
        {xs.map((x) => <line key={`vx${x}`} x1={sx(x)} y1={sy(yMax)} x2={sx(x)} y2={sy(0)} stroke="var(--line)" strokeWidth={1.5} />)}
        {ys.map((y) => <line key={`hy${y}`} x1={sx(0)} y1={sy(y)} x2={sx(xMax)} y2={sy(y)} stroke="var(--line)" strokeWidth={1.5} />)}
        <line x1={sx(0)} y1={sy(0)} x2={sx(xMax)} y2={sy(0)} stroke="var(--ink)" strokeWidth={3} />
        <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(yMax)} stroke="var(--ink)" strokeWidth={3} />
        <text x={sx(xMax) + 4} y={sy(0) + 5} fontSize={15} fontWeight={700} fill="var(--ink-soft)">x</text>
        <text x={sx(0) - 5} y={sy(yMax) - 5} fontSize={15} fontWeight={700} fill="var(--ink-soft)">y</text>
        {xs.map((x) => <text key={`xl${x}`} x={sx(x)} y={sy(0) + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--ink-soft)">{x}</text>)}
        {ys.filter((y) => y > 0).map((y) => <text key={`yl${y}`} x={sx(0) - 14} y={sy(y) + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--ink-soft)">{y}</text>)}
        {graded && <circle cx={sx(targetX)} cy={sy(targetY)} r={11} fill="none" stroke="var(--ok-accent)" strokeWidth={3} />}
        {v && <circle cx={sx(v.x)} cy={sy(v.y)} r={9} fill={mc} />}
        {xs.map((x) => ys.map((y) => (
          <g key={`n${x}-${y}`}><circle cx={sx(x)} cy={sy(y)} r={2.5} fill="var(--line)" />
            <circle cx={sx(x)} cy={sy(y)} r={hr} fill="transparent" onClick={() => !graded && setV({ x, y })} style={{ cursor: graded ? "default" : "pointer", touchAction: "none" }} /></g>
        )))}
      </svg>
      {v && <span className="mech-readout" style={{ color: graded ? mc : "var(--sel-fg)", fontSize: "1.5rem" }}>({v.x}; {v.y})</span>}
      <button type="button" className="mech-check" disabled={!v || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: mc }}>{correct ? "Верно!" : `Нужно (${targetX}; ${targetY})`}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><CoordinateGrid xMax={6} yMax={6} targetX={3} targetY={4} /></TabletFrame>; }

/* ── EC1 · путаница порядка координат ── */
function OrderDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (подсказка осей)</button>
        </div>
        <span className="mech-label" style={{ fontSize: 13 }}>Цель (4; 1), легко перепутать с (1; 4)</span>
      </div>
      <TabletFrame><CoordinateGrid key={fix ? "f" : "n"} xMax={6} yMax={6} targetX={4} targetY={1} guide={fix} prompt={fix ? "Сначала x = 4 (вправо), потом y = 1 (вверх)" : "Отметь точку (4; 1)"} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Подпись «сначала x вправо, потом y вверх» и подсветка строки или столбца выбранной точки помогают удержать порядок (x; y)."
        : "Классическая ошибка: перепутать координаты и отметить (1; 4) вместо (4; 1), а механика никак не помогает удержать порядок «сначала x, потом y»."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · мелкие узлы на крупной сетке ── */
function DenseDemo() {
  const [big, setBig] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={big ? "on" : ""} onClick={() => setBig(true)}>Сетка 12×12</button>
          <button className={!big ? "on" : ""} onClick={() => setBig(false)}>Сетка 6×6</button>
        </div>
      </div>
      <TabletFrame><CoordinateGrid key={big ? "b" : "s"} xMax={big ? 12 : 6} yMax={big ? 12 : 6} cell={big ? 24 : 40} targetX={big ? 9 : 3} targetY={big ? 7 : 4} /></TabletFrame>
      <div className="demo-note">{big
        ? "На сетке 12×12 клетки мелкие, узлы стоят близко, зона нажатия меньше 44px, палец легко попадает в соседний узел (точка уходит на (8;7) вместо (9;7))."
        : "На 6×6 узлы просторные, попасть точно легко."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · точка (0;0) и оси ── */
function OriginDemo() {
  return (
    <React.Fragment>
      <div className="ec-controls"><span className="mech-label" style={{ fontSize: 13 }}>Цель, начало координат (0; 0)</span></div>
      <TabletFrame><CoordinateGrid xMax={6} yMax={6} targetX={0} targetY={0} prompt="Отметь точку (0; 0)" /></TabletFrame>
      <div className="demo-note">Узел (0; 0) лежит прямо на пересечении осей и сливается с их толстыми линиями, поэтому попасть в него и понять, что отмечено именно начало координат, труднее, чем в обычный узел.</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-age", tagText: "Возраст · логика", title: "Легко перепутать порядок (x; y)", Demo: OrderDemo,
    problem: "Координатная пара читается «сначала x, потом y», но это частая ошибка возраста: ребёнок отмечает (1; 4) вместо (4; 1). Механика не помогает удержать порядок, узлы одинаковы, никакой опоры «куда сначала» нет.",
    fix: "Доработать: подсказывать порядок (x вправо, затем y вверх), подсвечивать строку или столбец выбираемой точки, показывать координаты выбранного узла числом." },
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Мелкие узлы на крупной сетке", Demo: DenseDemo,
    problem: "На большой сетке (12×12) узлы стоят близко, а зона нажатия меньше 44px. Палец ребёнка попадает в соседний узел, точка уходит на (8; 7) вместо (9; 7), хотя место определено верно.",
    fix: "Доработать: зона нажатия ≥44px, ограничивать размер сетки под экран или давать зум и прокрутку для крупных координат." },
  { tag: "t-grade", tagText: "Задание · логика", title: "Точка (0; 0) сливается с осями", Demo: OriginDemo,
    problem: "Узел начала координат лежит на пересечении двух толстых осей и зрительно сливается с ними. Попасть точно в (0; 0) и убедиться, что отмечено именно начало, труднее, чем в обычный узел поля.",
    fix: "Доработать: выделять узел (0; 0) отдельно, при выборе показывать координаты числом, чтобы начало координат читалось так же ясно, как любой другой узел." },
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
