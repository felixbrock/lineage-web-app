import { Transition, Tab } from '@headlessui/react';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import CustomScheduler, { FieldType } from './custom/custom-scheduler';
import QuickScheduler from './quick/quick-scheduler';
import translate from './translate';
export interface ExpressionParts {
  minutes: string;
  hours: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  year: string;
}

export default ({
  show,
  closeCallback,
  createdScheduleCallback,
}: {
  show: boolean;
  closeCallback: () => void;
  createdScheduleCallback: (cronExpression: string) => void;
}) => {
  const [translation, setTranslation] = useState('');

  const [expressionValid, setExpressionValid] = useState<boolean>(true);

  const [expressionParts, setExpressionParts] = useState<ExpressionParts>({
    minutes: '*',
    hours: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
    year: '*',
  });

  const customSchedulerOnChangeCallback = (
    e: ChangeEvent<HTMLInputElement>,
    fieldType: FieldType
  ) => {
    const localExpressionParts = expressionParts;

    const value = e.target.value;

    localExpressionParts[fieldType] = value;

    setExpressionParts({ ...localExpressionParts });
  };

  const customSchedulerBlurCallback = (
    e: { target: unknown },
    fieldType: FieldType
  ) => {
    const localExpressionParts = expressionParts;

    const target = e.target;

    const hasValue = (obj: unknown): obj is { value: unknown } =>
      !!obj && typeof obj === 'object' && 'value' in obj;

    if (!hasValue(target) || typeof target.value !== 'string')
      throw new Error('Received unexpected input value format');

    localExpressionParts[fieldType] = target.value || '*';

    setExpressionParts({ ...localExpressionParts });
  };

  const quickSchedulerOnExpressionPartsChangeCallback = (
    expression: ExpressionParts
  ) => setExpressionParts({ ...expression });


  const handleCreateClick = () => {
    if (!expressionValid) return;

    const cronExpression = `${expressionParts.minutes} ${expressionParts.hours} ${expressionParts.dayOfMonth} ${expressionParts.month} ${expressionParts.dayOfWeek} ${expressionParts.year}`;

    createdScheduleCallback(cronExpression);
    closeCallback();
  };

  useEffect(() => {
    const expressionNoYear = `${expressionParts.minutes} ${expressionParts.hours} ${expressionParts.dayOfMonth} ${expressionParts.month} ${expressionParts.dayOfWeek}`;

    const translationResult = translate(expressionNoYear);

    if (translationResult.description) {
      setTranslation(translationResult.description.full);
      setExpressionValid(true);
      return;
    }

    setExpressionValid(false);
    setTranslation(
      'Unknown schedule - Please make sure your expression is correct'
    );
  }, [expressionParts]);

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
                <p
                  className={`my-4 h-20 break-normal text-center text-lg font-medium italic ${
                    expressionValid ? 'text-gray-500' : 'text-red-500'
                  }`}
                >
                  {`"${translation}" (in UTC)`}
                </p>
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-cito p-1">
                    <Tab
                      key="quick-scheduler"
                      className={({ selected }) =>
                        `flex w-full flex-col items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5 text-white
                          ring-white ring-opacity-60 ring-offset-2 ring-offset-cito focus:outline-none focus:ring-2
                          ${
                            selected
                              ? 'bg-white text-cito shadow'
                              : 'hover:bg-white/[0.12] hover:text-white'
                          }`
                      }
                    >
                      Quick
                    </Tab>
                    <Tab
                      key="custom-scheduler"
                      className={({ selected }) =>
                        `flex w-full flex-col items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5 text-white
                          ring-white ring-opacity-60 ring-offset-2 ring-offset-cito focus:outline-none focus:ring-2
                          ${
                            selected
                              ? 'bg-white text-cito shadow'
                              : 'hover:bg-white/[0.12] hover:text-white'
                          }`
                      }
                    >
                      Custom
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="mt-2">
                    <Tab.Panel
                      key={0}
                      className={`rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2`}
                    >
                      <QuickScheduler
                        onExpressionPartsChangeCallback={
                          quickSchedulerOnExpressionPartsChangeCallback
                        }
                      />
                    </Tab.Panel>
                    <Tab.Panel
                      key={1}
                      className={`rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2`}
                    >
                      <CustomScheduler
                        expressionParts={expressionParts}
                        onChangeCallback={customSchedulerOnChangeCallback}
                        onBlurCallback={customSchedulerBlurCallback}
                      />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-black hover:bg-white hover:text-cito hover:ring-2 hover:ring-cito hover:ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cito focus-visible:ring-offset-2"
                    onClick={handleCreateClick}
                  >
                    Create
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
