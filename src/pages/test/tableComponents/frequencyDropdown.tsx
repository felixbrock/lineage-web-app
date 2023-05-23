import { Fragment, useContext, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Test } from '../dataComponents/buildTableData';
import { TableContext } from '../test';
import { BulkNewTestState } from './mainTable';
import { Level } from '../config';
import { buildCronExpression, frequencies, getFrequency } from '../utils/cron';
import { classNames } from '../utils/tailwind';

function getShownFrequency(cron: string, test?: Test) {
  if (cron === '' && test?.summary) {
    const minFrequency = test.summary.frequencyRange[0];
    const displayedMinFrequency =
      minFrequency === 0 ? 'Custom' : minFrequency + 'h';
    const maxFrequency = test.summary.frequencyRange[1];
    const displayedMaxFrequency = maxFrequency + 'h';

    return displayedMinFrequency + ' - ' + displayedMaxFrequency;
  } else {
    if (cron === 'custom') return 'Custom';
    const numericalFrequency = getFrequency(cron);
    if (numericalFrequency === 0) return 'Custom';
    return numericalFrequency + 'h';
  }
}
export default function FrequencyDropdown({
  test,
  parentElementId,
  level,
}: {
  test: Test;
  parentElementId: string;
  level: Level;
}) {
  const tableContext = useContext(TableContext);
  const [selected, setSelected] = useState(test.cron);

  async function changeFrequencySelection(newCron: string) {
    const success = await tableContext.handleTestChange(
      [parentElementId],
      [test.type],
      { newFrequency: newCron, newActivatedState: undefined },
      level
    );
    if (success) setSelected(newCron);
  }

  return (
    <Listbox
      value={selected}
      disabled={test.id.includes('TEMP_ID')}
      onChange={changeFrequencySelection}
    >
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cito focus:outline-none focus:ring-1 focus:ring-cito sm:text-sm">
              <span className="block truncate">
                {getShownFrequency(selected, test)}
              </span>
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
                {Object.values(frequencies).map((frequencyOption) => {
                  return (
                    <Listbox.Option
                      key={frequencyOption}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-cito text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={buildCronExpression(frequencyOption)}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {frequencyOption === 0 ? (
                              'Custom'
                            ) : (
                              <>{frequencyOption}h</>
                            )}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-cito',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

export function BulkFrequencyDropdown({
  newTestState,
  setNewTestState,
  sendFrequency,
}: {
  newTestState: BulkNewTestState;
  setNewTestState: React.Dispatch<React.SetStateAction<BulkNewTestState>>;
  sendFrequency: boolean;
}) {
  const selected = newTestState.newFrequency;

  function changeFrequencySelection(newCron: string) {
    setNewTestState({ ...newTestState, newFrequency: newCron });
  }

  return (
    <Listbox
      disabled={!sendFrequency}
      value={selected}
      onChange={changeFrequencySelection}
    >
      {({ open }) => (
        <>
          <div
            className={classNames(
              'relative',
              !sendFrequency ? 'opacity-50' : 'opacity-100'
            )}
          >
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cito focus:outline-none focus:ring-1 focus:ring-cito sm:text-sm">
              <span className="block truncate">{selected ? getFrequency(selected): ''}h</span>
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
                {Object.values(frequencies).map((frequencyOption) => {
                  return (
                    <Listbox.Option
                      key={frequencyOption}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-cito text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={buildCronExpression(frequencyOption)}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {frequencyOption === 0 ? (
                              'Custom'
                            ) : (
                              <>{frequencyOption}h</>
                            )}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-cito',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
