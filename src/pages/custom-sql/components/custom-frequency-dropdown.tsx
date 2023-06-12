import React, { Fragment } from "react";
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import ObservabilityApiRepo from "../../../infrastructure/observability-api/observability-api-repo";
import { buildCronExpression } from "./custom-utils";
import { DEFAULT_FREQUENCY } from "../config-custom";

export default function FrequencyDropdown({
    newTestFrequency,
    setNewTestFrequency,
    changingFrequency,
    updateFrequencyCallback,
    testId
}: {
    newTestFrequency: string,
    setNewTestFrequency: React.Dispatch<React.SetStateAction<string>>,
    changingFrequency: boolean;
    updateFrequencyCallback?: (testId: string, frequency: string) => void;
    testId?: string;
}) {

    const frequencies = ['1h', '3h', '6h', '12h', '24h'];

    const handleChange = async (event: string) => {
        setNewTestFrequency(event);

        if (changingFrequency && testId !== undefined && updateFrequencyCallback) {
          const cronString = buildCronExpression(event);

          await ObservabilityApiRepo.updateCustomTestSuite({
            id: testId,
            props: {
              cron: cronString ? cronString : DEFAULT_FREQUENCY
            }
          });

          updateFrequencyCallback(testId, event);
        }
    }
   
    return (
      <Listbox
        value={newTestFrequency}
        onChange={handleChange}
      >
        {({ open }) => (
          <>
            <div className="relative">
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm 
                                            focus:border-cito focus:outline-none focus:ring-1 focus:ring-cito sm:text-sm"
                >
                <span className="block truncate">
                    {newTestFrequency ? newTestFrequency : <span className="text-gray-500">Select Frequency...</span>}
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
                <Listbox.Options className="absolute z-40 mt-1 w-full min-w-[7rem] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 
                                                ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {Object.values(frequencies).map((frequencyOption) => {
                    return (
                      <Listbox.Option
                        key={frequencyOption}
                        className={({ active }) =>
                            `${active ? 'bg-cito text-white' : 'text-gray-900'} relative cursor-default select-none py-2 pl-3 pr-9`
                        }
                        value={frequencyOption}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}
                            >
                            {frequencyOption}
                            </span>
  
                            {selected ? (
                              <span
                                className={`${active ? 'text-white' : 'text-cito'} absolute inset-y-0 right-0 flex items-center pr-4`}
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