import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import { TEST_TYPES } from '../config';
import { TestType } from '../dataComponents/buildTableData';
import { classNames } from '../utils/tailwind';
import { BulkNewTestState, testTypes } from './mainTable';

export function TestTypeFrequencyDropdown({
  newTestState,
  setNewTestState,
}: {
  newTestState: BulkNewTestState;
  setNewTestState: React.Dispatch<React.SetStateAction<BulkNewTestState>>;
}) {
  const defaultTestTypes = newTestState.forTestTypes;
  const selectedType = defaultTestTypes.length > 1 ? 'All' : defaultTestTypes[0];

  function changeTestTypeSelection(testType: TestType | 'All') {
    if (testType === 'All') {
      setNewTestState({ ...newTestState, forTestTypes: [...TEST_TYPES] });
    } else {
      setNewTestState({ ...newTestState, forTestTypes: [testType] });
    }
  }

  function findHeading(testType: TestType | 'All') {
    if (testType === 'All') return 'All';
    let rightHeading;
    Object.entries(testTypes).forEach(([heading, type]) => {
      if (type === testType) rightHeading = heading;
    });
    return rightHeading;
  }

  return (
    <Listbox value={selectedType} onChange={changeTestTypeSelection}>
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-cito focus:outline-none focus:ring-1 focus:ring-cito sm:text-sm">
              <span className="block truncate">{findHeading(selectedType)}</span>
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
                {Object.values(testTypes).map((testType) => {
                  return (
                    <Listbox.Option
                      key={testType}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-cito text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={testType}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {findHeading(testType)}
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

                <Listbox.Option
                  key={'All'}
                  className={({ active }) =>
                    classNames(
                      active ? 'bg-cito text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9'
                    )
                  }
                  value={'All'}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                          selected ? 'font-semibold' : 'font-normal',
                          'block truncate'
                        )}
                      >
                        All
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
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
