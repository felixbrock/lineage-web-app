import  { Component } from 'react';
import moment from 'moment';
import 'moment/min/locales';

import { DATE_TIME_FORMAT } from '../../constants/index';
import translateLabel from '../../utils/translateLabel';
import DateTime from 'react-datetime';
import { BaseProps } from '../../utils/base-props';


export interface EndOnDateProps extends BaseProps {
  onDate: {
    date: string,
    options: {
      weekStartsOnSunday: boolean,
      calendarComponent: new() => Component<any, any>
    },
  },
}

const EndOnDate = (props: EndOnDateProps) => {
  const CustomCalendar = props.onDate.options.calendarComponent;

  const locale = props.onDate.options.weekStartsOnSunday ? 'en-ca' : 'en-gb';
  const calendarAttributes = {
    'aria-label': translateLabel(props.translations, 'end.tooltip'),
    value: props.onDate.date,
    dateFormat: DATE_TIME_FORMAT,
    locale,
    readOnly: true,
  };

  return (
    <div className="col-6 col-sm-3">
      {
        CustomCalendar
          ? <CustomCalendar
            key={`${props.id}-calendar`}
            {...calendarAttributes}
            onChange={(event: any) => {
              const editedEvent = {
                target: {
                  value: event.target.value,
                  name: 'end.onDate.date',
                },
              };

              props.handleChange(editedEvent);
            }}
          />
          : <DateTime
            {...calendarAttributes}
            inputProps={
              {
                id: `${props.id}-datetime`,
                name: 'end.onDate.date',
                readOnly: true,
              }
            }
            locale={translateLabel(props.translations, 'locale')}
            timeFormat={false}
            initialViewMode="days"
            closeOnSelect
            onChange={(inputDate: any) => {
              const editedEvent = {
                target: {
                  value: moment(inputDate).format(DATE_TIME_FORMAT),
                  name: 'end.onDate.date',
                },
              };

              props.handleChange(editedEvent);
            }}
          />
      }
    </div>
  );
};



export default EndOnDate;
