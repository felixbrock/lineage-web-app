import React from 'react';
import numericalFieldHandler from '../../../utils/numericalFieldHandler';
import translateLabel from '../../../utils/translateLabel';
import { BaseProps } from '../../../utils/base-props';

export interface Weekly {
  interval: number;
  days: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
  options: {
    weekStartsOnSunday: boolean;
  };
}

export interface RepeatWeeklyProps extends BaseProps {
  weekly: Weekly;
}

const RepeatWeekly = (props: RepeatWeeklyProps) => {
  const days: { [key: string]: boolean } = props.weekly.days;
  let daysArray: [string, boolean][] = Object.keys(days).map((key) => [
    key,
    days[key],
  ]);
  if (props.weekly.options.weekStartsOnSunday) {
    daysArray = daysArray.slice(-1).concat(daysArray.slice(0, -1));
  }

  return (
    <div className="px-3">
      <div className="form-group row d-flex align-items-sm-center">
        <div className="col-sm-1 offset-sm-2">
          {translateLabel(props.translations, 'repeat.weekly.every')}
        </div>
        <div className="col-sm-3">
          <input
            id={`${props.id}-interval`}
            name="repeat.weekly.interval"
            aria-label="Repeat weekly interval"
            className="form-control"
            value={props.weekly.interval}
            onChange={numericalFieldHandler(props.handleChange)}
          />
        </div>
        <div className="col-sm-1">
          {translateLabel(props.translations, 'repeat.weekly.weeks')}
        </div>
      </div>

      <div className="form-group row">
        <div className="btn-group btn-group-toggle offset-sm-2">
          {daysArray.map(([dayName, isDayActive]) => (
            <label
              htmlFor={`${props.id}-${dayName}`}
              key={dayName}
              className={`btn btn-primary ${isDayActive ? 'active' : ''}`}
            >
              <input
                type="checkbox"
                id={`${props.id}-${dayName}`}
                name={`repeat.weekly.days[${dayName}]`}
                className="form-control"
                checked={isDayActive}
                onChange={(event) => {
                  const editedEvent = {
                    ...event,
                    target: {
                      ...event.target,
                      value: !isDayActive,
                      name: event.target.name,
                    },
                  };

                  props.handleChange(editedEvent);
                }}
              />
              {translateLabel(
                props.translations,
                `days_short.${dayName.toLowerCase()}`
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepeatWeekly;
