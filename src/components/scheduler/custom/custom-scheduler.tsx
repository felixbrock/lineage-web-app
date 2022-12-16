import { ChangeEvent, ReactElement, useState } from 'react';
import { ExpressionParts } from '../scheduler';
import Description from './description';

interface FieldDescription {
  allowedValueRange: string;
  wildcards: string[];
}

export const fieldTypes = [
  'minutes',
  'hours',
  'dayOfMonth',
  'month',
  'dayOfWeek',
] as const;
export type FieldType = typeof fieldTypes[number];

export const parseFieldType = (fieldType: string): FieldType => {
  const identifiedElement = fieldTypes.find(
    (element) => element.toLowerCase() === fieldType.toLowerCase()
  );
  if (identifiedElement) return identifiedElement;
  throw new Error('Provision of invalid type');
};

const fieldDescription: { [key: string]: FieldDescription } = {
  minutes: {
    allowedValueRange: '0-59',
    wildcards: [',', '-', '*', '/'],
  },
  hours: {
    allowedValueRange: '0-23',
    wildcards: [',', '-', '*', '/'],
  },
  dayOfMonth: {
    allowedValueRange: '1-31',
    wildcards: [',', '-', '*', '/'],
  },
  month: {
    allowedValueRange: '1-12 or JAN-DEC',
    wildcards: [',', '-', '*', '/'],
  },
  dayOfWeek: {
    allowedValueRange: '1-7 or SUN-SAT',
    wildcards: [',', '-', '*'],
  },
};

const inputFieldClassName =
  'block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-cito focus:bg-white focus:outline-0 focus:w-full duration-500';

export default ({
  expressionParts,
  onChangeCallback,
  onBlurCallback,
}: {
  expressionParts: ExpressionParts;
  onChangeCallback: (
    e: ChangeEvent<HTMLInputElement>,
    fieldType: FieldType
  ) => void;
  onBlurCallback: (
    e: {target: unknown},
    fieldType: FieldType
  ) => void;
}): ReactElement => {
  const [typeOfSelectedField, setTypeOfSelectedField] = useState<FieldType>();

  const handleOnFocus = (e: unknown, fieldType: FieldType) =>
    setTypeOfSelectedField(fieldType);

  return (
    <>
      <form className="my-4 w-full">
        <div className="grid grid-cols-5 gap-2">
          <div>
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-minutes"
            >
              Minutes (in UTC)
            </label>
            <input
              className={inputFieldClassName}
              id="grid-minutes"
              type="text"
              placeholder="*"
              value={expressionParts.minutes}
              onFocus={(e) => handleOnFocus(e, 'minutes')}
              autoFocus={true}
              onChange={(e) => onChangeCallback(e, 'minutes')}
              onBlur ={(e) => onBlurCallback(e, 'minutes')}
            />
          </div>
          <div>
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-hours"
            >
              Hours (in UTC)
            </label>
            <input
              className={inputFieldClassName}
              id="grid-hours"
              type="text"
              placeholder="*"
              value={expressionParts.hours}
              onFocus={(e) => handleOnFocus(e, 'hours')}
              onChange={(e) => onChangeCallback(e, 'hours')}
              onBlur={(e) => onBlurCallback(e, 'hours')}
            />
          </div>
          <div>
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-day-of-month"
            >
              Day of Month
            </label>
            <input
              className={inputFieldClassName}
              id="grid-day-of-month"
              type="text"
              placeholder="*"
              value={expressionParts.dayOfMonth}
              onFocus={(e) => handleOnFocus(e, 'dayOfMonth')}
              onChange={(e) => onChangeCallback(e, 'dayOfMonth')}
              onBlur={(e) => onBlurCallback(e, 'dayOfMonth')}
            />
          </div>
          <div>
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-month"
            >
              Month
            </label>
            <input
              className={inputFieldClassName}
              id="grid-month"
              type="text"
              placeholder="*"
              value={expressionParts.month}
              onFocus={(e) => handleOnFocus(e, 'month')}
              onChange={(e) => onChangeCallback(e, 'month')}
              onBlur={(e) => onBlurCallback(e, 'month')}
            />
          </div>
          <div>
            <label
              className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
              htmlFor="grid-day-of-week"
            >
              Day of Week
            </label>
            <input
              className={inputFieldClassName}
              id="grid-day-of-week"
              type="text"
              placeholder="*"
              value={expressionParts.dayOfWeek}
              onFocus={(e) => handleOnFocus(e, 'dayOfWeek')}
              onChange={(e) => onChangeCallback(e, 'dayOfWeek')}
              onBlur={(e) => onBlurCallback(e, 'dayOfWeek')}
            />
          </div>
        </div>
      </form>
      <div className="my-4 rounded p-2 ring-1 ring-gray-200 ">
        <Description
          allowedValueRange={
            typeOfSelectedField
              ? fieldDescription[typeOfSelectedField].allowedValueRange
              : ''
          }
          wildcards={
            typeOfSelectedField
              ? fieldDescription[typeOfSelectedField].wildcards
              : []
          }
        />
      </div>
    </>
  );
};
