import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { ChangeEventHandler } from 'react';

type SearchBoxProps = {
  placeholder: string;
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export default function SearchBox({
  placeholder,
  label,
  onChange,
}: SearchBoxProps) {
  return (
    <div className="mx-4 mt-2">
      <label htmlFor={label} className="sr-only">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name={label}
          id={label}
          className="block w-full rounded-md border-gray-300 pl-10 focus:border-cito focus:ring-cito sm:text-sm"
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
