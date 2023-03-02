const numericDataTests: TestType[] = [
    'ColumnNullness',
    'ColumnCardinality',
    'ColumnUniqueness',
    'ColumnDistribution',
];
const stringAndBinaryDataTests: TestType[] = [
    'ColumnNullness',
    'ColumnCardinality',
    'ColumnUniqueness',
];
const logicalDataTests: TestType[] = ['ColumnNullness'];
const dateAndTimeDataTests: TestType[] = ['ColumnNullness', 'ColumnFreshness'];
const semiStructuredDataTests: TestType[] = ['ColumnNullness'];
const geospatialDataTests: TestType[] = ['ColumnNullness'];

const snowflakeTypes: { [key: string]: TestType[] } = {
    number: numericDataTests,
    decimal: numericDataTests,
    numeric: numericDataTests,
    int: numericDataTests,
    integer: numericDataTests,
    bigint: numericDataTests,
    smallint: numericDataTests,
    tinyint: numericDataTests,
    byteint: numericDataTests,
    float: numericDataTests,
    float4: numericDataTests,
    float8: numericDataTests,
    double: numericDataTests,
    'double precision': numericDataTests,
    real: numericDataTests,
    varchar: stringAndBinaryDataTests,
    character: stringAndBinaryDataTests,
    char: stringAndBinaryDataTests,
    string: stringAndBinaryDataTests,
    text: stringAndBinaryDataTests,
    binary: stringAndBinaryDataTests,
    varbinary: stringAndBinaryDataTests,
    boolean: logicalDataTests,
    date: dateAndTimeDataTests,
    datetime: dateAndTimeDataTests,
    time: dateAndTimeDataTests,
    timestamp: dateAndTimeDataTests,
    timestamp_ltz: dateAndTimeDataTests,
    timestamp_ntz: dateAndTimeDataTests,
    timestamp_tz: dateAndTimeDataTests,
    variant: semiStructuredDataTests,
    object: semiStructuredDataTests,
    array: semiStructuredDataTests,
    geography: geospatialDataTests,
};

const getAllowedTestTypes = (columnType: string): TestType[] => {
    if (!Object.keys(snowflakeTypes).includes(columnType.toLowerCase()))
        throw new Error(`Invalid column type (${columnType}) provided`);
    return snowflakeTypes[columnType.toLowerCase()];
};
export const testTypes = [
    'ColumnFreshness',
    'ColumnCardinality',
    'ColumnUniqueness',
    'ColumnNullness',
    'ColumnDistribution',
    'MaterializationRowCount',
    'MaterializationColumnCount',
    'MaterializationFreshness',
    'MaterializationSchemaChange',
] as const;
export type TestType = typeof testTypes[number];

export const executionTypes = ['frequency'] as const;
export type ExecutionType = typeof executionTypes[number];
interface TestSuiteConfig {
    type: TestType;
    activated: boolean;
    testSuiteId?: string;
}

interface ColumnTestConfig {
    id: string;
    label: string;
    type: string;
    cron: string;
    executionType: ExecutionType;
    threshold: number;
    testConfigs: TestSuiteConfig[];
    testsActivated: boolean;
}

interface TestDefinitionSummary {
    type: TestType;
    activationCount: number;
    totalCount: number;
}

interface MaterializationTestsConfig {
    columnTestConfigs: ColumnTestConfig[];
    navExpanded: boolean;
    label: string;
    cron?: string;
    executionType?: ExecutionType;
    threshold?: number;
    testDefinitionSummary: TestDefinitionSummary[];
    testsActivated: boolean;
    materializationTestConfigs: TestSuiteConfig[];
}

export const frequencies = ['1h', '3h', '6h', '12h', '24h', 'custom'] as const;
export type Frequency = typeof frequencies[number];

const buildCronExpression = (frequency: Frequency) => {
  const currentDate = new Date();
  const currentMinutes = currentDate.getUTCMinutes();
  const currentHours = currentDate.getUTCHours();

  switch (frequency) {
    case '1h':
      return `${currentMinutes} * * * ? *`;

    case '3h':
      return `${currentMinutes} */3 * * ? *`;

    case '6h':
      return `${currentMinutes} */6 * * ? *`;

    case '12h':
      return `${currentMinutes} */12 * * ? *`;

    case '24h':
      return `${currentMinutes} ${currentHours} * * ? *`;
    default:
      throw new Error('Unhandled frequency type');
  }
};

export function buildTestSelectionStructure(materializations: any, columns: any, testSuites: any, qualTestSuites: any): {
    [key: string]: MaterializationTestsConfig;
} {
    const testSelectionStructure: {
        [key: string]: MaterializationTestsConfig;
    } = {};

    materializations.forEach((materialization: any) => {
        const columnTestConfigs: ColumnTestConfig[] = [];

        const relevantColumns = columns.filter(
            (column: any) => column.materializationId === materialization.id
        );

        const materializationLabel = `${materialization.databaseName ? `${materialization.databaseName}.` : ''}${materialization.schemaName ? `${materialization.schemaName}.` : ''}${materialization.name}`;
        if (typeof materializationLabel !== 'string')
            throw new Error('Materialization label not of type string');

        relevantColumns.forEach((column: any) => {
            const columnLabel = column.name;
            if (typeof columnLabel !== 'string')
                throw new Error('Column label not of type string');

            const allowedTests = getAllowedTestTypes(column.dataType);

            const suites = testSuites.filter(
                (el: any) => el.target.targetResourceId === column.id
            );

            let testsActivated = false;

            columnTestConfigs.push({
                id: column.id,
                type: column.dataType,
                label: columnLabel,
                cron: suites.length ? suites[0].cron : buildCronExpression('1h'),
                executionType: suites.length ? suites[0].executionType : 'frequency',
                threshold: suites.length ? suites[0].threshold : 3,
                testConfigs: allowedTests.map((element: any): TestSuiteConfig => {
                    const typeSpecificSuite = suites.find((el: any) => el.type === element);

                    if (!typeSpecificSuite)
                        return {
                            type: element,
                            activated: false,
                        };

                    if (!testsActivated && typeSpecificSuite.activated)
                        testsActivated = true;

                    return {
                        type: element,
                        activated: typeSpecificSuite.activated,
                        testSuiteId: typeSpecificSuite.id,
                    };
                }),
                testsActivated,
            });
        });

        const testDefinitionSummary: TestDefinitionSummary[] = [
            {
                type: 'ColumnCardinality',
                activationCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter(
                        (el) => el.type === 'ColumnCardinality' && el.activated
                    ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter(
                        (el) => el.type === 'ColumnCardinality'
                    ).length
                ).length,
            },
            {
                type: 'ColumnDistribution',
                activationCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter(
                        (el) => el.type === 'ColumnDistribution' && el.activated
                    ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter(
                        (el) => el.type === 'ColumnDistribution'
                    ).length
                ).length,
            },
            {
                type: 'ColumnFreshness',
                activationCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter(
                        (el) => el.type === 'ColumnFreshness' && el.activated
                    ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter((el) => el.type === 'ColumnFreshness')
                        .length
                ).length,
            },
            {
                type: 'ColumnNullness',
                activationCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter(
                        (el) => el.type === 'ColumnNullness' && el.activated
                    ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter((el) => el.type === 'ColumnNullness')
                        .length
                ).length,
            },
            {
                type: 'ColumnUniqueness',
                activationCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter(
                        (el) => el.type === 'ColumnUniqueness' && el.activated
                    ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) => !!config.testConfigs.filter(
                        (el) => el.type === 'ColumnUniqueness'
                    ).length
                ).length,
            },
        ];

        const uniqueCronValues = Array.from(
            new Set(
                columnTestConfigs
                    .filter((el) => el.testsActivated)
                    .map((el) => el.cron)
            )
        );
        const uniqueThresholdValues = Array.from(
            new Set(
                columnTestConfigs
                    .filter((el) => el.testsActivated)
                    .map((el) => el.threshold)
            )
        );

        const materializationSuites = testSuites.filter(
            (el: any) => el.target.targetResourceId === materialization.id
        );

        const matQualTestSuites = qualTestSuites.filter(
            (el: any) => el.target.targetResourceId === materialization.id
        );

        const matchCountError = (testType: TestType) => {
            throw new Error(
                `Multiple mat test suites for ${testType} test type in place`
            );
        };

        const matColumnCountMatches = materializationSuites.filter(
            (el: any) => el.type === 'MaterializationColumnCount'
        );
        if (matColumnCountMatches.length > 1)
            matchCountError('MaterializationColumnCount');

        const matRowCountMatches = materializationSuites.filter(
            (el: any) => el.type === 'MaterializationRowCount'
        );
        if (matRowCountMatches.length > 1)
            matchCountError('MaterializationRowCount');

        const matFreshnessMatches = materializationSuites.filter(
            (el: any) => el.type === 'MaterializationFreshness'
        );
        if (matFreshnessMatches.length > 1)
            matchCountError('MaterializationFreshness');

        const matSchemaChangeMatches = matQualTestSuites.filter(
            (el: any) => el.type === 'MaterializationSchemaChange'
        );
        if (matSchemaChangeMatches.length > 1)
            matchCountError('MaterializationSchemaChange');

        const tableTestSelectionStructure: MaterializationTestsConfig = {
            label: materializationLabel,
            navExpanded: false,
            columnTestConfigs: columnTestConfigs,
            cron: uniqueCronValues.length === 1 ? uniqueCronValues[0] : undefined,
            threshold: uniqueThresholdValues.length === 1
                ? uniqueThresholdValues[0]
                : undefined,
            testDefinitionSummary,
            testsActivated: false,
            materializationTestConfigs: [
                {
                    type: 'MaterializationColumnCount',
                    activated: matColumnCountMatches.length
                        ? matColumnCountMatches[0].activated
                        : false,
                    testSuiteId: matColumnCountMatches.length
                        ? matColumnCountMatches[0].id
                        : undefined,
                },
                {
                    type: 'MaterializationRowCount',
                    activated: matRowCountMatches.length
                        ? matRowCountMatches[0].activated
                        : false,
                    testSuiteId: matRowCountMatches.length
                        ? matRowCountMatches[0].id
                        : undefined,
                },
                {
                    type: 'MaterializationFreshness',
                    activated: matFreshnessMatches.length
                        ? matFreshnessMatches[0].activated
                        : false,
                    testSuiteId: matFreshnessMatches.length
                        ? matFreshnessMatches[0].id
                        : undefined,
                },
                {
                    type: 'MaterializationSchemaChange',
                    activated: matSchemaChangeMatches.length
                        ? matSchemaChangeMatches[0].activated
                        : false,
                    testSuiteId: matSchemaChangeMatches.length
                        ? matSchemaChangeMatches[0].id
                        : undefined,
                },
            ],
        };

        testSelectionStructure[materialization.id] = tableTestSelectionStructure;
    });

    return testSelectionStructure;
}
