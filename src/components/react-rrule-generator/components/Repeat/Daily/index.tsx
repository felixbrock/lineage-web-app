import React from 'react';
import { BaseProps } from '../../../utils/base-props';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';


export interface Daily {
  interval: number,
};

export interface RepeatDailyProps extends BaseProps {
  daily: Daily
}


const RepeatDaily = (props: RepeatDailyProps) => (
  <div className="form-group row d-flex align-items-sm-center">
    <div className="col-sm-1 offset-sm-2">
      {translateLabel(props.translations, 'repeat.daily.every')}
    </div>
    <div className="col-sm-2">
      <input
        id={`${props.id}-interval`}
        name="repeat.daily.interval"
        aria-label="Repeat daily interval"
        className="form-control"
        value={props.daily.interval}
        onChange={numericalFieldHandler(props.handleChange)}
      />
    </div>
    <div className="col-sm-1">
      {translateLabel(props.translations, 'repeat.daily.days')}
    </div>

  </div>
);


export default RepeatDaily;
