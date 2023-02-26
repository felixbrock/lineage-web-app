import Toggle from './toggle'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import FrequencyDropdown from './frequencyDropdown'

const solutions = [
    <div className='absolute'>
        <FrequencyDropdown />
    </div>,
    <TestCounter />,
    <Threshold />
]

const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

function TestCounter() {
    return (
        <h1>
            0/0
        </h1>
    )
}

function Threshold() {
    return (
        <h1>
            Threshold
        </h1>
    )
}

export function MenuComponent() {
    return (
        <Popover className="relative">
            <Popover.Button className="flex">
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
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
                        <div className="p-4 grid grid-cols-3">
                            {solutions.map((item) => (
                                <div className="rounded-lg p-4 hover:bg-gray-50 flex justify-center items-center">
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                            {callsToAction.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                >
                                    <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}

export function OptionMenu() {
    return (
        <div className='relative flex items-center justify-center'>
            <Toggle />
            <MenuComponent />
        </div>
    )

}
