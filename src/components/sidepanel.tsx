import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

function Tabs({ context }: any) {
  const content = context.content;
  return (
    <Tab.Group
      selectedIndex={context.activeTab}
      onChange={context.setActiveTab}
    >
      <div className="flex items-center justify-center border-b border-gray-200">
        <Tab.List className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {Object.values(content).map((tabContent: any, idx) => (
            <Tab
              key={idx}
              className={({ selected }) =>
                classNames(
                  selected
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium focus:outline-none'
                )
              }
            >
              {tabContent.name}
            </Tab>
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="relative mt-6 flex-1 px-4 sm:px-6">
        <div className="absolute inset-0 px-4 sm:px-6">
          <div
            className="h-full border-2 border-dashed border-gray-200"
            aria-hidden="true"
          >
            {Object.values(content).map((tabContent: any, idx) => (
              <Tab.Panel
                key={idx}
                className="relative z-50 h-full w-full bg-gray-50"
              >
                {tabContent.jsx}
              </Tab.Panel>
            ))}
          </div>
        </div>
      </Tab.Panels>
    </Tab.Group>
  );
}

export default function Sidepanel({ isRight, panelContext }: any) {
  const panelName = isRight ? 'Integrations' : 'Overview';

  return (
    <>
      <div className={`${isRight ? 'right-4' : 'left-4'} absolute top-20 z-40`}>
        <button
          type="button"
          className="rounded-md bg-cito px-4 py-2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => panelContext.setOpen(true)}
        >
          <span className="sr-only">Open panel</span>
          <h1>Open {panelName}</h1>
        </button>
      </div>
      <Transition.Root show={panelContext.open} as={Fragment}>
        <div className="relative z-50">
          <div
            className={`${
              isRight ? 'right-0 pl-10' : 'left-0 pr-10'
            } pointer-events-none fixed top-16 bottom-0 flex max-w-full`}
          >
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom={`${isRight ? '' : '-'}translate-x-full`}
              enterTo={`${isRight ? '' : '-'}translate-x-0`}
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom={`${isRight ? '' : '-'}translate-x-full`}
              leaveTo={`${isRight ? '' : '-'}translate-x-full`}
            >
              <div className="pointer-events-auto relative w-screen max-w-lg">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className={`${
                      isRight
                        ? 'left-0 -ml-8 pr-2 sm:-ml-10 sm:pr-4'
                        : 'right-0 -mr-8 pl-2 sm:-mr-10 sm:pl-4'
                    } absolute top-0 flex pt-4`}
                  >
                    <button
                      type="button"
                      className="rounded-md text-gray-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={() => panelContext.setOpen(false)}
                    >
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                  <Tabs context={panelContext} />
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition.Root>
    </>
  );
}
