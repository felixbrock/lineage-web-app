function p(e, t) {
  return e - t;
}

function v(e) {
  return e.reduce(function (ee, t) {
    return ee.indexOf(t) < 0 && ee.push(t), ee;
  }, []);
}

function r(e) {
  return e.reduce(function (eee, t) {
    return eee.concat(Array.isArray(t) ? r(t) : t);
  }, []);
}

function o(e, t, n) {
  for (let rr = [], oo = e; oo <= t; oo += n) rr.push(oo);
  return r;
}
const a = /(^|[,-/])\*($|[,-/])/g;

function y(e, t) {
  const n = '$1' + t + '$2';
  return e.replace(a, n).replace(a, n);
}

function g(e, t) {
  const n = e.split(',').map(function (ee) {
    return (function (eee, tt) {
      const nn = eee
          ? (eee.match(/\d+|./g) || []).map(function (eeee) {
              const ttt = Number(eeee);
              return isNaN(ttt) ? eeee : ttt;
            })
          : [],
        rr = nn[0];
      if (typeof rr === 'number') {
        if (1 === nn.length)
          return {
            list: [rr],
          };
        if (
          3 === nn.length &&
          '/' === nn[1] &&
          typeof nn[2] === 'number' &&
          1 <= nn[2]
        )
          return {
            list: o(rr, tt, nn[2]),
            warnings: ['nonstandard'],
          };
        if (
          3 === nn.length &&
          '-' === nn[1] &&
          typeof nn[2] === 'number' &&
          nn[2] >= rr
        )
          return {
            list: o(rr, nn[2], 1),
          };
        if (
          5 === nn.length &&
          '-' === nn[1] &&
          typeof nn[2] === 'number' &&
          nn[2] >= rr &&
          '/' === nn[3] &&
          typeof nn[4] === 'number' &&
          1 <= nn[4]
        )
          return {
            list: o(rr, nn[2], nn[4]),
          };
      }
      return {
        errors: ['invalid part'],
      };
    })(ee, t);
  });
  return {
    list: v(
      r(
        n.map(function (ex) {
          return ex.list || [];
        })
      )
    )
      .sort(p)
      .filter(function (ey) {
        return !isNaN(ey);
      }),
    errors: v(
      r(
        n.map(function (ez) {
          return ez.errors || [];
        })
      )
    ),
    warnings: v(
      r(
        n.map(function (ew) {
          return ew.warnings || [];
        })
      )
    ),
  };
}

function b(e, t, n) {
  return e.length && (e[0] < t || e[e.length - 1] > n);
}
const w = /[^\d\-/,]/i;
export default (e) => {
  const t = e.parts
    .map(function (ees) {
      return ees.slice(0);
    })
    .map(function (eeer) {
      return eeer.replace(/\*\/1(?!\d)/g, '*');
    });
  if (0 === t.length && e.originalParts.length) return {};
  const n = {
    errors: [],
    warnings: [],
  };
  if (
    (void 0 !== e.daysAnded && (n.daysAnded = e.daysAnded),
    5 !== t.length && n.errors.push('fields'),
    t[0] && t[0].length)
  ) {
    let r = y(t[0], '0-59'),
      o = g(r, 59);
    (n.minutes = o.list),
      (o.errors.length || b(n.minutes, 0, 59) || w.test(r)) &&
        ((n.minutes = []), n.errors.push('minutes')),
      o.warnings.length && n.warnings.push('minutes');
  } else void 0 === t[0] && n.errors.push('minutes');
  if (t[1] && t[1].length) {
    var a = y(t[1], '0-23'),
      u = g(a, 23);
    (n.hours = u.list),
      (u.errors.length || b(n.hours, 0, 23) || w.test(a)) &&
        ((n.hours = []), n.errors.push('hours')),
      u.warnings.length && n.warnings.push('hours');
  } else void 0 === t[1] && n.errors.push('hours');
  if (t[2] && t[2].length) {
    var i = y(t[2], '1-31'),
      s = g(i, 31);
    (n.dates = s.list),
      (s.errors.length || b(n.dates, 1, 31) || w.test(i)) &&
        ((n.dates = []), n.errors.push('dates')),
      s.warnings.length && n.warnings.push('dates');
  } else void 0 === t[2] && n.errors.push('dates');
  if (t[3] && t[3].length) {
    var c = y(t[3], '1-12'),
      l = e.originalParts[3],
      d = g(c, 12);
    (n.months = d.list),
      (d.errors.length || b(n.months, 1, 12) || w.test(c)) &&
        ((n.months = []), n.errors.push('months')),
      (d.warnings.length ||
        (l && t[3] !== l && 3 < l.length && /\D/.test(l))) &&
        n.warnings.push('months');
  } else void 0 === t[3] && n.errors.push('months');
  if (t[4] && t[4].length) {
    var m = y(t[4], '0-6'),
      f = e.originalParts[4],
      h = g(m, 7);
    (n.weekdays = v(
      h.list.map(function (e) {
        return 7 === e ? 0 : e;
      })
    ).sort(p)),
      (h.errors.length || b(n.weekdays, 0, 6) || w.test(m)) &&
        ((n.weekdays = []), n.errors.push('weekdays')),
      (h.warnings.length ||
        h.list.includes(7) ||
        (f && t[4] !== f && 3 < f.length && /\D/.test(f))) &&
        n.warnings.push('weekdays');
  } else void 0 === t[4] && n.errors.push('weekdays');
  return (
    n.errors.length || delete n.errors,
    n.warnings.length || delete n.warnings,
    n
  );
};
