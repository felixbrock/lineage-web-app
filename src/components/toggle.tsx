import { Switch } from '@headlessui/react';
import { ReactElement, useEffect, useState } from 'react';

export default ({
  mode,
  modeOptions,
  disabled,
  modeChangeCallback,
}: {
  mode: string;
  modeOptions: [string, string];
  disabled: boolean;
  modeChangeCallback: (checked: boolean) => void;
}): ReactElement => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(mode === modeOptions[1]);
  }, [mode]);

  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch.Label className="mr-4">{mode}</Switch.Label>
        <Switch
          checked={checked}
          disabled={disabled}
          onChange={() => modeChangeCallback(!checked)}
          className={`${
            checked ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};
