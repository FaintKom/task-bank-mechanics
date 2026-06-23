/* sequence_track_edges.jsx — sequence-track: рабочий пример + edge-кейсы (что доработать) */
const { useState, useRef, useLayoutEffect } = React;

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

/* стартовая раскладка (реверс правильного; для палиндрома — сдвиг) */
function startOrder(items) {
  const rev = [...items].reverse();
  if (items.length > 1 && JSON.stringify(rev) !== JSON.stringify(items)) return rev;
  return items.length > 1 ? [...items.slice(1), items[0]] : [...items];
}

/* ── виджет (своп тапами) ── */
function SequenceTrack({ items, startFrom, hintSwap, controlled }) {
  const target = items;
  const [orderS, setOrderS] = useState(startFrom || startOrder(items));
  const [gradedS, setGradedS] = useState(false); const [sel, setSel] = useState(null);
  const order = controlled ? controlled.order : orderS;
  const graded = controlled ? controlled.graded : gradedS;
  const setOrder = controlled ? controlled.onOrder : setOrderS;
  const setGraded = controlled ? controlled.onGraded : setGradedS;
  const tap = (idx) => {
    if (graded) return;
    if (sel === null) { setSel(idx); return; }
    if (sel === idx) { setSel(null); return; }
    const next = [...order]; [next[sel], next[idx]] = [next[idx], next[sel]]; setSel(null); setOrder(next); if (!controlled) setGradedS(false);
  };
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.3rem" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>Расставь по возрастанию</p>
      {!graded && <div className="mech-label" style={{ marginTop: -4 }}>{hintSwap ? (sel === null ? "Нажми плитку, которую хочешь переставить" : "Теперь нажми, с какой её поменять местами") : "\u00A0"}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, width: "100%", maxWidth: 620 }}>
        {order.map((label, idx) => {
          const isSel = !graded && sel === idx;
          const st = graded ? (label === target[idx] ? "correct" : "wrong") : undefined;
          return (
            <button key={idx} type="button" className="mech-tile" onClick={() => tap(idx)} disabled={graded}
              data-selected={isSel ? "true" : undefined} data-state={st} data-locked={graded ? "true" : undefined}
              style={{ flex: "0 0 auto", minWidth: 84, fontSize: "1.6rem", transform: isSel ? "translateY(-8px)" : undefined, position: "relative" }}>
              {hintSwap && isSel && <span style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", fontSize: 18, color: "var(--sel-accent)" }}>⇄</span>}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{label}{st === "correct" && <IconCheck />}{st === "wrong" && <IconX />}</span>
            </button>
          );
        })}
      </div>
      <button type="button" className="mech-check" disabled={graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><SequenceTrack items={["12", "34", "56", "78"]} /></TabletFrame>; }

/* ── EC1 · своп тапами неочевиден ── */
function SwapDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (подсказка)</button>
        </div>
      </div>
      <TabletFrame><SequenceTrack key={fix ? "f" : "n"} items={["12", "34", "56", "78"]} hintSwap={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Подсказка ведёт по шагам (сначала «нажми плитку», затем «с какой поменять»), у выбранной плитки значок ⇄, понятно, что это обмен местами."
        : "Тап выделяет плитку, второй тап меняет её с другой местами, но об этом нигде не сказано; ребёнок тапает и не понимает, что происходит."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · старт может совпасть с верным ── */
function StartDemo() {
  // 2 плитки: реверс правильного для [12,34] = [34,12] (ок); но покажем риск на «почти решено»
  const [order, setOrder] = useState(["12", "56", "34", "78"]); const [graded, setGraded] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls"><span className="mech-label" style={{ fontSize: 13 }}>Стартовая раскладка уже почти верная</span></div>
      <TabletFrame><SequenceTrack items={["12", "34", "56", "78"]} startFrom={["12", "56", "34", "78"]} controlled={{ order, graded, onOrder: setOrder, onGraded: setGraded }} /></TabletFrame>
      <div className="demo-note">Перемешивание не гарантирует «далёкий» от ответа старт: тут достаточно одного обмена (56 и 34 местами). Для коротких рядов случайная раскладка иногда совпадает с верной или почти верной, и задание становится тривиальным.</div>
    </React.Fragment>
  );
}

/* ── EC3 · дубли значений: верный вид ≠ зачёт ── */
function DuplicateDemo() {
  const [order, setOrder] = useState(["10", "20", "20", "30"]); const [graded, setGraded] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <button className="btn primary" onClick={() => { setOrder(["10", "20", "20", "30"]); setGraded(true); }}>Проверить «10 20 20 30»</button>
        <button className="btn" onClick={() => { setGraded(false); }}>Сбросить</button>
      </div>
      <TabletFrame><SequenceTrack items={["10", "20", "20", "30"]} startFrom={["10", "20", "20", "30"]} controlled={{ order, graded, onOrder: setOrder, onGraded: setGraded }} /></TabletFrame>
      <div className="demo-note">Две плитки «20» одинаковы. Порядок выглядит правильным, но если конкретные плитки стоят «не на своих» позициях, проверка по позициям может не засчитать визуально верную последовательность.</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-age", tagText: "Касание · возраст", title: "Непонятно, что плитки меняются местами тапами", Demo: SwapDemo,
    problem: "Чтобы поменять две плитки местами, нужно тапнуть одну, затем другую. Это нигде не объяснено: ребёнок тапает плитку, она «подпрыгивает», он тапает ещё, и порядок неожиданно меняется. Модель «сначала выдели, потом обменяй» не угадывается с первого раза.",
    fix: "Доработать: вести подсказкой по шагам (сначала «нажми плитку», затем «нажми, с какой поменять»), помечать выбранную плитку значком обмена, показывать предполагаемую перестановку до тапа." },
  { tag: "t-cfg", tagText: "Задание · логика", title: "Стартовый порядок может быть почти верным", Demo: StartDemo,
    problem: "Перемешивание не гарантирует, что старт далёк от ответа. На коротких рядах (3–4 плитки) случайная раскладка иногда совпадает с верной или требует одного обмена, и задание становится тривиальным или вовсе уже решённым.",
    fix: "Доработать: гарантировать минимальную «дистанцию» старта от ответа (несколько перестановок), проверять, что стартовый порядок не равен верному и не решается «в один тап»." },
  { tag: "t-grade", tagText: "Задание · проверка", title: "Повторяющиеся значения ломают зачёт", Demo: DuplicateDemo,
    problem: "Если в ряду есть одинаковые значения (две «20»), проверка по позициям может не засчитать визуально правильную последовательность: плитки-дубли «закреплены» за конкретными местами, и перестановка одинаковых нарушает зачёт, хотя на экране всё верно.",
    fix: "Доработать: сверять по значениям, а не по тождеству плиток (последовательность значений === целевой), чтобы одинаковые элементы были взаимозаменяемы." },
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
