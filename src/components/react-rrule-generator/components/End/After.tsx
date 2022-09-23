import { BaseProps } from '../../utils/base-props';
import numericalFieldHandler from '../../utils/numericalFieldHandler';
import translateLabel from '../../utils/translateLabel';

export interface EndAfterProps extends BaseProps {
  after: number;
}

const EndAfter = (props: EndAfterProps) => (
  <div className="col-sm-4">
    <div className="form-group m-0 row d-flex align-items-center">
      <div className="col-3 col-sm-6 pl-0">
        <input
          id={props.id}
          name="end.after"
          aria-label="End after"
          className="form-control"
          value={props.after}
          onChange={numericalFieldHandler(props.handleChange)}
        />
      </div>
      <div className="col-9 col-sm-6">
        {translateLabel(props.translations, 'end.executions')}
      </div>
    </div>
  </div>
);

export default EndAfter;
