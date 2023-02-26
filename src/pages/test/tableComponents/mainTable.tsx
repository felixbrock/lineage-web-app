import { Disclosure } from '@headlessui/react'

import { useLayoutEffect, useRef, useState } from 'react'
import { OptionMenu } from './optionMenu'

const people = [
    {
        name: 'TeST_Db.test_S.Test_t',
        frequency: '1h',
        freshness: '0/0',
        switch: 8,
    },
    {
        name: 'TeST_Db_yyy.test_S_yyy.yyyyzsa_yyysonethukoenustoheu',
        frequency: '1h',
        freshness: '0/0',
        switch: 8,
    },
    {
        name: 'TeST_Db_xxx.test_S_xxx.xxxxzsa_xxx',
        frequency: '1h',
        freshness: '0/0',
        switch: 8,
    },
    {
        name: 'TeST_Db_yyy.test_S_yyy.yyyyzsa_yyy',
        frequency: '1h',
        freshness: '0/0',
        switch: 8,
    },
    {
        name: 'TeST_Db_yyy.test_S_yyy.yyyyzsa_yyysonethukoenustoheu',
        frequency: '1h',
        freshness: '0/0',
        switch: 8,
    },
    // More people...
]

const tableHeadings = [
    "Table Name",
    "Column Freshness",
    "Cardinality",
    "Nullness",
    "Uniqueness",
    "Distribution",
    "Row Count",
    "Column Count",
    "Table Freshness",
    "Schema Change",
]


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function MainTableRows({ textColor, bgColor, darkMode, people, selectedPeople, setSelectedPeople, buttonText, buttonOnClick, buttonIsDisclosure, buttonDisclosureContent }: any) {

    let selectionBgColor = "bg-gray-50";
    let selectionTextColor = "text-cito";
    let buttonTextColor = "text-cito";

    if (darkMode) selectionBgColor = "bg-gray-700";
    if (darkMode) selectionTextColor = "text-white";
    if (darkMode) buttonTextColor = "text-white";

    return (
        <>
            {people.map((person: any) => (
                <Disclosure>
                    {({ open }) => (
                        <>
                            <tr key={person.name} className={selectedPeople.includes(person) ? selectionBgColor : undefined}>
                                <td className="relative w-16 px-8 sm:w-12 sm:px-6">
                                    {selectedPeople.includes(person) && (
                                        <div className="absolute inset-y-0 left-0 w-0.5 bg-cito" />
                                    )}
                                    <input
                                        type="checkbox"
                                        className="absolute left-6 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cito focus:ring-cito sm:left-4"
                                        value={person.name}
                                        checked={selectedPeople.includes(person)}
                                        onChange={(e) =>
                                            setSelectedPeople(
                                                e.target.checked
                                                    ? [...selectedPeople, person]
                                                    : selectedPeople.filter((p: any) => p !== person)
                                            )
                                        }
                                    />
                                </td>
                                <td
                                    className={classNames(
                                        'hover:' + bgColor,
                                        'hover:drop-shadow-xl hover:p-2 hover:absolute hover:mt-4 hover:-ml-1.5 hover:max-w-[50rem] hover:z-10 truncate max-w-[12rem] py-4 pr-3 text-sm font-medium',
                                        selectedPeople.includes(person) ? selectionTextColor : textColor
                                    )}
                                >
                                    {person.name}
                                </td>
                                {Array(person.switch + 1).fill(
                                    <td className={classNames("whitespace-nowrap px-3 w-96 text-sm", textColor)}>{<OptionMenu />}</td>
                                )}
                                <td className="min-w-[6rem] whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-3">
                                    {buttonIsDisclosure ? (
                                        <Disclosure.Button className={buttonTextColor}>
                                            {buttonText}
                                        </Disclosure.Button>
                                    ) : (
                                        <button onClick={buttonOnClick} className={buttonTextColor}>
                                            {buttonText}
                                        </button>
                                    )}
                                </td>
                            </tr>
                            <Disclosure.Panel as="tr">
                                <td colSpan={12}>
                                    {buttonDisclosureContent}
                                </td>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            ))}
        </>
    )
}

type MainTableProps = {
    buttonOnClick: () => void;
    buttonText: string;
    buttonIsDisclosure: boolean;
    buttonDisclosureContent?: JSX.Element;
    tableTitle?: string;
    tableDescription?: string;
    darkMode?: boolean;
}

export default function MainTable({ buttonOnClick, buttonText, buttonIsDisclosure, buttonDisclosureContent, tableTitle, tableDescription, darkMode }: MainTableProps) {
    const checkbox = useRef()
    const [checked, setChecked] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [selectedPeople, setSelectedPeople] = useState([])

    useLayoutEffect(() => {
        const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length
        setChecked(selectedPeople.length === people.length)
        setIndeterminate(isIndeterminate)
        checkbox.current.indeterminate = isIndeterminate
    }, [selectedPeople])

    function toggleAll() {
        setSelectedPeople(checked || indeterminate ? [] : people)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }

    let textColor = "text-gray-900";
    let bgColor = "bg-white";

    if (darkMode) {
        textColor = "text-white";
        bgColor = "bg-cito";
    }

    return (
        <div className="w-full">
            {(tableTitle || tableDescription) && (
                <div className="pl-4 sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">{tableTitle}</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            {tableDescription}
                        </p>
                    </div>
                </div>
            )}
            <div className={classNames("mt-8 flow-root", bgColor)}>
                <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="relative">
                            {selectedPeople.length > 0 && (
                                <div className={classNames("absolute top-0 left-16 flex h-12 items-center space-x-3 sm:left-12")}>
                                    <button
                                        type="button"
                                        className={classNames("inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cito focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30 text-gray-900")}
                                    >
                                        Enable All Tests
                                    </button>
                                </div>
                            )}
                            <table className="min-w-full table-fixed divide-y divide-gray-300 break-normal">
                                <thead>
                                    <tr>
                                        <th scope="col" className="relative w-16 px-8 sm:w-12 sm:px-6">
                                            <input
                                                type="checkbox"
                                                className="absolute left-6 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-cito focus:ring-cito sm:left-4"
                                                ref={checkbox}
                                                checked={checked}
                                                onChange={toggleAll}
                                            />
                                        </th>
                                        {tableHeadings.map((heading) => (
                                            <th scope="col" className={classNames("px-3 py-3.5 text-left text-sm font-semibold", textColor)}>
                                                {heading}
                                            </th>
                                        ))}
                                        <th scope="col" className="relative py-3.5 pl-3 pr-6 sm:pr-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={classNames("divide-y divide-gray-200")}>
                                    <MainTableRows textColor={textColor} bgColor={bgColor} darkMode={darkMode} people={people} selectedPeople={selectedPeople} setSelectedPeople={setSelectedPeople} buttonText={buttonText} buttonOnClick={buttonOnClick} buttonIsDisclosure={buttonIsDisclosure} buttonDisclosureContent={buttonDisclosureContent} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
