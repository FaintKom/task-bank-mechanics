/* base10_blocks_edges.jsx — base10-blocks: рабочий пример + edge-кейсы (что доработать) */
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
  const btn = { display: "flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, padding: 0, fontSize: "1.5rem" };
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button type="button" className="mech-tile" onClick={onMinus} disabled={disabled} style={btn}>−</button>
      <button type="button" className="mech-tile" onClick={onPlus} disabled={disabled} style={btn}>+</button>
    </div>
  );
}

/* ── виджет (порт): блоки сотни/десятки/единицы, max 0–999 ── */
const GLYPH = { hundreds: { w: 26, h: 26 }, tens: { w: 8, h: 26 }, ones: { w: 11, h: 11 } };
function Base10({ target, columns, maxEach = 15 }) {
  const COLS = columns || [{ place: "hundreds", label: "Сотни" }, { place: "tens", label: "Десятки" }, { place: "ones", label: "Единицы" }];
  const [v, setV] = useState({ hundreds: 0, tens: 0, ones: 0 }); const [graded, setGraded] = useState(false);
  const total = v.hundreds * 100 + v.tens * 10 + v.ones;
  const correct = total === target; const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
  const adjust = (place, d) => { if (graded) return; setV({ ...v, [place]: Math.min(maxEach, Math.max(0, v[place] + d)) }); setGraded(false); };
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.3rem", margin: "0 auto" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>Собери число {target}</p>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16 }}>
        {COLS.map(({ place, label }) => { const g = GLYPH[place] || GLYPH.ones; return (
          <div key={place} style={{ display: "flex", width: 104, flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", minHeight: 116, flexDirection: "column-reverse", flexWrap: "wrap", alignContent: "center", justifyContent: "flex-start", gap: 4 }}>
              {Array.from({ length: v[place] || 0 }, (_, i) => <span key={i} style={{ width: g.w, height: g.h, background: "var(--sel-accent)", border: "1px solid var(--paper)", borderRadius: 3 }} />)}
            </div>
            <span className="mech-readout" style={{ fontSize: "1.5rem" }}>{v[place] || 0}</span>
            <span className="mech-label">{label}</span>
            <PlusMinus onMinus={() => adjust(place, -1)} onPlus={() => adjust(place, 1)} disabled={graded} />
          </div>
        ); })}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span className="mech-label">Получилось:</span><span className="mech-readout" style={graded ? { color: accent } : undefined}>{total}</span></div>
      <button type="button" className="mech-check" disabled={total === 0 || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
      {graded && <span className="mech-label" style={{ color: accent }}>{correct ? "Верно!" : `Нужно ${target}`}</span>}
    </div></div>
  );
}

/* ── рабочий пример ── */
function Example() { return <TabletFrame><Base10 target={234} /></TabletFrame>; }

/* ── EC1 · потолок сотен против чисел до миллиона ── */
function CeilingDemo() {
  const [big, setBig] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!big ? "on" : ""} onClick={() => setBig(false)}>Число 234</button>
          <button className={big ? "on" : ""} onClick={() => setBig(true)}>Число 24 500</button>
        </div>
      </div>
      <TabletFrame><Base10 key={big ? "b" : "n"} target={big ? 24500 : 234} /></TabletFrame>
      <div className="demo-note">{big
        ? "Цель 24 500, а у блоков только сотни, десятки и единицы (максимум 999). Тысяч и десятков тысяч в наборе нет, собрать число невозможно."
        : "Число 234 укладывается в сотни, десятки и единицы, а механика работает только до 999."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · перегруз блоков ── */
function OverflowDemo() {
  return (
    <React.Fragment>
      <div className="ec-controls"><span className="mech-label" style={{ fontSize: 13 }}>Собери 999, добавь по 9 в каждый разряд</span></div>
      <TabletFrame><Base10 target={999} /></TabletFrame>
      <div className="demo-note">Близко к цели (999 = 9+9+9 блоков, плюс перегруппировка) разряд набивается десятками блоков, стопки переполняются по высоте, считать и попадать кнопками тяжело.</div>
    </React.Fragment>
  );
}

/* ── EC3 · набор только по одному тапу ── */
function NoRepeatDemo() {
  return (
    <React.Fragment>
      <div className="ec-controls"><span className="mech-label" style={{ fontSize: 13 }}>Нажми «+» в сотнях несколько раз</span></div>
      <TabletFrame><Base10 target={734} /></TabletFrame>
      <div className="demo-note">Кнопки +/− добавляют ровно по одному блоку за тап и без автоповтора при удержании. Чтобы набрать 7 сотен, 3 десятка и 4 единицы, нужно 14 отдельных тапов, и для больших чисел это утомительно.</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-cfg", tagText: "Задание · охват", title: "Блоки только до сотен (макс 999)", Demo: CeilingDemo,
    problem: "В наборе есть сотни, десятки, единицы, потолок 999. А методология 4 класса работает с числами до 1 000 000 (разряды и классы тысяч). Тысячи и выше блоками не собрать, и инструмент остаётся «начальной школой» и не покрывает ядровую тему разрядов.",
    fix: "Доработать: добавить разряды тысяч, десятков и сотен тысяч (классы), либо честно ограничить применение механики числами до 999 и не давать её на большие разряды." },
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Стопки блоков переполняются", Demo: OverflowDemo,
    problem: "Любой состав числа засчитывается (это плюс), но при наборе близко к лимиту (до 15 блоков на разряд, перегруппировка) стопки забиваются десятками мелких блоков, их трудно сосчитать глазами, а столбец переполняется по высоте экрана.",
    fix: "Доработать: визуально группировать блоки (по 5 или по 10), сворачивать десяток единиц в «палочку-десяток» автоматически, ограничивать высоту стопки." },
  { tag: "t-touch", tagText: "Планшет · касание", title: "Набор только по одному тапу", Demo: NoRepeatDemo,
    problem: "Кнопки +/− меняют разряд ровно на единицу за тап и без автоповтора при удержании. Набрать многоразрядное число это десяток-полтора отдельных тапов, на планшете долго и провоцирует проскочить нужное.",
    fix: "Доработать: автоповтор при удержании, ввод количества числом, или перетаскивание блоков пачкой, чтобы набор не превращался в серию однообразных тапов." },
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
