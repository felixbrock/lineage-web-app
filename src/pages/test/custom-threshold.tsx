import { Transition, Tab } from '@headlessui/react';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';

export default ({
  show,
  testSuiteId,
  closeCallback,
  setScheduleCallback,
}: {
  show: boolean;
  testSuiteId: string;
  closeCallback: () => void;
  setScheduleCallback: (cronExp: string) => void;
}) => {
  const [lowerThresholdAbsolute, setLowerThresholdAbsolute] = useState(0);
  const [upperThresholdAbsolute, setUpperThresholdAbsolute] = useState(0);
  const [lowerThresholdRelative, setLowerThresholdRelative] = useState(0);
  const [upperThresholdRelative, setUpperThresholdRelative] = useState(0);

  const handleCreateClick = () => {
    if (!expressionValid) return;

    let dayOfMonth = expressionParts.dayOfMonth;
    let dayOfWeek = transformDayOfWeekExpression(
      expressionParts.dayOfWeek,
      'aws'
    );

    if (dayOfMonth === '*' && dayOfWeek === '*') {
      dayOfMonth = '*';
      dayOfWeek = '?';
    } else if (dayOfMonth === '*') dayOfMonth = '?';
    else if (dayOfWeek === '*') dayOfWeek = '?';

    const expression = `${expressionParts.minutes} ${expressionParts.hours} ${dayOfMonth} ${expressionParts.month} ${dayOfWeek} ${expressionParts.year}`;

    createdScheduleCallback(expression);
  };

  useEffect(() => {}, [testSuiteId]);

  useEffect(() => {
    if (!testSuiteId) return;
  }, [show]);

  return (
    <Transition appear show={show} as={Fragment}>
      <div className="relative z-10">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="m-4 w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between">
                  <h3 className="mb-2 text-lg font-bold leading-6 text-gray-900">
                    Define Custom Frequency
                  </h3>
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-2"
                    onClick={closeCallback}
                  >
                    <MdClose className="flex h-6 w-6 content-center justify-center fill-gray-500 text-center hover:fill-cito" />
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-white hover:text-cito hover:ring-2 hover:ring-cito hover:ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cito focus-visible:ring-offset-2"
                    onClick={handleCreateClick}
                  >
                    Save
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Transition>
  );
};
