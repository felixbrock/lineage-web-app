import React, { useEffect, useState } from 'react';
import { Popover, TextField, Typography, Button } from "@mui/material";
//@ts-ignore
import RRuleGenerator from 'react-rrule-generator-tt';
import * as cronstrue from "cronstrue";


interface PopupProps {
    popupOpen: boolean,
    handlePopupClose: () => void,
    getCron: any,
}
export default (props: PopupProps) => {

    const [rule, setRule] = useState<string>('');
    const [cron, setCron] = useState<string>('');


    const handleSave = () => {

        console.log(rule);
        console.log(cron);

        const fullCron = `cron(${cron})`;

        console.log(fullCron);

        props.getCron(fullCron);
        props.handlePopupClose();
    };

    const stringToDate = (until: string): Date => {
        const re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
        const bits = re.exec(until);

        if (!bits) throw new Error(`Invalid UNTIL value: ${until}`);

        return new Date(
            Date.UTC(
                parseInt(bits[1], 10),
                parseInt(bits[2], 10) - 1,
                parseInt(bits[3], 10),
                parseInt(bits[5], 10) || 0,
                parseInt(bits[6], 10) || 0,
                parseInt(bits[7], 10) || 0
            )
        );
    };

    const NOT_SUPPORTED = 'NOT SUPPORTED YET';
    const rruleToCron = (rrule: string): string => {

        const ruleString = rrule.includes('DTSTART')
            ? rrule.replace(/\n.*RRULE:/, ';')
            : rrule.replace('RRULE:', '');
        const C_DAYS_OF_WEEK_RRULE = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
        const C_DAYS_WEEKDAYS_RRULE = ['MO', 'TU', 'WE', 'TH', 'FR'];
        const C_DAYS_OF_WEEK_CRONE = ['2', '3', '4', '5', '6', '7', '1'];
        const C_DAYS_OF_WEEK_CRONE_NAMED = [
            'MON',
            'TUE',
            'WED',
            'THU',
            'FRI',
            'SAT',
            'SUN',
        ];
        const C_MONTHS = [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG',
            'SEP',
            'OCT',
            'NOV',
            'DEC',
        ];

        let dayTime = '0 0';
        let dayOfMonth: number | string = '?';
        let month = '*';
        let dayOfWeek = '?';
        const year = '*';

        let FREQ = '';
        let DTSTART: string | Date = '';
        let INTERVAL = -1;
        let BYMONTHDAY = -1;
        let BYMONTH = -1;
        let BYDAY = '';
        let BYSETPOS = 0;
        let BYHOUR = 0;
        let BYMINUTE = 0;

        const rarr = ruleString.split(';');
        for (let i = 0; i < rarr.length; i += 1) {
            const param = rarr[i].includes('=')
                ? rarr[i].split('=')[0]
                : rarr[i].split(':')[0];
            const value = rarr[i].includes('=')
                ? rarr[i].split('=')[1]
                : rarr[i].split(':')[1];
            if (param === 'FREQ') FREQ = value;
            if (param === 'DTSTART') DTSTART = value;
            if (param === 'INTERVAL') INTERVAL = parseInt(value, 10);
            if (param === 'BYMONTHDAY') BYMONTHDAY = parseInt(value, 10);
            if (param === 'BYDAY') BYDAY = value;
            if (param === 'BYSETPOS') BYSETPOS = parseInt(value, 10);
            if (param === 'BYMONTH') BYMONTH = parseInt(value, 10);
            if (param === 'BYHOUR') BYHOUR = parseInt(value, 10);
            if (param === 'BYMINUTE') BYMINUTE = parseInt(value, 10);
        }

        if (DTSTART !== '') {
            DTSTART = stringToDate(DTSTART);
            dayTime = `${DTSTART.getUTCMinutes()} ${DTSTART.getUTCHours()}`;
        }
        if (BYHOUR !== 0 || BYMINUTE !== 0) {
            dayTime = `${BYMINUTE} ${BYHOUR}`;
        }
        switch (FREQ) {
            case 'MONTHLY':
                if (INTERVAL === 1) {
                    month = '*'; // every month
                } else {
                    month = `1/${INTERVAL}`; // 1 - start of january, every INTERVALth month
                }
                if (BYMONTHDAY === -1 && DTSTART !== '') {
                    dayOfMonth = DTSTART.getUTCDate();
                } else if (BYMONTHDAY !== -1) {
                    dayOfMonth = BYMONTHDAY.toString();
                } else if (BYSETPOS !== 0) {
                    if (BYDAY === '') {
                        console.log('No BYDAY specified for MONTHLY/BYSETPOS rule');
                        return NOT_SUPPORTED;
                    }

                    if (BYDAY === 'MO,TU,WE,TH,FR') {
                        if (BYSETPOS === 1) {
                            // First weekday of every month
                            // "FREQ=MONTHLY;INTERVAL=1;BYSETPOS=1;BYDAY=MO,TU,WE,TH,FR",
                            dayOfMonth = '1W';
                        } else if (BYSETPOS === -1) {
                            // Last weekday of every month
                            // "FREQ=MONTHLY;INTERVAL=1;BYSETPOS=-1;BYDAY=MO,TU,WE,TH,FR",
                            dayOfMonth = 'LW';
                        } else {
                            console.log(
                                'Unsupported Xth weekday for MONTHLY rule (only 1st and last weekday are supported)'
                            );
                            return NOT_SUPPORTED;
                        }
                    } else if (C_DAYS_OF_WEEK_RRULE.indexOf(BYDAY) === -1) {
                        console.log(
                            `Unsupported BYDAY rule (multiple days are not supported by crone): ${BYDAY}`
                        );
                        return NOT_SUPPORTED;
                    } else {
                        dayOfMonth = '?';
                        if (BYSETPOS > 0) {
                            // 3rd friday = BYSETPOS=3;BYDAY=FR in RRULE, 6#3
                            dayOfWeek =
                                `${C_DAYS_OF_WEEK_CRONE[C_DAYS_OF_WEEK_RRULE.indexOf(BYDAY)]}#${BYSETPOS.toString()}`;
                        } else {
                            // last specific day
                            dayOfWeek =
                                `${C_DAYS_OF_WEEK_CRONE[C_DAYS_OF_WEEK_RRULE.indexOf(BYDAY)]}L`;
                        }
                    }
                } else {
                    console.log('No BYMONTHDAY or BYSETPOS in MONTHLY rrule');
                    return NOT_SUPPORTED;
                }
                break;
            case 'WEEKLY':
                if (INTERVAL !== 1) {
                    console.log('every X week different from 1st is not supported');
                    return NOT_SUPPORTED;
                }
                if (
                    BYDAY.split(',').sort().join(',') ===
                    C_DAYS_OF_WEEK_RRULE.concat().sort().join(',')
                ) {
                    dayOfWeek = '*'; // all days of week
                } else {
                    const arrByDayRRule = BYDAY.split(',');
                    const arrByDayCron = [];
                    for (let i = 0; i < arrByDayRRule.length; i += 1) {
                        const indexOfDayOfWeek = C_DAYS_OF_WEEK_RRULE.indexOf(arrByDayRRule[i]);
                        arrByDayCron.push(C_DAYS_OF_WEEK_CRONE_NAMED[indexOfDayOfWeek]);
                    }
                    dayOfWeek = arrByDayCron.join(',');
                }
                break;
            case 'DAILY':
                if (INTERVAL !== 1) {
                    dayOfMonth = `1/${INTERVAL.toString()}`;
                }
                break;
            case 'YEARLY':
                if (BYMONTH === -1) {
                    console.log('Missing BYMONTH in YEARLY rule');
                    return NOT_SUPPORTED;
                }
                month = C_MONTHS[BYMONTH - 1];
                if (BYMONTHDAY !== -1) {
                    // FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=2  // 2nd day of March
                    dayOfMonth = BYMONTHDAY;
                } else if (BYSETPOS === -1) {
                    if (
                        BYDAY.split(',').sort().join(',') ===
                        C_DAYS_OF_WEEK_RRULE.concat().sort().join(',')
                    ) {
                        dayOfMonth = 'L';
                    } else if (
                        BYDAY.split(',').sort().join(',') ===
                        C_DAYS_WEEKDAYS_RRULE.concat().sort().join(',')
                    ) {
                        dayOfMonth = 'LW';
                    } else {
                        console.log(
                            'Last weekends and just last specific days of Month are not supported'
                        );
                        return NOT_SUPPORTED;
                    }
                } else if (
                    BYDAY.split(',').sort().join(',') ===
                    C_DAYS_WEEKDAYS_RRULE.concat().sort().join(',') &&
                    BYSETPOS === 1
                ) {
                    dayOfMonth = `${BYSETPOS.toString()}W`;
                } else if (BYDAY.split(',').length === 1) {
                    dayOfWeek =
                        `${C_DAYS_OF_WEEK_CRONE[C_DAYS_OF_WEEK_RRULE.indexOf(BYDAY)]}#${BYSETPOS.toString()}`;
                } else {
                    console.log('Multiple days are not supported in YEARLY rule');
                    return NOT_SUPPORTED;
                }


                break;
            default:
                return NOT_SUPPORTED;
        }

        return `${dayTime} ${dayOfMonth} ${month} ${dayOfWeek} ${year}`;

    };

    const explainRule = (rrule: string): string => {
        const newCron = rruleToCron(rrule);
        if (newCron === NOT_SUPPORTED) {
            return NOT_SUPPORTED;
        } else {
            try {
                return cronstrue.toString(newCron, {
                    dayOfWeekStartIndexZero: false,
                    use24HourTimeFormat: true,
                    verbose: true,
                });
            } catch (error: any) {
                return NOT_SUPPORTED;
            }

        }
    };

    useEffect(() => {
        setCron(rruleToCron(rule));
    }, [rule]);

    return (
        <Popover
            open={props.popupOpen}
            onClose={props.handlePopupClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 400, left: 800 }}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
        >
            <Typography sx={{ p: 2 }}>Define custom exectuion schedule.</Typography>


            <RRuleGenerator
                onChange={(rrule: React.SetStateAction<string>) => setRule(rrule)}
                config={{
                    repeat: ["Monthly", "Weekly", "Daily", "Yearly"],
                    hideEnd: true,
                    weekStartsOnSunday: false,
                }}
                value={rule}
            />

            <React.Fragment>

                <b>&nbsp;Execution Schedule Explained:</b>
                <TextField
                    id="interval"
                    label=""
                    type="text"
                    value={explainRule(rule)}
                    defaultValue={''}
                    sx={{ width: 250 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

            </React.Fragment>

            <React.Fragment>

                <Button variant="contained" onClick={handleSave}>Save Changes</Button>

            </React.Fragment>


        </Popover>
    );

};

