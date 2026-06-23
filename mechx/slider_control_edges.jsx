/* slider_control_edges.jsx — slider-control: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет ползунка (порт компонента) ── */
function Slider({ min, max, step = 1, target, tolerance = 0, unit, prompt = "Поставь ползунок на нужное число", showValue = true, bigValue }) {
  const [value, setValue] = useState(min); const [graded, setGraded] = useState(false);
  const correct = Math.abs(value - target) <= tolerance;
  const accent = graded ? (correct ? "var(--ok-accent)" : "var(--no-accent)") : "var(--sel-accent)";
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.6rem", width: "100%", maxWidth: 560, margin: "0 auto" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>{prompt}: {target}{unit ? ` ${unit}` : ""}</p>
      {bigValue && <span className="mech-readout" style={graded ? { color: accent } : undefined}>{value}{unit ? ` ${unit}` : ""}</span>}
      <div style={{ width: "100%", position: "relative" }}>
        {showValue && !bigValue && (
          <span style={{ position: "absolute", left: `calc(${((value - min) / (max - min)) * 100}% )`, top: -34, transform: "translateX(-50%)", fontFamily: "Fraunces,serif", fontWeight: 700, fontSize: "1.3rem", color: accent }}>{value}</span>
        )}
        <input type="range" min={min} max={max} step={step} value={value} disabled={graded}
          onChange={(e) => { setValue(Number(e.target.value)); setGraded(false); }} className="mech-range" style={{ accentColor: accent }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span className="mech-label">{min}</span><span className="mech-label">{max}</span></div>
      </div>
      <button type="button" className="mech-check" disabled={graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: accent }}>{correct ? "Верно!" : `Нужно ${target}${unit ? " " + unit : ""}, у вас ${value}`}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><Slider min={0} max={10} step={1} target={7} bigValue /></TabletFrame>; }

/* ── EC1 · точное попадание жестоко ── */
function ToleranceDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Точно (допуск 0)</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>С допуском ±5</button>
        </div>
      </div>
      <TabletFrame><Slider key={fix ? "f" : "n"} min={0} max={100} step={1} target={70} tolerance={fix ? 5 : 0} prompt="Прикинь, где примерно" bigValue /></TabletFrame>
      <div className="demo-note">{fix
        ? "Задача на прикидку: допуск ±5 засчитывает 65–75, и ребёнок попадает «на глаз», как и задумано."
        : "Шкала 0–100, попасть нужно ровно в 70. Пальцем на планшете это почти невозможно: 69 или 71 уже «неверно», хотя для прикидки это правильно."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · бегунок и значение под пальцем ── */
function UnderThumbDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации</button>
        </div>
      </div>
      <TabletFrame><Slider key={fix ? "f" : "n"} min={0} max={20} step={1} target={13} bigValue={fix} showValue={!fix} prompt="Поставь ползунок на" /></TabletFrame>
      <div className="demo-note">{fix
        ? "Текущее значение вынесено крупно над шкалой, оно не под пальцем, видно всегда."
        : "Значение показано прямо над бегунком, ровно там, где палец: во время перетаскивания его закрывает рука, и ребёнок не видит, что выставил."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · мелкий шаг — палец проскакивает ── */
function FineStepDemo() {
  const [fine, setFine] = useState(true);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={fine ? "on" : ""} onClick={() => setFine(true)}>Шаг 1 (0…200)</button>
          <button className={!fine ? "on" : ""} onClick={() => setFine(false)}>Шаг 10 (0…200)</button>
        </div>
      </div>
      <TabletFrame><Slider key={fine ? "f" : "c"} min={0} max={200} step={fine ? 1 : 10} target={130} tolerance={fine ? 0 : 0} prompt="Поставь ползунок на" bigValue /></TabletFrame>
      <div className="demo-note">{fine
        ? "200 значений на узкой шкале: один пиксель равен нескольким единицам, палец проскакивает 130, поймать точное число почти нереально."
        : "При шаге 10 значений мало, ползунок встаёт на «круглые» числа, попасть в 130 легко."}</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-age", tagText: "Касание · возраст", title: "Точное попадание жестоко к моторике", Demo: ToleranceDemo,
    problem: "По умолчанию tolerance = 0, то есть нужно попасть ровно в целевое число. На широкой шкале пальцем 9-летнего это почти невозможно: 69 вместо 70 уже «неверно», хотя для задачи на прикидку и округление такой ответ правильный по сути.",
    fix: "Доработать: для задач на прикидку задавать допуск (tolerance), засчитывающий близкие значения; точное попадание оставлять только там, где это действительно нужно." },
  { tag: "t-touch", tagText: "Планшет · касание", title: "Бегунок и значение прячутся под пальцем", Demo: UnderThumbDemo,
    problem: "Если текущее значение показано над самим бегунком, во время перетаскивания его закрывает палец, и ребёнок тянет «вслепую», не видит, какое число выставляет, пока не уберёт руку.",
    fix: "Доработать: выносить текущее значение крупно над шкалой или сбоку от неё (вне зоны пальца), чтобы оно было видно в процессе перетаскивания." },
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Мелкий шаг, палец проскакивает значение", Demo: FineStepDemo,
    problem: "При большом диапазоне и шаге 1 на узкой шкале один пиксель соответствует нескольким единицам. Палец проскакивает нужное значение, ползунок «дёргается», и точное число поймать почти нереально.",
    fix: "Доработать: укрупнять шаг под диапазон (round-числа), либо давать допуск; для точного выбора добавить кнопки −/+ для тонкой подстройки рядом с ползунком." },
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
