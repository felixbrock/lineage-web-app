export const mockData = [
	{
		label: "DBT_INTERNAL_DB.DBT_PSAXENA._9012_MIISTA",
		navExpanded: true,
		columnTestConfigs: [
			{
				id: "53e261ce-37d9-4a8a-8a58-1899d7d12eaf",
				type: "text",
				label: "TYPE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "9873c7bf-2e31-4fd7-b464-da7ff3946369",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "aa982124-c063-4aa2-a60f-c637944fa9a4",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "9f1c562f-d67b-4807-95d6-eb9412c45c38",
				type: "text",
				label: "BRAND",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "4481d3b3-e14b-4862-a3c4-d5ec677dbbda",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "735bfa16-65d6-49e3-8c5e-5a2aab1eaa29",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "8e74cb8d-3bab-4247-a801-f77fe73e0a74",
				type: "float",
				label: "REVENUE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "8e110c15-3a4a-430e-9811-983939211c47",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "83999e0b-b1d4-46af-baee-fef30860a13b",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "752a2b2a-5e06-4361-b0b4-2c4c025d14ea",
				type: "text",
				label: "CONVERSION_RATE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "9a3a881a-5607-45ba-bbde-cbd8b32eb505",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "13f47e3c-df24-4b7f-8de1-fcc992e4d895",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "e994080d-bfb2-490e-af0b-b807ea969e67",
				type: "text",
				label: "SESSIONS_PER_USERS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "8ef64c11-8a8f-4c21-b58f-c170c885870a",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "9bec88de-aaea-4bcf-86d8-0d6b45a0408e",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "a0141932-37ec-4fb6-a28c-7f6eae1dc13b",
				type: "float",
				label: "REFUND_PERCENTAGE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "589ead20-8a01-4e98-ac4a-85c3719189d7",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "e9fda87d-50bc-46bd-977e-1e502e215d57",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "42057574-399c-4332-824e-dedd1e88dc94",
				type: "number",
				label: "AMOUNT_OF_ORDERS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "126358b9-9a3e-40f6-9055-6e2a1981140e",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "6807aa94-2f5a-46b2-a38e-b06b882f2f6d",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "90c03d20-b33f-454b-8454-a6b81c3ca5f2",
				type: "date",
				label: "DATE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "250af9b9-dffb-4c14-8dd1-5adb0a957b95",
					},
					{
						type: "ColumnFreshness",
						activated: true,
						testSuiteId: "6c85af1b-95c9-4620-a4f4-67a1ff8dc5b7",
					},
				],
				testsActivated: true,
			},
			{
				id: "ec1b0cb3-4d08-4234-a442-f050484f3930",
				type: "number",
				label: "AMOUN_OF_PRODUCTS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "062e49ee-2be9-4ad2-a657-1bb407a6fdc8",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "b690cc1f-b532-4f67-b212-91cf957659e5",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "24539d76-15f9-413c-8285-52feda8698dd",
				type: "text",
				label: "USERS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "4ca36fae-6b8e-4ab1-9932-45a4f80034f2",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "466f5353-fc4f-4414-b837-74b532aaac68",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "c5f7fba6-a3a4-47a4-8949-a128b35d54b4",
				type: "text",
				label: "SESSIONS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "c19aa1a6-6a7e-43ce-a058-7e9c1c7e211c",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "4c48f098-96cc-46ef-bd0b-4fcc4e3bcb0c",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "36e0ad86-0897-4cd3-95dc-74a589788bba",
				type: "text",
				label: "FUNNEL",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "c2221c04-482e-4f76-bdd3-888986a5d279",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "37e398cb-1855-4688-87a6-d7c24b437edf",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "d4e2d54b-99ba-4fef-8676-0ad6579790a0",
				type: "float",
				label: "REFUND_QUANTITY",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "99f24702-1642-467b-b70d-1a2205368177",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "2c5de18c-1d76-42a9-9c3b-cd87c1da80a8",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "083ca6b6-705e-46b8-a512-b672648230c2",
				type: "text",
				label: "INDUSTRY",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "585fe1d5-96a6-418c-8474-c83c0ed07163",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "19e1e4ed-ce1d-4a90-bd8c-c0a57350703c",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "50d75a8a-d061-4e71-a923-41a035134d72",
				type: "float",
				label: "REFUND_EURO",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "78d0cc2d-42df-4d23-8a6d-d0c4714928d1",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "794958fd-aca1-4179-9157-23f5bc4cdf00",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
		],
		cron: "5 * * * ? *",
		threshold: 3,
		testDefinitionSummary: [
			{
				type: "ColumnCardinality",
				activationCount: 14,
				totalCount: 14,
			},
			{
				type: "ColumnDistribution",
				activationCount: 0,
				totalCount: 6,
			},
			{
				type: "ColumnFreshness",
				activationCount: 1,
				totalCount: 1,
			},
			{
				type: "ColumnNullness",
				activationCount: 15,
				totalCount: 15,
			},
			{
				type: "ColumnUniqueness",
				activationCount: 0,
				totalCount: 14,
			},
		],
		testsActivated: false,
		materializationTestConfigs: [
			{
				type: "MaterializationColumnCount",
				activated: false,
			},
			{
				type: "MaterializationRowCount",
				activated: false,
			},
			{
				type: "MaterializationFreshness",
				activated: false,
			},
			{
				type: "MaterializationSchemaChange",
				activated: false,
			},
		],
	},
	{
		label: "DBT_INTERNAL_DB.DBT_PSAXENA._1000_FEST_PRODUCT_VARIANTS",
		navExpanded: false,
		columnTestConfigs: [
			{
				id: "10321f51-ff1b-4079-8d8e-daf4eef2be68",
				type: "number",
				label: "PRODUCT_ID",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "2ee053ca-88db-45d4-b4f6-3b4532d844fd",
				type: "text",
				label: "PRODUCT_TYPE",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "4a6ad783-db27-470d-a32b-11a6989f599d",
				type: "text",
				label: "VENDOR",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "b1b001e2-1464-4714-8ab8-3b0bb7b8c292",
				type: "text",
				label: "PRODUCT_NAME",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "29923cd4-cf4d-47de-9357-2d88f3201cb3",
				type: "text",
				label: "TITLE",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "6dce6f2c-4678-4a4b-bd42-7f8fc15cefec",
				type: "text",
				label: "SKU",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "829de0c2-d20f-421a-af39-84f7fd983202",
				type: "text",
				label: "PRODUCT_MATERIAL",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "a795391e-dd68-44f5-a946-09bc976eca53",
				type: "text",
				label: "PRODUCT_SIZE",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "a8841f6c-bbaf-4f26-9af7-7a75eccfa9cb",
				type: "text",
				label: "PRODUCT_COLOUR",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
					},
				],
				testsActivated: true,
			},
		],
		testDefinitionSummary: [
			{
				type: "ColumnCardinality",
				activationCount: 0,
				totalCount: 9,
			},
			{
				type: "ColumnDistribution",
				activationCount: 0,
				totalCount: 1,
			},
			{
				type: "ColumnFreshness",
				activationCount: 0,
				totalCount: 0,
			},
			{
				type: "ColumnNullness",
				activationCount: 0,
				totalCount: 9,
			},
			{
				type: "ColumnUniqueness",
				activationCount: 9,
				totalCount: 9,
			},
		],
		testsActivated: false,
		materializationTestConfigs: [
			{
				type: "MaterializationColumnCount",
				activated: true,
			},
			{
				type: "MaterializationRowCount",
				activated: false,
			},
			{
				type: "MaterializationFreshness",
				activated: false,
			},
			{
				type: "MaterializationSchemaChange",
				activated: false,
			},
		],
	},
	{
		label:
			"DBT_INTERNAL_DB.DBT_PSAXENA._803_CHARLOTTECHESNAIS_GA_GCP_EVENTS_PIVOTS",
		navExpanded: true,
		columnTestConfigs: [
			{
				id: "924e6fa8-e93f-4d93-a788-6ab4e28ecce5",
				type: "number",
				label: "PRODUCTVIEW",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "2b31c294-624c-41c3-a7ac-b2fbd3a5ae27",
				type: "number",
				label: "CHECKOUT",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "38ae39cf-228e-4ea8-9812-46606fed6365",
				type: "number",
				label: "ADDTOCART",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: true,
					},
				],
				testsActivated: true,
			},
			{
				id: "55a48a23-f772-43ba-a889-b435203313ae",
				type: "date",
				label: "DAY",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
					},
					{
						type: "ColumnFreshness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "ee463ffe-7f40-472b-9b99-41a465d8af8f",
				type: "number",
				label: "COMPLETE",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: true,
					},
				],
				testsActivated: true,
			},
		],
		cron: "18 */12 * * ? *",
		testDefinitionSummary: [
			{
				type: "ColumnCardinality",
				activationCount: 0,
				totalCount: 4,
			},
			{
				type: "ColumnDistribution",
				activationCount: 4,
				totalCount: 4,
			},
			{
				type: "ColumnFreshness",
				activationCount: 0,
				totalCount: 1,
			},
			{
				type: "ColumnNullness",
				activationCount: 5,
				totalCount: 5,
			},
			{
				type: "ColumnUniqueness",
				activationCount: 0,
				totalCount: 4,
			},
		],
		testsActivated: false,
		materializationTestConfigs: [
			{
				type: "MaterializationColumnCount",
				activated: false,
			},
			{
				type: "MaterializationRowCount",
				activated: false,
			},
			{
				type: "MaterializationFreshness",
				activated: false,
			},
			{
				type: "MaterializationSchemaChange",
				activated: true,
			},
		],
		executionType: "frequency",
	},
];

export const mockRawData = [
	{
		label: "DBT_INTERNAL_DB.DBT_PSAXENA._9012_MIISTA",
		navExpanded: true,
		columnTestConfigs: [
			{
				id: "53e261ce-37d9-4a8a-8a58-1899d7d12eaf",
				type: "text",
				label: "TYPE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "d1804cd0-cd39-4530-8f82-f56fccd61a53",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "aa982124-c063-4aa2-a60f-c637944fa9a4",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "9f1c562f-d67b-4807-95d6-eb9412c45c38",
				type: "text",
				label: "BRAND",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "f60b2889-14e4-41b0-ac9e-1ea148f16bbe",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "735bfa16-65d6-49e3-8c5e-5a2aab1eaa29",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "8e74cb8d-3bab-4247-a801-f77fe73e0a74",
				type: "float",
				label: "REVENUE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "dfa61e28-6a44-4ac9-99e3-d4ac45ba4850",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "83999e0b-b1d4-46af-baee-fef30860a13b",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "752a2b2a-5e06-4361-b0b4-2c4c025d14ea",
				type: "text",
				label: "CONVERSION_RATE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "26137b35-67fb-4f3c-9cf2-743fea08399e",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "13f47e3c-df24-4b7f-8de1-fcc992e4d895",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "e994080d-bfb2-490e-af0b-b807ea969e67",
				type: "text",
				label: "SESSIONS_PER_USERS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "6142fcd3-fa0c-42be-8cdd-7f33509fd75d",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "9bec88de-aaea-4bcf-86d8-0d6b45a0408e",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "a0141932-37ec-4fb6-a28c-7f6eae1dc13b",
				type: "float",
				label: "REFUND_PERCENTAGE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "b1f82420-c1a8-4f3d-93ff-fb145092e8ee",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "e9fda87d-50bc-46bd-977e-1e502e215d57",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "42057574-399c-4332-824e-dedd1e88dc94",
				type: "number",
				label: "AMOUNT_OF_ORDERS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "f45bbb50-63b4-48bd-8334-e0d3dc8d88ad",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "6807aa94-2f5a-46b2-a38e-b06b882f2f6d",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "90c03d20-b33f-454b-8454-a6b81c3ca5f2",
				type: "date",
				label: "DATE",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "7e944a3f-4472-4352-a58c-82b6c62c6c01",
					},
					{
						type: "ColumnFreshness",
						activated: true,
						testSuiteId: "6c85af1b-95c9-4620-a4f4-67a1ff8dc5b7",
					},
				],
				testsActivated: true,
			},
			{
				id: "ec1b0cb3-4d08-4234-a442-f050484f3930",
				type: "number",
				label: "AMOUN_OF_PRODUCTS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "7db8148e-d928-47d9-a0ec-3d8097955062",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "b690cc1f-b532-4f67-b212-91cf957659e5",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "24539d76-15f9-413c-8285-52feda8698dd",
				type: "text",
				label: "USERS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "67383d09-64e5-4589-9b1f-108cbdebe09e",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "466f5353-fc4f-4414-b837-74b532aaac68",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "c5f7fba6-a3a4-47a4-8949-a128b35d54b4",
				type: "text",
				label: "SESSIONS",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "b7e5d5fc-a0e3-4cb0-b843-ace36fb2c4ab",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "4c48f098-96cc-46ef-bd0b-4fcc4e3bcb0c",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "36e0ad86-0897-4cd3-95dc-74a589788bba",
				type: "text",
				label: "FUNNEL",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "c48f350d-180f-4d49-9141-20cd334ec65e",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "37e398cb-1855-4688-87a6-d7c24b437edf",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "d4e2d54b-99ba-4fef-8676-0ad6579790a0",
				type: "float",
				label: "REFUND_QUANTITY",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "35ec2a25-5e16-4364-803c-65154fe96787",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "2c5de18c-1d76-42a9-9c3b-cd87c1da80a8",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "083ca6b6-705e-46b8-a512-b672648230c2",
				type: "text",
				label: "INDUSTRY",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "6ab2c15d-7d7f-4b75-8dac-16b965519e12",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "19e1e4ed-ce1d-4a90-bd8c-c0a57350703c",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "50d75a8a-d061-4e71-a923-41a035134d72",
				type: "float",
				label: "REFUND_EURO",
				cron: "5 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
						testSuiteId: "9efae8e2-3300-4819-9ab7-81afe02411c7",
					},
					{
						type: "ColumnCardinality",
						activated: true,
						testSuiteId: "794958fd-aca1-4179-9157-23f5bc4cdf00",
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
		],
		cron: "5 * * * ? *",
		threshold: 3,
		testDefinitionSummary: [
			{
				type: "ColumnCardinality",
				activationCount: 14,
				totalCount: 14,
			},
			{
				type: "ColumnDistribution",
				activationCount: 0,
				totalCount: 6,
			},
			{
				type: "ColumnFreshness",
				activationCount: 1,
				totalCount: 1,
			},
			{
				type: "ColumnNullness",
				activationCount: 0,
				totalCount: 15,
			},
			{
				type: "ColumnUniqueness",
				activationCount: 0,
				totalCount: 14,
			},
		],
		testsActivated: false,
		materializationTestConfigs: [
			{
				type: "MaterializationColumnCount",
				activated: false,
			},
			{
				type: "MaterializationRowCount",
				activated: false,
			},
			{
				type: "MaterializationFreshness",
				activated: false,
			},
			{
				type: "MaterializationSchemaChange",
				activated: false,
			},
		],
	},
	{
		label: "DBT_INTERNAL_DB.DBT_PSAXENA._1000_FEST_PRODUCT_VARIANTS",
		navExpanded: false,
		columnTestConfigs: [
			{
				id: "10321f51-ff1b-4079-8d8e-daf4eef2be68",
				type: "number",
				label: "PRODUCT_ID",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
						testSuiteId: "2358dbe3-11e7-4f92-9f10-ccfdd2400b8b",
					},
					{
						type: "ColumnDistribution",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "2ee053ca-88db-45d4-b4f6-3b4532d844fd",
				type: "text",
				label: "PRODUCT_TYPE",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
						testSuiteId: "fd4837cc-856a-4ee2-89d1-e7b3e89fdc10",
					},
				],
				testsActivated: true,
			},
			{
				id: "4a6ad783-db27-470d-a32b-11a6989f599d",
				type: "text",
				label: "VENDOR",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
						testSuiteId: "dfa8edfe-706b-4ba2-bc66-d83a458e1cbe",
					},
				],
				testsActivated: true,
			},
			{
				id: "b1b001e2-1464-4714-8ab8-3b0bb7b8c292",
				type: "text",
				label: "PRODUCT_NAME",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
						testSuiteId: "7f89c480-7b5c-4a15-a18f-db504aa200f3",
					},
				],
				testsActivated: true,
			},
			{
				id: "29923cd4-cf4d-47de-9357-2d88f3201cb3",
				type: "text",
				label: "TITLE",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
						testSuiteId: "479bbdd8-5966-49cf-a8a4-b5eaf77af108",
					},
				],
				testsActivated: true,
			},
			{
				id: "6dce6f2c-4678-4a4b-bd42-7f8fc15cefec",
				type: "text",
				label: "SKU",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
						testSuiteId: "4248b809-869c-4200-94da-7f98c5369c6d",
					},
				],
				testsActivated: true,
			},
			{
				id: "829de0c2-d20f-421a-af39-84f7fd983202",
				type: "text",
				label: "PRODUCT_MATERIAL",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
						testSuiteId: "c3f43515-9a79-4cd2-9d28-844a6ae5a62a",
					},
				],
				testsActivated: true,
			},
			{
				id: "a795391e-dd68-44f5-a946-09bc976eca53",
				type: "text",
				label: "PRODUCT_SIZE",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
						testSuiteId: "62f4b7ab-177b-47eb-a701-8e38ab723475",
					},
				],
				testsActivated: true,
			},
			{
				id: "a8841f6c-bbaf-4f26-9af7-7a75eccfa9cb",
				type: "text",
				label: "PRODUCT_COLOUR",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: false,
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: true,
						testSuiteId: "018ce5d8-b0c6-44dc-b666-e15e2c7797aa",
					},
				],
				testsActivated: true,
			},
		],
		cron: "11 * * * ? *",
		threshold: 3,
		testDefinitionSummary: [
			{
				type: "ColumnCardinality",
				activationCount: 0,
				totalCount: 9,
			},
			{
				type: "ColumnDistribution",
				activationCount: 0,
				totalCount: 1,
			},
			{
				type: "ColumnFreshness",
				activationCount: 0,
				totalCount: 0,
			},
			{
				type: "ColumnNullness",
				activationCount: 0,
				totalCount: 9,
			},
			{
				type: "ColumnUniqueness",
				activationCount: 9,
				totalCount: 9,
			},
		],
		testsActivated: false,
		materializationTestConfigs: [
			{
				type: "MaterializationColumnCount",
				activated: true,
				testSuiteId: "49526f1a-0774-4dbd-84d3-905dfd6a40f7",
			},
			{
				type: "MaterializationRowCount",
				activated: false,
			},
			{
				type: "MaterializationFreshness",
				activated: false,
			},
			{
				type: "MaterializationSchemaChange",
				activated: false,
			},
		],
	},
	{
		label:
			"DBT_INTERNAL_DB.DBT_PSAXENA._803_CHARLOTTECHESNAIS_GA_GCP_EVENTS_PIVOTS",
		navExpanded: false,
		columnTestConfigs: [
			{
				id: "924e6fa8-e93f-4d93-a788-6ab4e28ecce5",
				type: "number",
				label: "PRODUCTVIEW",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "76f52d3c-4a78-47f8-9096-124696d10ea0",
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: true,
						testSuiteId: "74bf29e1-fb08-4acd-87f3-25664a92066c",
					},
				],
				testsActivated: true,
			},
			{
				id: "2b31c294-624c-41c3-a7ac-b2fbd3a5ae27",
				type: "number",
				label: "CHECKOUT",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "77128afe-47ae-4ccf-8c9e-3bdf8301af46",
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: true,
						testSuiteId: "148fdd7e-131d-4a75-96bf-2f5d7f6617b0",
					},
				],
				testsActivated: true,
			},
			{
				id: "38ae39cf-228e-4ea8-9812-46606fed6365",
				type: "number",
				label: "ADDTOCART",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "854dbd12-ac9a-43ac-8140-56f8abcbd6d7",
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: true,
						testSuiteId: "0f55e4f2-e8b2-49b6-980a-01c7cf176552",
					},
				],
				testsActivated: true,
			},
			{
				id: "55a48a23-f772-43ba-a889-b435203313ae",
				type: "date",
				label: "DAY",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "3c9d6429-891b-462a-9096-2efe7f4b887f",
					},
					{
						type: "ColumnFreshness",
						activated: false,
					},
				],
				testsActivated: true,
			},
			{
				id: "ee463ffe-7f40-472b-9b99-41a465d8af8f",
				type: "number",
				label: "COMPLETE",
				cron: "11 * * * ? *",
				executionType: "frequency",
				threshold: 3,
				testConfigs: [
					{
						type: "ColumnNullness",
						activated: true,
						testSuiteId: "a3d1c304-5ab4-4491-9e24-a4b567f555b7",
					},
					{
						type: "ColumnCardinality",
						activated: false,
					},
					{
						type: "ColumnUniqueness",
						activated: false,
					},
					{
						type: "ColumnDistribution",
						activated: true,
						testSuiteId: "13e2ace5-d3c8-476c-a85c-da5d952ad7f9",
					},
				],
				testsActivated: true,
			},
		],
		cron: "11 * * * ? *",
		threshold: 3,
		testDefinitionSummary: [
			{
				type: "ColumnCardinality",
				activationCount: 0,
				totalCount: 4,
			},
			{
				type: "ColumnDistribution",
				activationCount: 4,
				totalCount: 4,
			},
			{
				type: "ColumnFreshness",
				activationCount: 0,
				totalCount: 1,
			},
			{
				type: "ColumnNullness",
				activationCount: 5,
				totalCount: 5,
			},
			{
				type: "ColumnUniqueness",
				activationCount: 0,
				totalCount: 4,
			},
		],
		testsActivated: false,
		materializationTestConfigs: [
			{
				type: "MaterializationColumnCount",
				activated: false,
			},
			{
				type: "MaterializationRowCount",
				activated: false,
			},
			{
				type: "MaterializationFreshness",
				activated: false,
			},
			{
				type: "MaterializationSchemaChange",
				activated: true,
				testSuiteId: "5579cf38-5c4b-4861-949d-a239c202b30e",
			},
		],
	},
];
