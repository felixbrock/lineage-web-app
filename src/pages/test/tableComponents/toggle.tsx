import React, { useContext, useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { Test } from '../dataComponents/buildTableData';
import { TableContext } from '../newtest';
import { BulkNewTestState } from './mainTable';
import { classNames } from '../utils/tailwind';
import { Level } from '../config';

export const buttonColorOn = 'bg-green-600';
export const buttonColorOff = 'bg-gray-200';
export const buttonColorOnFrequencyRange = 'bg-cito';
export const buttonColorOffNoFrequencyRange = 'bg-green-300';
export const buttonColorOffFrequencyRange = 'bg-yellow-400';

type ColorPicker = Pick<Test, 'active' | 'cron' | 'summary'>;
function getColor({ active, cron, summary }: ColorPicker) {
  let hasFrequencyRange: boolean = cron === '' ? true : false;

  let color = '';
  if (active && !hasFrequencyRange) color = buttonColorOn;
  if (active && hasFrequencyRange) color = buttonColorOnFrequencyRange;
  if (!active && summary?.activeChildren && !hasFrequencyRange)
    color = buttonColorOffNoFrequencyRange;
  if (!active && summary?.activeChildren && hasFrequencyRange)
    color = buttonColorOffFrequencyRange;
  if (!active && !summary?.activeChildren) color = buttonColorOff;
  return color;
}

export default function Toggle({
  test,
  parentElementId,
  level,
}: {
  test: Test;
  parentElementId: string;
  level: Level;
}) {
  const tableContext = useContext(TableContext);

  const { id, active, cron, summary } = test;
  const [enabled, setEnabled] = useState(active);

  useEffect(() => {
    setEnabled(active);
  }, [active]);

  // if active state is changed alse change newTestState
  // necessary for Table Tests to Reflect all children column tests

  async function toggleSwitch(switchValue: boolean) {
    const success = await tableContext.handleTestChange(
      [parentElementId],
      [test.type],
      { newActivatedState: switchValue, newFrequency: undefined },
      level
    );
    if (success) setEnabled(switchValue);
  }

  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        disabled={id.includes('TEMP_ID')}
        onChange={toggleSwitch}
        className={classNames(
          getColor({ active: enabled, cron, summary }),
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  );
}

export function BulkToggle({
  newTestState,
  setNewTestState,
  sendState,
}: {
  newTestState: BulkNewTestState;
  setNewTestState: React.Dispatch<React.SetStateAction<BulkNewTestState>>;
  sendState: boolean;
}) {
  const enable = newTestState.newActivatedState;

  function toggleSwitch(switchValue: boolean) {
    setNewTestState({
      ...newTestState,
      newActivatedState: switchValue,
    });
  }

  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enable}
        disabled={!sendState}
        onChange={toggleSwitch}
        className={classNames(
          !sendState ? 'opacity-50' : 'opacity-100',
          enable ? buttonColorOn : buttonColorOff,
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enable ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
