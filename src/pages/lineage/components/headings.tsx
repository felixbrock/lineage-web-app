import { XMarkIcon } from '@heroicons/react/20/solid';
import { MouseEventHandler } from 'react';

type HeadingTitle = {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export function SectionHeading({ title, onClick }: HeadingTitle) {
  return (
    <div className="my-2 mx-4 border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      <div className="ml-auto pl-3">
        <div className="-mx-1.5 -my-1.5">
          <button
            onClick={onClick}
            type="button"
            className="inline-flex rounded-md p-1.5 text-black hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2 focus:ring-offset-cito"
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
