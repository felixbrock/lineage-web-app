    var r = "",
        o = {
            "/every-minute": "* * * * *",
            "/every-1-minute": "* * * * *",
            "/every-2-minutes": "*/2 * * * *",
            "/every-even-minute": "*/2 * * * *",
            "/every-uneven-minute": "1-59/2 * * * *",
            "/every-3-minutes": "*/3 * * * *",
            "/every-4-minutes": "*/4 * * * *",
            "/every-5-minutes": "*/5 * * * *",
            "/every-five-minutes": "*/5 * * * *",
            "/every-6-minutes": "*/6 * * * *",
            "/every-10-minutes": "*/10 * * * *",
            "/every-ten-minutes": "*/10 * * * *",
            "/every-15-minutes": "*/15 * * * *",
            "/every-fifteen-minutes": "*/15 * * * *",
            "/every-quarter-hour": "*/15 * * * *",
            "/every-20-minutes": "*/20 * * * *",
            "/every-30-minutes": "*/30 * * * *",
            "/every-hour-at-30-minutes": "30 * * * *",
            "/every-half-hour": "*/30 * * * *",
            "/every-60-minutes": "0 * * * *",
            "/every-hour": "0 * * * *",
            "/every-1-hour": "0 * * * *",
            "/every-2-hours": "0 */2 * * *",
            "/every-two-hours": "0 */2 * * *",
            "/every-even-hour": "0 */2 * * *",
            "/every-other-hour": "0 */2 * * *",
            "/every-3-hours": "0 */3 * * *",
            "/every-three-hours": "0 */3 * * *",
            "/every-4-hours": "0 */4 * * *",
            "/every-6-hours": "0 */6 * * *",
            "/every-six-hours": "0 */6 * * *",
            "/every-8-hours": "0 */8 * * *",
            "/every-12-hours": "0 */12 * * *",
            "/hour-range": "0 9-17 * * *",
            "/between-certain-hours": "0 9-17 * * *",
            "/every-day": "0 0 * * *",
            "/daily": "0 0 * * *",
            "/once-a-day": "0 0 * * *",
            "/every-night": "0 0 * * *",
            "/every-day-at-1am": "0 1 * * *",
            "/every-day-at-2am": "0 2 * * *",
            "/every-day-8am": "0 8 * * *",
            "/every-morning": "0 9 * * *",
            "/every-midnight": "0 0 * * *",
            "/every-day-at-midnight": "0 0 * * *",
            "/every-night-at-midnight": "0 0 * * *",
            "/every-sunday": "0 0 * * SUN",
            "/every-monday": "0 0 * * MON",
            "/every-tuesday": "0 0 * * TUE",
            "/every-wednesday": "0 0 * * WED",
            "/every-thursday": "0 0 * * THU",
            "/every-friday": "0 0 * * FRI",
            "/every-friday-at-midnight": "0 0 * * FRI",
            "/every-saturday": "0 0 * * SAT",
            "/every-weekday": "0 0 * * 1-5",
            "/weekdays-only": "0 0 * * 1-5",
            "/monday-to-friday": "0 0 * * 1-5",
            "/every-weekend": "0 0 * * 6,0",
            "/weekends-only": "0 0 * * 6,0",
            "/every-7-days": "0 0 * * 0",
            "/weekly": "0 0 * * 0",
            "/once-a-week": "0 0 * * 0",
            "/every-week": "0 0 * * 0",
            "/every-month": "0 0 1 * *",
            "/monthly": "0 0 1 * *",
            "/once-a-month": "0 0 1 * *",
            "/every-other-month": "0 0 1 */2 *",
            "/every-quarter": "0 0 1 */3 *",
            "/every-6-months": "0 0 1 */6 *",
            "/every-year": "0 0 1 1 *"
        };
    const title = {
        textFromLocation: function()
        {
            if (window.location.hash) return value = decodeURIComponent(window.location.hash)
                .replace("#", "")
                .replace(/_/g, " "), 4 === value.trim()
                .split(" ")
                .length && (value = value.trim() + " *"), value;
            if (window.location.pathname)
            {
                var e = decodeURIComponent(window.location.pathname);
                if (e in o) return document.title = "Cron job " + decodeURIComponent(window.location.pathname)
                    .replace(/-/g, " ")
                    .replace(/\//g, " "), o[e];
            }
            return null;
        },
        updateLocation: function(e)
        {
            var t = e.trim()
                .replace(/ +/g, "_");
            window.history.replaceState(
            {}, r, "/#" + t), document.title = r;
        },
        defaultTitle: r
    };

    export default title;