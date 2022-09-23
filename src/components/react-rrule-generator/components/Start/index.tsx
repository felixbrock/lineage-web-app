import StartOnDate, { OnDate } from './OnDate';

import translateLabel from '../../utils/translateLabel';
import { BaseProps } from '../../utils/base-props';

export interface StartProps extends BaseProps {
  start: {
    onDate: OnDate,
  }
}

const Start = (props: StartProps) => (
  <div className="px-3">
    <div className="form-group row">
      <div className="col-sm-2 text-sm-right">
        <label
          htmlFor={props.id}
          className="col-form-label"
        >
          <strong>
            {translateLabel(props.translations, 'start.label')}
          </strong>
        </label>
      </div>
      <StartOnDate id={props.id} onDate={props.start.onDate} handleChange={props.handleChange} translations={props.translations} />
    </div>
  </div>
);

export default Start;
