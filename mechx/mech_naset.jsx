/* mech_naset.jsx — base10-blocks, balance-scale, coins, slider-control */

function PlusMinus({ onMinus, onPlus, disabled }) {
  const btn = { display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, padding: 0 };
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button type="button" className="mech-tile" onClick={onMinus} disabled={disabled} style={btn}>−</button>
      <button type="button" className="mech-tile" onClick={onPlus} disabled={disabled} style={btn}>+</button>
    </div>
  );
}

/* ── base10-blocks ──────────────────────────────── */
function Base10BlocksDemo() {
  const config = { target: 234 };
  const score = (c, v) => { if (!v) return { correct: false }; return { correct: v.hundreds * 100 + v.tens * 10 + v.ones === c.target }; };
  const MAX = 15;
  const GLYPH = { hundreds: { w: 26, h: 26 }, tens: { w: 8, h: 26 }, ones: { w: 11, h: 11 } };
  const COLS = [{ place: "hundreds", label: "Сотни" }, { place: "tens", label: "Десятки" }, { place: "ones", label: "Единицы" }];
  return (
    <MechHost config={config} score={score} initial={{ hundreds: 0, tens: 0, ones: 0 }} canCheck={(v) => v && (v.hundreds || v.tens || v.ones)} render={({ value, onChange, display, result }) => {
      const v = value ?? { hundreds: 0, tens: 0, ones: 0 }; const graded = display === Display.Graded; const correct = result?.correct ?? false;
      const total = v.hundreds * 100 + v.tens * 10 + v.ones; const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
      const adjust = (place, d) => { if (graded) return; onChange({ ...v, [place]: Math.min(MAX, Math.max(0, v[place] + d)) }); };
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16 }}>
            {COLS.map(({ place, label }) => { const g = GLYPH[place]; return (
              <div key={place} style={{ display: "flex", width: 110, flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", minHeight: 110, flexDirection: "column-reverse", flexWrap: "wrap", alignContent: "center", justifyContent: "flex-start", gap: 4 }}>
                  {Array.from({ length: v[place] }, (_, i) => <span key={i} style={{ width: g.w, height: g.h, background: "var(--sel-accent)", border: "1px solid var(--paper)", borderRadius: 3 }} />)}
                </div>
                <span className="mech-readout" style={{ fontSize: "1.6rem" }}>{v[place]}</span>
                <span className="mech-label">{label}</span>
                <PlusMinus onMinus={() => adjust(place, -1)} onPlus={() => adjust(place, 1)} disabled={graded} />
              </div>
            ); })}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span className="mech-label">Получилось:</span><span className="mech-readout" style={graded ? { color: accent } : undefined}>{total}</span>{graded && <span className="mech-label">нужно {config.target}</span>}</div>
        </div>
      );
    }} />
  );
}

/* ── balance-scale ──────────────────────────────── */
function BalanceScaleDemo() {
  const config = { left_grams: 8, weights: [1, 2, 5] };
  const rightTotal = (c, v) => c.weights.reduce((s, w, i) => s + w * (v?.[i] ?? 0), 0);
  const score = (c, v) => ({ correct: rightTotal(c, v) === c.left_grams });
  const PX = 160, PY = 110, ARM = 100, MAXT = 14, MAX_EACH = 20;
  const rot = (x, y, deg) => { const a = (deg * Math.PI) / 180, dx = x - PX, dy = y - PY; return [PX + dx * Math.cos(a) - dy * Math.sin(a), PY + dx * Math.sin(a) + dy * Math.cos(a)]; };
  return (
    <MechHost config={config} score={score} initial={config.weights.map(() => 0)} canCheck={(v) => (v ?? []).some((n) => n > 0)} render={({ value, onChange, display, result }) => {
      const graded = display === Display.Graded; const correct = result?.correct ?? false;
      const right = rightTotal(config, value ?? null); const tilt = Math.max(-MAXT, Math.min(MAXT, (right - config.left_grams) * 3)); const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
      const adjust = (i, d) => { if (graded) return; const next = config.weights.map((_, k) => value?.[k] ?? 0); next[i] = Math.max(0, Math.min(MAX_EACH, next[i] + d)); onChange(next); };
      const [lx, ly] = rot(PX - ARM, PY, tilt); const [rx, ry] = rot(PX + ARM, PY, tilt); const STR = 22;
      const pans = [{ x: lx, y: ly, label: `${config.left_grams} г`, fill: "var(--sel-bg)" }, { x: rx, y: ry, label: `${right} г`, fill: "var(--paper)" }];
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%", maxWidth: 420 }}>
          <svg viewBox="0 0 320 210" style={{ width: "100%", touchAction: "none" }}>
            <line x1={PX} y1={PY} x2={PX} y2={190} stroke="var(--ink)" strokeWidth={6} />
            <polygon points={`${PX - 26},190 ${PX + 26},190 ${PX},${PY}`} fill="var(--line)" stroke="var(--ink)" strokeWidth={2} />
            <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={graded ? accent : "var(--ink)"} strokeWidth={6} strokeLinecap="round" />
            <circle cx={PX} cy={PY} r={6} fill="var(--ink)" />
            {pans.map((p, i) => (<g key={i}><line x1={p.x} y1={p.y} x2={p.x} y2={p.y + STR} stroke="var(--ink)" strokeWidth={1.5} /><path d={`M ${p.x - 30} ${p.y + STR} A 30 16 0 0 0 ${p.x + 30} ${p.y + STR} Z`} fill={p.fill} stroke="var(--ink)" strokeWidth={2} /><text x={p.x} y={p.y + STR + 13} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--ink)">{p.label}</text></g>))}
          </svg>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            {config.weights.map((w, i) => (<div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><span className="mech-label">{w} г{value?.[i] ? ` ×${value[i]}` : ""}</span><PlusMinus onMinus={() => adjust(i, -1)} onPlus={() => adjust(i, 1)} disabled={graded} /></div>))}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span className="mech-label">Справа:</span><span className="mech-readout" style={graded ? { color: accent } : undefined}>{right} г</span>{graded && <span className="mech-label">нужно {config.left_grams} г</span>}</div>
        </div>
      );
    }} />
  );
}

/* ── coins ──────────────────────────────────────── */
function CoinsDemo() {
  const config = { target: 18, coins: [1, 2, 5, 10], unit: "₽" };
  const total = (c, v) => c.coins.reduce((s, x, i) => s + x * (v?.[i] ?? 0), 0);
  const score = (c, v) => ({ correct: total(c, v) === c.target });
  const MAX_EACH = 20;
  return (
    <MechHost config={config} score={score} initial={config.coins.map(() => 0)} canCheck={(v) => (v ?? []).some((n) => n > 0)} render={({ value, onChange, display, result }) => {
      const graded = display === Display.Graded; const correct = result?.correct ?? false; const t = total(config, value ?? null); const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
      const adjust = (i, d) => { if (graded) return; const next = config.coins.map((_, k) => value?.[k] ?? 0); next[i] = Math.max(0, Math.min(MAX_EACH, next[i] + d)); onChange(next); };
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            {config.coins.map((c, i) => { const nn = value?.[i] ?? 0; return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: "50%", background: "var(--canvas-bg)", border: "3px solid var(--ink-soft)", color: "var(--ink)", fontWeight: 700, fontFamily: "Fraunces, Georgia, serif" }}>{c}</span>
                <span className="mech-label">{nn ? `×${nn}` : "—"}</span>
                <PlusMinus onMinus={() => adjust(i, -1)} onPlus={() => adjust(i, 1)} disabled={graded} />
              </div>
            ); })}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span className="mech-label">Сумма:</span><span className="mech-readout" style={graded ? { color: accent } : undefined}>{t} {config.unit}</span>{graded && <span className="mech-label">нужно {config.target} {config.unit}</span>}</div>
        </div>
      );
    }} />
  );
}

/* ── slider-control ─────────────────────────────── */
function SliderControlDemo() {
  const config = { min: 0, max: 10, step: 1, target: 7 };
  const score = (c, v) => ({ correct: v != null && Math.abs(v - c.target) <= (c.tolerance ?? 0) });
  return (
    <MechHost config={config} score={score} initial={config.min} canCheck={() => true} render={({ value, onChange, display, result }) => {
      const graded = display === Display.Graded; const correct = result?.correct ?? false; const current = value ?? config.min;
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: "100%", maxWidth: 380 }}>
          <span className="mech-readout" style={graded ? { color: correct ? "var(--ok-accent)" : "var(--no-accent)" } : undefined}>{current}{config.unit ? ` ${config.unit}` : ""}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
            <input type="range" min={config.min} max={config.max} step={config.step ?? 1} value={current} disabled={graded} onChange={(e) => onChange(Number(e.target.value))} className="mech-range" />
            <div style={{ display: "flex", justifyContent: "space-between" }}><span className="mech-label">{config.min}</span><span className="mech-label">{config.max}</span></div>
          </div>
          {graded && <span className="mech-label">нужно {config.target}</span>}
        </div>
      );
    }} />
  );
}

Object.assign(window, { Base10BlocksDemo, BalanceScaleDemo, CoinsDemo, SliderControlDemo });
