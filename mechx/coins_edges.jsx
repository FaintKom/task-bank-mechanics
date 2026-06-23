/* coins_edges.jsx — coins: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (порт): монеты-номиналы, +/− набирают количество ──
   liveColor — пилюля суммы краснеет при переборе по ходу; tapRemove — тап по монете убирает её */
function Coins({ target, coins, unit = "₽", liveColor, tapRemove, maxEach = 20 }) {
  const [counts, setCounts] = useState(coins.map(() => 0)); const [graded, setGraded] = useState(false);
  const total = coins.reduce((s, c, i) => s + c * counts[i], 0);
  const correct = total === target; const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const over = total > target;
  const adjust = (i, d) => { if (graded) return; const n = [...counts]; n[i] = Math.max(0, Math.min(maxEach, n[i] + d)); setCounts(n); setGraded(false); };
  let pillColor = "var(--sel-fg)", pillBg = "var(--sel-bg)";
  if (graded) { pillColor = correct ? "var(--ok-fg)" : "var(--no-fg)"; pillBg = correct ? "var(--ok-bg)" : "var(--no-bg)"; }
  else if (liveColor && total > 0) { pillColor = (total === target) ? "var(--ok-fg)" : over ? "var(--no-fg)" : "var(--sel-fg)"; pillBg = (total === target) ? "var(--ok-bg)" : over ? "var(--no-bg)" : "var(--sel-bg)"; }
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.2rem", margin: "0 auto" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>Собери {target} {unit}</p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
        {coins.map((c, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span onClick={() => tapRemove && counts[i] > 0 && adjust(i, -1)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 54, height: 54, borderRadius: "50%", background: "var(--canvas-bg)", border: "3px solid var(--ink-soft)", color: "var(--ink)", fontWeight: 700, fontFamily: "Fraunces, Georgia, serif", fontSize: "1.2rem", cursor: tapRemove && !graded ? "pointer" : "default" }}>{c}</span>
            <span className="mech-label">{counts[i] ? `×${counts[i]}` : "—"}</span>
            <PlusMinus onMinus={() => adjust(i, -1)} onPlus={() => adjust(i, 1)} disabled={graded} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span className="mech-label">Сумма:</span>
        <span style={{ fontFamily: "Nunito,sans-serif", fontWeight: 800, fontSize: "1.4rem", color: pillColor, background: pillBg, borderRadius: 999, padding: "4px 16px" }}>{total} {unit}</span>
      </div>
      <button type="button" className="mech-check" disabled={total === 0 || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: accent }}>{correct ? "Верно!" : over ? "Перебор" : "Не хватает"}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><Coins target={18} coins={[1, 2, 5, 10]} /></TabletFrame>; }

/* ── EC1 · сумма не краснеет при переборе по ходу ── */
function LiveColorDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (живой цвет)</button>
        </div>
        <span className="mech-label" style={{ fontSize: 13 }}>Набери больше 18</span>
      </div>
      <TabletFrame><Coins key={fix ? "f" : "n"} target={18} coins={[1, 2, 5, 10]} liveColor={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Пилюля суммы краснеет, как только перебрал цель, и ребёнок сразу видит, что пора убрать монету."
        : "Сумма-пилюля не меняет цвет при переборе по ходу: ребёнок узнаёт, что собрал лишнее, только после «Проверить»."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · target недостижим номиналами ── */
function UnreachableDemo() {
  const [bad, setBad] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={bad ? "on" : ""} onClick={() => setBad(true)}>Цель 3, монеты [2, 5]</button>
          <button className={!bad ? "on" : ""} onClick={() => setBad(false)}>Цель 7, монеты [2, 5]</button>
        </div>
      </div>
      <TabletFrame><Coins key={bad ? "b" : "g"} target={bad ? 3 : 7} coins={[2, 5]} liveColor /></TabletFrame>
      <div className="demo-note">{bad
        ? "Цель 3, а монеты только 2 и 5: ровно 3 не собрать никак, потому что 2 мало, а 4 уже перебор. Задание в принципе нерешаемо (ошибка конфига)."
        : "Цель 7 собирается как 5 + 2. Тот же набор монет, но достижимая цель."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · убрать монету только кнопкой «−» ── */
function RemoveDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (тап по монете)</button>
        </div>
      </div>
      <TabletFrame><Coins key={fix ? "f" : "n"} target={18} coins={[1, 2, 5, 10]} tapRemove={fix} liveColor={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Лишнюю монету можно убрать тапом прямо по ней, это прямее и понятнее ребёнку, чем искать кнопку «−»."
        : "Убрать монету можно только кнопкой «−» под номиналом; тап по самой монете ничего не делает. Плюс автоповтора при удержании нет, поэтому большую сумму набирать долго."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-age", tagText: "Возраст · фидбек", title: "Перебор не виден до проверки (предложение)", Demo: LiveColorDemo,
    problem: "Сумма-пилюля не меняет цвет, пока ребёнок набирает монеты. Что он перебрал цель, выяснится только после «Проверить», а по ходу набора нет сигнала «уже слишком много», хотя сумма считается живо.",
    fix: "Доработать: подкрашивать сумму по ходу, зелёным при точном совпадении, красным при переборе, нейтрально пока меньше цели. Можно дать это как включаемый режим подсказки, а не всегда." },
  { tag: "t-cfg", tagText: "Задание · конфиг", title: "Цель недостижима номиналами", Demo: UnreachableDemo,
    problem: "Если набором номиналов нельзя получить ровно target (цель 3 при монетах 2 и 5), задание невозможно решить: любая комбинация либо не дотягивает, либо перебирает. Ребёнок застревает без понимания, что задача в принципе нерешаема.",
    fix: "Доработать: валидировать конфиг, target обязан собираться доступными номиналами; иначе не выпускать задание." },
  { tag: "t-touch", tagText: "Планшет · касание", title: "Убрать монету только кнопкой «−» (предложение)", Demo: RemoveDemo,
    problem: "Лишняя монета убирается только кнопкой «−» под номиналом, тап по самой монете ничего не делает, хотя это интуитивный жест. Плюс +/− без автоповтора: большую сумму набирать приходится десятками отдельных тапов.",
    fix: "Доработать: убирать монету тапом по ней; добавить автоповтор при удержании кнопок +/− или ввод количества, чтобы набор крупных сумм не был утомительным." },
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
