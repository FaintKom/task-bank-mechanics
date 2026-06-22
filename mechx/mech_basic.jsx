/* mech_basic.jsx — choice, text-with-slots, number-line, number-grid, clock */
const { useState: useStateB } = React;

/* ── choice ─────────────────────────────────────── */
function ChoiceDemo() {
  const config = { options: ["7", "12", "15", "9"], correct_indices: [1] };
  const score = (c, v) => {
    const sel = new Set(v ?? []); const cor = new Set(c.correct_indices);
    return { correct: sel.size === cor.size && [...cor].every((i) => sel.has(i)) };
  };
  const single = config.correct_indices.length === 1;
  return (
    <MechHost config={config} score={score} initial={[]} render={({ value, onChange, display, result }) => {
      const selected = value ?? []; const graded = display === Display.Graded;
      const correctSet = new Set(config.correct_indices);
      const pick = (idx) => {
        if (single) return onChange([idx]);
        onChange(selected.includes(idx) ? selected.filter((i) => i !== idx) : [...selected, idx]);
      };
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360 }}>
          {config.options.map((opt, idx) => {
            const isSel = selected.includes(idx); const isCor = correctSet.has(idx);
            const state = graded ? (isCor ? "correct" : isSel ? "wrong" : undefined) : undefined;
            return (
              <button key={idx} type="button" className="mech-option" onClick={() => pick(idx)} disabled={graded}
                data-selected={!graded && isSel ? "true" : undefined} data-state={state} data-locked={graded ? "true" : undefined}>
                <span>{opt}</span>
                {state === "correct" && <IconCheck />}{state === "wrong" && <IconX />}
              </button>
            );
          })}
        </div>
      );
    }} />
  );
}

/* ── text-with-slots ────────────────────────────── */
function TextWithSlotsDemo() {
  const config = {
    template: "1250 + 940 = {0}",
    slots: [{ type: "number", answer: 2190 }],
  };
  const slotOk = (slot, raw) => {
    if (raw === undefined) return false; const v = String(raw); if (v.trim() === "") return false;
    if (slot.type === "number") { const n = Number(v.replace(",", ".")); return !Number.isNaN(n) && n === slot.answer; }
    return v === slot.answer;
  };
  const score = (c, v) => ({ correct: c.slots.every((s, i) => slotOk(s, v?.[i])) });
  return (
    <MechHost config={config} score={score} initial={[]} render={({ value, onChange, display, result }) => {
      const graded = display === Display.Graded;
      const parts = config.template.split(/(\{\d+\})/g);
      const setSlot = (i, val) => { const next = [...(value ?? [])]; next[i] = val; onChange(next); };
      return (
        <div className="mech-readout" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 6, lineHeight: 1.7 }}>
          {parts.map((p, idx) => {
            const m = p.match(/\{(\d+)\}/);
            if (!m) return <span key={idx}>{p}</span>;
            const i = Number(m[1]); const slot = config.slots[i]; const raw = value?.[i];
            const state = graded ? (slotOk(slot, raw) ? "correct" : "wrong") : undefined;
            return (
              <input key={idx} inputMode="decimal" disabled={graded} value={raw === undefined ? "" : String(raw)}
                onChange={(e) => setSlot(i, e.target.value)} data-state={state}
                className="mech-field" style={{ width: 120, height: 56, fontSize: "1.7rem" }} placeholder="?" />
            );
          })}
        </div>
      );
    }} />
  );
}

/* ── number-line ────────────────────────────────── */
function NumberLineDemo() {
  const config = { from: 0, to: 10, step: 1, target: 7 };
  const score = (c, v) => ({ correct: v != null && v === c.target });
  const round = (v) => Math.round(v * 1e6) / 1e6;
  return (
    <MechHost config={config} score={score} render={({ value, onChange, display }) => {
      const graded = display === Display.Graded;
      const { from, to, target } = config; const ticks = [];
      for (let v = from; v <= to + 1e-9; v += config.step) ticks.push(round(v));
      const W = 1000, PAD = 40, Y = 40;
      const x = (v) => PAD + ((v - from) / (to - from)) * (W - 2 * PAD);
      const pct = (v) => (x(v) / W) * 100;
      const markerColor = graded ? (value === target ? "var(--ok-accent)" : "var(--no-accent)") : "var(--sel-accent)";
      return (
        <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
          <svg viewBox={`0 0 ${W} 120`} style={{ width: "100%", touchAction: "none" }}>
            <line x1={PAD} y1={Y} x2={W - PAD} y2={Y} stroke="var(--line)" strokeWidth={4} />
            {ticks.map((t) => (
              <g key={t}>
                <line x1={x(t)} y1={Y - 12} x2={x(t)} y2={Y + 12} stroke="var(--line)" strokeWidth={4} />
                <text x={x(t)} y={Y + 44} textAnchor="middle" fontSize={28} fontWeight={700} fill="var(--ink)" style={{ fontVariantNumeric: "tabular-nums" }}>{t}</text>
              </g>
            ))}
            {graded && <circle cx={x(target)} cy={Y} r={16} fill="none" stroke="var(--ok-accent)" strokeWidth={4} />}
            {value != null && <circle cx={x(value)} cy={Y} r={13} fill={markerColor} />}
          </svg>
          <div style={{ position: "absolute", inset: 0 }}>
            {ticks.map((t) => (
              <button key={t} type="button" disabled={graded} onClick={() => onChange(t)}
                style={{ position: "absolute", left: `${pct(t)}%`, top: 0, bottom: 0, transform: "translateX(-50%)", width: `max(44px, ${(100 / ticks.length) * 0.9}%)`, background: "transparent", border: "none", cursor: graded ? "default" : "pointer", touchAction: "none" }} />
            ))}
          </div>
        </div>
      );
    }} />
  );
}

/* ── number-grid ────────────────────────────────── */
function NumberGridDemo() {
  const config = { rows: 3, cols: 10, start: 1, rule: { kind: "multiples", of: 3 } };
  const cells = () => Array.from({ length: config.rows * config.cols }, (_, i) => config.start + i);
  const correctSetFn = () => cells().filter((n) => config.rule.of !== 0 && n % config.rule.of === 0);
  const score = (c, v) => { const want = new Set(correctSetFn()); const got = new Set(v ?? []); return { correct: want.size === got.size && [...want].every((n) => got.has(n)) }; };
  return (
    <MechHost config={config} score={score} initial={[]} render={({ value, onChange, display }) => {
      const graded = display === Display.Graded; const selected = new Set(value ?? []); const want = new Set(correctSetFn());
      const toggle = (n) => { const next = new Set(selected); next.has(n) ? next.delete(n) : next.add(n); onChange([...next].sort((a, b) => a - b)); };
      return (
        <div style={{ display: "grid", gap: 6, gridTemplateColumns: `repeat(${config.cols}, minmax(0,1fr))`, width: "100%" }}>
          {cells().map((n) => {
            const isSel = selected.has(n);
            const state = graded ? (want.has(n) ? "correct" : isSel ? "wrong" : undefined) : undefined;
            return (
              <button key={n} type="button" className="mech-tile" onClick={() => toggle(n)} disabled={graded}
                data-selected={!graded && isSel ? "true" : undefined} data-state={state} data-locked={graded ? "true" : undefined}
                style={{ aspectRatio: "1", minHeight: 44, padding: 2, fontSize: "1rem", boxShadow: "0 3px 0 0 var(--line)" }}>{n}</button>
            );
          })}
        </div>
      );
    }} />
  );
}

/* ── clock ──────────────────────────────────────── */
function ClockDemo() {
  const config = { target_hour: 3, target_minute: 0 };
  const score = (c, v) => ({ correct: v != null && v.hour === c.target_hour && v.minute === c.target_minute });
  const C = 120, TAU = Math.PI * 2;
  const at = (f, r) => { const a = f * TAU - Math.PI / 2; return [C + Math.cos(a) * r, C + Math.sin(a) * r]; };
  const pad = (m) => String(m).padStart(2, "0");
  const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
  const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);
  return (
    <MechHost config={config} score={score} canCheck={(v) => v && v.hour != null && v.minute != null} render={({ value, onChange, display, result }) => {
      const graded = display === Display.Graded; const correct = result?.correct ?? false;
      const handColor = graded ? (correct ? "var(--ok-accent)" : "var(--no-accent)") : "var(--ink)";
      const set = (next) => { if (!graded) onChange(next); };
      const hr = value ? at((value.hour % 12) / 12 + value.minute / 720, 55) : null;
      const mn = value ? at(value.minute / 60, 85) : null;
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <svg viewBox="0 0 240 240" style={{ width: "100%", maxWidth: 260, touchAction: "none" }}>
            <circle cx={C} cy={C} r={100} fill="var(--paper)" stroke="var(--ink)" strokeWidth={3} />
            {MINUTES.map((m) => { const [x1, y1] = at(m / 60, 96); const [x2, y2] = at(m / 60, 100); return <line key={m} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line)" strokeWidth={2} />; })}
            {HOURS.map((h) => { const [x, y] = at(h / 12, 80); return <text key={h} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={20} fontWeight={700} fill="var(--ink)">{h}</text>; })}
            {mn && <line x1={C} y1={C} x2={mn[0]} y2={mn[1]} stroke={handColor} strokeWidth={4} strokeLinecap="round" />}
            {hr && <line x1={C} y1={C} x2={hr[0]} y2={hr[1]} stroke={handColor} strokeWidth={6} strokeLinecap="round" />}
            <circle cx={C} cy={C} r={5} fill="var(--ink)" />
            {HOURS.map((h) => { const [x, y] = at(h / 12, 80); return <circle key={`h${h}`} cx={x} cy={y} r={16} fill="transparent" style={{ cursor: graded ? "default" : "pointer" }} onClick={() => set({ hour: h, minute: value?.minute ?? 0 })} />; })}
            {MINUTES.map((m) => { const [x, y] = at(m / 60, 104); return (<g key={`m${m}`}><circle cx={x} cy={y} r={3} fill="var(--ink-mute)" /><circle cx={x} cy={y} r={14} fill="transparent" style={{ cursor: graded ? "default" : "pointer" }} onClick={() => set({ hour: value?.hour ?? 12, minute: m })} /></g>); })}
          </svg>
          {graded && value && <span className="mech-readout" style={{ color: correct ? "var(--ok-accent)" : "var(--no-accent)" }}>{value.hour}:{pad(value.minute)}</span>}
          {graded && <span className="mech-label">нужно {config.target_hour}:{pad(config.target_minute)}</span>}
        </div>
      );
    }} />
  );
}

Object.assign(window, { ChoiceDemo, TextWithSlotsDemo, NumberLineDemo, NumberGridDemo, ClockDemo });
