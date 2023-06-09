import { useEffect, useState } from 'react';
import LoadingScreen from '../../../components/loading-screen';
import MetricsGraph, {
  defaultOption,
  getDefaultYAxis,
  HistoryDataSet,
} from '../../../components/metrics-graph';
import Toggle from '../../../components/toggle';
import ObservabilityApiRepo from '../../../infrastructure/observability-api/observability-api-repo';
import FrequencyDropdown from './custom-frequency-dropdown';
import { MdClose } from 'react-icons/md';
import { CustomTestSuiteDto } from '../../../infrastructure/observability-api/test-suite-dto';
import { getFrequency } from '../../test/utils/cron';

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

export interface CustomThreshold {
  value?: number;
  mode: ThresholdMode;
}

export interface CustomThresholdState {
  lower: CustomThreshold;
  upper: CustomThreshold;
}

const calcRelativeThreshold = (absoluteThreshold: number, median: number) =>
  median === 0 ? 0 : absoluteThreshold / median;

export default ({
  closeOverlay,
  show,
  state,
  savedThresholdCallback,
  savedFrequencyCallback,
  test,
}: {
  closeOverlay: () => void;
  show: boolean;
  state: CustomThresholdState;
  savedThresholdCallback: (
    state: CustomThresholdState,
    testSuiteId: string
  ) => Promise<void>;
  savedFrequencyCallback: (
    testId: string,
    frequency: string
  ) => void;
  test: CustomTestSuiteDto;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [customLowerThreshold, setCustomLowerThreshold] = useState<
    number | undefined
  >(state.lower.value);
  const [customLowerThresholdMode, setCustomLowerThresholdMode] = useState(
    state.lower.mode
  );
  const [customUpperThreshold, setCustomUpperThreshold] = useState<
    number | undefined
  >(state.upper.value);
  const [customUpperThresholdMode, setCustomUpperThresholdMode] = useState(
    state.upper.mode
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

  const [testFrequency, setTestFrequency] = useState(`${getFrequency(test.cron).toString()}h`);

  const relativeModeDisabled =
    !testHistory || testHistory.length === 0 || valueBase.median === 0;

  const handleSaveClick = () => {
    savedThresholdCallback(
      {
        upper: { value: customUpperThreshold, mode: customUpperThresholdMode },
        lower: { value: customLowerThreshold, mode: customLowerThresholdMode },
      },
      test.id
    );

    closeOverlay();
  };

  const handleCustomLowerThresholdModeChange = (checked: boolean) => {
    const newMode = checked ? 'relative' : 'absolute';

    setCustomLowerThresholdMode(newMode);

    if (!customLowerThreshold) return;

    if (newMode === 'absolute') {
      setCustomLowerThreshold(valueBase.median * customLowerThreshold);
    } else
      setCustomLowerThreshold(
        calcRelativeThreshold(customLowerThreshold, valueBase.median)
      );
  };

  const handleCustomUpperThresholdModeChange = (checked: boolean) => {
    const newMode = checked ? 'relative' : 'absolute';

    setCustomUpperThresholdMode(newMode);

    if (!customUpperThreshold) return;

    if (newMode === 'absolute') {
      setCustomUpperThreshold(valueBase.median * customUpperThreshold);
    } else
      setCustomUpperThreshold(
        calcRelativeThreshold(customUpperThreshold, valueBase.median)
      );
  };

  const handleCustomLowerThresholdOnChange = (e: {
    target: { value: unknown };
  }) => {
    const { value } = e.target;
    const numericValue = Number(value);
    if (!value || Number.isNaN(numericValue)) {
      setCustomLowerThreshold(undefined);
      return;
    }

    setCustomLowerThreshold(numericValue);
  };

  const handleCustomLowerThresholdOnBlur = (e: {
    target: { value: unknown };
  }) => {
    const { value } = e.target;
    const numericValue = Number(value);
    if (!value || Number.isNaN(numericValue)) {
      setCustomLowerThreshold(undefined);
      return;
    }

    if (!customUpperThreshold) {
      setCustomLowerThreshold(numericValue);
      return;
    }

    if (
      (customLowerThresholdMode === 'relative' &&
        customUpperThresholdMode === 'relative') ||
      (customLowerThresholdMode === 'absolute' &&
        customUpperThresholdMode === 'absolute')
    ) {
      setCustomLowerThreshold(
        numericValue > customUpperThreshold
          ? customUpperThreshold
          : numericValue
      );
    } else if (
      customLowerThresholdMode === 'relative' &&
      customUpperThresholdMode === 'absolute'
    ) {
      const absoluteValue = valueBase.median * numericValue;
      setCustomLowerThreshold(
        absoluteValue > customUpperThreshold
          ? calcRelativeThreshold(customUpperThreshold, valueBase.median)
          : numericValue
      );
    } else if (
      customLowerThresholdMode === 'absolute' &&
      customUpperThresholdMode === 'relative'
    ) {
      const relativeValue = calcRelativeThreshold(
        numericValue,
        valueBase.median
      );
      setCustomLowerThreshold(
        relativeValue > customUpperThreshold
          ? valueBase.median * customUpperThreshold
          : numericValue
      );
    } else throw new Error('Invalid threshold mode combination');
  };

  const handleCustomUpperThresholdOnChange = (e: {
    target: { value: unknown };
  }) => {
    const { value } = e.target;
    const numericValue = Number(value);
    if (!value || Number.isNaN(numericValue)) {
      setCustomUpperThreshold(undefined);
      return;
    }

    setCustomUpperThreshold(numericValue);
  };

  const handleCustomUpperThresholdOnBlur = (e: {
    target: { value: unknown };
  }) => {
    const { value } = e.target;
    const numericValue = Number(value);
    if (!value || Number.isNaN(numericValue)) {
      setCustomUpperThreshold(undefined);
      return;
    }

    if (!customLowerThreshold) {
      setCustomUpperThreshold(numericValue);
      return;
    }

    if (
      (customLowerThresholdMode === 'relative' &&
        customUpperThresholdMode === 'relative') ||
      (customLowerThresholdMode === 'absolute' &&
        customUpperThresholdMode === 'absolute')
    ) {
      setCustomUpperThreshold(
        numericValue < customLowerThreshold
          ? customLowerThreshold
          : numericValue
      );
    } else if (
      customLowerThresholdMode === 'absolute' &&
      customUpperThresholdMode === 'relative'
    ) {
      const absoluteValue = valueBase.median * numericValue;
      setCustomUpperThreshold(
        absoluteValue < customLowerThreshold
          ? calcRelativeThreshold(customLowerThreshold, valueBase.median)
          : numericValue
      );
    } else if (
      customLowerThresholdMode === 'relative' &&
      customUpperThresholdMode === 'absolute'
    ) {
      const relativeValue = calcRelativeThreshold(
        numericValue,
        valueBase.median
      );
      setCustomUpperThreshold(
        relativeValue < customLowerThreshold
          ? valueBase.median * customLowerThreshold
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
      if (customLowerThresholdMode === 'relative') {
        setCustomLowerThreshold(0);
        setCustomLowerThresholdMode('absolute');
      }
      if (customUpperThresholdMode === 'relative') {
        setCustomUpperThreshold(0);
        setCustomUpperThresholdMode('absolute');
      }
    }

    let yMin = valueBase.min;
    let yMax = valueBase.max;

    if (customLowerThreshold) {
      if (customLowerThresholdMode === 'relative') {
        yMin = valueBase.median * customLowerThreshold;
      } else yMin = customLowerThreshold;
    }
    if (customUpperThreshold) {
      if (customUpperThresholdMode === 'relative') {
        yMax = valueBase.median * customUpperThreshold;
      } else yMax = customUpperThreshold;
    }

    setYMinMax([yMin, yMax]);
  }, [valueBase, customLowerThreshold, customUpperThreshold]);

  useEffect(() => {
    if (!yMinMax || !testHistory) return;

    const data = testHistory.map((el: HistoryDataSet) => {
      return {
        ...el,
        customLowerThreshold:
          customLowerThresholdMode === 'absolute' || !customLowerThreshold
            ? customLowerThreshold
            : valueBase.median * customLowerThreshold,
        customUpperThreshold:
          customUpperThresholdMode === 'absolute' || !customUpperThreshold
            ? customUpperThreshold
            : valueBase.median * customUpperThreshold,
      };
    });

    setGraphData(data);
  }, [yMinMax]);

  useEffect(() => {
    if (!show) return;

    ObservabilityApiRepo.getSelectionTestHistories([{
      id: test.id,
      type: test.name,
    }])
      .then((testHistories) => {
        if (!testHistories || !testHistories.length) {
          if (state.lower.mode === 'relative') {
            setCustomLowerThreshold(0);
            setCustomLowerThresholdMode('absolute');
          }
          if (state.upper.mode === 'relative') {
            setCustomUpperThreshold(0);
            setCustomUpperThresholdMode('absolute');
          }
        }

        if (testHistories.length > 1)
          throw new Error(
            'More than one test history for custom threshold setting mode returned'
          );

        setTestHistory(
          testHistories.length && testHistories[0].historyDataSet.length
            ? testHistories[0].historyDataSet
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
      <div className="relative z-60">
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="mx-4 w-full max-w-4xl transform rounded-2xl bg-white p-6 text-left align-middle transition-all">
                  <div className="grid grid-cols-3 p-2">
                    <div className="flex items-center justify-center rounded-lg p-2 hover:bg-gray-50">
                      <h1 className='mr-2'>Frequency:</h1>
                      <div>
                        <FrequencyDropdown
                          newTestFrequency={testFrequency} 
                          setNewTestFrequency={setTestFrequency} 
                          changingFrequency={true} 
                          savedFrequencyCallback={savedFrequencyCallback} 
                          testId={test.id} />
                      </div>
                    </div>
                    <div className="flex items-center justify-center rounded-lg p-2 hover:bg-gray-50">
                      {test.activated ? <h1>Active</h1> : <h1>Deactive</h1>}
                    </div>
                    <button
                        type="button"
                        className="flex items-center justify-end px-4 py-2"
                        onClick={closeOverlay}
                      >
                        <MdClose className="flex h-6 w-6 content-center justify-end fill-gray-500 text-center hover:fill-cito" />
                    </button>
                  </div>

                  {test.activated && (
                    <>
                      <div className="flex justify-between">
                        <h3 className="mb-2 text-xl font-bold leading-6 text-gray-900">
                          Define Custom Threshold
                        </h3>
                      </div>
                      {isLoading ? (
                        <LoadingScreen tailwindCss="fixed flex w-full items-center justify-center" />
                      ) : (
                        <>
                          {yMinMax && testHistory ? (
                            <MetricsGraph
                              option={defaultOption(
                                getDefaultYAxis(
                                  yMinMax,
                                  !!customLowerThreshold,
                                  !!customUpperThreshold
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
                                mode={customLowerThresholdMode}
                                modeChangeCallback={
                                  handleCustomLowerThresholdModeChange
                                }
                                disabled={relativeModeDisabled}
                                modeOptions={[...thresholdModes]}
                              ></Toggle>
                              <div className="mt-4 flex items-center">
                                <input
                                  className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                                  id="lower-threshold"
                                  type="number"
                                  value={customLowerThreshold ?? 0.0}
                                  onChange={handleCustomLowerThresholdOnChange}
                                  onBlur={handleCustomLowerThresholdOnBlur}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <h3>Upper Threshold</h3>
                              <Toggle
                                mode={customUpperThresholdMode}
                                modeChangeCallback={
                                  handleCustomUpperThresholdModeChange
                                }
                                modeOptions={[...thresholdModes]}
                                disabled={relativeModeDisabled}
                              ></Toggle>
                              <div className="mt-4 flex items-center">
                                <input
                                  className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                                  id="upper-threshold"
                                  type="number"
                                  value={customUpperThreshold ?? 0.0}
                                  onChange={handleCustomUpperThresholdOnChange}
                                  onBlur={handleCustomUpperThresholdOnBlur}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              {(customLowerThresholdMode === 'relative' ||
                                customUpperThresholdMode === 'relative') &&
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
                        <p className="whitespace-normal">
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
                            customUpperThreshold === state.upper.value &&
                            customLowerThreshold === state.lower.value
                              ? 'bg-gray-100'
                              : 'bg-violet-200 hover:bg-white hover:text-cito hover:ring-2 hover:ring-cito hover:ring-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cito focus-visible:ring-offset-2'
                          } px-4 py-2 text-sm font-medium text-black`}
                          onClick={handleSaveClick}
                          disabled={
                            customUpperThreshold === state.upper.value &&
                            customLowerThreshold === state.lower.value
                          }
                        >
                          Save
                        </button>
                      </div>
                  </>)}
            </div>
          </div>
        </div>
      </div>
  );
};