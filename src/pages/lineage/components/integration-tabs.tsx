import { Tab } from '@headlessui/react';
import { ReactElement, useEffect, useState } from 'react';
import { IconType } from 'react-icons';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default ({
  integrations,
  selectedTabIndex,
}: {
  integrations: { name: string; icon: IconType; tabContentJsx: ReactElement }[];
  selectedTabIndex: number;
}): ReactElement => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    setTabIndex(selectedTabIndex);
  }, [selectedTabIndex]);

  return (
    <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex} defaultIndex={0}>
      <Tab.List className="mx-6 mt-10 flex space-x-1 rounded-xl bg-cito p-1">
        {Object.values(integrations).map((integration: any) => (
          <Tab
            key={integration.name}
            className={({ selected }) =>
              classNames(
                'flex w-full flex-col items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-cito focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-cito shadow'
                  : 'text-white hover:bg-white/[0.12]'
              )
            }
          >
            <integration.icon className="h-6 w-6" />
            {integration.name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-2">
        {Object.values(integrations).map((integration: any, idx) => (
          <Tab.Panel
            key={idx}
            className={classNames(
              'rounded-xl bg-white p-3',
              'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
            )}
          >
            {integration.tabContentJsx}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};
