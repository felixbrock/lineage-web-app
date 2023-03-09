'use strict';
function r(e) {
  var t,
    n,
    r =
      0 !== (n = (t = e).getUTCMilliseconds())
        ? new Date(t.getTime() + (1e3 - n))
        : t,
    o = r.getUTCSeconds();
  return 0 !== o ? new Date(r.getTime() + 1e3 * (60 - o)) : r;
}
function m(e, t, n, r, o) {
  return new Date(Date.UTC(e, t, n, r, o));
}
export default (e, t) => {
  return Object.keys(e).length &&
    e.months.length &&
    e.dates.length &&
    e.weekdays.length &&
    e.hours.length &&
    e.minutes.length
    ? (function e(t, n, r) {
        if (127 < r) return null;
        var o = n.getUTCMonth() + 1,
          a = n.getUTCFullYear();
        if (!t.months.includes(o)) return e(t, m(a, o + 1 - 1, 1, 0, 0), ++r);
        var u = n.getUTCDate(),
          i = n.getUTCDay(),
          s = t.dates.includes(u),
          c = t.weekdays.includes(i);
        if ((t.daysAnded && (!s || !c)) || (!t.daysAnded && !s && !c))
          return e(t, m(a, o - 1, u + 1, 0, 0), ++r);
        var l = n.getUTCHours();
        if (!t.hours.includes(l)) return e(t, m(a, o - 1, u, l + 1, 0), ++r);
        var d = n.getUTCMinutes();
        return t.minutes.includes(d) ? n : e(t, m(a, o - 1, u, l, d + 1), ++r);
      })(e, r(t), 1)
    : null;
};
