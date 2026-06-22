/* mech_move.jsx — drag-drop-set, sequence-track, match-columns (tap-режим + прямые линии) */
const { useState: useStateM, useRef: useRefM, useLayoutEffect: useLayoutEffectM } = React;

/* ── drag-drop-set (tap-to-place — реальный режим) ── */
function DragDropSetDemo() {
  const config = { zones: ["Чётные", "Нечётные"], items: [{ label: "2", zone: "Чётные" }, { label: "3", zone: "Нечётные" }, { label: "4", zone: "Чётные" }, { label: "7", zone: "Нечётные" }] };
  const score = (c, v) => ({ correct: c.items.every((it, i) => (v ?? {})[i] === it.zone) });
  return (
    <MechHost config={config} score={score} initial={{}} canCheck={(v) => v && Object.keys(v).length === config.items.length} render={({ value, onChange, display }) => {
      const placed = value ?? {}; const graded = display === Display.Graded;
      const [selected, setSelected] = useStateM(null);
      const place = (itemIdx, zoneLabel) => { onChange({ ...placed, [itemIdx]: zoneLabel }); setSelected(null); };
      const tapItem = (i) => { if (graded) return; setSelected((s) => (s === i ? null : i)); };
      const tapZone = (zi) => { if (graded || selected === null) return; place(selected, config.zones[zi]); };
      const tray = config.items.map((it, i) => ({ it, i })).filter(({ i }) => placed[i] === undefined);
      const renderItem = (i) => {
        const it = config.items[i]; const isSel = selected === i;
        const isCor = graded && placed[i] === it.zone; const isWrong = graded && placed[i] !== undefined && placed[i] !== it.zone;
        return (
          <button key={i} type="button" className="mech-item" onClick={() => tapItem(i)} disabled={graded}
            data-selected={!graded && isSel ? "true" : undefined} data-state={isCor ? "correct" : isWrong ? "wrong" : undefined}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span>{it.label}</span>{isCor && <IconCheck s={18} />}{isWrong && <IconX s={18} />}
          </button>
        );
      };
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 420 }}>
          {!graded && <div className="mech-label" style={{ textAlign: "center" }}>{selected === null ? "Нажми карточку, потом группу" : "Теперь нажми нужную группу"}</div>}
          <div className="mech-tray">{tray.length === 0 ? <span className="mech-label">—</span> : tray.map(({ i }) => renderItem(i))}</div>
          <div className="mech-zones">
            {config.zones.map((zone, zi) => {
              const here = config.items.map((_, i) => i).filter((i) => placed[i] === zone);
              return (
                <div key={zi} onClick={() => tapZone(zi)} className="mech-zone" data-dragover={!graded && selected !== null ? "true" : undefined} style={{ cursor: graded ? "default" : "pointer" }}>
                  <span className="mech-zone-label">{zone}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", alignItems: "center", minHeight: 56 }}>{here.map((i) => renderItem(i))}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }} />
  );
}

/* ── sequence-track ─────────────────────────────── */
function SequenceTrackDemo() {
  const config = { items: ["1", "2", "3", "4"] };
  const score = (c, v) => ({ correct: JSON.stringify(v) === JSON.stringify(c.items) });
  const start = (items) => { const rev = [...items].reverse(); return items.length > 1 && JSON.stringify(rev) !== JSON.stringify(items) ? rev : (items.length > 1 ? [...items.slice(1), items[0]] : [...items]); };
  return (
    <MechHost config={config} score={score} initial={start(config.items)} canCheck={() => true} render={({ value, onChange, display }) => {
      const order = value ?? start(config.items); const graded = display === Display.Graded;
      const [selected, setSelected] = useStateM(null);
      const tap = (idx) => {
        if (graded) return;
        if (selected === null) { setSelected(idx); return; }
        if (selected === idx) { setSelected(null); return; }
        const next = [...order]; [next[selected], next[idx]] = [next[idx], next[selected]]; setSelected(null); onChange(next);
      };
      return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, width: "100%" }}>
          {order.map((label, idx) => {
            const isSel = !graded && selected === idx;
            const state = graded ? (label === config.items[idx] ? "correct" : "wrong") : undefined;
            return <button key={idx} type="button" className="mech-tile" onClick={() => tap(idx)} disabled={graded}
              data-selected={isSel ? "true" : undefined} data-state={state} data-locked={graded ? "true" : undefined}
              style={{ flex: 1, minWidth: 64, transform: isSel ? "translateY(-6px)" : undefined }}>{label}</button>;
          })}
        </div>
      );
    }} />
  );
}

/* ── match-columns (tap-to-connect, прямые линии) ── */
function MatchColumnsDemo() {
  const config = { pairs: [{ left: "2 × 3", right: "6" }, { left: "1 × 6", right: "6" }, { left: "2 × 5", right: "10" }, { left: "5 × 2", right: "10" }] };
  const rightOptions = (c) => { const seen = new Set(); const out = []; for (const p of c.pairs) if (!seen.has(p.right)) { seen.add(p.right); out.push(p.right); } return out; };
  const score = (c, v) => { const opts = rightOptions(c); const m = v ?? {}; return { correct: c.pairs.every((p, i) => opts[m[i]] === p.right) }; };
  const shuffledOrder = (n) => { const shift = n >= 2 ? Math.max(1, Math.floor(n / 2)) : 0; return Array.from({ length: n }, (_, i) => (i + shift) % n); };
  return (
    <MechHost config={config} score={score} initial={{}} canCheck={(v) => v && Object.keys(v).length === config.pairs.length} render={({ value, onChange, display, result }) => {
      const matches = value ?? {}; const graded = display === Display.Graded;
      const opts = rightOptions(config); const order = shuffledOrder(opts.length);
      const [active, setActive] = useStateM(null);
      const rootRef = useRefM(null); const leftRefs = useRefM(new Map()); const rightRefs = useRefM(new Map());
      const [box, setBox] = useStateM({ w: 0, h: 0 }); const [lines, setLines] = useStateM([]);
      const leftCorrect = (i) => opts[matches[i]] === config.pairs[i]?.right;
      const offsetWithin = (el, root) => { let x = 0, y = 0; for (let n = el; n && n !== root; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; } return { x, y }; };
      const measure = () => {
        const root = rootRef.current; if (!root) return; const w = root.offsetWidth, h = root.offsetHeight; if (!w || !h) return; setBox({ w, h });
        const next = [];
        for (const [l, r] of Object.entries(matches)) { const lt = leftRefs.current.get(Number(l)); const rt = rightRefs.current.get(Number(r)); if (!lt || !rt) continue; const a = offsetWithin(lt, root); const b = offsetWithin(rt, root); next.push({ left: Number(l), x1: a.x + lt.offsetWidth, y1: a.y + lt.offsetHeight / 2, x2: b.x, y2: b.y + rt.offsetHeight / 2 }); }
        setLines(next);
      };
      useLayoutEffectM(measure, [JSON.stringify(matches), graded]);
      const lineStroke = (i) => graded ? (leftCorrect(i) ? "var(--ok-accent)" : "var(--no-accent)") : "var(--sel-accent)";
      const tapTile = (side, index) => {
        if (graded) return;
        if (!active) { setActive({ side, index }); return; }
        if (active.side === side) { setActive(active.index === index ? null : { side, index }); return; }
        const [li, ri] = side === "left" ? [index, active.index] : [active.index, index];
        onChange({ ...matches, [li]: ri }); setActive(null);
      };
      const rightToLefts = {}; for (const [l, r] of Object.entries(matches)) (rightToLefts[Number(r)] ??= []).push(Number(l));
      return (
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div ref={rootRef} className="mech-match" style={{ position: "relative" }}>
            {(lines.length > 0) && (
              <svg width={box.w} height={box.h} viewBox={`0 0 ${box.w} ${box.h}`} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "visible" }}>
                {lines.map((ln) => <line key={ln.left} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke={lineStroke(ln.left)} strokeWidth={4} strokeLinecap="round" />)}
              </svg>
            )}
            <div className="mech-col">
              {config.pairs.map((pair, i) => {
                const isActive = active?.side === "left" && active.index === i; const matched = matches[i] !== undefined;
                const st = graded && matched ? (leftCorrect(i) ? "correct" : "wrong") : null;
                return <button key={i} type="button" ref={(el) => { if (el) leftRefs.current.set(i, el); }} className="mech-tile" onClick={() => tapTile("left", i)} disabled={graded}
                  data-selected={!graded && (isActive || matched) ? "true" : undefined} data-state={st ?? undefined} data-locked={graded ? "true" : undefined}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}><span>{pair.left}</span>{st === "correct" && <IconCheck s={18} />}{st === "wrong" && <IconX s={18} />}</button>;
              })}
            </div>
            <div className="mech-col">
              {order.map((ri) => {
                const label = opts[ri]; if (label === undefined) return null;
                const linked = rightToLefts[ri] ?? []; const isLinked = linked.length > 0;
                const isActive = active?.side === "right" && active.index === ri;
                const st = graded && isLinked ? (linked.every(leftCorrect) ? "correct" : "wrong") : null;
                return <button key={ri} type="button" ref={(el) => { if (el) rightRefs.current.set(ri, el); }} className="mech-tile" onClick={() => tapTile("right", ri)} disabled={graded}
                  data-selected={!graded && (isActive || isLinked) ? "true" : undefined} data-state={st ?? undefined} data-locked={graded ? "true" : undefined}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}><span>{label}</span>{st === "correct" && <IconCheck s={18} />}{st === "wrong" && <IconX s={18} />}</button>;
              })}
            </div>
          </div>
        </div>
      );
    }} />
  );
}

Object.assign(window, { DragDropSetDemo, SequenceTrackDemo, MatchColumnsDemo });
