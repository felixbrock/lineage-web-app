
"use strict";

function a(e, i) {
    return Object.keys(i)
        .reduce(function (e, t) {
            return n = e, o = i[r = t], a = new RegExp("(^|[ ,-/])" + r + "($|[ ,-/])", "gi"), u = "$1" + o + "$2", n.replace(a, u)
                .replace(a, u);
            var n, r, o, a, u;
        }, e);
}
var u = {
    sun: "0",
    mon: "1",
    tue: "2",
    wed: "3",
    thu: "4",
    fri: "5",
    sat: "6"
};
var i = {
    jan: "1",
    feb: "2",
    mar: "3",
    apr: "4",
    may: "5",
    jun: "6",
    jul: "7",
    aug: "8",
    sep: "9",
    oct: "10",
    nov: "11",
    dec: "12"
};
var shortcutExpressionRegistry = {
    "@yearly": ["0", "0", "1", "1", "*"],
    "@annually": ["0", "0", "1", "1", "*"],
    "@monthly": ["0", "0", "1", "*", "*"],
    "@weekly": ["0", "0", "*", "*", "0"],
    "@daily": ["0", "0", "*", "*", "*"],
    "@midnight": ["0", "0", "*", "*", "*"],
    "@hourly": ["0", "*", "*", "*", "*"]
};
export default (expression) => {
    var trimmedExpression = expression.trim()
        .split(/\s+/)
        .filter(function (e) {
            return e;
        });
    if (1 === trimmedExpression.length && "@reboot" === trimmedExpression[0]) return {
        originalParts: trimmedExpression,
        parts: []
    };
    var shortcut, shortcutExpression, o = (1 === trimmedExpression.length ? (shortcut = trimmedExpression[0], shortcutExpression = shortcutExpressionRegistry[shortcut], void 0 !== shortcutExpression ? shortcutExpression : [shortcut]) : trimmedExpression)
        .map(function (e, t) {
            switch (t) {
                case 3:
                    return a(e, i);
                case 4:
                    return a(e, u);
                default:
                    return e;
            }
        });
    return {
        originalParts: trimmedExpression,
        parts: o,
        daysAnded: !!o[2] && "*" === o[2][0] || !!o[4] && "*" === o[4][0]
    };
};
