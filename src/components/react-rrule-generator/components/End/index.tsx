import EndAfter from './After';
import EndOnDate from './OnDate';

import translateLabel from '../../utils/translateLabel';
import { BaseProps } from '../../utils/base-props';

export const modeTypes = [
  'Never', 'After', 'On date'
] as const;
export type ModeType = typeof modeTypes[number];

export const parseModeType = (testType: unknown): ModeType => {
  const identifiedElement = modeTypes.find((element) => element === testType);
  if (identifiedElement) return identifiedElement;
  throw new Error('Provision of invalid type');
};

export interface EndProps extends BaseProps {
    end: {
      mode: string,
      after: number,
      onDate: {date: any, options: any},
      options: {
        modes: [
          'Never', 'After', 'On date'
        ],
        weekStartsOnSunday: boolean,
      },
    },
}

const End = (props: EndProps) => {
  const isOptionAvailable = (option: ModeType) => !props.end.options.modes || props.end.options.modes.indexOf(option) !== -1;
  const isOptionSelected = (option: string) => props.end.mode === option;

  return (
    <div className="px-3">
      <div className="form-group row">
        <div className="col-sm-2 text-sm-right">
          <label
            htmlFor={props.id}
            className="col-form-label"
          >
            <strong>
              {translateLabel(props.translations, 'end.label')}
            </strong>
          </label>
        </div>
        <div className="col-sm-3">
          <select
            name="end.mode"
            id={props.id}
            className="form-control"
            value={props.end.mode}
            onChange={props.handleChange}
          >
            {isOptionAvailable('Never') && <option value="Never">{translateLabel(props.translations, 'end.never')}</option>}
            {isOptionAvailable('After') && <option value="After">{translateLabel(props.translations, 'end.after')}</option>}
            {isOptionAvailable('On date') && <option value="On date">{translateLabel(props.translations, 'end.on_date')}</option>}
          </select>
        </div>

        {
          isOptionSelected('After') &&
          <EndAfter
            id={`${props.id}-after`}
            after={props.end.after}
            handleChange={props.handleChange}
            translations={props.translations}
          />
        }
        {
          isOptionSelected('On date') &&
          <EndOnDate
            id={`${props.id}-onDate`}
            onDate={props.end.onDate}
            handleChange={props.handleChange}
            translations={props.translations}
          />
        }

      </div>
    </div>
  );
};

export default End;
