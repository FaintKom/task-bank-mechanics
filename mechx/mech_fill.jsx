/* mech_fill.jsx — fraction-shade, column-add, table-grid */

/* ── fraction-shade ─────────────────────────────── */
function FractionShadeDemo() {
  const config = { shape: "circle", denominator: 4, target_filled: 3 };
  const score = (c, v) => ({ correct: (v?.length ?? 0) === c.target_filled });
  const SIZE = 240, R = SIZE / 2;
  const sectorPath = (k, n) => {
    const a0 = (k / n) * 2 * Math.PI - Math.PI / 2, a1 = ((k + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const x0 = R + R * Math.cos(a0), y0 = R + R * Math.sin(a0), x1 = R + R * Math.cos(a1), y1 = R + R * Math.sin(a1);
    return `M ${R} ${R} L ${x0} ${y0} A ${R} ${R} 0 ${1 / n > 0.5 ? 1 : 0} 1 ${x1} ${y1} Z`;
  };
  return (
    <MechHost config={config} score={score} initial={[]} render={({ value, onChange, display, result }) => {
      const graded = display === Display.Graded; const correct = result?.correct ?? false;
      const filled = new Set(value ?? []); const parts = Array.from({ length: config.denominator }, (_, k) => k);
      const toggle = (i) => { if (graded) return; const next = filled.has(i) ? [...filled].filter((x) => x !== i) : [...filled, i]; onChange(next.sort((a, b) => a - b)); };
      const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ maxWidth: "100%" }}>
            {parts.map((k) => <path key={k} d={sectorPath(k, config.denominator)} onClick={() => toggle(k)} fill={filled.has(k) ? "var(--sel-accent)" : "var(--paper)"} stroke="var(--line)" strokeWidth={3} style={{ cursor: graded ? "default" : "pointer", touchAction: "none" }} />)}
          </svg>
          {graded && <div style={{ display: "flex", alignItems: "center", gap: 8, color: accent }}>{correct ? <IconCheck s={26} /> : <IconX s={26} />}<span className="mech-readout" style={{ color: accent }}>{filled.size} / {config.denominator}</span><span className="mech-label">нужно {config.target_filled}</span></div>}
        </div>
      );
    }} />
  );
}

/* ── column-add ─────────────────────────────────── */
function ColumnAddDemo() {
  const config = { a: 27, b: 45 };
  const colCount = (c) => Math.max(String(c.a).length, String(c.b).length, String(c.a + c.b).length);
  const score = (c, v) => { const entered = (v ?? []).join("").trim(); return { correct: entered !== "" && Number(entered) === c.a + c.b }; };
  const n = colCount(config);
  return (
    <MechHost config={config} score={score} initial={Array(n).fill("")} canCheck={(v) => (v ?? []).some((d) => d !== "")} render={({ value, onChange, display }) => {
      const graded = display === Display.Graded;
      const aStr = String(config.a), bStr = String(config.b), sumStr = String(config.a + config.b);
      const cols = Array.from({ length: n }, (_, j) => j); const digits = value ?? Array(n).fill("");
      const charAt = (s, j) => { const idx = s.length - 1 - (n - 1 - j); return idx >= 0 ? s[idx] : ""; };
      const set = (j, ch) => { const d = ch.replace(/[^0-9]/g, "").slice(-1); const next = [...(value ?? Array(n).fill(""))]; next[j] = d; onChange(next); };
      const cell = { display: "flex", height: 56, width: 48, alignItems: "center", justifyContent: "center", fontSize: "1.7rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" };
      return (
        <div style={{ display: "inline-flex", flexDirection: "column", fontFamily: "Fraunces, Georgia, serif" }}>
          <div style={{ display: "flex", gap: 4 }}><div style={{ width: 36 }} />{cols.map((j) => <div key={j} style={{ ...cell, color: "var(--ink)" }}>{charAt(aStr, j)}</div>)}</div>
          <div style={{ display: "flex", gap: 4 }}><div style={{ ...cell, width: 36, color: "var(--ink-soft)" }}>+</div>{cols.map((j) => <div key={j} style={{ ...cell, color: "var(--ink)" }}>{charAt(bStr, j)}</div>)}</div>
          <div style={{ height: 3, background: "var(--ink)", borderRadius: 2, margin: "4px 0" }} />
          <div style={{ display: "flex", gap: 4 }}><div style={{ width: 36 }} />{cols.map((j) => {
            const expected = charAt(sumStr, j); const state = graded ? ((digits[j] ?? "") === expected ? "correct" : "wrong") : undefined;
            return <input key={j} inputMode="numeric" maxLength={1} disabled={graded} value={digits[j] ?? ""} onChange={(e) => set(j, e.target.value)} data-state={state} className="mech-field" style={{ width: 48, height: 56, padding: 0, fontSize: "1.7rem" }} />;
          })}</div>
        </div>
      );
    }} />
  );
}

/* ── table-grid ─────────────────────────────────── */
function TableGridDemo() {
  const config = { headers: ["×", "2", "3"], rows: [
    { cells: [{ blank: false, value: "4" }, { blank: false, value: "8" }, { blank: true, value: "12" }] },
    { cells: [{ blank: false, value: "5" }, { blank: true, value: "10" }, { blank: false, value: "15" }] },
  ] };
  const key = (r, c) => `${r}-${c}`;
  const match = (exp, got) => { if (got == null) return false; const a = Number(exp.replace(",", ".")), b = Number(got.replace(",", ".")); if (!Number.isNaN(a) && !Number.isNaN(b) && got.trim() !== "") return a === b; return exp.trim() === got.trim(); };
  const score = (c, v) => { const e = v ?? {}; return { correct: c.rows.every((row, r) => row.cells.every((cell, ci) => !cell.blank || match(cell.value, e[key(r, ci)]))) }; };
  return (
    <MechHost config={config} score={score} initial={{}} canCheck={(v) => { const blanks = []; config.rows.forEach((row, r) => row.cells.forEach((cell, c) => { if (cell.blank) blanks.push(key(r, c)); })); return blanks.every((k) => (v ?? {})[k] && (v ?? {})[k].trim() !== ""); }} render={({ value, onChange, display }) => {
      const graded = display === Display.Graded; const entries = value ?? {};
      const set = (r, c, raw) => onChange({ ...entries, [key(r, c)]: raw });
      const tdBase = { border: "2px solid var(--line)", minWidth: 60, height: 60 };
      return (
        <table style={{ borderCollapse: "collapse", fontFamily: "Fraunces, Georgia, serif" }}>
          {config.headers.length > 0 && <thead><tr>{config.headers.map((h, c) => <th key={c} style={{ ...tdBase, padding: "6px 10px", fontSize: "1.5rem", fontWeight: 700, background: "var(--paper)", color: "var(--ink)" }}>{h}</th>)}</tr></thead>}
          <tbody>
            {config.rows.map((row, r) => (
              <tr key={r}>{row.cells.map((cell, c) => {
                if (!cell.blank) return <td key={c} style={{ ...tdBase, textAlign: "center", fontSize: "1.5rem", fontWeight: 700, color: "var(--ink)" }}>{cell.value}</td>;
                const state = graded ? (match(cell.value, entries[key(r, c)]) ? "correct" : "wrong") : undefined;
                return <td key={c} style={{ ...tdBase, padding: 0 }}><input inputMode="numeric" disabled={graded} value={entries[key(r, c)] ?? ""} onChange={(e) => set(r, c, e.target.value)} data-state={state} className="mech-field" style={{ width: "100%", minWidth: 60, height: 60, padding: 0, boxShadow: "none", borderRadius: 0, border: "none", background: "transparent", fontSize: "1.5rem" }} /></td>;
              })}</tr>
            ))}
          </tbody>
        </table>
      );
    }} />
  );
}

Object.assign(window, { FractionShadeDemo, ColumnAddDemo, TableGridDemo });
