import { Auth } from 'aws-amplify';
import Logo from './top-nav/cito-header-purple.png';
import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { RiRefreshLine } from 'react-icons/ri';
import LineageApiRepository from '../infrastructure/lineage-api/lineage/lineage-api-repository';

type SnapshotState = 'loading' | 'creating' | 'available' | 'not available';

const navigation = [
  { name: 'Lineage', href: '/lineage', current: true },
  { name: 'Tests', href: '/test', current: false },
];
const subNavigation = [
  { name: 'Overview', isShown: true, toggle: () => {} },
  { name: 'Integrations', isShown: false, toggle: () => {} },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({
  current,
  toggleLeftPanel,
  toggleRightPanelFunctions,
  isRightPanelShown,
  setIsRightPanelShown,
  jwt,
}: {
  [key: string]: any;
}) {
  const [isLeftPanelShown, setIsLeftPanelShown] = useState(true);

  const [snapshotState, setSnapshotState] = useState<SnapshotState>('loading');

  const [snapshotInfo, setSnapshotInfo] = useState<string>('Loading...');

  // temp code because of launch
  if (current === 'lineage') {
    navigation[0].current = true;
    navigation[1].current = false;
  } else {
    navigation[0].current = false;
    navigation[1].current = true;
  }

  const getSnapshotInfo = (state: SnapshotState, createdAt?: string) => {
    switch (state) {
      case 'loading':
        return 'Loading...';
      case 'creating':
        return 'Creating new snapshot...';
      case 'available':
        if (!createdAt) throw new Error('CreatedAt param needs to be provided');
        return new Date(createdAt).toLocaleString();
      case 'not available':
        return 'Not available';
      default:
        throw new Error('Unhandled snapshot state');
    }
  };

  const handleLineageSnapshotRefresh = () => {
    if (!jwt) {
      console.error('jwt missing. Cannot create new lineage snapshot');
      return;
    }

    if (snapshotState === 'loading' || snapshotState === 'creating') return;

    const state: SnapshotState = 'creating';
    setSnapshotState(state);
    setSnapshotInfo(getSnapshotInfo(state));
    LineageApiRepository.create(jwt);
  };

  function toggleRightPanel() {
    if (isRightPanelShown) {
      toggleRightPanelFunctions.close();
    } else {
      toggleRightPanelFunctions.open();
    }
  }
  subNavigation[0].toggle = () => {
    setIsLeftPanelShown(!isLeftPanelShown);
    toggleLeftPanel();
  };
  subNavigation[0].isShown = isLeftPanelShown;
  subNavigation[1].toggle = () => {
    setIsRightPanelShown(!isRightPanelShown);
    toggleRightPanel();
  };
  subNavigation[1].isShown = isRightPanelShown;

  useEffect(() => {
    if (!jwt) return;

    LineageApiRepository.getLatest(jwt, true, 3)
      .then((snapshot) => {
        let state: SnapshotState = 'not available';
        if (!snapshot) {
          setSnapshotState(state);
          setSnapshotInfo(getSnapshotInfo(state));
          return;
        }

        if (snapshot.creationState !== 'completed') {
          state = 'creating';
          setSnapshotState(state);
          setSnapshotInfo(getSnapshotInfo(state));
        } else if (snapshot.creationState === 'completed') {
          state = 'available';
          setSnapshotState(state);
          setSnapshotInfo(getSnapshotInfo(state, snapshot.createdAt));
        } else {
          setSnapshotState(state);
          setSnapshotInfo(getSnapshotInfo(state));
        }
      })
      .catch((err) => {
        const state: SnapshotState = 'not available';
        setSnapshotState(state);
        setSnapshotInfo(getSnapshotInfo(state));
        console.error(err);
      });
  }, [jwt]);

  return (
    <Disclosure as="nav" className="relative z-50 bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-700 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center rounded-md bg-white">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src={Logo}
                    alt="Cito Data"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src={Logo}
                    alt="Cito Data"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {snapshotState === 'loading' || snapshotState === 'creating' ? (
                  <div className="relative ml-3 animate-spin rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <RiRefreshLine className="h-6 w-6" aria-hidden="true" />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="relative ml-3 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={handleLineageSnapshotRefresh}
                  >
                    <span className="sr-only">Create new snapshot</span>
                    <RiRefreshLine className="h-6 w-6" aria-hidden="true" />
                  </button>
                )}
                <i className="relative ml-3 text-xs text-gray-300">
                  Latest Snapshot: {snapshotInfo}
                </i>
                <button
                  type="button"
                  className="relative ml-3 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon className="h-8 w-8 rounded-full text-white" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              sessionStorage.clear();
                              Auth.signOut();
                            }}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block w-full px-4 py-2 text-left text-sm text-gray-700'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>

            {navigation[0].current && (
              <div
                className="flex justify-between space-x-8 py-4"
                aria-label="Global"
              >
                {subNavigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={item.toggle}
                    className={classNames(
                      item.isShown
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'inline-flex items-center rounded-md py-2 px-3 text-sm font-medium'
                    )}
                    aria-current={item.isShown ? 'page' : undefined}
                  >
                    {item.isShown ? 'Close' : 'Open'} {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
