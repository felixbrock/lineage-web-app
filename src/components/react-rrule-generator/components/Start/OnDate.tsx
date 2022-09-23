import { Component } from 'react';
import moment from 'moment';
import DateTime from 'react-datetime';
import 'moment/min/locales';

import { DATE_TIME_FORMAT } from '../../constants/index';
import translateLabel from '../../utils/translateLabel';
import { BaseProps } from '../../utils/base-props';

export interface OnDate {
  date: string;
  options: {
    weekStartsOnSunday: boolean;
    calendarComponent: new () => Component<any, any>;
  };
}

export interface StartOnDateProps extends BaseProps {
  onDate: OnDate;
}

const StartOnDate = (props: StartOnDateProps) => {
  const CustomCalendar = props.onDate.options.calendarComponent;
  const locale = props.onDate.options.weekStartsOnSunday ? 'en-ca' : 'en-gb';
  const calendarAttributes = {
    'aria-label': translateLabel(props.translations, 'start.tooltip'),
    value: props.onDate.date,
    dateFormat: DATE_TIME_FORMAT,
    locale,
    readOnly: true,
  };

  return (
    <div className="col-6 col-sm-3">
      {CustomCalendar ? (
        <CustomCalendar
          key={`${props.id}-calendar`}
          {...calendarAttributes}
          onChange={(event: any) => {
            const editedEvent = {
              target: {
                value: event.target.value,
                name: 'start.onDate.date',
              },
            };

            props.handleChange(editedEvent);
          }}
        />
      ) : (
        <DateTime
          {...calendarAttributes}
          inputProps={{
            id: `${props.id}-datetime`,
            name: 'start.onDate.date',
            readOnly: true,
          }}
          locale={translateLabel(props.translations, 'locale')}
          timeFormat={false}
          initialViewMode="days"
          closeOnSelect
          onChange={(inputDate) => {
            const editedEvent = {
              target: {
                value: moment(inputDate).format(DATE_TIME_FORMAT),
                name: 'start.onDate.date',
              },
            };

            props.handleChange(editedEvent);
          }}
        />
      )}
    </div>
  );
};

export default StartOnDate;
