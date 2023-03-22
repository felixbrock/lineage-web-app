import React, { useContext, useState } from 'react';
import { Switch } from '@headlessui/react';
import { Test } from '../dataComponents/buildTableData';
import { TableContext } from '../newtest';
import { NewTestState } from './mainTable';
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
          getColor({ active: active, cron, summary }),
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

export function BulkToggle({
  newTestState,
  setNewTestState,
}: {
  newTestState: NewTestState;
  setNewTestState: React.Dispatch<React.SetStateAction<NewTestState>>;
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
        onChange={toggleSwitch}
        className={classNames(
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
