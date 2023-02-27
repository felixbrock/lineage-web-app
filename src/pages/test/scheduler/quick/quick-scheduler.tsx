import { ChangeEvent, useEffect, useState } from 'react';
import { ExpressionParts } from '../scheduler';
import { IoMdRemoveCircleOutline } from 'react-icons/io';

const labelClassName = `mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700`;
const checkboxClassName = `rounded border border-gray-200 bg-gray-200 checked:bg-cito`;

const toTimeString = (time: [number, number, number], toLocal: boolean) => {
  let timeCopy = time;

  if (toLocal) {
    const timezoneOffset = new Date().getTimezoneOffset() * -1;
    const minutesOffset = timezoneOffset % 60;
    let hoursOffset = ~~(timezoneOffset / 60);

    if (timezoneOffset < 0 && minutesOffset) hoursOffset -= 1;

    let hours = timeCopy[0] + hoursOffset;
    if (hours < 0) hours = 24 - hours;
    if (hours >= 24) hours = hours - 24;

    timeCopy = [
      hours,
      minutesOffset ? Math.abs(minutesOffset) : timeCopy[1],
      timeCopy[2],
    ];
  }

  return `${timeCopy[0] < 10 ? `0${timeCopy[0]}` : timeCopy[0]}:${
    timeCopy[1] < 10 ? `0${timeCopy[1]}` : timeCopy[1]
  }:${timeCopy[2] < 10 ? `0${timeCopy[2]}` : timeCopy[2]}`;
};

export default ({
  onExpressionPartsChangeCallback,
}: {
  onExpressionPartsChangeCallback: (expressionParts: ExpressionParts) => void;
}) => {
  const [daySelectionStates, setDaySelectionState] = useState<boolean[]>([
    false,
    true,
    true,
    true,
    true,
    true,
    false,
  ]);
  const [timeFrom, setTimeFrom] = useState<
    [number, number, number] | undefined
  >([7, 0, 0]);
  const [timeTill, setTimeTill] = useState<
    [number, number, number] | undefined
  >([20, 0, 0]);
  const [frequency, setFrequency] = useState<number>(60);

  const [expressionParts, setExpressionParts] = useState<ExpressionParts>();

  const buildExpressionParts = (): ExpressionParts => {
    const currentDate = new Date();
    const currentUTCMinutes = currentDate.getUTCMinutes();
    const currentUTCHours = currentDate.getUTCHours();

    let hours = '*';
    if (timeFrom && timeTill) hours = `${timeFrom[0]}-${timeTill[0]}`;
    else if (timeFrom) hours = timeFrom[0].toString();
    else if (timeTill) hours = timeTill[0].toString();

    let minutes = currentUTCMinutes.toString();
    if (frequency === 5) minutes = '*/5';
    else if (frequency === 1440)
      if (timeFrom && !timeTill) hours = timeFrom[0].toString();
      else if (timeTill && !timeFrom) hours = timeTill[0].toString();
      else hours = currentUTCHours.toString();
    else hours = hours.concat(`/${~~(frequency / 60)}`);

    const selectedDayIndices = daySelectionStates
      .map((el, index) => (el ? index : undefined))
      .filter((el: unknown): el is number => typeof el === 'number');

    const dayOfWeek =
      selectedDayIndices.length === 7 ? '*' : selectedDayIndices.join(',');

    return {
      minutes,
      hours,
      dayOfMonth: '*',
      month: '*',
      dayOfWeek,
      year: '*',
    };
  };

  const handleDayCheck = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const localDaySelectionStates = daySelectionStates;

    const counts: { [key: string]: number } = {};
    for (const num of localDaySelectionStates) {
      const key = num ? 'true' : 'false';
      counts[key] = counts[key] ? counts[key] + 1 : 1;
    }

    if (counts.true === 1 && !e.target.checked) return;

    localDaySelectionStates[index] = e.target.checked;

    setDaySelectionState([...localDaySelectionStates]);
  };

  const handleOnFrequencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);

    if (Number.isNaN(value)) throw new Error(`Didn't receive numeric string`);

    if (value === 1440 && timeFrom && timeTill) return;

    setFrequency(value);
  };

  const getCorrectedTime = (time: string): [number, number, number] => [
    Number(time.split(':')[0]),
    0,
    0,
  ];

  const handleTimeFromChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? getCorrectedTime(e.target.value) : undefined;

    if (
      (value && timeTill && value[0] >= timeTill[0]) ||
      (frequency === 1440 && timeTill)
    )
      return;

    setTimeFrom(value);
  };

  const handleTimeTillChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? getCorrectedTime(e.target.value) : undefined;

    if (
      (value && timeFrom && value[0] <= timeFrom[0]) ||
      (frequency === 1440 && timeFrom)
    )
      return;

    setTimeTill(value);
  };

  const handleRemoveTimes = () => {
    setTimeTill(undefined);
    setTimeFrom(undefined);
  };

  useEffect(
    () => setExpressionParts(buildExpressionParts()),
    [frequency, timeFrom, timeTill, daySelectionStates]
  );

  useEffect(() => {
    if (!expressionParts) return;
    onExpressionPartsChangeCallback(expressionParts);
  }, [expressionParts]);

  return (
    <>
      <div className="my-2 text-lg font-bold">Execution Days</div>
      <div className="my-2 mb-8 grid grid-cols-7">
        <div>
          <label htmlFor="check-sun" className={labelClassName}>
            Sun
          </label>
          <input
            type="checkbox"
            checked={daySelectionStates[0]}
            onChange={(e) => handleDayCheck(e, 0)}
            className={checkboxClassName}
            id="check-sun"
          />
        </div>
        <div>
          <label htmlFor="check-mon" className={labelClassName}>
            Mon
          </label>
          <input
            type="checkbox"
            checked={daySelectionStates[1]}
            onChange={(e) => handleDayCheck(e, 1)}
            className={checkboxClassName}
            id="check-mon"
          />
        </div>
        <div>
          <label htmlFor="check-tue" className={labelClassName}>
            Tue
          </label>
          <input
            type="checkbox"
            checked={daySelectionStates[2]}
            onChange={(e) => handleDayCheck(e, 2)}
            className={checkboxClassName}
            id="check-tue"
          />
        </div>
        <div>
          <label htmlFor="check-wed" className={labelClassName}>
            Wed
          </label>
          <input
            type="checkbox"
            checked={daySelectionStates[3]}
            onChange={(e) => handleDayCheck(e, 3)}
            className={checkboxClassName}
            id="check-wed"
          />
        </div>
        <div>
          <label htmlFor="check-thu" className={labelClassName}>
            Thu
          </label>
          <input
            type="checkbox"
            checked={daySelectionStates[4]}
            onChange={(e) => handleDayCheck(e, 4)}
            className={checkboxClassName}
            id="check-thu"
          />
        </div>
        <div>
          <label htmlFor="check-fri" className={labelClassName}>
            Fri
          </label>
          <input
            type="checkbox"
            checked={daySelectionStates[5]}
            onChange={(e) => handleDayCheck(e, 5)}
            className={checkboxClassName}
            id="check-fri"
          />
        </div>

        <div>
          <label htmlFor="check-sat" className={labelClassName}>
            Sat
          </label>
          <input
            type="checkbox"
            checked={daySelectionStates[6]}
            onChange={(e) => handleDayCheck(e, 6)}
            className={checkboxClassName}
            id="check-sat"
          />
        </div>
      </div>
      <div className="my-2 mt-8 text-lg font-bold"> Execution Time Period</div>
      <div className="my-2 grid grid-cols-4 ">
        <div>
          <label htmlFor="time-from" className={labelClassName}>
            From
          </label>
          <input
            type="time"
            value={timeFrom ? toTimeString(timeFrom, false) : ''}
            onChange={handleTimeFromChange}
            className="rounded border border-gray-200 hover:border-cito"
            id="time-from"
          />
        </div>
        <div>
          <label htmlFor="time-till" className={labelClassName}>
            Till
          </label>
          <input
            type="time"
            value={timeTill ? toTimeString(timeTill, false) : ''}
            onChange={handleTimeTillChange}
            className="rounded border border-gray-200 hover:border-cito "
            id="time-till"
          />
        </div>
        <button
          type="button"
          className="flex items-center justify-center px-4 py-2"
          onClick={handleRemoveTimes}
        >
          <IoMdRemoveCircleOutline className="flex h-6 w-6 content-center justify-center fill-gray-500 text-center hover:fill-cito" />
        </button>
        <p className="flex items-center px-4 py-2 uppercase">UTC</p>
      </div>
      <div className="my-2 grid grid-cols-4 ">
        <div>
          <input
            type="time"
            value={timeFrom ? toTimeString(timeFrom, true) : ''}
            disabled={true}
            className="rounded border border-gray-200 bg-gray-100"
            id="time-from-local"
          />
        </div>
        <div>
          <input
            type="time"
            value={timeTill ? toTimeString(timeTill, true) : ''}
            disabled={true}
            className="rounded border border-gray-200 bg-gray-100"
            id="time-till-local"
          />
        </div>
        <div></div>
        <p className="flex items-center px-4 py-2 uppercase">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </p>
      </div>
      <div className="my-2 mt-8 text-lg font-bold"> Frequency</div>
      <select
        onChange={handleOnFrequencyChange}
        value={frequency}
        className="rounded border border-gray-200 hover:border-purple-500 "
        id="select-frequency"
      >
        <option value="60">1h</option>
        <option value="180">3h</option>
        <option value="360">6h</option>
        <option value="720">12h</option>
        <option value="1440">1d</option>
      </select>
    </>
  );
};
