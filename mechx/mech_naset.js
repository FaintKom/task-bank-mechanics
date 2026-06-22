/* mech_naset.jsx — base10-blocks, balance-scale, coins, slider-control */

function PlusMinus({
  onMinus,
  onPlus,
  disabled
}) {
  const btn = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    padding: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-tile",
    onClick: onMinus,
    disabled: disabled,
    style: btn
  }, "\u2212"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mech-tile",
    onClick: onPlus,
    disabled: disabled,
    style: btn
  }, "+"));
}

/* ── base10-blocks ──────────────────────────────── */
function Base10BlocksDemo() {
  const config = {
    target: 234
  };
  const score = (c, v) => {
    if (!v) return {
      correct: false
    };
    return {
      correct: v.hundreds * 100 + v.tens * 10 + v.ones === c.target
    };
  };
  const MAX = 15;
  const GLYPH = {
    hundreds: {
      w: 26,
      h: 26
    },
    tens: {
      w: 8,
      h: 26
    },
    ones: {
      w: 11,
      h: 11
    }
  };
  const COLS = [{
    place: "hundreds",
    label: "Сотни"
  }, {
    place: "tens",
    label: "Десятки"
  }, {
    place: "ones",
    label: "Единицы"
  }];
  return /*#__PURE__*/React.createElement(MechHost, {
    config: config,
    score: score,
    initial: {
      hundreds: 0,
      tens: 0,
      ones: 0
    },
    canCheck: v => v && (v.hundreds || v.tens || v.ones),
    render: ({
      value,
      onChange,
      display,
      result
    }) => {
      const v = value ?? {
        hundreds: 0,
        tens: 0,
        ones: 0
      };
      const graded = display === Display.Graded;
      const correct = result?.correct ?? false;
      const total = v.hundreds * 100 + v.tens * 10 + v.ones;
      const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
      const adjust = (place, d) => {
        if (graded) return;
        onChange({
          ...v,
          [place]: Math.min(MAX, Math.max(0, v[place] + d))
        });
      };
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 16
        }
      }, COLS.map(({
        place,
        label
      }) => {
        const g = GLYPH[place];
        return /*#__PURE__*/React.createElement("div", {
          key: place,
          style: {
            display: "flex",
            width: 110,
            flexDirection: "column",
            alignItems: "center",
            gap: 8
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: "flex",
            minHeight: 110,
            flexDirection: "column-reverse",
            flexWrap: "wrap",
            alignContent: "center",
            justifyContent: "flex-start",
            gap: 4
          }
        }, Array.from({
          length: v[place]
        }, (_, i) => /*#__PURE__*/React.createElement("span", {
          key: i,
          style: {
            width: g.w,
            height: g.h,
            background: "var(--sel-accent)",
            border: "1px solid var(--paper)",
            borderRadius: 3
          }
        }))), /*#__PURE__*/React.createElement("span", {
          className: "mech-readout",
          style: {
            fontSize: "1.6rem"
          }
        }, v[place]), /*#__PURE__*/React.createElement("span", {
          className: "mech-label"
        }, label), /*#__PURE__*/React.createElement(PlusMinus, {
          onMinus: () => adjust(place, -1),
          onPlus: () => adjust(place, 1),
          disabled: graded
        }));
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "baseline",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, "\u041F\u043E\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C:"), /*#__PURE__*/React.createElement("span", {
        className: "mech-readout",
        style: graded ? {
          color: accent
        } : undefined
      }, total), graded && /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, "\u043D\u0443\u0436\u043D\u043E ", config.target)));
    }
  });
}

/* ── balance-scale ──────────────────────────────── */
function BalanceScaleDemo() {
  const config = {
    left_grams: 8,
    weights: [1, 2, 5]
  };
  const rightTotal = (c, v) => c.weights.reduce((s, w, i) => s + w * (v?.[i] ?? 0), 0);
  const score = (c, v) => ({
    correct: rightTotal(c, v) === c.left_grams
  });
  const PX = 160,
    PY = 110,
    ARM = 100,
    MAXT = 14,
    MAX_EACH = 20;
  const rot = (x, y, deg) => {
    const a = deg * Math.PI / 180,
      dx = x - PX,
      dy = y - PY;
    return [PX + dx * Math.cos(a) - dy * Math.sin(a), PY + dx * Math.sin(a) + dy * Math.cos(a)];
  };
  return /*#__PURE__*/React.createElement(MechHost, {
    config: config,
    score: score,
    initial: config.weights.map(() => 0),
    canCheck: v => (v ?? []).some(n => n > 0),
    render: ({
      value,
      onChange,
      display,
      result
    }) => {
      const graded = display === Display.Graded;
      const correct = result?.correct ?? false;
      const right = rightTotal(config, value ?? null);
      const tilt = Math.max(-MAXT, Math.min(MAXT, (right - config.left_grams) * 3));
      const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
      const adjust = (i, d) => {
        if (graded) return;
        const next = config.weights.map((_, k) => value?.[k] ?? 0);
        next[i] = Math.max(0, Math.min(MAX_EACH, next[i] + d));
        onChange(next);
      };
      const [lx, ly] = rot(PX - ARM, PY, tilt);
      const [rx, ry] = rot(PX + ARM, PY, tilt);
      const STR = 22;
      const pans = [{
        x: lx,
        y: ly,
        label: `${config.left_grams} г`,
        fill: "var(--sel-bg)"
      }, {
        x: rx,
        y: ry,
        label: `${right} г`,
        fill: "var(--paper)"
      }];
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          width: "100%",
          maxWidth: 420
        }
      }, /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 320 210",
        style: {
          width: "100%",
          touchAction: "none"
        }
      }, /*#__PURE__*/React.createElement("line", {
        x1: PX,
        y1: PY,
        x2: PX,
        y2: 190,
        stroke: "var(--ink)",
        strokeWidth: 6
      }), /*#__PURE__*/React.createElement("polygon", {
        points: `${PX - 26},190 ${PX + 26},190 ${PX},${PY}`,
        fill: "var(--line)",
        stroke: "var(--ink)",
        strokeWidth: 2
      }), /*#__PURE__*/React.createElement("line", {
        x1: lx,
        y1: ly,
        x2: rx,
        y2: ry,
        stroke: graded ? accent : "var(--ink)",
        strokeWidth: 6,
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: PX,
        cy: PY,
        r: 6,
        fill: "var(--ink)"
      }), pans.map((p, i) => /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("line", {
        x1: p.x,
        y1: p.y,
        x2: p.x,
        y2: p.y + STR,
        stroke: "var(--ink)",
        strokeWidth: 1.5
      }), /*#__PURE__*/React.createElement("path", {
        d: `M ${p.x - 30} ${p.y + STR} A 30 16 0 0 0 ${p.x + 30} ${p.y + STR} Z`,
        fill: p.fill,
        stroke: "var(--ink)",
        strokeWidth: 2
      }), /*#__PURE__*/React.createElement("text", {
        x: p.x,
        y: p.y + STR + 13,
        textAnchor: "middle",
        fontSize: 13,
        fontWeight: 700,
        fill: "var(--ink)"
      }, p.label)))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 12
        }
      }, config.weights.map((w, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, w, " \u0433", value?.[i] ? ` ×${value[i]}` : ""), /*#__PURE__*/React.createElement(PlusMinus, {
        onMinus: () => adjust(i, -1),
        onPlus: () => adjust(i, 1),
        disabled: graded
      })))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "baseline",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, "\u0421\u043F\u0440\u0430\u0432\u0430:"), /*#__PURE__*/React.createElement("span", {
        className: "mech-readout",
        style: graded ? {
          color: accent
        } : undefined
      }, right, " \u0433"), graded && /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, "\u043D\u0443\u0436\u043D\u043E ", config.left_grams, " \u0433")));
    }
  });
}

/* ── coins ──────────────────────────────────────── */
function CoinsDemo() {
  const config = {
    target: 18,
    coins: [1, 2, 5, 10],
    unit: "₽"
  };
  const total = (c, v) => c.coins.reduce((s, x, i) => s + x * (v?.[i] ?? 0), 0);
  const score = (c, v) => ({
    correct: total(c, v) === c.target
  });
  const MAX_EACH = 20;
  return /*#__PURE__*/React.createElement(MechHost, {
    config: config,
    score: score,
    initial: config.coins.map(() => 0),
    canCheck: v => (v ?? []).some(n => n > 0),
    render: ({
      value,
      onChange,
      display,
      result
    }) => {
      const graded = display === Display.Graded;
      const correct = result?.correct ?? false;
      const t = total(config, value ?? null);
      const accent = correct ? "var(--ok-accent)" : "var(--no-accent)";
      const adjust = (i, d) => {
        if (graded) return;
        const next = config.coins.map((_, k) => value?.[k] ?? 0);
        next[i] = Math.max(0, Math.min(MAX_EACH, next[i] + d));
        onChange(next);
      };
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16
        }
      }, config.coins.map((c, i) => {
        const nn = value?.[i] ?? 0;
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "var(--canvas-bg)",
            border: "3px solid var(--ink-soft)",
            color: "var(--ink)",
            fontWeight: 700,
            fontFamily: "Fraunces, Georgia, serif"
          }
        }, c), /*#__PURE__*/React.createElement("span", {
          className: "mech-label"
        }, nn ? `×${nn}` : "—"), /*#__PURE__*/React.createElement(PlusMinus, {
          onMinus: () => adjust(i, -1),
          onPlus: () => adjust(i, 1),
          disabled: graded
        }));
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "baseline",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, "\u0421\u0443\u043C\u043C\u0430:"), /*#__PURE__*/React.createElement("span", {
        className: "mech-readout",
        style: graded ? {
          color: accent
        } : undefined
      }, t, " ", config.unit), graded && /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, "\u043D\u0443\u0436\u043D\u043E ", config.target, " ", config.unit)));
    }
  });
}

/* ── slider-control ─────────────────────────────── */
function SliderControlDemo() {
  const config = {
    min: 0,
    max: 10,
    step: 1,
    target: 7
  };
  const score = (c, v) => ({
    correct: v != null && Math.abs(v - c.target) <= (c.tolerance ?? 0)
  });
  return /*#__PURE__*/React.createElement(MechHost, {
    config: config,
    score: score,
    initial: config.min,
    canCheck: () => true,
    render: ({
      value,
      onChange,
      display,
      result
    }) => {
      const graded = display === Display.Graded;
      const correct = result?.correct ?? false;
      const current = value ?? config.min;
      return /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          width: "100%",
          maxWidth: 380
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "mech-readout",
        style: graded ? {
          color: correct ? "var(--ok-accent)" : "var(--no-accent)"
        } : undefined
      }, current, config.unit ? ` ${config.unit}` : ""), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%"
        }
      }, /*#__PURE__*/React.createElement("input", {
        type: "range",
        min: config.min,
        max: config.max,
        step: config.step ?? 1,
        value: current,
        disabled: graded,
        onChange: e => onChange(Number(e.target.value)),
        className: "mech-range"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between"
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, config.min), /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, config.max))), graded && /*#__PURE__*/React.createElement("span", {
        className: "mech-label"
      }, "\u043D\u0443\u0436\u043D\u043E ", config.target));
    }
  });
}
Object.assign(window, {
  Base10BlocksDemo,
  BalanceScaleDemo,
  CoinsDemo,
  SliderControlDemo
});