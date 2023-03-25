import Toggle from './toggle';
import { Fragment, useContext } from 'react';
import { Popover, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  PhoneIcon,
  PlayCircleIcon,
} from '@heroicons/react/20/solid';
import FrequencyDropdown from './frequencyDropdown';
import { Test } from '../dataComponents/buildTableData';
import { TableContext } from '../newtest';
import { Level } from '../config';
import { classNames } from '../utils/tailwind';

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

function Threshold({ threshold }: { threshold: number }) {
  return <h1>{threshold}</h1>;
}

export function MenuComponent({
  test,
  parentElementId,
  level,
}: {
  test: Test;
  parentElementId: string;
  level: Level;
}) {
  const tableContext = useContext(TableContext);
  const currentTheme = tableContext.theme.currentTheme;
  const tableColorConfig =
    tableContext.theme.colorConfig[currentTheme].table[level];
  const { textColor } = tableColorConfig;

  const { id, active, threshold, summary } = test;
  return (
    <Popover className="relative">
      <Popover.Button disabled={id.includes('TEMP_ID')} className="flex">
        <EllipsisVerticalIcon
          className={'h-5 w-5 ' + textColor}
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
        <Popover.Panel className="absolute left-1/2 z-10 mt-2 flex w-screen max-w-max -translate-x-1/2 px-4">
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
                    <Threshold threshold={threshold} />
                  </div>
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
