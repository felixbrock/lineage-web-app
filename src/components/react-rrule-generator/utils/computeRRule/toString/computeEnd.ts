import moment from 'moment';

export interface ComputeEndProps {
  mode: any,
  after: any,
  onDate: {
    date: any
  }
}

const computeEnd = (props: ComputeEndProps) => {
  const end: {[key: string]: any} = {};

  if (props.mode === 'After') {
    end.count = props.after;
  }

  if (props.mode === 'On date') {
    end.until = moment(props.onDate.date).format();
  }

  return end;
};

export default computeEnd;
