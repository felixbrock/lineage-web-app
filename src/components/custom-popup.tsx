import React, { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Popover, TextField, Typography, Button, Radio, RadioGroup } from "@mui/material";
import { RRule, Frequency } from 'rrule'

interface PopupProps {
    popupOpen: boolean,
    handlePopupClose: () => void,
    getRrule: any,
}
export default (props: PopupProps) => {
    const [frequency, setFrequency] = useState<string>();
    const [interval, setInterval] = useState<number>();
    const [occurances, setOccurances] = useState<number>();

    const [startTime, setStartTime] = useState<Date>();
    const [endTime, setEndTime] = useState<Date>();

    const [days, setDays] = useState<boolean[]>(new Array(7).fill(false));
    const [months, setMonths] = useState<boolean[]>(new Array(12).fill(false));


    const [minutes, setMinutes] = useState<number[]>([]);
    const [hours, setHours] = useState<number[]>([]);
    const [weekNumber, setWeekNumber] = useState<number[]>([]);
    const [monthDays, setMonthDays] = useState<number[]>([]);
    const [yearDays, setYearDays] = useState<number[]>([]);


    const handleDaysChange = (index: number) => {
        days[index] = !days[index];
        setDays(days);
    };

    const handleMonthsChange = (index: number) => {
        months[index] = !months[index];
        setMonths(months);
    };

    const handleSave = () => {

        console.log("frequency is: " + frequency);
        console.log("interval is: " + interval);
        console.log("occurances is: " + occurances);
        console.log("startTime is: " + startTime);
        console.log("endTime is: " + endTime);
        console.log("days is: " + days);
        console.log("months is: " + months);
        console.log("minutes is: " + minutes);
        console.log("hours is: " + hours);
        console.log("weekNumber is: " + weekNumber);
        console.log("monthDays is: " + monthDays);
        console.log("yearDays is: " + yearDays);

        const trueDays = days.map((bool, index) => bool ? index : -1).filter(index => index !== -1);

        const trueMonths = months.map((bool, index) => bool ? index : -1).filter(index => index !== -1);;

        const rule = new RRule({
            freq: Frequency[frequency as keyof typeof Frequency],
            dtstart: startTime,
            interval,
            count: occurances,
            until: endTime,
            
            bymonth: trueMonths,
            bymonthday: monthDays,
            byyearday: yearDays,
            byweekno: weekNumber,
            byweekday: trueDays,
            byhour: hours,
            byminute: minutes
        });
        console.log(rule);

        props.getRrule(rule);
        props.handlePopupClose();
    };

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
            <Typography sx={{ p: 2 }}>Frequency?</Typography>
            <FormGroup>
                <RadioGroup
                    row
                    defaultValue="Daily"
                    onChange={(_, value) => setFrequency(value)}
                    value={frequency}
                >
                    <FormControlLabel value={"MINUTELY"} control={<Radio />} label="Minutely" />
                    <FormControlLabel value={"DAILY"} control={<Radio />} label="Daily" />
                    <FormControlLabel value={"WEEKLY"} control={<Radio />} label="Weekly" />
                    <FormControlLabel value={"MONTHLY"} control={<Radio />} label="Monthly" />
                    <FormControlLabel value={"YEARLY"} control={<Radio />} label="Yearly" />
                </RadioGroup>
            </FormGroup>


            <Typography sx={{ p: 2 }}>Interval?</Typography>
            <TextField
                id="interval"
                label=""
                type="number"
                onChange={(event) => setInterval(parseInt(event.target.value))}
                value={interval}
                sx={{ width: 250 }}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{ inputProps: { min: 0 } }}
            />


            <Typography sx={{ p: 2 }}>Start time? (Default now)</Typography>
            <TextField
                id="start-time"
                label="Start time"
                type="datetime-local"
                onChange={(event) => setStartTime(new Date(event.target.value))}
                sx={{ width: 250 }}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Typography sx={{ p: 2 }}>End time? (Default none)</Typography>
            <TextField
                id="end-time"
                label="End time"
                type="datetime-local"
                onChange={(event) => setEndTime(new Date(event.target.value))}
                sx={{ width: 250 }}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Typography sx={{ p: 2 }}>Number of occurances? </Typography>
            <TextField
                id="count"
                label=""
                type="number"
                onChange={(event) => setOccurances(parseInt(event.target.value))}
                sx={{ width: 250 }}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{ inputProps: { min: 0 } }}
            />


            <Typography sx={{ p: 2 }}>Days?</Typography>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={days[0]} onChange={()=>handleDaysChange(0)} />} label="Monday" />
                <FormControlLabel control={<Checkbox checked={days[1]} onChange={()=>handleDaysChange(1)}/>} label="Tuesday" />
                <FormControlLabel control={<Checkbox checked={days[2]} onChange={()=>handleDaysChange(2)}/>} label="Wednesday" />
                <FormControlLabel control={<Checkbox checked={days[3]} onChange={()=>handleDaysChange(3)}/>} label="Thursday" />
                <FormControlLabel control={<Checkbox checked={days[4]} onChange={()=>handleDaysChange(4)}/>} label="Friday" />
                <FormControlLabel control={<Checkbox checked={days[5]} onChange={()=>handleDaysChange(5)}/>} label="Saturday" />
                <FormControlLabel control={<Checkbox checked={days[6]} onChange={()=>handleDaysChange(6)}/>} label="Sunday" />
            </FormGroup>

            <Typography sx={{ p: 2 }}>Months?</Typography>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={months[0]} onChange={()=>handleMonthsChange(0)}/>} label="Jan" />
                <FormControlLabel control={<Checkbox checked={months[1]} onChange={()=>handleMonthsChange(1)}/>} label="Feb" />
                <FormControlLabel control={<Checkbox checked={months[2]} onChange={()=>handleMonthsChange(2)}/>} label="Mar" />
                <FormControlLabel control={<Checkbox checked={months[3]} onChange={()=>handleMonthsChange(3)}/>} label="Apr" />
                <FormControlLabel control={<Checkbox checked={months[4]} onChange={()=>handleMonthsChange(4)}/>} label="May" />
                <FormControlLabel control={<Checkbox checked={months[5]} onChange={()=>handleMonthsChange(5)}/>} label="Jun" />
                <FormControlLabel control={<Checkbox checked={months[6]} onChange={()=>handleMonthsChange(6)}/>} label="Jul" />
                <FormControlLabel control={<Checkbox checked={months[7]} onChange={()=>handleMonthsChange(7)}/>} label="Aug" />
                <FormControlLabel control={<Checkbox checked={months[8]} onChange={()=>handleMonthsChange(8)}/>} label="Sep" />
                <FormControlLabel control={<Checkbox checked={months[9]} onChange={()=>handleMonthsChange(9)}/>} label="Oct" />
                <FormControlLabel control={<Checkbox checked={months[10]} onChange={()=>handleMonthsChange(10)}/>} label="Nov" />
                <FormControlLabel control={<Checkbox checked={months[11]} onChange={()=>handleMonthsChange(11)}/>} label="Dec" />
            </FormGroup>


            <Typography sx={{ p: 2 }}>Minutes?</Typography>

            <TextField 
                id="outlined-basic"
                label="" 
                variant="outlined"
                onChange={(event) => {
                    const mins:string[] = event.target.value.split(',');
                    const minNums = mins.map((minute) => parseInt(minute));
                    setMinutes(minNums);
                }}
            />

            <Typography sx={{ p: 2 }}>Hours?</Typography>

            <TextField 
                id="outlined-basic"
                label=""
                variant="outlined"
                onChange={(event) => {
                    const hourStr: string[] = event.target.value.split(',');
                    const hourNums = hourStr.map((hour) => parseInt(hour));
                    setHours(hourNums);
                }}
            />

            <Typography sx={{ p: 2 }}>Week numbers?</Typography>

            <TextField
                id="outlined-basic"
                label=""
                variant="outlined"
                onChange={(event) => {
                    const weeks: string[] = event.target.value.split(',');
                    const weekNums = weeks.map((week) => parseInt(week));
                    setWeekNumber(weekNums);
                }}
            />

            <Typography sx={{ p: 2 }}>Month Days?</Typography>

            <TextField
                id="outlined-basic"
                label=""
                variant="outlined"
                onChange={(event) => {
                    const monthDayStr: string[] = event.target.value.split(',');
                    const monthDayNums = monthDayStr.map((monthDay) => parseInt(monthDay));
                    setMonthDays(monthDayNums);
                }}
            />

            <Typography sx={{ p: 2 }}>Year Days?</Typography>

            <TextField
                id="outlined-basic"
                label=""
                variant="outlined"
                onChange={(event) => {
                    const yearDayStr: string[] = event.target.value.split(',');
                    const yearDayNums = yearDayStr.map((yearDay) => parseInt(yearDay));
                    setYearDays(yearDayNums);
                }}
            />

            <React.Fragment>

                <Button variant="contained" onClick={handleSave}>Save Changes</Button>

            </React.Fragment>


        </Popover>
    );

};

