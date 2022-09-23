import React from 'react';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';
import { BaseProps } from '../../../utils/base-props';

export interface Hourly {
  interval: number;
}

export interface RepeatHourlyProps extends BaseProps {
  hourly: Hourly;
}

const RepeatHourly = (props: RepeatHourlyProps) => (
  <div className="form-group row d-flex align-items-sm-center">
    <div className="col-sm-1 offset-sm-2">
      {translateLabel(props.translations, 'repeat.hourly.every')}
    </div>
    <div className="col-sm-2">
      <input
        id={`${props.id}-interval`}
        name="repeat.hourly.interval"
        aria-label="Repeat hourly interval"
        className="form-control"
        value={props.hourly.interval}
        onChange={numericalFieldHandler(props.handleChange)}
      />
    </div>
    <div className="col-sm-1">
      {translateLabel(props.translations, 'repeat.hourly.hours')}
    </div>
  </div>
);

export default RepeatHourly;
