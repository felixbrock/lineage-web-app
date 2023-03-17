import React, { useContext, useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import {
  changeColumnTest,
  changeTableTest,
  changeTest,
} from '../dataComponents/handleTestData';
import { Test } from '../dataComponents/buildTableData';
import { TableContext } from '../newtest';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getColor(
  active: boolean,
  hasOnChildren: boolean,
  frequencyRange: number[],
  cron: string
) {
  let hasFrequencyRange: boolean = false;
  if (cron === 'custom') {
    hasFrequencyRange = true;
  } else {
    if (frequencyRange) {
      if (frequencyRange[0] === frequencyRange[1]) {
        hasFrequencyRange = false;
      } else {
        hasFrequencyRange = true;
      }
    }
  }

  let color = '';
  if (active && !hasFrequencyRange) color = 'bg-green-600';
  if (active && hasFrequencyRange) color = 'bg-cito';
  if (!active && hasOnChildren && !hasFrequencyRange) color = 'bg-green-300';
  if (!active && hasOnChildren && hasFrequencyRange) color = 'bg-yellow-400';
  if (!active && !hasOnChildren) color = 'bg-gray-200';
  return color;
}

export default function Toggle({
  testState,
  hasOnChildren,
  columnLevel,
  elementId,
  newTestState,
  setNewTestState,
}: {
  testState: Test;
  hasOnChildren: boolean;
  columnLevel: boolean;
  elementId: string;
  newTestState: any;
  setNewTestState: any;
}) {
  const tableContextData = useContext(TableContext);

  const { id, active, cron, frequencyRange, name } = testState;
  const [enabled, setEnabled] = useState(active);
  const [color, setColor] = useState(
    getColor(active, hasOnChildren, frequencyRange, cron)
  );
  useEffect(() => {
    setColor(getColor(enabled, hasOnChildren, frequencyRange, cron));
  }, [enabled]);

  function toggleSwitch(switchValue: boolean) {
    setEnabled(switchValue);
    setNewTestState({ ...newTestState, newActivatedState: switchValue });
    changeTest(
      elementId,
      { ...newTestState, newActivatedState: switchValue },
      columnLevel,
      testState,
      tableContextData
    );
  }

  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={toggleSwitch}
        className={classNames(
          color,
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
