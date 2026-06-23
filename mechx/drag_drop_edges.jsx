/* drag_drop_edges.jsx — drag-drop-set: рабочий пример + edge-кейсы (что доработать) */
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

/* ── виджет (tap-to-place) ── */
function DragDropSet({ config, requireAll, controlled, compact, growSelected }) {
  const [placedS, setPlacedS] = useState({}); const [gradedS, setGradedS] = useState(false); const [sel, setSel] = useState(null);
  const placed = controlled ? controlled.placed : placedS;
  const graded = controlled ? controlled.graded : gradedS;
  const setPlaced = controlled ? controlled.onPlaced : setPlacedS;
  const setGraded = controlled ? controlled.onGraded : setGradedS;
  const tray = config.items.map((it, i) => ({ it, i })).filter(({ i }) => placed[i] === undefined);
  const tapItem = (i) => { if (graded) return; if (placed[i] !== undefined) { const p = { ...placed }; delete p[i]; setPlaced(p); return; } setSel((s) => (s === i ? null : i)); };
  const tapZone = (zone) => { if (graded || sel == null) return; setPlaced({ ...placed, [sel]: zone }); setSel(null); };
  const renderItem = (i, inZone) => {
    const it = config.items[i]; const isSel = sel === i;
    const isCor = graded && inZone && placed[i] === it.zone; const isWrong = graded && inZone && placed[i] !== it.zone;
    return (
      <button key={i} type="button" className="mech-item" onClick={() => tapItem(i)} disabled={graded}
        data-selected={!graded && isSel ? "true" : undefined} data-state={isCor ? "correct" : isWrong ? "wrong" : undefined}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: compact ? "1rem" : "1.2rem", padding: compact ? ".4rem .8rem" : ".5rem 1rem", transition: "transform .15s", ...(growSelected && !graded && isSel ? { transform: "scale(1.7)", zIndex: 5, boxShadow: "0 8px 18px rgba(0,0,0,.22)" } : {}) }}>
        <span>{it.label}</span>{isCor && <IconCheck />}{isWrong && <IconX />}
      </button>
    );
  };
  const ready = requireAll ? tray.length === 0 : Object.keys(placed).length > 0;
  return (
    <div className="mech"><div className="mech-stack" style={{ gap: "1.1rem" }}>
      <p className="mech-prompt" style={{ fontSize: "1.4rem" }}>{config.prompt}</p>
      {!graded && <div className="mech-label" style={{ marginTop: -4 }}>{sel === null ? "Нажми карточку, потом группу" : "Теперь нажми нужную группу"}</div>}
      <div className="mech-tray" style={requireAll && !graded && tray.length > 0 ? { borderColor: "var(--warn)", background: "var(--warn-bg)" } : undefined}>
        {tray.length === 0 ? <span className="mech-label">—</span> : tray.map(({ i }) => renderItem(i, false))}
      </div>
      <div className="mech-zones">
        {config.zones.map((zone, zi) => {
          const here = config.items.map((_, i) => i).filter((i) => placed[i] === zone);
          return (
            <div key={zi} className="mech-zone" onClick={() => tapZone(zone)} data-dragover={!graded && sel !== null ? "true" : undefined} style={{ cursor: graded ? "default" : "pointer" }}>
              <span className="mech-zone-label" style={{ fontSize: compact ? "1rem" : "1.25rem" }}>{zone}</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", alignItems: "center", minHeight: 52 }}>{here.map((i) => renderItem(i, true))}</div>
            </div>
          );
        })}
      </div>
      <button type="button" className="mech-check" disabled={!ready || graded} onClick={() => setGraded(true)} style={{ fontSize: "1.2rem", minHeight: 60 }}>Проверить</button>
    </div></div>
  );
}

/* ── опорный палец удалён ── */

const EVEN_ODD = { prompt: "Разложи числа по группам", zones: ["Чётные", "Нечётные"], items: [{ label: "2", zone: "Чётные" }, { label: "3", zone: "Нечётные" }, { label: "4", zone: "Чётные" }, { label: "7", zone: "Нечётные" }] };
const PLACES = { prompt: "Разложи разряды по классам", zones: ["Единицы", "Десятки", "Сотни", "Тысячи"], items: [{ label: "5 ед", zone: "Единицы" }, { label: "3 дес", zone: "Десятки" }, { label: "8 сот", zone: "Сотни" }, { label: "2 тыс", zone: "Тысячи" }, { label: "7 ед", zone: "Единицы" }, { label: "1 дес", zone: "Десятки" }, { label: "6 сот", zone: "Сотни" }, { label: "9 тыс", zone: "Тысячи" }] };

/* ── рабочий пример ── */
function Example() { return <TabletFrame><DragDropSet config={EVEN_ODD} /></TabletFrame>; }

/* ── EC1 · карточка в лотке = «неверно» ── */
function UnplacedDemo() {
  const [fix, setFix] = useState(false);
  const [placed, setPlaced] = useState({}); const [graded, setGraded] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => { setFix(false); setPlaced({}); setGraded(false); }}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => { setFix(true); setPlaced({}); setGraded(false); }}>рекомендации</button>
        </div>
        {!fix && <button className="btn primary" onClick={() => { setPlaced({ 0: "Чётные", 1: "Нечётные" }); setGraded(true); }}>Разложить только две и проверить</button>}
      </div>
      <TabletFrame><DragDropSet key={fix ? "f" : "n"} config={EVEN_ODD} requireAll={fix} controlled={fix ? undefined : { placed, graded, onPlaced: setPlaced, onGraded: setGraded }} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Лоток подсвечен, «Проверить» заблокирована, пока в нём остались карточки: недоразложенное сдать нельзя."
        : "Две карточки остались в лотке, но «Проверить» сработала, и они засчитаны как ошибка, хотя ребёнок их просто не разложил."}</div>
    </React.Fragment>
  );
}

/* ── EC2 · карточка прячется под пальцем ── */
function UnderFingerDemo() {
  const [fix, setFix] = useState(false);
  return (
    <React.Fragment>
      <div className="ec-controls">
        <div className="seg">
          <button className={!fix ? "on" : ""} onClick={() => setFix(false)}>Как есть</button>
          <button className={fix ? "on" : ""} onClick={() => setFix(true)}>рекомендации (увеличивать)</button>
        </div>
      </div>
      <TabletFrame><DragDropSet key={fix ? "f" : "n"} config={EVEN_ODD} growSelected={fix} /></TabletFrame>
      <div className="demo-note">{fix
        ? "Нажми карточку: при переносе она увеличивается, становится больше пальца и остаётся видной, пока её не опустят в зону."
        : "Нажми карточку: при переносе она не меняется и едет под пальцем, на планшете её закрывает ладонь, ребёнок тащит «вслепую»."}</div>
    </React.Fragment>
  );
}

/* ── EC3 · много карточек и тесные зоны ── */
function CrampedDemo() {
  return (
    <React.Fragment>
      <div className="ec-controls"><span className="mech-label" style={{ fontSize: 13 }}>8 карточек · 4 зоны</span></div>
      <TabletFrame><DragDropSet config={PLACES} compact /></TabletFrame>
      <div className="demo-note">8 карточек и 4 зоны на одном экране: зоны узкие, карточки мелкие, цель для «броска» маленькая, на планшете легко промахнуться мимо нужной группы.</div>
    </React.Fragment>
  );
}

const CASES = [
  { tag: "t-grade", tagText: "Задание · проверка", title: "Неразложенные карточки сразу идут в ошибку", Demo: UnplacedDemo,
    problem: "«Проверить» доступна, как только разложена хотя бы одна карточка. Карточки, оставшиеся в лотке, грейдятся как ошибочные, хотя ребёнок их просто не разложил. «Не доделал» неотличимо от «положил не туда», и сигнала «разложи все» нет. Уточнение: особенно это про задания, где часть карточек по замыслу остаётся неразложенной (лишние карточки), там оставить их в лотке это и есть верный ответ.",
    fix: "Доработать: блокировать «Проверить», пока лоток не пуст, или подсвечивать оставшиеся карточки перед проверкой; отличать «не разложено» от «неверно». Для заданий, где часть карточек по замыслу лишняя, сверять с задуманным распределением, а не блокировать по непустому лотку." },
  { tag: "t-age", tagText: "Касание · возраст", title: "Карточка прячется под пальцем", Demo: UnderFingerDemo,
    problem: "При перетаскивании карточка едет ровно под пальцем и полностью скрыта ладонью. Ребёнок тащит «вслепую», не видит ни что несёт, ни попал ли в нужную зону.",
    fix: "Доработать: при перетаскивании увеличивать карточку (чтобы она была больше пальца и оставалась видной) и держать её поверх, пока не опустят в зону." },
  { tag: "t-tab", tagText: "Планшет · эргономика", title: "Много карточек и тесные зоны", Demo: CrampedDemo,
    problem: "При 8+ карточках и 3–4 зонах всё сжимается: карточки мелкие, зоны узкие, цель для «броска» маленькая. На планшете легко уронить карточку мимо нужной группы или задеть соседнюю.",
    fix: "Доработать: ограничивать число карточек и зон на экран, увеличивать зоны-цели и зазоры между ними, дробить большую сортировку на этапы." },
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
