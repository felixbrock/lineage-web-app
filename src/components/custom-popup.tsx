import { Checkbox, FormControlLabel, FormGroup, Popover, TextField, Typography, Button, Radio, RadioGroup } from "@mui/material";

interface PopupProps {
    popupOpen: boolean,
    handlePopupClose: () => void,
}
export default (props: PopupProps) => {

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
                    >
                    <FormControlLabel control={<Radio />} label="Minutely" />
                    <FormControlLabel control={<Radio />} label="Daily" />
                    <FormControlLabel control={<Radio />} label="Weekly" />
                    <FormControlLabel control={<Radio />} label="Monthly" />
                    <FormControlLabel control={<Radio />} label="Yearly" />
                </RadioGroup>
            </FormGroup>


            <Typography sx={{ p: 2 }}>Interval?</Typography>
            <TextField
                id="datetime-local"
                label=""
                type="number"
                sx={{ width: 250 }}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{ inputProps: { min: 0 } }}
            />


            <Typography sx={{ p: 2 }}>Start time? (Default now)</Typography>
            <TextField
                id="datetime-local"
                label="Start time"
                type="datetime-local"
                sx={{ width: 250 }}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Typography sx={{ p: 2 }}>End time? (Default none)</Typography>
            <TextField
                id="datetime-local"
                label="End time"
                type="datetime-local"
                sx={{ width: 250 }}
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Typography sx={{ p: 2 }}>Number of occurances? </Typography>
            <TextField
                id="datetime-local"
                label=""
                type="number"
                sx={{ width: 250 }}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{ inputProps: { min: 0 } }}
            />


            <Typography sx={{ p: 2 }}>Days?</Typography>
            <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Monday" />
                <FormControlLabel control={<Checkbox />} label="Tuesday" />
                <FormControlLabel control={<Checkbox />} label="Wednesday" />
                <FormControlLabel control={<Checkbox />} label="Thursday" />
                <FormControlLabel control={<Checkbox />} label="Friday" />
                <FormControlLabel control={<Checkbox />} label="Saturday" />
                <FormControlLabel control={<Checkbox />} label="Sunday" />
            </FormGroup>

            <Typography sx={{ p: 2 }}>Months?</Typography>
            <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Jan" />
                <FormControlLabel control={<Checkbox />} label="Feb" />
                <FormControlLabel control={<Checkbox />} label="Mar" />
                <FormControlLabel control={<Checkbox />} label="Apr" />
                <FormControlLabel control={<Checkbox />} label="May" />
                <FormControlLabel control={<Checkbox />} label="Jun" />
                <FormControlLabel control={<Checkbox />} label="Jul" />
                <FormControlLabel control={<Checkbox />} label="Aug" />
                <FormControlLabel control={<Checkbox />} label="Sep" />
                <FormControlLabel control={<Checkbox />} label="Oct" />
                <FormControlLabel control={<Checkbox />} label="Nov" />
                <FormControlLabel control={<Checkbox />} label="Dec" />
            </FormGroup>

            <Typography sx={{ p: 2 }}>Month Days?</Typography>

            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            <Typography sx={{ p: 2 }}>Year Days?</Typography>

            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            <Typography sx={{ p: 2 }}>Week number?</Typography>

            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            <Typography sx={{ p: 2 }}>Hours?</Typography>

            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            <Typography sx={{ p: 2 }}>Minutes?</Typography>

            <TextField id="outlined-basic" label="Outlined" variant="outlined" />


            <></>
            <Button variant="contained" onClick={() => {
            }}>Save Changes</Button>


        </Popover>
    );

};

