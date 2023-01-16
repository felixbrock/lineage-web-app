import title from './title';
import prenormalize from './prenormalize';
import normalize from './normalize';
import describe from './describe';

const c = (e) => {
  return e.trim().replace(/ +/g, ' ');
};

export default (expression) => {
  var t = c(expression),
    n =
      document.title !== title.defaultTitle
        ? document.title.charAt(0).toUpperCase() +
          document.title.substr(1) +
          ' is a commonly used cron schedule.'
        : null,
    r = prenormalize(t),
    o = normalize(r),
    a = o.errors ? null : describe(r),
    u = t.split(' ');
  return {
    schedule: o,
    description: a,
    commonBlurb: n,
    isSpecialString: 1 <= u.length && u[0].startsWith('@'),
  };
};
