import { Disclosure } from '@headlessui/react';
import { FiChevronRight } from 'react-icons/fi';

export default ({ nextExecutions }: { nextExecutions: Date[] }) => {
  return (
    <div className="mb-4 w-full">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium text-cito hover:bg-cito hover:text-white focus:outline-none focus-visible:ring focus-visible:ring-cito focus-visible:ring-opacity-75">
                <span>
                  Next Execution:{' '}
                  {nextExecutions.length ? nextExecutions[0].toUTCString() : ''}
                </span>
                <FiChevronRight
                  className={`${
                    open ? 'rotate-90 transform ' : 'text-white'
                  } h-5 w-5 text-cito`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                {nextExecutions.slice(1).map((el) => (
                  <p className="text-center">{el.toUTCString()}</p>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};
