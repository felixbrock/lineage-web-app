import Toggle from './toggle';
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  PhoneIcon,
  PlayCircleIcon,
} from '@heroicons/react/20/solid';
import FrequencyDropdown from './frequencyDropdown';

const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
];

function TestCounter({ activeChildren }: { activeChildren: string }) {
  return <h1>{activeChildren}</h1>;
}

function Threshold() {
  return <h1>Threshold</h1>;
}

export function MenuComponent({
  cron,
  threshold,
  activeChildren,
  frequencyRange,
optionsMenuColor,
columnLevel,
active,
}: {
  cron: string;
  threshold: string;
  activeChildren: string;
  frequencyRange: number[];
optionsMenuColor: string;
columnLevel: boolean;
active: boolean;
}) {
    console.log('omc', optionsMenuColor)
  return (
    <Popover className="relative">
      <Popover.Button className="flex">
        <EllipsisVerticalIcon className={"h-5 w-5 "+optionsMenuColor} aria-hidden="true" />
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
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="grid grid-cols-3 p-4">
              <div className="flex items-center justify-center rounded-lg p-4 hover:bg-gray-50">
                <div className="absolute">
                  <FrequencyDropdown
                    cron={cron}
                    frequencyRange={frequencyRange}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center rounded-lg p-4 hover:bg-gray-50">
              {columnLevel ? (
              active ? <h1>Active</h1> : <h1>Deactive</h1>
              ) : (
                <TestCounter activeChildren={activeChildren} />
                )}
              </div>
              <div className="flex items-center justify-center rounded-lg p-4 hover:bg-gray-50">
                <Threshold />
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
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
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

export function OptionMenu({
  cron,
  active,
  threshold,
  frequencyRange,
  activeChildren,
  hasOnChildren,
optionsMenuColor,
columnLevel,
}: {
  cron: string;
  active: boolean;
  threshold: string;
  frequencyRange: number[];
  activeChildren: string;
  hasOnChildren: boolean;
optionsMenuColor: string;
columnLevel: boolean;
}) {
  return (
    <div className="relative flex items-center justify-start">
      <Toggle active={active} hasOnChildren={hasOnChildren} frequencyRange={frequencyRange} cron={cron}/>
      <MenuComponent
        cron={cron}
        threshold={threshold}
        frequencyRange={frequencyRange}
        activeChildren={activeChildren}
optionsMenuColor={optionsMenuColor}
columnLevel={columnLevel}
active={active}
      />
    </div>
  );
}
