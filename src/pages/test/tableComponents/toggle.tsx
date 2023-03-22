import React, { useContext } from 'react';
import { Switch } from '@headlessui/react';
import { Test } from '../dataComponents/buildTableData';
import { TableContext } from '../newtest';
import { NewTestState } from './mainTable';
import { classNames } from '../utils/tailwind';
import { Level } from '../config';

type ColorPicker = Pick<Test, 'active' | 'cron' | 'summary'>;
function getColor({ active, cron, summary }: ColorPicker) {
  let hasFrequencyRange: boolean = cron === '' ? true : false;

  let color = '';
  if (active && !hasFrequencyRange) color = 'bg-green-600';
  if (active && hasFrequencyRange) color = 'bg-cito';
  if (!active && summary?.activeChildren && !hasFrequencyRange)
    color = 'bg-green-300';
  if (!active && summary?.activeChildren && hasFrequencyRange)
    color = 'bg-yellow-400';
  if (!active && !summary?.activeChildren) color = 'bg-gray-200';
  return color;
}

export default function Toggle({
  test,
  newTestState,
  setNewTestState,
  parentElementId,
  level,
}: {
  test: Test;
  newTestState: NewTestState;
  setNewTestState: React.Dispatch<React.SetStateAction<NewTestState>>;
  parentElementId: string;
  level: Level;
}) {
  const tableContext = useContext(TableContext);
  const setAlertInfo = tableContext.setAlertInfo;

  const { id, active, cron, summary } = test;

  function toggleSwitch(switchValue: boolean) {
    if (switchValue && cron === '') {
      setAlertInfo({
        show: true,
        title: 'No Cron Job Specified',
        description:
          'We cannot apply a range of cron frequencies to tests. Please choose one.',
      });
      return;
    }

    const updatedTestState = {
      ...newTestState,
      newActivatedState: switchValue,
    };
    setNewTestState(updatedTestState);
    tableContext.handleTestChange(
      parentElementId,
      test,
      updatedTestState,
      level
    );
  }

  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={active}
        disabled={id.includes('TEMP_ID')}
        onChange={toggleSwitch}
        className={classNames(
          getColor({active: active, cron, summary}),
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            active ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
