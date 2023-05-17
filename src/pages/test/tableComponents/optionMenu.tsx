import Toggle from './toggle';
import { Fragment, useContext, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  PhoneIcon,
  PlayCircleIcon,
} from '@heroicons/react/20/solid';
import FrequencyDropdown from './frequencyDropdown';
import { Test } from '../dataComponents/buildTableData';
import { TableContext } from '../test';
import { Level } from '../config';
import { classNames } from '../utils/tailwind';
import CustomThreshold, { CustomThresholdState } from '../components/custom-threshold';
import ObservabilityApiRepo, { CustomThresholdMode } from '../../../infrastructure/observability-api/observability-api-repo';

const callsToAction = [
  { name: 'Example', href: '#', icon: PlayCircleIcon },
  { name: 'Example2', href: '#', icon: PhoneIcon },
];

type Summary = Pick<Test, 'summary'>;
function TestCounter({ summary }: Summary) {
  return (
    <h1>
      {summary?.activeChildren}/{summary?.totalChildren}
    </h1>
  );
}

function UpperThreshold({ threshold }: { threshold: number }) {
  return <h1>Upper: {threshold} </h1>;
}

function LowerThreshold({ threshold }: { threshold: number }) {
  return <h1>Lower: {threshold} </h1>;
}

export function MenuComponent({
  test,
  parentElementId,
  level,
  index,
}: {
  test: Test;
  parentElementId: string;
  level: Level;
  index: number;
}) {
  const tableContext = useContext(TableContext);
  const currentTheme = tableContext.theme.currentTheme;
  const tableColorConfig =
    tableContext.theme.colorConfig[currentTheme].table[level];
  const { textColor } = tableColorConfig;

  const [customThresholdState, setCustomThresholdState] = useState<{
    show: boolean;
    target?: {
      target: {
        id: string;
        matId?: string;
      };
      testSuiteRep: {
        id: string;
        type: string;
        state: CustomThresholdState;
      };
    };
  }>({
    show: true,
  });

  const { id, 
          active,
          type,
          // customLowerThresholdMode,
          // customUpperThresholdMode,
          customLowerThreshold,
          customUpperThreshold,
          // feedbackLowerThreshold,
          // feedbackUpperThreshold,
          summary 
        } = test;
  
  // const closeCustomThresholdCallback = () => {
  //   setCustomThresholdState({ ...customThresholdState, show: false });
  // };

  // const saveCustomThresholdCallback = async (
  //   state: CustomThresholdState,
  //   testSuiteId: string,
  //   target: { id: string; matId?: string }
  // ): Promise<void> => {
  //   await ObservabilityApiRepo.updateTestSuites([
  //     {
  //       id: testSuiteId,
  //       props: {
  //         customLowerThreshold: state.lower,
  //         customUpperThreshold: state.upper,
  //       },
  //     },
  //   ]);

    // if (target.matId) {
    //   const colConfigIndex = testSelectionLocal[
    //     target.matId
    //   ].columnTestConfigs.findIndex((col) => col.id === target.id);

    //   if (colConfigIndex === -1)
    //     throw new Error('Invalid target for custom threshold setting target');

    //   const testConfigIndex = testSelectionLocal[
    //     target.matId
    //   ].columnTestConfigs[colConfigIndex].testConfigs.findIndex(
    //     (config) => config.testSuiteId === testSuiteId
    //   );

    //   if (testConfigIndex === -1)
    //     throw new Error('Invalid target for custom threshold setting target');

    //   testSelectionLocal[target.matId].columnTestConfigs[
    //     colConfigIndex
    //   ].testConfigs[testConfigIndex].customLowerThreshold = state.lower.value;
    //   testSelectionLocal[target.matId].columnTestConfigs[
    //     colConfigIndex
    //   ].testConfigs[testConfigIndex].customLowerThresholdMode =
    //     state.lower.mode;
    //   testSelectionLocal[target.matId].columnTestConfigs[
    //     colConfigIndex
    //   ].testConfigs[testConfigIndex].customUpperThreshold = state.upper.value;
    //   testSelectionLocal[target.matId].columnTestConfigs[
    //     colConfigIndex
    //   ].testConfigs[testConfigIndex].customUpperThresholdMode =
    //     state.upper.mode;
    // } else {
    //   const testConfigIndex = testSelectionLocal[
    //     target.id
    //   ].materializationTestConfigs.findIndex(
    //     (config) => config.testSuiteId === testSuiteId
    //   );

    //   if (testConfigIndex === -1)
    //     throw new Error('Invalid target for custom threshold setting target');

    //   testSelectionLocal[target.id].materializationTestConfigs[
    //     testConfigIndex
    //   ].customLowerThreshold = state.lower.value;

    //   testSelectionLocal[target.id].materializationTestConfigs[
    //     testConfigIndex
    //   ].customLowerThresholdMode = state.lower.mode;

    //   testSelectionLocal[target.id].materializationTestConfigs[
    //     testConfigIndex
    //   ].customUpperThreshold = state.upper.value;

    //   testSelectionLocal[target.id].materializationTestConfigs[
    //     testConfigIndex
    //   ].customUpperThresholdMode = state.upper.mode;
    // }

    // setTestSelection({ ...testSelectionLocal });

  //   setCustomThresholdState({
  //     target: undefined,
  //     show: false,
  //   });
  // };
      
  // const handleShowCustomThreshold = (event: any) => {
  //   // if (customThresholdState.show)
  //   //   setCustomThresholdState({
  //   //     target: undefined,
  //   //     show: false,
  //   //   });
  //   // else {
  //     const componentId = event.target.id;
  //     const idEls = componentId.split('#$*');

  //     const targetIdEls = idEls[1].split('.');

  //     if (targetIdEls.lenth > 2 || targetIdEls.length === 0)
  //       throw new Error('Invalid target for custom threshold setting target');

  //     let testConfig:
  //       | {
  //           customLowerThreshold?: number;
  //           customUpperThreshold?: number;
  //           customLowerThresholdMode: CustomThresholdMode;
  //           customUpperThresholdMode: CustomThresholdMode;
  //         }
  //       | undefined;
  //     if (targetIdEls.length === 2) {
  //       const target = testSelection[targetIdEls[0]].columnTestConfigs.find(
  //         (col) => col.id === targetIdEls[1]
  //       );

  //       if (!target)
  //         throw new Error('Invalid target for custom threshold setting target');

  //       testConfig = target.testConfigs.find((test: Test) => test.type === idEls[0]);
  //     } else
  //       testConfig = testSelection[
  //         targetIdEls[0]
  //       ].materializationTestConfigs.find((test) => test.type === idEls[0]);

  //     if (!testConfig)
  //       throw new Error('Invalid target for custom threshold setting target');

  //     setCustomThresholdState({
  //       target: {
  //         target: {
  //           id: targetIdEls.length === 2 ? targetIdEls[1] : targetIdEls[0],
  //           matId: targetIdEls.length === 2 ? targetIdEls[0] : undefined,
  //         },
  //         testSuiteRep: {
  //           id: idEls[2],
  //           type: idEls[0],
  //           state: {
  //             lower: {
  //               value: testConfig.customLowerThreshold,
  //               mode: testConfig.customLowerThresholdMode,
  //             },
  //             upper: {
  //               value: testConfig.customUpperThreshold,
  //               mode: testConfig.customUpperThresholdMode,
  //             },
  //           },
  //         },
  //       },
  //       show: true,
  //     });
  //   // }
  // };
    
  // const testSuiteSettingsButton = (
  //   target: { id: string; matId?: string },
  //   testType: TestType
  // ) => {
  //   let testConfig:
  //     | {
  //         testSuiteId?: string;
  //         customLowerThreshold?: number;
  //         customUpperThreshold?: number;
  //       }
  //     | undefined;
  //   if (target.matId) {
  //     const columnTestConfig = testSelection[
  //       target.matId
  //     ].columnTestConfigs.find((el) => el.id === target.id);
  //     if (!columnTestConfig) throw new Error('Test config not found');

  //     testConfig = columnTestConfig.testConfigs.find(
  //       (el) => el.type === testType
  //     );
  //     if (!testConfig) throw new Error('Test config not found');
  //   } else {
  //     const matTestConfig = testSelection[target.id];
  //     if (!matTestConfig) throw new Error('Test config not found');

  //     testConfig = matTestConfig.materializationTestConfigs.find(
  //       (el) => el.type === testType
  //     );
  //     if (!testConfig) throw new Error('Test config not found');
  //   }

  //   const button = (
  //     <button
  //       id={`${testType}#$*${
  //         target.matId ? `${target.matId}.${target.id}` : `${target.id}`
  //       }#$*${testConfig.testSuiteId}#$*settings`}
  //       className={`text m-1 rounded-full p-1   font-bold  ${
  //         testConfig.customLowerThreshold || testConfig.customUpperThreshold
  //           ? 'bg-violet-300 hover:bg-white'
  //           : 'hover:bg-violet-300'
  //       }`}
  //       onClick={handleShowCustomThreshold}
  //       hidden={!(testConfig && testConfig.testSuiteId)}
  //     >
  //       ...
  //     </button>
  //   );

  //   return button;
  // };


  // open last menu to the left
  const translate = index !== 9 ? '-translate-x-1/2' : '-translate-x-3/4'


  return (
    <Popover className="relative">
      <Popover.Button disabled={id.includes('TEMP_ID')} className="flex">
        <EllipsisVerticalIcon
          className={'h-5 w-5 relative z-10 ' + textColor}
          aria-hidden="true"
        />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className={classNames("absolute left-1/2 z-20 mt-2 flex w-screen max-w-max px-4", translate)}>
          {({ close }) => {
            if (id.includes('TEMP_ID')) close();
            return (
              <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                <div className="grid grid-cols-3 p-4">
                  <div className="flex items-center justify-center rounded-lg p-4 hover:bg-gray-50">
                    <div className="absolute">
                      <FrequencyDropdown
                        test={test}
                        level={level}
                        parentElementId={parentElementId}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center rounded-lg p-4 hover:bg-gray-50">
                    {(level === 'column' || !summary) &&
                      (active ? <h1>Active</h1> : <h1>Deactive</h1>)}
                    {level === 'table' && summary && <TestCounter summary={summary} />}
                  </div>
                  <div className="flex items-center justify-center rounded-lg p-4 hover:bg-gray-50">
                    <LowerThreshold threshold={customLowerThreshold} />
                    <UpperThreshold threshold={customUpperThreshold} />
                  </div>
                  {/* <CustomThreshold
                    closeCallback={closeCustomThresholdCallback}
                    savedScheduleCallback={saveCustomThresholdCallback}
                    show={customThresholdState.show}
                    state={customThresholdState.target.testSuiteRep.state}
                    target={customThresholdState.target.target}
                    testSuiteRep={customThresholdState.target.testSuiteRep}
                    orgId={account?.organizationId}
                /> */}
                </div>

                <div className="hidden grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  {callsToAction.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                    >
                      <item.icon
                        className="h-5 w-5 flex-none text-gray-400"
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            );
          }}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export function OptionMenu(props: {
  test: Test;
  parentElementId: string;
  level: Level;
  index: number;
}) {
  return (
    <div
      className={classNames(
        'relative flex items-center justify-start',
        props.test.id.includes('TEMP_ID') ? 'opacity-50' : 'opacity-100'
      )}
    >
      {props.test.id.includes('TEMP_ID') ? (
        <>
Loading...
        </>
      ) : (
        <>
          <Toggle {...props} />
          <MenuComponent {...props} />
        </>
      )}
    </div>
  );
}
