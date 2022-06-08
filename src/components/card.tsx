import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, CardHeader } from '@mui/material';
import { BsSlack } from 'react-icons/bs';

export default function BasicCard() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#6f47ef' }} aria-label="recipe">
            {<BsSlack />}
          </Avatar>
        }
        title="Slack Notification"
        subheader={new Date().toISOString().split('T')[0]}
      />
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Newest Anomaly Alert
        </Typography>
        <Typography variant="h5" component="div">
          Value of <span style={{ color: '#db1d33' }}>47,011</span> at deviation
          of <span style={{ color: '#db1d33' }}>448%</span>
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Data distribution significantly higher than expected
        </Typography>
        <Typography variant="body2">Expected range: 4,129 - 17,521</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Mark as Read</Button>
      </CardActions>
    </Card>
  );
}
