const buildTestSelectionStructure = (materializations, testSuites, columns): {
    [key: string]: MaterializationTestsConfig;
} => {
    const testSelectionStructure: {
        [key: string]: MaterializationTestsConfig;
    } = {};

    materializations.forEach((materialization) => {
        const columnTestConfigs: ColumnTestConfig[] = [];

        const relevantColumns = columns.filter(
            (column) => column.materializationId === materialization.id
        );

        const materializationLabel = `${materialization.databaseName ? `${materialization.databaseName}.` : ''
            }${materialization.schemaName ? `${materialization.schemaName}.` : ''}${materialization.name
            }`;
        if (typeof materializationLabel !== 'string')
            throw new Error('Materialization label not of type string');

        relevantColumns.forEach((column) => {
            const columnLabel = column.name;
            if (typeof columnLabel !== 'string')
                throw new Error('Column label not of type string');

            const allowedTests = getAllowedTestTypes(column.dataType);

            const suites = testSuites.filter(
                (el) => el.target.targetResourceId === column.id
            );

            let testsActivated = false;

            columnTestConfigs.push({
                id: column.id,
                type: column.dataType,
                label: columnLabel,
                cron: suites.length ? suites[0].cron : buildCronExpression('1h'),
                executionType: suites.length ? suites[0].executionType : 'frequency',
                threshold: suites.length ? suites[0].threshold : 3,
                testConfigs: allowedTests.map((element): TestSuiteConfig => {
                    const typeSpecificSuite = suites.find((el) => el.type === element);

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
                    (config) =>
                        !!config.testConfigs.filter(
                            (el) => el.type === 'ColumnCardinality' && el.activated
                        ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) =>
                        !!config.testConfigs.filter(
                            (el) => el.type === 'ColumnCardinality'
                        ).length
                ).length,
            },
            {
                type: 'ColumnDistribution',
                activationCount: columnTestConfigs.filter(
                    (config) =>
                        !!config.testConfigs.filter(
                            (el) => el.type === 'ColumnDistribution' && el.activated
                        ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) =>
                        !!config.testConfigs.filter(
                            (el) => el.type === 'ColumnDistribution'
                        ).length
                ).length,
            },
            {
                type: 'ColumnFreshness',
                activationCount: columnTestConfigs.filter(
                    (config) =>
                        !!config.testConfigs.filter(
                            (el) => el.type === 'ColumnFreshness' && el.activated
                        ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) =>
                        !!config.testConfigs.filter((el) => el.type === 'ColumnFreshness')
                            .length
                ).length,
            },
            {
                type: 'ColumnNullness',
                activationCount: columnTestConfigs.filter(
                    (config) =>
                        !!config.testConfigs.filter(
                            (el) => el.type === 'ColumnNullness' && el.activated
                        ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) =>
                        !!config.testConfigs.filter((el) => el.type === 'ColumnNullness')
                            .length
                ).length,
            },
            {
                type: 'ColumnUniqueness',
                activationCount: columnTestConfigs.filter(
                    (config) =>
                        !!config.testConfigs.filter(
                            (el) => el.type === 'ColumnUniqueness' && el.activated
                        ).length
                ).length,
                totalCount: columnTestConfigs.filter(
                    (config) =>
                        !!config.testConfigs.filter(
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
            (el) => el.target.targetResourceId === materialization.id
        );

        const matQualTestSuites = qualTestSuites.filter(
            (el) => el.target.targetResourceId === materialization.id
        );

        const matchCountError = (testType: TestType) => {
            throw new Error(
                `Multiple mat test suites for ${testType} test type in place`
            );
        };

        const matColumnCountMatches = materializationSuites.filter(
            (el) => el.type === 'MaterializationColumnCount'
        );
        if (matColumnCountMatches.length > 1)
            matchCountError('MaterializationColumnCount');

        const matRowCountMatches = materializationSuites.filter(
            (el) => el.type === 'MaterializationRowCount'
        );
        if (matRowCountMatches.length > 1)
            matchCountError('MaterializationRowCount');

        const matFreshnessMatches = materializationSuites.filter(
            (el) => el.type === 'MaterializationFreshness'
        );
        if (matFreshnessMatches.length > 1)
            matchCountError('MaterializationFreshness');

        const matSchemaChangeMatches = matQualTestSuites.filter(
            (el) => el.type === 'MaterializationSchemaChange'
        );
        if (matSchemaChangeMatches.length > 1)
            matchCountError('MaterializationSchemaChange');

        const tableTestSelectionStructure: MaterializationTestsConfig = {
            label: materializationLabel,
            navExpanded: false,
            columnTestConfigs: columnTestConfigs,
            cron: uniqueCronValues.length === 1 ? uniqueCronValues[0] : undefined,
            threshold:
                uniqueThresholdValues.length === 1
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
};
