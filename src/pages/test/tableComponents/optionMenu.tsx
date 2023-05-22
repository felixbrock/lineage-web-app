import Toggle from './toggle';
import { Fragment, useContext, useEffect, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  PhoneIcon,
  PlayCircleIcon,
} from '@heroicons/react/20/solid';
import { Test } from '../dataComponents/buildTableData';
import { TableContext } from '../test';
import { Level } from '../config';
import { classNames } from '../utils/tailwind';
import CustomThreshold, { CustomThresholdState } from '../components/custom-threshold';
import ObservabilityApiRepo from '../../../infrastructure/observability-api/observability-api-repo';

const callsToAction = [
  { name: 'Example', href: '#', icon: PlayCircleIcon },
  { name: 'Example2', href: '#', icon: PhoneIcon },
];

export function MenuComponent({
  test,
  parentElementId,
  level,
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
        active: boolean;
        state: CustomThresholdState;
        summary?: {
          frequencyRange: [number, number];
          activeChildren: number;
          totalChildren: number;
        };
      };
    };
  }>({
    show: false,
  });

  const { id, 
          active,
          type,
          targetResourceId,
          customLowerThresholdMode,
          customLowerThreshold,
          customUpperThresholdMode,
          customUpperThreshold,
          summary 
        } = test;

  const saveCustomThresholdCallback = async (
    state: CustomThresholdState,
    testSuiteId: string,
  ): Promise<void> => {
    await ObservabilityApiRepo.updateTestSuites([
      {
        id: testSuiteId,
        props: {
          customLowerThreshold: state.lower,
          customUpperThreshold: state.upper,
        },
      },
    ]);

    setCustomThresholdState({
      target: undefined,
      show: false,
    });
  };

  const renderCustomThresholdComponent = () => {
    const target = {
      target: {
        id: targetResourceId,
        matId: targetResourceId === parentElementId ? undefined : parentElementId,
      },
      testSuiteRep: {
        id,
        type,
        active,
        state: {
          lower: {
            mode: customLowerThresholdMode,
            value: customLowerThreshold,
          },
          upper: {
            mode: customUpperThresholdMode,
            value: customUpperThreshold,
          }
        },
        summary
      },
    };
    
    setCustomThresholdState({
      show: true,
      target
    });
  };

  useEffect(renderCustomThresholdComponent, []);

  return (
    <Popover className="relative">
      <Popover.Button disabled={id.includes('TEMP_ID')} className="flex">
        <EllipsisVerticalIcon
          className={'h-5 w-5 relative z-10 ' + textColor}
          aria-hidden="true"
        />
      </Popover.Button>
        <Popover.Panel className={"fixed inset-0 flex items-center justify-center z-20"}>
          {({ close }) => {
            if (id.includes('TEMP_ID')) close(); 
            return (
              <>
                <div className="fixed inset-0 bg-black opacity-50"></div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'
                >
                <div className="flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                      <CustomThreshold
                        closeOverlay={close}
                        savedScheduleCallback={saveCustomThresholdCallback}
                        show={customThresholdState.show}
                        state={customThresholdState.target!.testSuiteRep.state}
                        testSuiteRep={customThresholdState.target!.testSuiteRep}
                        test={test}
                        level={level}
                        parentElementId={parentElementId}
                        summary={customThresholdState.target!.testSuiteRep.summary}
                      />

                  <div className="hidden grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                    {callsToAction.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-center gap-x-2.5 p-1 font-semibold text-gray-900 hover:bg-gray-100"
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
                </Transition>
              </>
            );
          }}
        </Popover.Panel>
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
