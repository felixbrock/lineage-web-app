import RepeatYearlyOn, { On } from './On';
import { BaseProps } from '../../../utils/base-props';
import RepeatYearlyOnThe, {OnThe} from './OnThe';

type Mode = 'on' | 'on the';

export interface Yearly {
  mode: Mode;
  on: On;
  onThe: OnThe;
  options: {
    modes: ['on', 'on the'];
  };
}

export interface RepeatYearlyProps extends BaseProps {
  yearly: Yearly;
}

const RepeatYearly = (props: RepeatYearlyProps) => {
  const isTheOnlyOneMode = false;
  const isOptionAvailable = true;
  // const isTheOnlyOneMode = (option: Mode) => props.yearly.options.modes.includes(option) && props.yearly.options.modes.length === 1;
  // const isOptionAvailable = (option) =>
  //   !options.modes || isTheOnlyOneMode(option);
  return (
    <div>
      {isOptionAvailable && (
        <RepeatYearlyOn
          id={`${props.id}-on`}
          mode={props.yearly.mode}
          on={props.yearly.on}
          hasMoreModes={!isTheOnlyOneMode}
          handleChange={props.handleChange}
          translations={props.translations}
        />
      )}
      {isOptionAvailable && (
        <RepeatYearlyOnThe
          id={`${props.id}-onThe`}
          mode={props.yearly.mode}
          onThe={props.yearly.onThe}
          hasMoreModes={!isTheOnlyOneMode}
          handleChange={props.handleChange}
          translations={props.translations}
        />
      )}
    </div>
  );
};

export default RepeatYearly;
