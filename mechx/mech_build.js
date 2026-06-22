/* mech_build.jsx — bar-chart, ruler, angle, array-grid, coordinate-grid */

/* ── bar-chart ──────────────────────────────────── */
function BarChartDemo() {
  const config = {
    max: 5,
    bars: [{
      label: "Пн",
      target: 3
    }, {
      label: "Вт",
      target: 5
    }, {
      label: "Ср",
      target: 2
    }]
  };
  const score = (c, v) => ({
    correct: c.bars.every((b, i) => (v?.[i] ?? 0) === b.target)
  });
  return /*#__PURE__*/React.createElement(MechHost, {
    config: config,
    score: score,
    initial: config.bars.map(() => 0),
    render: ({
      value,
      onChange,
      display,
      result
    }) => {
      const graded = display === Display.Graded;
      const correct = result?.correct ?? false;
      const heights = config.bars.map((_, i) => value?.[i] ?? 0);
      const levels = Array.from({
        length: config.max
      }, (_, k) => config.max - k);
      const setH = (i, L) => {
        const next = [...heights];
        next[i] = L;
        onChange(next);
      };
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "stretch",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "mech-label",
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "4px 0",
          fontVariantNumeric: "tabular-nums"
        }
      }, levels.map(L => /*#__PURE__*/React.createElement("span", {
        key: L
      }, L)), /*#__PURE__*/React.createElement("span", null, "0")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          borderLeft: "2px solid var(--line)",
          borderBottom: "2px solid var(--line)"
        }
      }, config.bars.map((bar, i) => {
        const h = heights[i];
        const barOk = h === bar.target;
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: "flex",
            flexDirection: "column"
          }
        }, levels.map(L => {
          const filled = L <= h;
          const state = graded && filled ? barOk ? "correct" : "wrong" : undefined;
          return /*#__PURE__*/React.createElement("button", {
            key: L,
            type: "button",
            className: "mech-tile",
            onClick: () => setH(i, L),
            disabled: graded,
            "data-state": state,
            "data-locked": graded ? "true" : undefined,
            style: {
              borderRadius: 0,
              padding: 0,
              minHeight: 30,
              width: 50,
              boxShadow: "none",
              ...(state ? {} : {
                background: filled ? "var(--sel-accent)" : "var(--paper)",
                borderColor: "var(--line)"
              })
            }
          });
        })), /*#__PURE__*/React.createElement("span", {
          className: "mech-label"
        }, bar.label));
      })));
    }
  });
}

/* ── ruler ──────────────────────────────────────── */
function RulerDemo() {
  const config = {
    length: 6,
    max: 12,
    unit: "см"
  };
  const score = (c, v) => ({
    correct: v != null && v === c.length
  });
  return /*#__PURE__*/React.createElement(MechHost, {
    config: config,
    score: score,
    render: ({
      value,
      onChange,
      display,
      result
    }) => {
      const graded = display === Display.Graded;
      const correct = result?.correct ?? false;
      const {
        max,
        unit
      } = config;
      const W = 1000,
        PAD = 30,
        RY = 70;
      const x = n => PAD + n / max * (W - 2 * PAD);
      const pct = n => x(n) / W * 100;
      const ticks = Array.from({
        length: max + 1
      }, (_, i) => i);
      const objColor = graded ? correct ? "var(--ok-accent)" : "var(--no-accent)" : "var(--sel-accent)";
      return /*#__PURE__*/React.createElement("div", {
        style: {
          width: "100%",
          maxWidth: 440
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          width: "100%"
        }
      }, /*#__PURE__*/React.createElement("svg", {
        viewBox: `0 0 ${W} 150`,
        style: {
          width: "100%",
          touchAction: "none"
        }
      }, /*#__PURE__*/React.createElement("rect", {
        x: x(0),
        y: 28,
        width: x(config.length) - x(0),
        height: 28,
        rx: 4,
        fill: objColor,
        opacity: 0.5
      }), /*#__PURE__*/React.createElement("rect", {
        x: PAD,
        y: RY,
        width: W - 2 * PAD,
        height: 56,
        rx: 6,
        fill: "var(--paper)",
        stroke: "var(--ink)",
        strokeWidth: 2
      }), ticks.map(n => /*#__PURE__*/React.createElement("g", {
        key: n
      }, /*#__PURE__*/React.createElement("line", {
        x1: x(n),
        y1: RY,
        x2: x(n),
        y2: RY + (n % 5 === 0 ? 22 : 13),
        stroke: "var(--ink)",
        strokeWidth: 2
      }), n % 5 === 0 && /*#__PURE__*/React.createElement("text", {
        x: x(n),
        y: RY + 44,
        textAnchor: "middle",
        fontSize: 18,
        fontWeight: 700,
        fill: "var(--ink)"
      }, n))), unit && /*#__PURE__*/React.createElement("text", {
        x: W - PAD,
        y: 24,
        textAnchor: "end",
        fontSize: 16,
        fontWeight: 600,
        fill: "var(--ink-soft)"
      }, unit), graded && /*#__PURE__*/React.createElement("line", {
        x1: x(config.length),
        y1: 18,
        x2: x(config.length),
        y2: RY + 30,
        stroke: "var(--ok-accent)",
        strokeWidth: 3
      }), value != null && /*#__PURE__*/React.createElement("line", {
        x1: x(value),
        y1: 18,
        x2: x(value),
        y2: RY + 30,
        stroke: objColor,
        strokeWidth: 3
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          inset: 0
        }
      }, ticks.map(n => /*#__PURE__*/React.createElement("button", {
        key: n,
        type: "button",
        disabled: graded,
        onClick: () => onChange(n),
        style: {
          position: "absolute",
          left: `${pct(n)}%`,
          top: 0,
          bottom: 0,
          transform: "translateX(-50%)",
          width: `max(40px, ${100 / ticks.length * 0.9}%)`,
          background: "transparent",
          border: "none",
          cursor: graded ? "default" : "pointer",
          touchAction: "none"
        }
      })))), value != null && /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "center",
          marginTop: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "mech-readout",
        style: graded ? {
          color: objColor
        } : undefined
      }, value, unit ? ` ${unit}` : "")));
    }
  });
}

/* ── angle ──────────────────────────────────────── */
function AngleDemo() {
  const config = {
    target_deg: 60,
    step: 15
  };
  const score = (c, v) => ({
    correct: v != null && v === c.target_deg
  });
  const CX = 160,
    CY = 160,
    R = 130,
    RAD = Math.PI / 180;
  const at = (deg, r) => [CX + r * Math.cos(deg * RAD), CY - r * Math.sin(deg * RAD)];
  return /*#__PURE__*/React.createElement(MechHost, {
    config: config,
    score: score,
    render: ({
      value,
      onChange,
      display,
      result
    }) => {
      const graded = display === Display.Graded;
      const correct = result?.correct ?? false;
      const setColor = graded ? correct ? "var(--ok-accent)" : "var(--no-accent)" : "var(--sel-accent)";
      let step = config.step > 0 ? config.step : 15;
      if (180 / step > 60) step = 15;
      const marks = [];
      for (let d = 0; d <= 180; d += step) marks.push(d);
      const [bx, by] = at(0, R);
      const set = value != null ? at(value, R) : null;
      const tgt = at(config.target_deg, R);
      const labelled = d => step % 30 === 0 ? d % 30 === 0 : d / step % 2 === 0;
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 320 190",
        style: {
          width: "100%",
          maxWidth: 420,
          touchAction: "none"
        }
      }, /*#__PURE__*/React.createElement("path", {
        d: `M ${at(0, R)[0]} ${at(0, R)[1]} A ${R} ${R} 0 0 0 ${at(180, R)[0]} ${at(180, R)[1]}`,
        fill: "none",
        stroke: "var(--ink)",
        strokeWidth: 3
      }), marks.map(d => {
        const [x1, y1] = at(d, R - 8);
        const [x2, y2] = at(d, R);
        const [lx, ly] = at(d, R - 26);
        return /*#__PURE__*/React.createElement("g", {
          key: d
        }, /*#__PURE__*/React.createElement("line", {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          stroke: "var(--line)",
          strokeWidth: 2
        }), labelled(d) && /*#__PURE__*/React.createElement("text", {
          x: lx,
          y: ly,
          textAnchor: "middle",
          dominantBaseline: "central",
          fontSize: 12,
          fontWeight: 700,
          fill: "var(--ink)"
        }, d));
      }), graded && /*#__PURE__*/React.createElement("line", {
        x1: CX,
        y1: CY,
        x2: tgt[0],
        y2: tgt[1],
        stroke: "var(--ok-accent)",
        strokeWidth: 3,
        strokeDasharray: "6 5"
      }), /*#__PURE__*/React.createElement("line", {
        x1: CX,
        y1: CY,
        x2: bx,
        y2: by,
        stroke: "var(--ink)",
        strokeWidth: 4,
        strokeLinecap: "round"
      }), set && /*#__PURE__*/React.createElement("line", {
        x1: CX,
        y1: CY,
        x2: set[0],
        y2: set[1],
        stroke: setColor,
        strokeWidth: 5,
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: CX,
        cy: CY,
        r: 5,
        fill: "var(--ink)"
      }), marks.map(d => {
        const [x, y] = at(d, R + 8);
        return /*#__PURE__*/React.createElement("g", {
          key: `t${d}`
        }, /*#__PURE__*/React.createElement("circle", {
          cx: x,
          cy: y,
          r: 3,
          fill: "var(--ink-mute)"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: x,
          cy: y,
          r: 14,
          fill: "transparent",
          style: {
            cursor: graded ? "default" : "pointer"
          },
          onClick: () => !graded && onChange(d)
        }));
      })), graded && value != null && /*#__PURE__*/React.createElement("span", {
        className: "mech-readout",
        style: {
          color: correct ? "var(--ok-accent)" : "var(--no-accent)"
        }
      }, value, "\xB0"), graded && /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, "\u043D\u0443\u0436\u043D\u043E ", config.target_deg, "\xB0"));
    }
  });
}

/* ── array-grid ─────────────────────────────────── */
function ArrayGridDemo() {
  const config = {
    max_rows: 5,
    max_cols: 5,
    target_rows: 3,
    target_cols: 4
  };
  const score = (c, v) => ({
    correct: v != null && v.rows === c.target_rows && v.cols === c.target_cols
  });
  return /*#__PURE__*/React.createElement(MechHost, {
    config: config,
    score: score,
    render: ({
      value,
      onChange,
      display,
      result
    }) => {
      const graded = display === Display.Graded;
      const correct = result?.correct ?? false;
      const rows = Array.from({
        length: config.max_rows
      }, (_, i) => i + 1);
      const cols = Array.from({
        length: config.max_cols
      }, (_, i) => i + 1);
      const inArr = (r, c) => value != null && r <= value.rows && c <= value.cols;
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "grid",
          gap: 6,
          gridTemplateColumns: `repeat(${config.max_cols}, minmax(0,1fr))`
        }
      }, rows.map(r => cols.map(c => {
        const on = inArr(r, c);
        return /*#__PURE__*/React.createElement("button", {
          key: `${r}-${c}`,
          type: "button",
          className: "mech-tile",
          onClick: () => onChange({
            rows: r,
            cols: c
          }),
          disabled: graded,
          "data-selected": !graded && on ? "true" : undefined,
          "data-state": graded && on ? correct ? "correct" : "wrong" : undefined,
          "data-locked": graded ? "true" : undefined,
          style: {
            aspectRatio: "1",
            minHeight: 46,
            padding: 0,
            width: 46
          }
        });
      }))), value != null && /*#__PURE__*/React.createElement("div", {
        className: "mech-readout",
        style: {
          color: graded ? correct ? "var(--ok-accent)" : "var(--no-accent)" : undefined
        }
      }, value.rows, " \xD7 ", value.cols, " = ", value.rows * value.cols));
    }
  });
}

/* ── coordinate-grid ────────────────────────────── */
function CoordinateGridDemo() {
  const config = {
    x_max: 6,
    y_max: 6,
    target_x: 3,
    target_y: 4
  };
  const score = (c, v) => ({
    correct: v != null && v.x === c.target_x && v.y === c.target_y
  });
  const CELL = 40,
    PAD_L = 34,
    PAD_B = 34,
    PAD_T = 16,
    PAD_R = 16;
  return /*#__PURE__*/React.createElement(MechHost, {
    config: config,
    score: score,
    render: ({
      value,
      onChange,
      display,
      result
    }) => {
      const graded = display === Display.Graded;
      const correct = result?.correct ?? false;
      const {
        x_max,
        y_max,
        target_x,
        target_y
      } = config;
      const W = PAD_L + x_max * CELL + PAD_R,
        H = PAD_T + y_max * CELL + PAD_B;
      const sx = x => PAD_L + x * CELL;
      const sy = y => PAD_T + (y_max - y) * CELL;
      const xs = Array.from({
        length: x_max + 1
      }, (_, i) => i);
      const ys = Array.from({
        length: y_max + 1
      }, (_, i) => i);
      const mc = graded ? correct ? "var(--ok-accent)" : "var(--no-accent)" : "var(--sel-accent)";
      return /*#__PURE__*/React.createElement("svg", {
        viewBox: `0 0 ${W} ${H}`,
        style: {
          width: "100%",
          maxWidth: 360,
          touchAction: "none"
        }
      }, xs.map(x => /*#__PURE__*/React.createElement("line", {
        key: `vx${x}`,
        x1: sx(x),
        y1: sy(y_max),
        x2: sx(x),
        y2: sy(0),
        stroke: "var(--line)",
        strokeWidth: 1.5
      })), ys.map(y => /*#__PURE__*/React.createElement("line", {
        key: `hy${y}`,
        x1: sx(0),
        y1: sy(y),
        x2: sx(x_max),
        y2: sy(y),
        stroke: "var(--line)",
        strokeWidth: 1.5
      })), /*#__PURE__*/React.createElement("line", {
        x1: sx(0),
        y1: sy(0),
        x2: sx(x_max),
        y2: sy(0),
        stroke: "var(--ink)",
        strokeWidth: 3
      }), /*#__PURE__*/React.createElement("line", {
        x1: sx(0),
        y1: sy(0),
        x2: sx(0),
        y2: sy(y_max),
        stroke: "var(--ink)",
        strokeWidth: 3
      }), xs.map(x => /*#__PURE__*/React.createElement("text", {
        key: `xl${x}`,
        x: sx(x),
        y: sy(0) + 22,
        textAnchor: "middle",
        fontSize: 15,
        fontWeight: 700,
        fill: "var(--ink-soft)"
      }, x)), ys.filter(y => y > 0).map(y => /*#__PURE__*/React.createElement("text", {
        key: `yl${y}`,
        x: sx(0) - 12,
        y: sy(y) + 5,
        textAnchor: "middle",
        fontSize: 15,
        fontWeight: 700,
        fill: "var(--ink-soft)"
      }, y)), graded && /*#__PURE__*/React.createElement("circle", {
        cx: sx(target_x),
        cy: sy(target_y),
        r: 11,
        fill: "none",
        stroke: "var(--ok-accent)",
        strokeWidth: 3
      }), value != null && /*#__PURE__*/React.createElement("circle", {
        cx: sx(value.x),
        cy: sy(value.y),
        r: 9,
        fill: mc
      }), xs.map(x => ys.map(y => /*#__PURE__*/React.createElement("g", {
        key: `n${x}-${y}`
      }, /*#__PURE__*/React.createElement("circle", {
        cx: sx(x),
        cy: sy(y),
        r: 2.5,
        fill: "var(--line)"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: sx(x),
        cy: sy(y),
        r: CELL * 0.42,
        fill: "transparent",
        onClick: () => !graded && onChange({
          x,
          y
        }),
        style: {
          cursor: graded ? "default" : "pointer",
          touchAction: "none"
        }
      })))));
    }
  });
}
Object.assign(window, {
  BarChartDemo,
  RulerDemo,
  AngleDemo,
  ArrayGridDemo,
  CoordinateGridDemo
});