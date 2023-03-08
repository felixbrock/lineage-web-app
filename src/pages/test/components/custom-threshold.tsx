import { Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import LoadingScreen from '../../../components/loading-screen';
import MetricsGraph, {
  defaultOption,
  getDefaultYAxis,
  HistoryDataSet,
} from '../../../components/metrics-graph';
import Toggle from '../../../components/toggle';

export const thresholdModes = ['absolute', 'relative'] as const;
export type ThresholdMode = typeof thresholdModes[number];

export const parseThresholdMode = (type: unknown): ThresholdMode => {
  if (typeof type !== 'string')
    throw new Error('Provision of type in non-string format');
  const identifiedElement = thresholdModes.find(
    (element) => element.toLowerCase() === type.toLowerCase()
  );
  if (identifiedElement) return identifiedElement;
  throw new Error('Provision of invalid type');
};

interface ValueBase {
  min: number;
  max: number;
  median: number;
}

const calcRelativeThreshold = (absoluteThreshold: number, median: number) =>
  median === 0 ? 0 : absoluteThreshold / median;

export default ({
  show,
  testSuiteRepresentation,
  closeCallback,
  savedScheduleCallback,
}: {
  show: boolean;
  testSuiteRepresentation: {
    id: string;
    lowerThreshold?: number;
    upperThreshold?: number;
    upperThresholdMode: ThresholdMode;
    lowerThresholdMode: ThresholdMode;
  };
  closeCallback: () => void;
  savedScheduleCallback: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [lowerThreshold, setLowerThreshold] = useState<number | undefined>(
    testSuiteRepresentation.lowerThreshold
  );
  const [upperThreshold, setUpperThreshold] = useState<number | undefined>(
    testSuiteRepresentation.upperThreshold
  );
  const [lowerThresholdMode, setLowerThresholdMode] = useState(
    testSuiteRepresentation.lowerThresholdMode
  );
  const [upperThresholdMode, setUpperThresholdMode] = useState(
    testSuiteRepresentation.upperThresholdMode
  );
  const [testHistory, setTestHistory] = useState<
    HistoryDataSet[] | undefined
  >();
  const [yMinMax, setYMinMax] = useState<[number, number] | undefined>();
  const [valueBase, setValueBase] = useState<ValueBase>({
    min: 0,
    max: 0,
    median: 0,
  });
  const [graphData, setGraphData] = useState<HistoryDataSet[]>([]);

  const relativeModeDisabled =
    !testHistory || testHistory.length === 0 || valueBase.median === 0;

  const handleSaveClick = () => {
    savedScheduleCallback();
  };

  const handleLowerThresholdModeChange = (checked: boolean) => {
    const newMode = checked ? 'relative' : 'absolute';

    setLowerThresholdMode(newMode);

    if (!lowerThreshold) return;

    if (newMode === 'absolute') {
      setLowerThreshold(valueBase.median * lowerThreshold);
    } else
      setLowerThreshold(
        calcRelativeThreshold(lowerThreshold, valueBase.median)
      );
  };

  const handleUpperThresholdModeChange = (checked: boolean) => {
    const newMode = checked ? 'relative' : 'absolute';

    setUpperThresholdMode(newMode);

    if (!upperThreshold) return;

    if (newMode === 'absolute') {
      setUpperThreshold(valueBase.median * upperThreshold);
    } else
      setUpperThreshold(
        calcRelativeThreshold(upperThreshold, valueBase.median)
      );
  };

  const handleLowerThresholdChange = (e: { target: { value: unknown } }) => {
    const { value } = e.target;
    const numericValue = Number(value);
    if (!value || Number.isNaN(numericValue)) {
      setLowerThreshold(undefined);
      return;
    }

    if (!upperThreshold) {
      setLowerThreshold(numericValue);
      return;
    }

    if (
      (lowerThresholdMode === 'relative' &&
        upperThresholdMode === 'relative') ||
      (lowerThresholdMode === 'absolute' && upperThresholdMode === 'absolute')
    ) {
      setLowerThreshold(
        numericValue > upperThreshold ? upperThreshold : numericValue
      );
    } else if (
      lowerThresholdMode === 'relative' &&
      upperThresholdMode === 'absolute'
    ) {
      const absoluteValue = valueBase.median * numericValue;
      setLowerThreshold(
        absoluteValue > upperThreshold
          ? calcRelativeThreshold(upperThreshold, valueBase.median)
          : numericValue
      );
    } else if (
      lowerThresholdMode === 'absolute' &&
      upperThresholdMode === 'relative'
    ) {
      const relativeValue = calcRelativeThreshold(
        numericValue,
        valueBase.median
      );
      setLowerThreshold(
        relativeValue > upperThreshold
          ? valueBase.median * upperThreshold
          : numericValue
      );
    } else throw new Error('Invalid threshold mode combination');
  };

  const handleUpperThresholdChange = (e: { target: { value: unknown } }) => {
    const { value } = e.target;
    const numericValue = Number(value);
    if (!value || Number.isNaN(numericValue)) {
      setUpperThreshold(undefined);
      return;
    }

    if (!lowerThreshold) {
      setUpperThreshold(numericValue);
      return;
    }

    if (
      (lowerThresholdMode === 'relative' &&
        upperThresholdMode === 'relative') ||
      (lowerThresholdMode === 'absolute' && upperThresholdMode === 'absolute')
    ) {
      setUpperThreshold(
        numericValue < lowerThreshold ? lowerThreshold : numericValue
      );
    } else if (
      lowerThresholdMode === 'absolute' &&
      upperThresholdMode === 'relative'
    ) {
      const absoluteValue = valueBase.median * numericValue;
      setUpperThreshold(
        absoluteValue < lowerThreshold
          ? calcRelativeThreshold(lowerThreshold, valueBase.median)
          : numericValue
      );
    } else if (
      lowerThresholdMode === 'relative' &&
      upperThresholdMode === 'absolute'
    ) {
      const relativeValue = calcRelativeThreshold(
        numericValue,
        valueBase.median
      );
      setUpperThreshold(
        relativeValue < lowerThreshold
          ? valueBase.median * lowerThreshold
          : numericValue
      );
    } else throw new Error('Invalid threshold mode combination');
  };

  const calcMedian = (values: number[]): number => {
    values.sort((a, b) => a - b);

    const medianIndex = Math.floor(values.length / 2);

    return values.length % 2 === 0
      ? (values[medianIndex - 1] + values[medianIndex]) / 2
      : values[medianIndex];
  };

  const getHistoryMinMax = (
    historyDataSet: HistoryDataSet[]
  ): { min: number; max: number } => {
    if (!historyDataSet.length) throw new Error('History data set is empty');

    return historyDataSet.reduce<{ min: number; max: number }>(
      (acc, curr) => {
        const localAcc = acc;

        if (curr.value < localAcc.min) localAcc.min = curr.value;
        if (curr.value > localAcc.max) localAcc.max = curr.value;

        return localAcc;
      },
      { min: historyDataSet[0].value, max: historyDataSet[0].value }
    );
  };
  const getTestHistory = async (): Promise<HistoryDataSet[]> => {
    const getTimestamp = (dayOffset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      return date.toISOString();
    };

    const defaultFreshnessValues = [
      132, 131, 130, 132, 540, 129, 127, 120, 128,
    ];
    const defaultFreshnessData: HistoryDataSet[] = defaultFreshnessValues.map(
      (el, i) => ({
        value: el,
        isAnomaly: i === 4,
        timestamp: getTimestamp(i + 1 - defaultFreshnessValues.length),
        userFeedbackIsAnomaly: -1,
        valueUpperBound:
          (defaultFreshnessValues
            .slice(0, i + 1)
            .reduce((partialSum, a) => partialSum + a, 0) /
            (i + 1)) *
          1.3,
        valueLowerBound:
          (defaultFreshnessValues
            .slice(0, i + 1)
            .reduce((partialSum, a) => partialSum + a, 0) /
            (i + 1)) *
          0.7,
      })
    );

    return defaultFreshnessData;
  };

  useEffect(() => {
    if (!testHistory || !testHistory.length) return;

    const historyValues = testHistory.map((el) => el.value);
    setValueBase({
      ...getHistoryMinMax(testHistory),
      median: calcMedian(historyValues),
    });
  }, [testHistory]);

  useEffect(() => {
    if (isLoading || !valueBase) return;

    if (valueBase.median === 0) {
      if (lowerThresholdMode === 'relative') {
        setLowerThreshold(0);
        setLowerThresholdMode('absolute');
      }
      if (upperThresholdMode === 'relative') {
        setUpperThreshold(0);
        setUpperThresholdMode('absolute');
      }
    }

    let yMin = valueBase.min;
    let yMax = valueBase.max;

    if (lowerThreshold) {
      if (lowerThresholdMode === 'relative') {
        yMin = valueBase.median * lowerThreshold;
      } else yMin = lowerThreshold;
    }
    if (upperThreshold) {
      if (upperThresholdMode === 'relative') {
        yMax = valueBase.median * upperThreshold;
      } else yMax = upperThreshold;
    }

    setYMinMax([yMin, yMax]);
  }, [valueBase, lowerThreshold, upperThreshold]);

  useEffect(() => {
    if (!yMinMax || !testHistory) return;

    const data = testHistory.map((el: HistoryDataSet) => {
      return {
        ...el,
        customLowerThreshold:
          lowerThresholdMode === 'absolute' || !lowerThreshold
            ? lowerThreshold
            : valueBase.median * lowerThreshold,
        customUpperThreshold:
          upperThresholdMode === 'absolute' || !upperThreshold
            ? upperThreshold
            : valueBase.median * upperThreshold,
      };
    });

    setGraphData(data);
  }, [yMinMax]);

  useEffect(() => {
    getTestHistory()
      .then((data) => {
        if (!data || !data.length) {
          if (testSuiteRepresentation.lowerThresholdMode === 'relative') {
            setLowerThreshold(0);
            setLowerThresholdMode('absolute');
          }
          if (testSuiteRepresentation.upperThresholdMode === 'relative') {
            setUpperThreshold(0);
            setUpperThresholdMode('absolute');
          }
        }

        setTestHistory(
          data.length
            ? data
            : Array(10).fill({
                value: 0,
                isAnomaly: false,
                timestamp: '',
                userFeedbackIsAnomaly: -1,
                valueLowerBound: 0,
                valueUpperBound: 0,
              })
        );

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [show]);

  return (
    <Transition appear show={show} as={Fragment}>
      <div className="relative z-10">
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="m-4 w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between">
                  <h3 className="mb-2 text-lg font-bold leading-6 text-gray-900">
                    Define Custom Threshold
                  </h3>
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-2"
                    onClick={closeCallback}
                  >
                    <MdClose className="flex h-6 w-6 content-center justify-center fill-gray-500 text-center hover:fill-cito" />
                  </button>
                </div>
                {isLoading ? (
                  <LoadingScreen tailwindCss="fixed flex w-full h-full items-center justify-center" />
                ) : (
                  <>
                    {yMinMax && testHistory ? (
                      <MetricsGraph
                        option={defaultOption(
                          getDefaultYAxis(
                            yMinMax,
                            !!lowerThreshold,
                            !!upperThreshold
                          ),
                          graphData
                        )}
                      />
                    ) : (
                      <></>
                    )}
                    <div className="grid grid-cols-3 items-end gap-3">
                      <div className="flex flex-col items-center">
                        <h3>Lower Threshold</h3>
                        <Toggle
                          mode={lowerThresholdMode}
                          modeChangeCallback={handleLowerThresholdModeChange}
                          disabled={relativeModeDisabled}
                          modeOptions={[...thresholdModes]}
                        ></Toggle>
                        <div className="mt-4 flex items-center">
                          <input
                            className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                            id="lower-threshold"
                            type="number"
                            value={lowerThreshold}
                            onChange={handleLowerThresholdChange}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <h3>Upper Threshold</h3>
                        <Toggle
                          mode={upperThresholdMode}
                          modeChangeCallback={handleUpperThresholdModeChange}
                          modeOptions={[...thresholdModes]}
                          disabled={relativeModeDisabled}
                        ></Toggle>
                        <div className="mt-4 flex items-center">
                          <input
                            className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                            id="upper-threshold"
                            type="number"
                            value={upperThreshold}
                            onChange={handleUpperThresholdChange}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        {(lowerThresholdMode === 'relative' ||
                          upperThresholdMode === 'relative') &&
                        valueBase ? (
                          <>
                            <h3 className="break-normal">
                              Median (Relative Base Value)
                            </h3>
                            <div className="mt-4 flex items-center">
                              <input
                                className="block w-full appearance-none rounded border border-gray-200 bg-violet-200 py-2 px-4 leading-tight text-violet-700 "
                                id="median-value"
                                type="number"
                                disabled={true}
                                value={valueBase.median}
                              />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div
                  className="mt-4 border-l-4 border-orange-500 bg-orange-100 p-4 text-orange-700"
                  role="alert"
                  hidden={
                    testHistory &&
                    testHistory.length !== 0 &&
                    valueBase.median !== 0
                  }
                >
                  <p className="font-bold">Relative Mode Disabled</p>
                  <p className="break-normal">
                    You cannot define relative custom thresholds at the moment,
                    due to absent monitoring history or due to a median value
                    (the base value needed to calculate relative thresholds) of
                    0.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent ${
                      upperThreshold ===
                        testSuiteRepresentation.upperThreshold &&
                      lowerThreshold === testSuiteRepresentation.lowerThreshold
                        ? 'bg-gray-100'
                        : 'bg-violet-200 hover:bg-white hover:text-cito hover:ring-2 hover:ring-cito hover:ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cito focus-visible:ring-offset-2'
                    } px-4 py-2 text-sm font-medium text-black`}
                    onClick={handleSaveClick}
                    disabled={
                      upperThreshold ===
                        testSuiteRepresentation.upperThreshold &&
                      lowerThreshold === testSuiteRepresentation.lowerThreshold
                    }
                  >
                    Save
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Transition>
  );
};
