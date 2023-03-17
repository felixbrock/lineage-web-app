import { Fragment, useContext, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Frequency } from '../test';
import { changeTest } from '../dataComponents/handleTestData';
import { Test } from '../dataComponents/buildTableData';
import { TableContext } from '../newtest';

const buildCronExpression = (frequency: Frequency) => {
  const currentDate = new Date();
  const currentMinutes = currentDate.getUTCMinutes();
  const currentHours = currentDate.getUTCHours();

  switch (frequency) {
    case '1h':
      return `${currentMinutes} * * * ? *`;

    case '3h':
      return `${currentMinutes} */3 * * ? *`;

    case '6h':
      return `${currentMinutes} */6 * * ? *`;

    case '12h':
      return `${currentMinutes} */12 * * ? *`;

    case '24h':
      return `${currentMinutes} ${currentHours} * * ? *`;
    default:
      throw new Error('Unhandled frequency type');
  }
};

const frequencies = {
  '1h': '1h',
  '3h': '3h',
  '6h': '6h',
  '12h': '12h',
  '24h': '24h',
  custom: 'Custom',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const getFrequency = (cron: string) => {
  if (cron === 'custom') return cron;
  const parts = cron.split(' ');

  if (parts.length !== 6)
    throw new Error(
      'Unexpected cron exp. format received. Expected 6 elements'
    );

  if (
    !Number.isNaN(Number(parts[0])) &&
    parts.slice(1).every((el) => el === '*' || el === '?')
  )
    return '1h';
  if (
    !Number.isNaN(Number(parts[0])) &&
    parts[1] === '*/3' &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return '3h';
  if (
    !Number.isNaN(Number(parts[0])) &&
    parts[1] === '*/6' &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return '6h';
  if (
    !Number.isNaN(Number(parts[0])) &&
    parts[1] === '*/12' &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return '12h';
  if (
    !Number.isNaN(Number(parts[0])) &&
    !Number.isNaN(Number(parts[1])) &&
    parts.slice(2).every((el) => el === '*' || el === '?')
  )
    return '24h';
  return 'custom';
};

export default function FrequencyDropdown({
  testState,
  cron,
  frequencyRange,
  columnLevel,
  newTestState,
  setNewTestState,
  elementId,
}: {
  testState: Test;
  cron: string;
  frequencyRange: number[];
  columnLevel: boolean;
  newTestState: any;
  setNewTestState: any;
  elementId: string;
}) {
  let frequency;
  if (!frequencyRange) {
    frequency = frequencies[getFrequency(cron || newTestState.newFrequency)];
  } else {
    if (frequencyRange[0] === frequencyRange[1]) {
      frequency = frequencyRange[0] + 'h';
    } else {
      frequency = `${frequencyRange[0]}h - ${frequencyRange[1]}h`;
    }
  }

  const tableContextData = useContext(TableContext);
  const [selected, setSelected] = useState(frequency);

  function changeFrequencySelection(value: string) {
    setSelected(value);
    let newFrequency;
    if (value === 'Custom') {
      newFrequency = 'custom';
    } else {
      newFrequency = buildCronExpression(value);
    }
    setNewTestState({ ...newTestState, newFrequency: newFrequency });
    changeTest(
      elementId,
      { ...newTestState, newFrequency: newFrequency },
      columnLevel,
      testState,
      tableContextData
    );
  }

  return (
    <Listbox value={selected} onChange={changeFrequencySelection}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cito focus:outline-none focus:ring-1 focus:ring-cito sm:text-sm">
              <span className="block truncate">{selected}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-40 mt-1 w-full min-w-[7rem] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {Object.values(frequencies).map((frequencyOption) => (
                  <Listbox.Option
                    key={frequencyOption}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-cito text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={frequencyOption}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          )}
                        >
                          {frequencyOption}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-cito',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
