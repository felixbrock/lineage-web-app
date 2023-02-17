import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, AvatarGroup, CardHeader } from '@mui/material';
import { BsSlack } from 'react-icons/bs';

export default (
  value: number,
  relativeDeviation: number,
  rangeLowerBorder: number,
  rangeUpperBorder: number
) => (
  <Card sx={{ minWidth: 275 }}>
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: '#6f47ef' }} aria-label="recipe">
          {<BsSlack />}
        </Avatar>
      }
      title="Slack Notification"
      subheader={new Date().toISOString().split('T')[0]}
      action={
        <AvatarGroup max={4}>
          <Avatar
            alt="Remy Sharp"
            src="https://source.unsplash.com/random/150x150?people"
          />
          <Avatar
            alt="Travis Howard"
            src="https://source.unsplash.com/random/150x150?nature"
          />
          <Avatar
            alt="Cindy Baker"
            src="https://source.unsplash.com/random/150x150"
          />
          <Avatar
            alt="Agnes Walker"
            src="https://source.unsplash.com/random/150x150"
          />
          <Avatar
            alt="Trevor Henderson"
            src="https://source.unsplash.com/random/150x150"
          />
        </AvatarGroup>
      }
    />
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Newest Anomaly Alert
      </Typography>
      <Typography variant="h5" component="div">
        Value of <span style={{ color: '#db1d33' }}>{value}</span> at deviation
        of <span style={{ color: '#db1d33' }}>{relativeDeviation}%</span>
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Data distribution significantly higher than expected
      </Typography>
      <Typography variant="body2">
        Expected range: {rangeLowerBorder} - {rangeUpperBorder}
      </Typography>
    </CardContent>
    <CardActions disableSpacing>
      <Button size="small">Mark as Read</Button>
    </CardActions>
  </Card>
);
