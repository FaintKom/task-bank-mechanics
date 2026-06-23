/* fraction_shade_edges.jsx — fraction-shade: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): круг из равных секторов, тап закрашивает; счёт = количество ── */
function FractionShade({ denominator, targetFilled, liveCounter }) {
  const [filled, setFilled] = useState([]); const [graded, setGraded] = useState(false);
  const SIZE = 260, R = SIZE / 2;
  const set = new Set(filled);
  const correct = filled.length === targetFilled;
  const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const sectorPath = (k) => {
    const a0 = (k / denominator) * 2 * Math.PI - Math.PI / 2, a1 = ((k + 1) / denominator) * 2 * Math.PI - Math.PI / 2;
    const x0 = R + R * Math.cos(a0), y0 = R + R * Math.sin(a0), x1 = R + R * Math.cos(a1), y1 = R + R * Math.sin(a1);
    const large = 1 / denominator > 0.5 ? 1 : 0;
    return `M ${R} ${R} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`;
  };
  const toggle = (k) => { if (graded) return; const next = set.has(k) ? filled.filter((x) => x !== k) : [...filled, k]; setFilled(next.sort((a, b) => a - b)); setGraded(false); };
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.2rem", margin: "0 auto" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>Закрась {targetFilled} из {denominator}</p>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ maxWidth: "100%" }}>
        {Array.from({ length: denominator }, (_, k) => k).map((k) => (
          <path key={k} d={sectorPath(k)} onClick={() => toggle(k)} fill={set.has(k) ? "var(--sel-accent)" : "var(--paper)"} stroke="var(--line)" strokeWidth={3} style={{ cursor: graded ? "default" : "pointer", touchAction: "none" }} />
        ))}
      </svg>
      {(liveCounter || graded) && <span className="mech-readout" style={{ color: graded ? accent : "var(--sel-fg)" }}>{filled.length} / {denominator}</span>}
      <button type="button" className="mech-check" disabled={filled.length === 0 || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: accent }}>{correct ? "Верно!" : `Нужно ${targetFilled}`}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><FractionShade denominator={4} targetFilled={3} /></TabletFrame>; }

/* ── EC1 · нет живого счётчика ── */
function CounterDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (живой счётчик)</button>
        </div>
      </div>
      <TabletFrame><FractionShade key={fix ? "f" : "n"} denominator={6} targetFilled={4} liveCounter={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Дробь-счётчик «N / 6» обновляется при каждом тапе, и ребёнок видит, сколько уже закрасил и сколько нужно."
        : "Счётчик появляется только после «Проверить». По ходу ребёнок не видит, сколько частей уже закрасил, и приходится считать сектора глазами."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · «закрась ноль» нельзя подтвердить ── */
function ZeroDemo() {
  return (
    <React.Fragment>
      <div className="ec-controls"><span className="mech-label" style={{ fontSize: 13 }}>Задача: «не закрашивай ничего» (0 из 4)</span></div>
      <TabletFrame><FractionShade denominator={4} targetFilled={0} /></TabletFrame>
      <div className="demo-note">Если верный ответ это 0 закрашенных, ребёнок ничего не трогает, но «Проверить» заблокирована на пустом значении. Подтвердить «ноль» нельзя, задание зависает.</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-age", tagText: "Возраст · фидбек", title: "Нет живого счётчика дроби (предложение)", Demo: CounterDemo,
    problem: "Дробь-счётчик «N / знаменатель» показывается только после «Проверить». По ходу ребёнок не видит, сколько частей уже закрасил, и вынужден пересчитывать сектора глазами. Для 9-летнего это лишняя нагрузка и источник ошибок «закрасил на одну больше или меньше».",
    fix: "Доработать: показывать живой счётчик закрашенных долей сразу при касании, а не только в режиме проверки." },
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Мелкие сектора и промах по соседней доле", Demo: null,
    problem: "При большом знаменателе (до 24) сектора круга становятся узкими, особенно у центра. Подушечка пальца задевает соседнюю долю и закрашивает не ту, а так как засчитывается количество, лишний случайный сектор молча портит ответ.",
    fix: "Доработать: увеличивать круг и зону нажатия каждой доли, расширять hit-area у центра, для больших знаменателей предпочитать форму «полоса», где доли крупнее." },
  { tag: "t-grade", tagText: "Задание · проверка", title: "«Закрась ноль» нельзя подтвердить (предложение)", Demo: ZeroDemo,
    problem: "Если правильный ответ это 0 закрашенных долей, ребёнок ничего не закрашивает, но «Проверить» заблокирована на пустом значении. Подтвердить намеренный «ноль» нечем, и задание невозможно сдать. Это может пригодиться, когда задание комбинируется с другим (тогда «закрась ноль» осмысленный ответ).",
    fix: "Доработать: разрешать подтверждать пустой ответ явной кнопкой, либо не выпускать задания с target_filled = 0 для этой механики." },
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
            {D && <D />}
          </article>
        );
      })}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("example")).render(<Example />);
ReactDOM.createRoot(document.getElementById("cases")).render(<Cases />);
