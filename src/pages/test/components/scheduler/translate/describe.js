'use strict';

function u(e) {
  var t = parseInt(e);
  switch (20 < t ? t % 10 : t) {
    case 1:
      return e + 'st';
    case 2:
      return e + 'nd';
    case 3:
      return e + 'rd';
    default:
      return e + 'th';
  }
}

function i(e, t, n, r) {
  return '*' === e
    ? 'every ' + t
    : (function (e, t, n, r) {
        var o = e.match(/\d+|./g).map(function (e) {
            var t = Number(e);
            return isNaN(t) ? e : t;
          }),
          a = o[0];
        if (Number.isInteger(a)) {
          if (1 === o.length) return '' + (n[a] || a);
          if (3 === o.length && '/' === o[1] && Number.isInteger(o[2]))
            return (
              'every ' +
              u(o[2]) +
              ' ' +
              t +
              ' from ' +
              (n[a] || a) +
              ' through ' +
              (n[r] || r)
            );
          if (
            3 === o.length &&
            '-' === o[1] &&
            Number.isInteger(o[2]) &&
            o[2] >= a
          )
            return (
              'every ' +
              t +
              ' from ' +
              (n[a] || a) +
              ' through ' +
              (n[o[2]] || o[2])
            );
          if (
            5 === o.length &&
            '-' === o[1] &&
            Number.isInteger(o[2]) &&
            o[2] >= a &&
            '/' === o[3] &&
            Number.isInteger(o[4]) &&
            1 <= o[4]
          )
            return (
              'every ' +
              u(o[4]) +
              ' ' +
              t +
              ' from ' +
              (n[a] || a) +
              ' through ' +
              (n[o[2]] || o[2])
            );
        } else if (
          3 === o.length &&
          '/' === o[1] &&
          Number.isInteger(o[2]) &&
          '*' === o[0]
        )
          return 'every ' + u(o[2]) + ' ' + t;
        return '';
      })(e, t, n, r);
}

function p(e, t, n, r, o) {
  var a = e.split(',');
  return (
    (o ? '' : t + ' ') +
    (function (e) {
      switch (e.length) {
        case 0:
          return '';
        case 1:
          return e[0];
        case 2:
          return e[0] + ' and ' + e[1];
        default:
          return (
            e.slice(0, e.length - 1).join(', ') + ', and ' + e[e.length - 1]
          );
      }
    })(
      a.map(function (e) {
        return i(e, t, n, r);
      })
    )
  )
    .replace('every 1st', 'every')
    .replace(t + ' every', 'every')
    .replace(', ' + t, ', ')
    .replace(', and ' + t, ', and ');
}
var v = [
  null,
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
var y = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
var g = /^0*\d\d?$/;
var b = 'After rebooting.';
export default (e) => {
  if ('@reboot' === e.originalParts[0])
    return {
      full: b,
      special: b,
    };
  var t,
    n,
    r,
    o = e.parts,
    a = '*' === (r = o[2]) ? '' : 'on ' + p(r, 'day-of-month', {}, 31),
    u = '*' === (n = o[3]) ? '' : 'in ' + p(n, 'month', v, 12, !0),
    i = '*' === (t = o[4]) ? '' : 'on ' + p(t, 'day-of-week', y, 7, !0),
    s = '';
  a && i && (s = e.daysAnded ? "if it's" : 'and');
  var c,
    l,
    d =
      ((c = o[0]),
      (l = o[1]),
      g.test(c) && g.test(l)
        ? [('0' + c).slice(-2), ('0' + l).slice(-2)]
        : null);
  if (d)
    return {
      start: 'At',
      minutes: d[0],
      hours: d[1],
      isTime: !0,
      dates: a || null,
      datesWeekdays: s || null,
      weekdays: i || null,
      months: u || null,
      end: '.',
      full:
        ('At ' + d[1] + ':' + d[0] + ' ' + a + ' ' + s + ' ' + i + ' ' + u)
          .replace(/ +/g, ' ')
          .trim() + '.',
    };
  var m,
    f = p(o[0], 'minute', {}, 59),
    h = '*' === (m = o[1]) ? '' : 'past ' + p(m, 'hour', {}, 23);
  return {
    start: 'At',
    minutes: f || null,
    hours: h || null,
    dates: a || null,
    datesWeekdays: s || null,
    weekdays: i || null,
    months: u || null,
    end: '.',
    full:
      ('At ' + f + ' ' + h + ' ' + a + ' ' + s + ' ' + i + ' ' + u)
        .replace(/ +/g, ' ')
        .trim() + '.',
  };
};
