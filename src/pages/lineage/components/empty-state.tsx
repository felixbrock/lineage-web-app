import { FaGithub, FaSlack } from 'react-icons/fa';
import { SiSnowflake } from 'react-icons/si';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { MouseEventHandler } from 'react';

// Temporary hard coded due to time issues
const items = [
  {
    name: 'Snowflake',
    description: 'Connect to your Snowflake for data access and storage.',
    icon: SiSnowflake,
  },
  {
    name: 'GitHub',
    description:
      'Get your dbt metadata directly from your GitHub repositories.',
    icon: FaGithub,
  },
  {
    name: 'Slack',
    description: 'Connect to Slack to seamlessly receive anomaly alerts.',
    icon: FaSlack,
  },
];

export function EmptyStateIntegrations({
  onClick,
}: {
  onClick: any; // temporary
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="mx-auto max-w-lg bg-white p-4 shadow-xl">
        <h2 className="text-lg font-medium text-gray-900">
          Actionable Data Observability in Less Than 15 Minutes
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Set up your integrations and get started with data observability
          powered by column-level lineage now.
        </p>
        <ul
          role="list"
          className="mt-6 divide-y divide-gray-200 border-t border-b border-gray-200"
        >
          {items.map((item, itemIdx) => (
            <li key={itemIdx}>
              <div className="group relative flex items-start space-x-3 py-4">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg">
                    <item.icon
                      className="h-6 w-6 text-cito"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    <button
                      onClick={(e) => {
                        onClick(e, itemIdx);
                      }}
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      {item.name}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <ChevronRightIcon
                    className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export function EmptyStateDottedLine({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative block h-full w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
        />
      </svg>
      <span className="mt-2 block text-sm font-medium text-gray-900">
        No compatible data
      </span>
    </button>
  );
}
