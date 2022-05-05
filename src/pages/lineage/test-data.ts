// // aka columns
// const defaultNodes = [
//   { id: '0', label: 'sales_order_id', comboId: 'a' },
//   { id: '1', label: 'country_of_sales', comboId: 'a' },
//   { id: '2', label: 'product_category', comboId: 'a' },
//   { id: '3', label: 'order_id', comboId: 'b' },
//   { id: '4', label: 'ordered_pieces', comboId: 'b' },
//   { id: '5', label: 'label', comboId: 'b' },
//   { id: '6', label: 'country_of_sales', comboId: 'b' },
//   { id: '7', label: 'region', comboId: 'c' },
//   { id: '8', label: 'type', comboId: 'c' },
//   { id: '9', label: 'name', comboId: 'c' },
//   { id: '10', label: 'label', comboId: 'd' },
//   { id: '11', label: 'id', comboId: 'd' },
//   { id: '12', label: 'storage_location', comboId: 'd' },
//   { id: '13', label: 'distributor', comboId: 'd' },
//   { id: '14', label: 'en_country', comboId: 'e' },
//   { id: '15', label: 'region', comboId: 'e' },
//   { id: '16', label: 'de_country', comboId: 'e' },
//   { id: '17', label: 'region', comboId: 'f' },
//   { id: '18', label: 'department', comboId: 'f' },
//   { id: '19', label: 'role', comboId: 'f' },
//   { id: '20', label: 'type', comboId: 'f' },
//   { id: '21', label: 'name', comboId: 'f' },
//   { id: '22', label: 'storage_location', comboId: 'g' },
//   { id: '23', label: 'label', comboId: 'g' },
//   { id: '24', label: 'distributor', comboId: 'g' },
//   { id: '25', label: 'region', comboId: 'g' },
//   { id: '26', label: 'id', comboId: 'g' },
//   { id: '27', label: 'model', comboId: 'g' },
//   { id: '28', label: 'amount', comboId: 'g' },
//   { id: '29', label: 'department', comboId: 'g' },
//   { id: '30', label: 'name', comboId: 'h' },
//   { id: '31', label: 'type', comboId: 'h' },
//   { id: '32', label: 'type', comboId: 'h' },
//   { id: '33', label: 'is_active', comboId: 'h' },
//   { id: '34', label: 'region', comboId: 'h' },
//   { id: '35', label: 'storage_location', comboId: 'i' },
//   { id: '36', label: 'distributor', comboId: 'i' },
//   { id: '37', label: 'status', comboId: 'i' },
//   { id: '38', label: 'amount_orders', comboId: 'i' },
//   { id: '39', label: 'responsibility', comboId: 'i' },
//   { id: '40', label: 'model', comboId: 'i' },
// ];

// const defaultEdges = [
//   {
//     source: '0',
//     target: '3',
//   },
//   {
//     source: '0',
//     target: '4',
//   },
//   {
//     source: '1',
//     target: '6',
//   },
//   {
//     source: '2',
//     target: '5',
//   },
//   {
//     source: '3',
//     target: '11',
//   },
//   {
//     source: '3',
//     target: '12',
//   },
//   {
//     source: '4',
//     target: '28',
//   },
//   {
//     source: '5',
//     target: '10',
//   },
//   {
//     source: '6',
//     target: '14',
//   },
//   {
//     source: '7',
//     target: '15',
//   },
//   {
//     source: '7',
//     target: '17',
//   },
//   {
//     source: '8',
//     target: '20',
//   },
//   {
//     source: '8',
//     target: '32',
//   },
//   {
//     source: '9',
//     target: '21',
//   },
//   {
//     source: '10',
//     target: '23',
//   },
//   {
//     source: '11',
//     target: '26',
//   },
//   {
//     source: '12',
//     target: '22',
//   },
//   {
//     source: '13',
//     target: '24',
//   },
//   {
//     source: '14',
//     target: '24',
//   },
//   {
//     source: '15',
//     target: '25',
//   },
//   {
//     source: '18',
//     target: '29',
//   },
//   {
//     source: '17',
//     target: '34',
//   },
//   {
//     source: '20',
//     target: '31',
//   },
//   {
//     source: '21',
//     target: '30',
//   },
//   {
//     source: '22',
//     target: '35',
//   },
//   {
//     source: '24',
//     target: '36',
//   },
//   {
//     source: '27',
//     target: '40',
//   },
//   {
//     source: '27',
//     target: '37',
//   },
//   {
//     source: '28',
//     target: '38',
//   },
//   {
//     source: '29',
//     target: '39',
//   },
//   {
//     source: '30',
//     target: '39',
//   },
//   {
//     source: '33',
//     target: '37',
//   },
// ];

// // aka tables
// const defaultCombos = [
//   {
//     id: 'a',
//     label: 'source_salesforce',
//   },
//   {
//     id: 'b',
//     label: 'dim_sales',
//   },
//   {
//     id: 'c',
//     label: 'source_HR',
//   },
//   {
//     id: 'd',
//     label: 'dim_sales_9x5k',
//   },
//   {
//     id: 'e',
//     label: 'dim_region',
//   },
//   {
//     id: 'f',
//     label: 'dim_employee',
//   },
//   {
//     id: 'g',
//     label: 'fact_sales',
//   },
//   {
//     id: 'h',
//     label: 'dim_employee_sales',
//   },
//   {
//     id: 'i',
//     label: 'report_regional_sales',
//   },
// ];

// const testData: GraphData = { nodes, edges, combos };

// const testSqlLogic = [
//   {
//     comboId: 'a',
//     sql: "with table as (\n  select 1 as sales_order_id, 'string' as country_of_sales,\n    'category' as product_category\n    \n)\n\nselect *\nfrom table",
//   },
//   {
//     comboId: 'b',
//     sql: 'select sales_order_id as order_id, sales_order_id as ordered_pieces,\n  product_category as label, country_of_sales from source_salesforce\n',
//   },
//   {
//     comboId: 'c',
//     sql: "with table as (\n  select 'region' as region, 'type' as type,\n    'name' as name\n    \n)\n\nselect *\nfrom table",
//   },
//   {
//     comboId: 'd',
//     sql: "with table as (\n  select label, order_id as id, order_id as storage_location, 'distributor' as distributor from dim_sales\n    \n)\n\nselect *\nfrom table",
//   },
//   {
//     comboId: 'e',
//     sql: "with table as (\n  select country_of_sales as en_country, region, 'de_country' as de_country from dim_sales JOIN source_HR \n WHERE dim_sales.label = source_HR.type \n)\n\nselect *\nfrom table",
//   },
//   {
//     comboId: 'f',
//     sql: "with table as (\n  select region, 'department' as department, 'role' as role, type, name from source_HR\n    \n)\n\nselect *\nfrom table",
//   },
//   {
//     comboId: 'g',
//     sql: "with table as (\n  select storage_location, dim_sales_9x5k.label, CONCAT(distributor, en_country) as distributor \n dim_region.region, id, 'model' as model,\n ordered_pieces as amount, department\n FROM ((dim_sales_9x5k JOIN dim_region WHERE dim_sales_9x5k.storage_location = dim_region.region)\n JOIN dim_sales WHERE dim_region.region = dim_sales.country_of_sales)\n JOIN dim_employee WHERE dim_region.region = dim_employee.region \n)\n\nselect *\nfrom table",
//   },
//   {
//     comboId: 'h',
//     sql: "with table as (\n  select name, type, 'is_active' as is_active, region from dim_employee \n)\n\nselect *\nfrom table",
//   },
//   {
//     comboId: 'i',
//     sql: 'select storage_location, distributor, CONCAT(model, is_active) as status,\n amount as amount_orders, CONCAT(department, name) as responsibility, model\n from fact_sales join dim_employee_sales\n WHERE fact_sales.region = dim_employee_sales.region\n',
//   },
// ];

export const defaultSql =
  'select storage_location, distributor, CONCAT(model, is_active) as status,\n amount as amount_orders, CONCAT(department, name) as responsibility, model\n from fact_sales join dim_employee_sales\n WHERE fact_sales.region = dim_employee_sales.region\n';

export const defaultData =  {
  "combos": [
    {
      "id": "62715f8e7e3d8066494d3fa6",
      "label": "ACCESS_HISTORY"
    },
    {
      "id": "62715f8e7e3d8066494d3fa1",
      "label": "FUNCTIONS"
    },
    {
      "id": "62715f8e7e3d8066494d3faa",
      "label": "STORAGE_USAGE"
    },
    {
      "id": "62715f8e7e3d8066494d3fa5",
      "label": "QUERY_HISTORY"
    },
    {
      "id": "62715f8e7e3d8066494d3fb1",
      "label": "RATE_SHEET_DAILY"
    },
    {
      "id": "62715f8e7e3d8066494d3fac",
      "label": "TABLE_STORAGE_METRICS"
    },
    {
      "id": "62715f8e7e3d8066494d3fa2",
      "label": "LOAD_HISTORY"
    },
    {
      "id": "62715f8e7e3d8066494d3fb0",
      "label": "WAREHOUSE_METERING_HISTORY"
    },
    {
      "id": "62715f8e7e3d8066494d3fa0",
      "label": "FILE_FORMATS"
    },
    {
      "id": "62715f8e7e3d8066494d3fa3",
      "label": "LOGIN_HISTORY"
    },
    {
      "id": "62715f8e7e3d8066494d3fa7",
      "label": "SEQUENCES"
    },
    {
      "id": "62715f8e7e3d8066494d3fab",
      "label": "TABLE_CONSTRAINTS"
    },
    {
      "id": "62715f8e7e3d8066494d3fad",
      "label": "TABLES"
    },
    {
      "id": "62715f8e7e3d8066494d3fa4",
      "label": "DATABASES"
    },
    {
      "id": "62715f8e7e3d8066494d3fa8",
      "label": "COLUMNS"
    },
    {
      "id": "62715f8e7e3d8066494d3f9f",
      "label": "DATABASE_STORAGE_USAGE_HISTORY"
    },
    {
      "id": "62715f8e7e3d8066494d3faf",
      "label": "VIEWS"
    },
    {
      "id": "62715f8e7e3d8066494d3fa9",
      "label": "STAGES"
    },
    {
      "id": "62715f8e7e3d8066494d3fae",
      "label": "USERS"
    },
    {
      "id": "627160637e3d8066494d4132",
      "label": "W_USERS_D"
    },
    {
      "id": "627160637e3d8066494d4133",
      "label": "W_ACCESS_HISTORY_F"
    },
    {
      "id": "627160637e3d8066494d4134",
      "label": "W_DATABASES_D"
    },
    {
      "id": "627160637e3d8066494d4136",
      "label": "W_COLUMNS_D"
    },
    {
      "id": "627160637e3d8066494d4137",
      "label": "W_WAREHOUSE_D"
    },
    {
      "id": "627160637e3d8066494d4135",
      "label": "W_TABLES_D"
    },
    {
      "id": "627160657e3d8066494d41c7",
      "label": "V_WAREHOUSE_STG"
    },
    {
      "id": "6271606b7e3d8066494d41d0",
      "label": "V_WAREHOUSE_USAGE_STG"
    },
    {
      "id": "6271606f7e3d8066494d41d7",
      "label": "V_DAILY_STORAGE_USAGE_STG"
    },
    {
      "id": "6271606f7e3d8066494d41d6",
      "label": "V_DAILY_RATE_SHEET_STG"
    },
    {
      "id": "6271606f7e3d8066494d41d8",
      "label": "W_QUERY_HISTORY_F"
    },
    {
      "id": "627160707e3d8066494d41e6",
      "label": "V_DATABASES_STG"
    },
    {
      "id": "627160707e3d8066494d41e8",
      "label": "V_TABLES_STG"
    },
    {
      "id": "627160707e3d8066494d41e7",
      "label": "V_USERS_STG"
    },
    {
      "id": "627160707e3d8066494d41e3",
      "label": "W_DAILY_STORAGE_USAGE_F"
    },
    {
      "id": "627160707e3d8066494d41e5",
      "label": "W_DATABASE_STORAGE_USAGE_F"
    },
    {
      "id": "627160707e3d8066494d41da",
      "label": "V_DATABASE_DAILY_STORAGE_USAGE_STG"
    },
    {
      "id": "627160707e3d8066494d41e4",
      "label": "V_ACCESS_HISTORY_STG"
    },
    {
      "id": "627160727e3d8066494d4273",
      "label": "W_WAREHOUSE_USAGE_F"
    },
    {
      "id": "6271607c7e3d8066494d42cd",
      "label": "V_QUERY_HISTORY_STG"
    },
    {
      "id": "627160807e3d8066494d431f",
      "label": "V_COLUMNS_STG"
    }
  ],
  "nodes": [
    {
      "id": "62715f907e3d8066494d401a",
      "label": "ACCOUNT_LOCATOR",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f907e3d8066494d4019",
      "label": "ACCOUNT_NAME",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f907e3d8066494d4029",
      "label": "ACTIVE_BYTES",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f8f7e3d8066494d3fcf",
      "label": "API_INTEGRATION",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fbf",
      "label": "ARGUMENT_SIGNATURE",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d40b6",
      "label": "AUTO_CLUSTERING_ON",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40f4",
      "label": "AVERAGE_DATABASE_BYTES",
      "comboId": "62715f8e7e3d8066494d3f9f"
    },
    {
      "id": "62715f917e3d8066494d40f5",
      "label": "AVERAGE_FAILSAFE_BYTES",
      "comboId": "62715f8e7e3d8066494d3f9f"
    },
    {
      "id": "627160717e3d8066494d41f7",
      "label": "A_ACCONT_NAME",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160657e3d8066494d41aa",
      "label": "A_AUTO_CLUSTERING_ON",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4259",
      "label": "A_AUTO_CLUSTERING_ON",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160647e3d8066494d413b",
      "label": "A_BYPASS_MFA_UNTIL",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4276",
      "label": "A_BYPASS_MFA_UNTIL",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d4176",
      "label": "A_CHARACTER_SET_CATALOG",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4328",
      "label": "A_CHARACTER_SET_CATALOG",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4177",
      "label": "A_CHARACTER_SET_NAME",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4329",
      "label": "A_CHARACTER_SET_NAME",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4178",
      "label": "A_CHARACTER_SET_SCHEMA",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d432a",
      "label": "A_CHARACTER_SET_SCHEMA",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "6271607e7e3d8066494d42db",
      "label": "A_CLOUD_SERVICES_RATE_CURRENCY",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160657e3d8066494d41ab",
      "label": "A_CLUSTERING_KEY",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d425a",
      "label": "A_CLUSTERING_KEY",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160717e3d8066494d4217",
      "label": "A_CLUSTER_NUMBER",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42f2",
      "label": "A_CLUSTER_NUMBER",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160647e3d8066494d4179",
      "label": "A_COLLATION_CATALOG",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d432b",
      "label": "A_COLLATION_CATALOG",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d417a",
      "label": "A_COLLATION_NAME",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d432c",
      "label": "A_COLLATION_NAME",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d417b",
      "label": "A_COLLATION_SCHEMA",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d432d",
      "label": "A_COLLATION_SCHEMA",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d417c",
      "label": "A_COLUMN_DEFAULT",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d432e",
      "label": "A_COLUMN_DEFAULT",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d417d",
      "label": "A_COLUMN_NAME",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d432f",
      "label": "A_COLUMN_NAME",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d413c",
      "label": "A_COMMENT",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160647e3d8066494d4165",
      "label": "A_COMMENT",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160657e3d8066494d41ac",
      "label": "A_COMMENT",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160657e3d8066494d417e",
      "label": "A_COMMENT",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160727e3d8066494d4277",
      "label": "A_COMMENT",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160727e3d8066494d424b",
      "label": "A_COMMENT",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160727e3d8066494d425b",
      "label": "A_COMMENT",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160837e3d8066494d4330",
      "label": "A_COMMENT",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d41ad",
      "label": "A_COMMIT_ACTION",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d425c",
      "label": "A_COMMIT_ACTION",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "6271607e7e3d8066494d42dc",
      "label": "A_COMPUTE_RATE_CURRENCY",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160647e3d8066494d4167",
      "label": "A_CREATED_AT_DTS",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160727e3d8066494d424d",
      "label": "A_CREATED_AT_DTS",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160717e3d8066494d41f8",
      "label": "A_CURRENCY",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160647e3d8066494d415e",
      "label": "A_DATABASE_NAME",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "627160647e3d8066494d4163",
      "label": "A_DATABASE_NAME",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160727e3d8066494d4249",
      "label": "A_DATABASE_NAME",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "6271607a7e3d8066494d42ca",
      "label": "A_DATABASE_NAME",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160647e3d8066494d4164",
      "label": "A_DATABASE_OWNER",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160727e3d8066494d424a",
      "label": "A_DATABASE_OWNER",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160657e3d8066494d417f",
      "label": "A_DATA_TYPE",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4331",
      "label": "A_DATA_TYPE",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160717e3d8066494d41f4",
      "label": "A_DATE",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160647e3d8066494d413d",
      "label": "A_DEFAULT_NAMESPACE",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4278",
      "label": "A_DEFAULT_NAMESPACE",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d413e",
      "label": "A_DEFAULT_ROLE",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4279",
      "label": "A_DEFAULT_ROLE",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d413f",
      "label": "A_DEFAULT_WAREHOUSE",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d427a",
      "label": "A_DEFAULT_WAREHOUSE",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160657e3d8066494d4180",
      "label": "A_DELETED",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4332",
      "label": "A_DELETED",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4168",
      "label": "A_DELETED_AT_DTS",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160727e3d8066494d424e",
      "label": "A_DELETED_AT_DTS",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160647e3d8066494d4140",
      "label": "A_DISABLED",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d427b",
      "label": "A_DISABLED",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d4141",
      "label": "A_DISPLAY_NAME",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d427c",
      "label": "A_DISPLAY_NAME",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160657e3d8066494d4181",
      "label": "A_DOMAIN_CATALOG",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4333",
      "label": "A_DOMAIN_CATALOG",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4182",
      "label": "A_DOMAIN_NAME",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4334",
      "label": "A_DOMAIN_NAME",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4183",
      "label": "A_DOMAIN_SCHEMA",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4335",
      "label": "A_DOMAIN_SCHEMA",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4190",
      "label": "A_DTD_BKENTIFIER",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4342",
      "label": "A_DTD_BKENTIFIER",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4142",
      "label": "A_EMAIL",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d427d",
      "label": "A_EMAIL",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160707e3d8066494d41de",
      "label": "A_END_TIME",
      "comboId": "6271606b7e3d8066494d41d0"
    },
    {
      "id": "627160717e3d8066494d420d",
      "label": "A_END_TIME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "6271607e7e3d8066494d42d1",
      "label": "A_END_TIME",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160807e3d8066494d42e8",
      "label": "A_END_TIME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d420e",
      "label": "A_ERROR_CODE",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42e9",
      "label": "A_ERROR_CODE",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d420f",
      "label": "A_ERROR_MESSAGE",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42ea",
      "label": "A_ERROR_MESSAGE",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4210",
      "label": "A_EXECUTION_STATUS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42eb",
      "label": "A_EXECUTION_STATUS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160647e3d8066494d414b",
      "label": "A_EXPIRES_AT_DTS",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4286",
      "label": "A_EXPIRES_AT_DTS",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d4143",
      "label": "A_EXT_AUTHN_DUO",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d427e",
      "label": "A_EXT_AUTHN_DUO",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d414a",
      "label": "A_EXT_AUTHN_UID",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4285",
      "label": "A_EXT_AUTHN_UID",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d4144",
      "label": "A_FIRST_NAME",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d427f",
      "label": "A_FIRST_NAME",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160657e3d8066494d41b0",
      "label": "A_FULLY_QUALIFIED_TABLE_NAME",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d425f",
      "label": "A_FULLY_QUALIFIED_TABLE_NAME",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160657e3d8066494d4191",
      "label": "A_IDENTITY_CYCLE",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4343",
      "label": "A_IDENTITY_CYCLE",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4192",
      "label": "A_IDENTITY_GENERATION",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4344",
      "label": "A_IDENTITY_GENERATION",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4193",
      "label": "A_IDENTITY_INCREMENT",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4345",
      "label": "A_IDENTITY_INCREMENT",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4194",
      "label": "A_IDENTITY_MAXIMUM",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4346",
      "label": "A_IDENTITY_MAXIMUM",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4195",
      "label": "A_IDENTITY_MINIMUM",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4347",
      "label": "A_IDENTITY_MINIMUM",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4196",
      "label": "A_IDENTITY_START",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4348",
      "label": "A_IDENTITY_START",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160717e3d8066494d4219",
      "label": "A_INBOUND_DATA_TRANSFER_CLOUD",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42f4",
      "label": "A_INBOUND_DATA_TRANSFER_CLOUD",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d421a",
      "label": "A_INBOUND_DATA_TRANSFER_REGION",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42f5",
      "label": "A_INBOUND_DATA_TRANSFER_REGION",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160657e3d8066494d4184",
      "label": "A_INTERVAL_PRECISION",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4336",
      "label": "A_INTERVAL_PRECISION",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4185",
      "label": "A_INTERVAL_TYPE",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4337",
      "label": "A_INTERVAL_TYPE",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4198",
      "label": "A_IS_NULLABLE",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d434a",
      "label": "A_IS_NULLABLE",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4199",
      "label": "A_IS_SELF_REFERENCING",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d434b",
      "label": "A_IS_SELF_REFERENCING",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4166",
      "label": "A_LAST_ALTERED_AT_DTS",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160657e3d8066494d41bf",
      "label": "A_LAST_ALTERED_AT_DTS",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d426e",
      "label": "A_LAST_ALTERED_AT_DTS",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160727e3d8066494d424c",
      "label": "A_LAST_ALTERED_AT_DTS",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160647e3d8066494d4145",
      "label": "A_LAST_NAME",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4280",
      "label": "A_LAST_NAME",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d4146",
      "label": "A_LAST_SUCCESS_LOGIN",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4281",
      "label": "A_LAST_SUCCESS_LOGIN",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d4147",
      "label": "A_LOCKED_UNTIL_TIME",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4282",
      "label": "A_LOCKED_UNTIL_TIME",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d4148",
      "label": "A_LOGIN_NAME",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4283",
      "label": "A_LOGIN_NAME",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160657e3d8066494d4186",
      "label": "A_MAXIMUM_CARDINALITY",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4338",
      "label": "A_MAXIMUM_CARDINALITY",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160717e3d8066494d41f9",
      "label": "A_ORGANIZATION_NAME",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160717e3d8066494d421b",
      "label": "A_OUTBOUND_DATA_TRANSFER_CLOUD",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42f6",
      "label": "A_OUTBOUND_DATA_TRANSFER_CLOUD",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d421c",
      "label": "A_OUTBOUND_DATA_TRANSFER_REGION",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42f7",
      "label": "A_OUTBOUND_DATA_TRANSFER_REGION",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160647e3d8066494d4149",
      "label": "A_PASSWORD_LAST_SET_TIME",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4284",
      "label": "A_PASSWORD_LAST_SET_TIME",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160717e3d8066494d4211",
      "label": "A_QUERY_TAG",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42ec",
      "label": "A_QUERY_TAG",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4212",
      "label": "A_QUERY_TEXT",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42ed",
      "label": "A_QUERY_TEXT",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4213",
      "label": "A_QUERY_TYPE",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42ee",
      "label": "A_QUERY_TYPE",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160767e3d8066494d42b5",
      "label": "A_RATE_CURRENCY",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160717e3d8066494d4246",
      "label": "A_RATE_CURRENCY",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160757e3d8066494d42a3",
      "label": "A_RATE_CURRENCY",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160657e3d8066494d41ae",
      "label": "A_REFERENCE_GENERATION",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d425d",
      "label": "A_REFERENCE_GENERATION",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160717e3d8066494d41fa",
      "label": "A_REGION",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160717e3d8066494d4214",
      "label": "A_RELEASE_VERSION",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42ef",
      "label": "A_RELEASE_VERSION",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4215",
      "label": "A_ROLE_NAME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42f0",
      "label": "A_ROLE_NAME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160647e3d8066494d415f",
      "label": "A_SCHEMA_NAME",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "627160717e3d8066494d4216",
      "label": "A_SCHEMA_NAME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "6271607a7e3d8066494d42cb",
      "label": "A_SCHEMA_NAME",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160807e3d8066494d42f1",
      "label": "A_SCHEMA_NAME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160657e3d8066494d4187",
      "label": "A_SCOPE_CATALOG",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4339",
      "label": "A_SCOPE_CATALOG",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4188",
      "label": "A_SCOPE_NAME",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d433a",
      "label": "A_SCOPE_NAME",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d4189",
      "label": "A_SCOPE_SCHEMA",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d433b",
      "label": "A_SCOPE_SCHEMA",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d41af",
      "label": "A_SELF_REFERENCING_COLUMN_NAME",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d425e",
      "label": "A_SELF_REFERENCING_COLUMN_NAME",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160717e3d8066494d41fb",
      "label": "A_SERVICE_LEVEL",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160717e3d8066494d41fc",
      "label": "A_SERVICE_TYPE",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160707e3d8066494d41dd",
      "label": "A_START_TIME",
      "comboId": "6271606b7e3d8066494d41d0"
    },
    {
      "id": "627160717e3d8066494d420c",
      "label": "A_START_TIME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "6271607e7e3d8066494d42d0",
      "label": "A_START_TIME",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160807e3d8066494d42e7",
      "label": "A_START_TIME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160647e3d8066494d415d",
      "label": "A_START_TIME_DTS",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "6271607a7e3d8066494d42c9",
      "label": "A_START_TIME_DTS",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160657e3d8066494d418a",
      "label": "A_TABLE_CATALOG",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41b1",
      "label": "A_TABLE_CATALOG",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4260",
      "label": "A_TABLE_CATALOG",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160837e3d8066494d433c",
      "label": "A_TABLE_CATALOG",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4160",
      "label": "A_TABLE_NAME",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "627160657e3d8066494d418b",
      "label": "A_TABLE_NAME",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41b2",
      "label": "A_TABLE_NAME",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4261",
      "label": "A_TABLE_NAME",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "6271607a7e3d8066494d42cc",
      "label": "A_TABLE_NAME",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160837e3d8066494d433d",
      "label": "A_TABLE_NAME",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d41b3",
      "label": "A_TABLE_OWNER",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4262",
      "label": "A_TABLE_OWNER",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160657e3d8066494d418c",
      "label": "A_TABLE_SCHEMA",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41b4",
      "label": "A_TABLE_SCHEMA",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4263",
      "label": "A_TABLE_SCHEMA",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160837e3d8066494d433e",
      "label": "A_TABLE_SCHEMA",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d41b5",
      "label": "A_TABLE_TYPE",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4264",
      "label": "A_TABLE_TYPE",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160657e3d8066494d418d",
      "label": "A_UDT_CATALOG",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d433f",
      "label": "A_UDT_CATALOG",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d418e",
      "label": "A_UDT_NAME",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4340",
      "label": "A_UDT_NAME",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d418f",
      "label": "A_UDT_SCHEMA",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4341",
      "label": "A_UDT_SCHEMA",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160707e3d8066494d41ea",
      "label": "A_USAGE_DATE",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160757e3d8066494d4294",
      "label": "A_USAGE_DATE",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160767e3d8066494d42a5",
      "label": "A_USAGE_DATE",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160787e3d8066494d42b7",
      "label": "A_USAGE_DATE",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160717e3d8066494d41fd",
      "label": "A_USAGE_TYPE",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160647e3d8066494d413a",
      "label": "A_USERNAME",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160647e3d8066494d415c",
      "label": "A_USERNAME",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "627160717e3d8066494d420b",
      "label": "A_USERNAME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160727e3d8066494d4275",
      "label": "A_USERNAME",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "6271607a7e3d8066494d42c8",
      "label": "A_USERNAME",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160807e3d8066494d42e6",
      "label": "A_USERNAME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160657e3d8066494d41b6",
      "label": "A_USER_DEFINED_TYPE_CATALOG",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4265",
      "label": "A_USER_DEFINED_TYPE_CATALOG",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160657e3d8066494d41b7",
      "label": "A_USER_DEFINED_TYPE_NAME",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4266",
      "label": "A_USER_DEFINED_TYPE_NAME",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160657e3d8066494d41b8",
      "label": "A_USER_DEFINED_TYPE_SCHEMA",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4267",
      "label": "A_USER_DEFINED_TYPE_SCHEMA",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160657e3d8066494d41c6",
      "label": "A_WAREHOUSE_NAME",
      "comboId": "627160637e3d8066494d4137"
    },
    {
      "id": "6271606f7e3d8066494d41d5",
      "label": "A_WAREHOUSE_NAME",
      "comboId": "627160657e3d8066494d41c7"
    },
    {
      "id": "627160707e3d8066494d41df",
      "label": "A_WAREHOUSE_NAME",
      "comboId": "6271606b7e3d8066494d41d0"
    },
    {
      "id": "6271607e7e3d8066494d42d2",
      "label": "A_WAREHOUSE_NAME",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "62715f8f7e3d8066494d3fb6",
      "label": "BASE_OBJECTS_ACCESSED",
      "comboId": "62715f8e7e3d8066494d3fa6"
    },
    {
      "id": "62715f907e3d8066494d405c",
      "label": "BINARY_FORMAT",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f917e3d8066494d4126",
      "label": "BYPASS_MFA_UNTIL",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d40a9",
      "label": "BYTES",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f907e3d8066494d3ffa",
      "label": "BYTES_DELETED",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ff4",
      "label": "BYTES_READ_FROM_RESULT",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ff0",
      "label": "BYTES_SCANNED",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3fff",
      "label": "BYTES_SENT_OVER_THE_NETWORK",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ffd",
      "label": "BYTES_SPILLED_TO_LOCAL_STORAGE",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ffe",
      "label": "BYTES_SPILLED_TO_REMOTE_STORAGE",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ff2",
      "label": "BYTES_WRITTEN",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ff3",
      "label": "BYTES_WRITTEN_TO_RESULT",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "627160647e3d8066494d4150",
      "label": "B_DISABLED",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d428b",
      "label": "B_DISABLED",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d414c",
      "label": "B_HAS_PASSWORD",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4287",
      "label": "B_HAS_PASSWORD",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d414d",
      "label": "B_HAS_RSA_PUBLIC_KEY",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4288",
      "label": "B_HAS_RSA_PUBLIC_KEY",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160657e3d8066494d4197",
      "label": "B_IS_BKENTITY",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4349",
      "label": "B_IS_BKENTITY",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160717e3d8066494d4218",
      "label": "B_IS_CLIENT_GENERATED_STATEMENT",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42f3",
      "label": "B_IS_CLIENT_GENERATED_STATEMENT",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160657e3d8066494d41b9",
      "label": "B_IS_INSERTABLE_INTO",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4268",
      "label": "B_IS_INSERTABLE_INTO",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160647e3d8066494d4169",
      "label": "B_IS_TRANSIENT",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160657e3d8066494d41ba",
      "label": "B_IS_TRANSIENT",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d424f",
      "label": "B_IS_TRANSIENT",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160727e3d8066494d4269",
      "label": "B_IS_TRANSIENT",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160657e3d8066494d41bb",
      "label": "B_IS_TYPED",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d426a",
      "label": "B_IS_TYPED",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160647e3d8066494d414e",
      "label": "B_MUST_CHANGE_PASSWORD",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d4289",
      "label": "B_MUST_CHANGE_PASSWORD",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d414f",
      "label": "B_SNOWFLAKE_LOCK",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d428a",
      "label": "B_SNOWFLAKE_LOCK",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "62715f907e3d8066494d4033",
      "label": "CATALOG_CREATED",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d4034",
      "label": "CATALOG_DROPPED",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d403a",
      "label": "CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d403b",
      "label": "CATALOG_NAME",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f8f7e3d8066494d3fc1",
      "label": "CHARACTER_MAXIMUM_LENGTH",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d40cd",
      "label": "CHARACTER_MAXIMUM_LENGTH",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f8f7e3d8066494d3fc2",
      "label": "CHARACTER_OCTET_LENGTH",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d40ce",
      "label": "CHARACTER_OCTET_LENGTH",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40d5",
      "label": "CHARACTER_SET_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40d7",
      "label": "CHARACTER_SET_NAME",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40d6",
      "label": "CHARACTER_SET_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40fe",
      "label": "CHECK_OPTION",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f907e3d8066494d406c",
      "label": "CLIENT_IP",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d4027",
      "label": "CLONE_GROUP_ID",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d40a7",
      "label": "CLUSTERING_KEY",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f8f7e3d8066494d3fe8",
      "label": "CLUSTER_NUMBER",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f917e3d8066494d40d8",
      "label": "COLLATION_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40da",
      "label": "COLLATION_NAME",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40d9",
      "label": "COLLATION_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40ca",
      "label": "COLUMN_DEFAULT",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40c1",
      "label": "COLUMN_ID",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40c2",
      "label": "COLUMN_NAME",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f8f7e3d8066494d3fcd",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d411e",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f907e3d8066494d4067",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4089",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d409a",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f917e3d8066494d40bc",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fa4"
    },
    {
      "id": "62715f917e3d8066494d40b7",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d4105",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f907e3d8066494d4035",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f917e3d8066494d40ee",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d4110",
      "label": "COMMENT",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d40b2",
      "label": "COMMIT_ACTION",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f907e3d8066494d4000",
      "label": "COMPILATION_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f8f7e3d8066494d3fd2",
      "label": "COMPRESSION",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f907e3d8066494d4062",
      "label": "COMPRESSION",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d408f",
      "label": "CONSTRAINT_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d408e",
      "label": "CONSTRAINT_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d408a",
      "label": "CONSTRAINT_ID",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d408b",
      "label": "CONSTRAINT_NAME",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d408d",
      "label": "CONSTRAINT_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d408c",
      "label": "CONSTRAINT_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d4096",
      "label": "CONSTRAINT_TYPE",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f8f7e3d8066494d3fd0",
      "label": "CONTEXT_HEADERS",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f907e3d8066494d4018",
      "label": "CONTRACT_NUMBER",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f8f7e3d8066494d3fca",
      "label": "CREATED",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f907e3d8066494d4064",
      "label": "CREATED",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4086",
      "label": "CREATED",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f917e3d8066494d40b3",
      "label": "CREATED",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40bd",
      "label": "CREATED",
      "comboId": "62715f8e7e3d8066494d3fa4"
    },
    {
      "id": "62715f917e3d8066494d4111",
      "label": "CREATED",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f907e3d8066494d409b",
      "label": "CREATED",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f917e3d8066494d4102",
      "label": "CREATED",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f917e3d8066494d4115",
      "label": "CREATED_ON",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f907e3d8066494d404b",
      "label": "CREDITS_USED",
      "comboId": "62715f8e7e3d8066494d3fb0"
    },
    {
      "id": "62715f907e3d8066494d400d",
      "label": "CREDITS_USED_CLOUD_SERVICES",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d404d",
      "label": "CREDITS_USED_CLOUD_SERVICES",
      "comboId": "62715f8e7e3d8066494d3fb0"
    },
    {
      "id": "62715f907e3d8066494d404c",
      "label": "CREDITS_USED_COMPUTE",
      "comboId": "62715f8e7e3d8066494d3fb0"
    },
    {
      "id": "62715f907e3d8066494d401e",
      "label": "CURRENCY",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f907e3d8066494d4085",
      "label": "CYCLE_OPTION",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f8f7e3d8066494d3fdc",
      "label": "DATABASE_ID",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f917e3d8066494d40f1",
      "label": "DATABASE_ID",
      "comboId": "62715f8e7e3d8066494d3f9f"
    },
    {
      "id": "62715f917e3d8066494d40b8",
      "label": "DATABASE_ID",
      "comboId": "62715f8e7e3d8066494d3fa4"
    },
    {
      "id": "62715f8f7e3d8066494d3fdd",
      "label": "DATABASE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f917e3d8066494d40f2",
      "label": "DATABASE_NAME",
      "comboId": "62715f8e7e3d8066494d3f9f"
    },
    {
      "id": "62715f917e3d8066494d40b9",
      "label": "DATABASE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa4"
    },
    {
      "id": "62715f917e3d8066494d40ba",
      "label": "DATABASE_OWNER",
      "comboId": "62715f8e7e3d8066494d3fa4"
    },
    {
      "id": "62715f8f7e3d8066494d3fc0",
      "label": "DATA_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d40cc",
      "label": "DATA_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d407c",
      "label": "DATA_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d4016",
      "label": "DATE",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f917e3d8066494d40d2",
      "label": "DATETIME_PRECISION",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d4059",
      "label": "DATE_FORMAT",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f917e3d8066494d4122",
      "label": "DEFAULT_NAMESPACE",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d4123",
      "label": "DEFAULT_ROLE",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d4121",
      "label": "DEFAULT_WAREHOUSE",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f8f7e3d8066494d3fcc",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d40b5",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f907e3d8066494d4066",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d409d",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d402d",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d4088",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f917e3d8066494d40f3",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3f9f"
    },
    {
      "id": "62715f917e3d8066494d4113",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d40bf",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3fa4"
    },
    {
      "id": "62715f917e3d8066494d40ef",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d4104",
      "label": "DELETED",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f917e3d8066494d4116",
      "label": "DELETED_ON",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f8f7e3d8066494d3fb5",
      "label": "DIRECT_OBJECTS_ACCESSED",
      "comboId": "62715f8e7e3d8066494d3fa6"
    },
    {
      "id": "62715f917e3d8066494d411f",
      "label": "DISABLED",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d4118",
      "label": "DISPLAY_NAME",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d40db",
      "label": "DOMAIN_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40dd",
      "label": "DOMAIN_NAME",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40dc",
      "label": "DOMAIN_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40e5",
      "label": "DTD_IDENTIFIER",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d401f",
      "label": "EFFECTIVE_RATE",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f917e3d8066494d411b",
      "label": "EMAIL",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f8f7e3d8066494d3fee",
      "label": "END_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4048",
      "label": "END_TIME",
      "comboId": "62715f8e7e3d8066494d3fb0"
    },
    {
      "id": "62715f907e3d8066494d4099",
      "label": "ENFORCED",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f8f7e3d8066494d3feb",
      "label": "ERROR_CODE",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4072",
      "label": "ERROR_CODE",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d4045",
      "label": "ERROR_COUNT",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d4046",
      "label": "ERROR_LIMIT",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f8f7e3d8066494d3fec",
      "label": "ERROR_MESSAGE",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4073",
      "label": "ERROR_MESSAGE",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d4063",
      "label": "ERROR_ON_COLUMN_COUNT_MISMATCH",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d405d",
      "label": "ESCAPE",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d405e",
      "label": "ESCAPE_UNENCLOSED_FIELD",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4068",
      "label": "EVENT_ID",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d4069",
      "label": "EVENT_TIMESTAMP",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d406a",
      "label": "EVENT_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f8f7e3d8066494d3fea",
      "label": "EXECUTION_STATUS",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4001",
      "label": "EXECUTION_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f917e3d8066494d4128",
      "label": "EXPIRES_AT",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f907e3d8066494d400f",
      "label": "EXTERNAL_FUNCTION_TOTAL_INVOCATIONS",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4013",
      "label": "EXTERNAL_FUNCTION_TOTAL_RECEIVED_BYTES",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4011",
      "label": "EXTERNAL_FUNCTION_TOTAL_RECEIVED_ROWS",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4012",
      "label": "EXTERNAL_FUNCTION_TOTAL_SENT_BYTES",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4010",
      "label": "EXTERNAL_FUNCTION_TOTAL_SENT_ROWS",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f917e3d8066494d4124",
      "label": "EXT_AUTHN_DUO",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d4125",
      "label": "EXT_AUTHN_UID",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f8f7e3d8066494d3fd9",
      "label": "FAILSAFE_BYTES",
      "comboId": "62715f8e7e3d8066494d3faa"
    },
    {
      "id": "62715f907e3d8066494d402b",
      "label": "FAILSAFE_BYTES",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d4057",
      "label": "FIELD_DELIMITER",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4060",
      "label": "FIELD_OPTIONALLY_ENCLOSED_BY",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4053",
      "label": "FILE_FORMAT_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4052",
      "label": "FILE_FORMAT_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d404e",
      "label": "FILE_FORMAT_ID",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d404f",
      "label": "FILE_FORMAT_NAME",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4054",
      "label": "FILE_FORMAT_OWNER",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4051",
      "label": "FILE_FORMAT_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4050",
      "label": "FILE_FORMAT_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d4055",
      "label": "FILE_FORMAT_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d403c",
      "label": "FILE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d406f",
      "label": "FIRST_AUTHENTICATION_FACTOR",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d4043",
      "label": "FIRST_ERROR_CHARACTER_POSITION",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d4044",
      "label": "FIRST_ERROR_COL_NAME",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d4042",
      "label": "FIRST_ERROR_LINE_NUMBER",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d4041",
      "label": "FIRST_ERROR_MESSAGE",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f917e3d8066494d4119",
      "label": "FIRST_NAME",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f8f7e3d8066494d3fbd",
      "label": "FUNCTION_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fbc",
      "label": "FUNCTION_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fc7",
      "label": "FUNCTION_DEFINITION",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fb8",
      "label": "FUNCTION_ID",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fc6",
      "label": "FUNCTION_LANGUAGE",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fb9",
      "label": "FUNCTION_NAME",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fbe",
      "label": "FUNCTION_OWNER",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fbb",
      "label": "FUNCTION_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fba",
      "label": "FUNCTION_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f8f7e3d8066494d3fd4",
      "label": "HANDLER",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d411d",
      "label": "HAS_PASSWORD",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d412a",
      "label": "HAS_RSA_PUBLIC_KEY",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f907e3d8066494d4021",
      "label": "ID",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f917e3d8066494d40ed",
      "label": "IDENTITY_CYCLE",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40e8",
      "label": "IDENTITY_GENERATION",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40ea",
      "label": "IDENTITY_INCREMENT",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40eb",
      "label": "IDENTITY_MAXIMUM",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40ec",
      "label": "IDENTITY_MINIMUM",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40e9",
      "label": "IDENTITY_START",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f8f7e3d8066494d3fd3",
      "label": "IMPORTS",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f907e3d8066494d400b",
      "label": "INBOUND_DATA_TRANSFER_BYTES",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4009",
      "label": "INBOUND_DATA_TRANSFER_CLOUD",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d400a",
      "label": "INBOUND_DATA_TRANSFER_REGION",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4084",
      "label": "INCREMENT",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d4098",
      "label": "INITIALLY_DEFERRED",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f917e3d8066494d4100",
      "label": "INSERTABLE_INTO",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f917e3d8066494d40d4",
      "label": "INTERVAL_PRECISION",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40d3",
      "label": "INTERVAL_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d4015",
      "label": "IS_CLIENT_GENERATED_STATEMENT",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4097",
      "label": "IS_DEFERRABLE",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f8f7e3d8066494d3fce",
      "label": "IS_EXTERNAL",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d40e7",
      "label": "IS_IDENTITY",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40b0",
      "label": "IS_INSERTABLE_INTO",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40cb",
      "label": "IS_NULLABLE",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f8f7e3d8066494d3fc9",
      "label": "IS_NULL_CALL",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d4101",
      "label": "IS_SECURE",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f917e3d8066494d40e6",
      "label": "IS_SELF_REFERENCING",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d4071",
      "label": "IS_SUCCESS",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d4028",
      "label": "IS_TRANSIENT",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f917e3d8066494d40bb",
      "label": "IS_TRANSIENT",
      "comboId": "62715f8e7e3d8066494d3fa4"
    },
    {
      "id": "62715f907e3d8066494d40a6",
      "label": "IS_TRANSIENT",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40b1",
      "label": "IS_TYPED",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40ff",
      "label": "IS_UPDATABLE",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "627160717e3d8066494d41f6",
      "label": "K_ACCOUNT_BK",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160717e3d8066494d41f5",
      "label": "K_ACCOUNT_DLHK",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160647e3d8066494d4172",
      "label": "K_COLUMN_BK",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4324",
      "label": "K_COLUMN_BK",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d416e",
      "label": "K_COLUMN_DLHK",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160827e3d8066494d4320",
      "label": "K_COLUMN_DLHK",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4162",
      "label": "K_DATABASE_BK",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160647e3d8066494d4174",
      "label": "K_DATABASE_BK",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41a8",
      "label": "K_DATABASE_BK",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160717e3d8066494d4206",
      "label": "K_DATABASE_BK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160727e3d8066494d4257",
      "label": "K_DATABASE_BK",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160727e3d8066494d4248",
      "label": "K_DATABASE_BK",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160787e3d8066494d42b9",
      "label": "K_DATABASE_BK",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160767e3d8066494d42a7",
      "label": "K_DATABASE_BK",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160807e3d8066494d42e1",
      "label": "K_DATABASE_BK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160837e3d8066494d4326",
      "label": "K_DATABASE_BK",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4161",
      "label": "K_DATABASE_DLHK",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160647e3d8066494d4170",
      "label": "K_DATABASE_DLHK",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160717e3d8066494d4203",
      "label": "K_DATABASE_DLHK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160727e3d8066494d4247",
      "label": "K_DATABASE_DLHK",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160787e3d8066494d42b8",
      "label": "K_DATABASE_DLHK",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160767e3d8066494d42a6",
      "label": "K_DATABASE_DLHK",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160807e3d8066494d42de",
      "label": "K_DATABASE_DLHK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160827e3d8066494d4322",
      "label": "K_DATABASE_DLHK",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160767e3d8066494d42a4",
      "label": "K_DATABASE_STORAGE_USAGE_DLHK",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160787e3d8066494d42b6",
      "label": "K_DATABASE_STORAGE_USAGE_DLHK",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160647e3d8066494d4157",
      "label": "K_QUERY_BK",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "627160717e3d8066494d4207",
      "label": "K_QUERY_BK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "6271607a7e3d8066494d42c3",
      "label": "K_QUERY_BK",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160807e3d8066494d42e2",
      "label": "K_QUERY_BK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4202",
      "label": "K_QUERY_DLHK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42dd",
      "label": "K_QUERY_DLHK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4208",
      "label": "K_SCHEMA_BK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42e3",
      "label": "K_SCHEMA_BK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4209",
      "label": "K_SESSION_BK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42e4",
      "label": "K_SESSION_BK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160707e3d8066494d41e9",
      "label": "K_STORAGE_USAGE_DLHK",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160757e3d8066494d4293",
      "label": "K_STORAGE_USAGE_DLHK",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160647e3d8066494d415b",
      "label": "K_TABLE_BK",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "627160647e3d8066494d4173",
      "label": "K_TABLE_BK",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41a7",
      "label": "K_TABLE_BK",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4256",
      "label": "K_TABLE_BK",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "6271607a7e3d8066494d42c7",
      "label": "K_TABLE_BK",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160837e3d8066494d4325",
      "label": "K_TABLE_BK",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d415a",
      "label": "K_TABLE_DLHK",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "627160647e3d8066494d416f",
      "label": "K_TABLE_DLHK",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41a5",
      "label": "K_TABLE_DLHK",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4254",
      "label": "K_TABLE_DLHK",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "6271607a7e3d8066494d42c6",
      "label": "K_TABLE_DLHK",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160827e3d8066494d4321",
      "label": "K_TABLE_DLHK",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4175",
      "label": "K_TABLE_SCHEMA_BK",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41a9",
      "label": "K_TABLE_SCHEMA_BK",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4258",
      "label": "K_TABLE_SCHEMA_BK",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160837e3d8066494d4327",
      "label": "K_TABLE_SCHEMA_BK",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4159",
      "label": "K_UNIQUE_TABLE_DLHK",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "627160647e3d8066494d4171",
      "label": "K_UNIQUE_TABLE_DLHK",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41a6",
      "label": "K_UNIQUE_TABLE_DLHK",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4255",
      "label": "K_UNIQUE_TABLE_DLHK",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "6271607a7e3d8066494d42c5",
      "label": "K_UNIQUE_TABLE_DLHK",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160827e3d8066494d4323",
      "label": "K_UNIQUE_TABLE_DLHK",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4139",
      "label": "K_USER_DLHK",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160647e3d8066494d4158",
      "label": "K_USER_DLHK",
      "comboId": "627160637e3d8066494d4133"
    },
    {
      "id": "6271607a7e3d8066494d42c4",
      "label": "K_USER_DLHK",
      "comboId": "627160707e3d8066494d41e4"
    },
    {
      "id": "627160727e3d8066494d4274",
      "label": "K_USER_DLHK",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160717e3d8066494d4205",
      "label": "K_USER_DLHK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42e0",
      "label": "K_USER_DLHK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160657e3d8066494d41c5",
      "label": "K_WAREHOUSE_BK",
      "comboId": "627160637e3d8066494d4137"
    },
    {
      "id": "6271606f7e3d8066494d41d4",
      "label": "K_WAREHOUSE_BK",
      "comboId": "627160657e3d8066494d41c7"
    },
    {
      "id": "627160707e3d8066494d41dc",
      "label": "K_WAREHOUSE_BK",
      "comboId": "6271606b7e3d8066494d41d0"
    },
    {
      "id": "627160717e3d8066494d420a",
      "label": "K_WAREHOUSE_BK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42e5",
      "label": "K_WAREHOUSE_BK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "6271607e7e3d8066494d42cf",
      "label": "K_WAREHOUSE_BK",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160657e3d8066494d41c4",
      "label": "K_WAREHOUSE_DLHK",
      "comboId": "627160637e3d8066494d4137"
    },
    {
      "id": "6271606f7e3d8066494d41d3",
      "label": "K_WAREHOUSE_DLHK",
      "comboId": "627160657e3d8066494d41c7"
    },
    {
      "id": "627160707e3d8066494d41db",
      "label": "K_WAREHOUSE_DLHK",
      "comboId": "6271606b7e3d8066494d41d0"
    },
    {
      "id": "627160717e3d8066494d4204",
      "label": "K_WAREHOUSE_DLHK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "6271607e7e3d8066494d42ce",
      "label": "K_WAREHOUSE_DLHK",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160807e3d8066494d42df",
      "label": "K_WAREHOUSE_DLHK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "62715f8f7e3d8066494d3fcb",
      "label": "LAST_ALTERED",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f917e3d8066494d4103",
      "label": "LAST_ALTERED",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f907e3d8066494d4065",
      "label": "LAST_ALTERED",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f917e3d8066494d40b4",
      "label": "LAST_ALTERED",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40be",
      "label": "LAST_ALTERED",
      "comboId": "62715f8e7e3d8066494d3fa4"
    },
    {
      "id": "62715f907e3d8066494d4087",
      "label": "LAST_ALTERED",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d409c",
      "label": "LAST_ALTERED",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f917e3d8066494d4112",
      "label": "LAST_ALTERED",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f907e3d8066494d403d",
      "label": "LAST_LOAD_TIME",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f917e3d8066494d411a",
      "label": "LAST_NAME",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d4127",
      "label": "LAST_SUCCESS_LOGIN",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f907e3d8066494d400c",
      "label": "LIST_EXTERNAL_FILES_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f917e3d8066494d4129",
      "label": "LOCKED_UNTIL_TIME",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d4117",
      "label": "LOGIN_NAME",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f917e3d8066494d40e4",
      "label": "MAXIMUM_CARDINALITY",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d4082",
      "label": "MAXIMUM_VALUE",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f8f7e3d8066494d3fd1",
      "label": "MAX_BATCH_ROWS",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "627160647e3d8066494d4154",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160647e3d8066494d416c",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160657e3d8066494d41a3",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41c2",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160717e3d8066494d4200",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160727e3d8066494d4271",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160727e3d8066494d428f",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160727e3d8066494d4252",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160707e3d8066494d41f2",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160787e3d8066494d42c1",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160767e3d8066494d42af",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160757e3d8066494d429c",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160837e3d8066494d4355",
      "label": "MD_ELT_UPDATED_DTS",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d416d",
      "label": "MD_INTGR_ID",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160647e3d8066494d4155",
      "label": "MD_INTGR_ID",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160657e3d8066494d41a4",
      "label": "MD_INTGR_ID",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41c3",
      "label": "MD_INTGR_ID",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160707e3d8066494d41f3",
      "label": "MD_INTGR_ID",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160727e3d8066494d4272",
      "label": "MD_INTGR_ID",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160717e3d8066494d4201",
      "label": "MD_INTGR_ID",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160727e3d8066494d4253",
      "label": "MD_INTGR_ID",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160727e3d8066494d4290",
      "label": "MD_INTGR_ID",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160767e3d8066494d42b0",
      "label": "MD_INTGR_ID",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160787e3d8066494d42c2",
      "label": "MD_INTGR_ID",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160757e3d8066494d429d",
      "label": "MD_INTGR_ID",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160837e3d8066494d4356",
      "label": "MD_INTGR_ID",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4153",
      "label": "MD_IS_DELETED",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160647e3d8066494d416b",
      "label": "MD_IS_DELETED",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160657e3d8066494d41a2",
      "label": "MD_IS_DELETED",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160657e3d8066494d41c1",
      "label": "MD_IS_DELETED",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160767e3d8066494d42ae",
      "label": "MD_IS_DELETED",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160727e3d8066494d4251",
      "label": "MD_IS_DELETED",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160727e3d8066494d428e",
      "label": "MD_IS_DELETED",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160727e3d8066494d4270",
      "label": "MD_IS_DELETED",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160787e3d8066494d42c0",
      "label": "MD_IS_DELETED",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160837e3d8066494d4354",
      "label": "MD_IS_DELETED",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160647e3d8066494d4151",
      "label": "MD_VALID_FROM_DTS",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160727e3d8066494d428c",
      "label": "MD_VALID_FROM_DTS",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160647e3d8066494d4152",
      "label": "MD_VALID_TO_DTS",
      "comboId": "627160637e3d8066494d4132"
    },
    {
      "id": "627160657e3d8066494d41c0",
      "label": "MD_VALID_TO_DTS",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160657e3d8066494d41a1",
      "label": "MD_VALID_TO_DTS",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160727e3d8066494d428d",
      "label": "MD_VALID_TO_DTS",
      "comboId": "627160707e3d8066494d41e7"
    },
    {
      "id": "627160727e3d8066494d426f",
      "label": "MD_VALID_TO_DTS",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160787e3d8066494d42bf",
      "label": "MD_VALID_TO_DTS",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160767e3d8066494d42ad",
      "label": "MD_VALID_TO_DTS",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160837e3d8066494d4353",
      "label": "MD_VALID_TO_DTS",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "62715f907e3d8066494d4081",
      "label": "MINIMUM_VALUE",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f917e3d8066494d411c",
      "label": "MUST_CHANGE_PASSWORD",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "627160767e3d8066494d42b3",
      "label": "M_AMOUNT_BILLABLE",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160757e3d8066494d42a1",
      "label": "M_AMOUNT_BILLABLE",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160757e3d8066494d42a0",
      "label": "M_AMOUNT_BILLABLE_FAILSAFE",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160767e3d8066494d42b2",
      "label": "M_AMOUNT_BILLABLE_FAILSAFE",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160757e3d8066494d429e",
      "label": "M_AMOUNT_BILLABLE_STAGE",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160757e3d8066494d429f",
      "label": "M_AMOUNT_BILLABLE_STORAGE",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160767e3d8066494d42b1",
      "label": "M_AMOUNT_BILLABLE_STORAGE",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "6271607e7e3d8066494d42d8",
      "label": "M_AMOUNT_SPENT",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160717e3d8066494d4244",
      "label": "M_AMOUNT_SPENT_CLOUD_SERVICES",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "6271607e7e3d8066494d42d6",
      "label": "M_AMOUNT_SPENT_CLOUD_SERVICES",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "6271607e7e3d8066494d42d7",
      "label": "M_AMOUNT_SPENT_COMPUTE",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160767e3d8066494d42a8",
      "label": "M_AVERAGE_DATABASE_BYTES",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160787e3d8066494d42ba",
      "label": "M_AVERAGE_DATABASE_BYTES",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160767e3d8066494d42aa",
      "label": "M_AVERAGE_DATABASE_TERABYTES",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160787e3d8066494d42bc",
      "label": "M_AVERAGE_DATABASE_TERABYTES",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160787e3d8066494d42bb",
      "label": "M_AVERAGE_FAILSAFE_BYTES",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160767e3d8066494d42a9",
      "label": "M_AVERAGE_FAILSAFE_BYTES",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160767e3d8066494d42ab",
      "label": "M_AVERAGE_FAILSAFE_TERABYTES",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160787e3d8066494d42bd",
      "label": "M_AVERAGE_FAILSAFE_TERABYTES",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160707e3d8066494d41f1",
      "label": "M_BILLABLE_TB",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160767e3d8066494d42ac",
      "label": "M_BILLABLE_TB",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160757e3d8066494d429b",
      "label": "M_BILLABLE_TB",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160787e3d8066494d42be",
      "label": "M_BILLABLE_TB",
      "comboId": "627160707e3d8066494d41da"
    },
    {
      "id": "627160657e3d8066494d41bc",
      "label": "M_BYTES",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d426b",
      "label": "M_BYTES",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160717e3d8066494d421d",
      "label": "M_BYTES_DELETED",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42f8",
      "label": "M_BYTES_DELETED",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d421e",
      "label": "M_BYTES_READ_FROM_RESULT",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42f9",
      "label": "M_BYTES_READ_FROM_RESULT",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d421f",
      "label": "M_BYTES_SCANNED",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42fa",
      "label": "M_BYTES_SCANNED",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4220",
      "label": "M_BYTES_SENT_OVER_THE_NETWORK",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42fb",
      "label": "M_BYTES_SENT_OVER_THE_NETWORK",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4221",
      "label": "M_BYTES_SPILLED_TO_LOCAL_STORAGE",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42fc",
      "label": "M_BYTES_SPILLED_TO_LOCAL_STORAGE",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4222",
      "label": "M_BYTES_SPILLED_TO_REMOTE_STORAGE",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42fd",
      "label": "M_BYTES_SPILLED_TO_REMOTE_STORAGE",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4223",
      "label": "M_BYTES_WRITTEN",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42fe",
      "label": "M_BYTES_WRITTEN",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4224",
      "label": "M_BYTES_WRITTEN_TO_RESULT",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d42ff",
      "label": "M_BYTES_WRITTEN_TO_RESULT",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160657e3d8066494d419a",
      "label": "M_CHARACTER_MAXIMUM_LENGTH",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d434c",
      "label": "M_CHARACTER_MAXIMUM_LENGTH",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d419b",
      "label": "M_CHARACTER_OCTET_LENGTH",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d434d",
      "label": "M_CHARACTER_OCTET_LENGTH",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160717e3d8066494d4245",
      "label": "M_CLOUD_SERVICES_RATE_PER_CREDIT",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "6271607e7e3d8066494d42d9",
      "label": "M_CLOUD_SERVICES_RATE_PER_CREDIT",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160717e3d8066494d4225",
      "label": "M_COMPILATION_TIME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4300",
      "label": "M_COMPILATION_TIME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4226",
      "label": "M_COMPILATION_TIME_SECONDS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4301",
      "label": "M_COMPILATION_TIME_SECONDS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "6271607e7e3d8066494d42da",
      "label": "M_COMPUTE_RATE_PER_CREDIT",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160717e3d8066494d41fe",
      "label": "M_CONTRACT_NUMBER",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160707e3d8066494d41e0",
      "label": "M_CREDITS_USED",
      "comboId": "6271606b7e3d8066494d41d0"
    },
    {
      "id": "6271607e7e3d8066494d42d3",
      "label": "M_CREDITS_USED",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160707e3d8066494d41e1",
      "label": "M_CREDITS_USED_CLOUD_SERVICES",
      "comboId": "6271606b7e3d8066494d41d0"
    },
    {
      "id": "627160717e3d8066494d4227",
      "label": "M_CREDITS_USED_CLOUD_SERVICES",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "6271607e7e3d8066494d42d4",
      "label": "M_CREDITS_USED_CLOUD_SERVICES",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160807e3d8066494d4302",
      "label": "M_CREDITS_USED_CLOUD_SERVICES",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160707e3d8066494d41e2",
      "label": "M_CREDITS_USED_COMPUTE",
      "comboId": "6271606b7e3d8066494d41d0"
    },
    {
      "id": "6271607e7e3d8066494d42d5",
      "label": "M_CREDITS_USED_COMPUTE",
      "comboId": "627160727e3d8066494d4273"
    },
    {
      "id": "627160657e3d8066494d419c",
      "label": "M_DATETIME_PRECISION",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d434e",
      "label": "M_DATETIME_PRECISION",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160717e3d8066494d41ff",
      "label": "M_EFFECTIVE_RATE",
      "comboId": "6271606f7e3d8066494d41d6"
    },
    {
      "id": "627160717e3d8066494d4228",
      "label": "M_EXECUTION_TIME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4303",
      "label": "M_EXECUTION_TIME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4229",
      "label": "M_EXECUTION_TIME_SECONDS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4304",
      "label": "M_EXECUTION_TIME_SECONDS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d422a",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_INVOCATIONS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4305",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_INVOCATIONS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d422b",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_RECEIVED_BYTES",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4306",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_RECEIVED_BYTES",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d422c",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_RECEIVED_ROWS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4307",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_RECEIVED_ROWS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d422d",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_SENT_BYTES",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4308",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_SENT_BYTES",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d422e",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_SENT_ROWS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4309",
      "label": "M_EXTERNAL_FUNCTION_TOTAL_SENT_ROWS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160707e3d8066494d41ed",
      "label": "M_FAILSAFE_BYTES",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160757e3d8066494d4297",
      "label": "M_FAILSAFE_BYTES",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160707e3d8066494d41f0",
      "label": "M_FAILSAFE_TERABYTES",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160757e3d8066494d429a",
      "label": "M_FAILSAFE_TERABYTES",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160717e3d8066494d422f",
      "label": "M_INBOUND_DATA_TRANSFER_BYTES",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d430a",
      "label": "M_INBOUND_DATA_TRANSFER_BYTES",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4230",
      "label": "M_LIST_EXTERNAL_FILES_TIME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d430b",
      "label": "M_LIST_EXTERNAL_FILES_TIME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160657e3d8066494d419d",
      "label": "M_NUMERIC_PRECISION",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d434f",
      "label": "M_NUMERIC_PRECISION",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d419e",
      "label": "M_NUMERIC_PRECISION_RADIX",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4350",
      "label": "M_NUMERIC_PRECISION_RADIX",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d419f",
      "label": "M_NUMERIC_SCALE",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4351",
      "label": "M_NUMERIC_SCALE",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160657e3d8066494d41a0",
      "label": "M_ORDINAL_POSITION",
      "comboId": "627160637e3d8066494d4136"
    },
    {
      "id": "627160837e3d8066494d4352",
      "label": "M_ORDINAL_POSITION",
      "comboId": "627160807e3d8066494d431f"
    },
    {
      "id": "627160717e3d8066494d4231",
      "label": "M_OUTBOUND_DATA_TRANSFER_BYTES",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d430c",
      "label": "M_OUTBOUND_DATA_TRANSFER_BYTES",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4232",
      "label": "M_PARTITIONS_SCANNED",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d430d",
      "label": "M_PARTITIONS_SCANNED",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4233",
      "label": "M_PARTITIONS_TOTAL",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d430e",
      "label": "M_PARTITIONS_TOTAL",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4234",
      "label": "M_PERCENTAGE_SCANNED_FROM_CACHE",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d430f",
      "label": "M_PERCENTAGE_SCANNED_FROM_CACHE",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4235",
      "label": "M_QUERY_LOAD_PERCENT",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4310",
      "label": "M_QUERY_LOAD_PERCENT",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4236",
      "label": "M_QUEUED_OVERLOAD_TIME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4311",
      "label": "M_QUEUED_OVERLOAD_TIME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4237",
      "label": "M_QUEUED_OVERLOAD_TIME_SECONDS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4312",
      "label": "M_QUEUED_OVERLOAD_TIME_SECONDS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4238",
      "label": "M_QUEUED_PROVISIONING_TIME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4313",
      "label": "M_QUEUED_PROVISIONING_TIME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4239",
      "label": "M_QUEUED_PROVISIONING_TIME_SECONDS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4314",
      "label": "M_QUEUED_PROVISIONING_TIME_SECONDS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d423a",
      "label": "M_QUEUED_REPAIR_TIME_SECONDS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4315",
      "label": "M_QUEUED_REPAIR_TIME_SECONDS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160647e3d8066494d416a",
      "label": "M_RETENTION_TIME",
      "comboId": "627160637e3d8066494d4134"
    },
    {
      "id": "627160657e3d8066494d41bd",
      "label": "M_RETENTION_TIME",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d4250",
      "label": "M_RETENTION_TIME",
      "comboId": "627160707e3d8066494d41e6"
    },
    {
      "id": "627160727e3d8066494d426c",
      "label": "M_RETENTION_TIME",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160717e3d8066494d423b",
      "label": "M_ROWS_DELETED",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4316",
      "label": "M_ROWS_DELETED",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d423c",
      "label": "M_ROWS_INSERTED",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4317",
      "label": "M_ROWS_INSERTED",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d423d",
      "label": "M_ROWS_PRODUCED",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4318",
      "label": "M_ROWS_PRODUCED",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d423e",
      "label": "M_ROWS_UNLOADED",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d4319",
      "label": "M_ROWS_UNLOADED",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d423f",
      "label": "M_ROWS_UPDATED",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d431a",
      "label": "M_ROWS_UPDATED",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160657e3d8066494d41be",
      "label": "M_ROW_COUNT",
      "comboId": "627160637e3d8066494d4135"
    },
    {
      "id": "627160727e3d8066494d426d",
      "label": "M_ROW_COUNT",
      "comboId": "627160707e3d8066494d41e8"
    },
    {
      "id": "627160707e3d8066494d41ec",
      "label": "M_STAGE_BYTES",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160757e3d8066494d4296",
      "label": "M_STAGE_BYTES",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160707e3d8066494d41ef",
      "label": "M_STAGE_TERABYTES",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160757e3d8066494d4299",
      "label": "M_STAGE_TERABYTES",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160707e3d8066494d41eb",
      "label": "M_STORAGE_BYTES",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160757e3d8066494d4295",
      "label": "M_STORAGE_BYTES",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160767e3d8066494d42b4",
      "label": "M_STORAGE_RATE",
      "comboId": "627160707e3d8066494d41e5"
    },
    {
      "id": "627160757e3d8066494d42a2",
      "label": "M_STORAGE_RATE",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160707e3d8066494d41ee",
      "label": "M_STORAGE_TERABYTES",
      "comboId": "6271606f7e3d8066494d41d7"
    },
    {
      "id": "627160757e3d8066494d4298",
      "label": "M_STORAGE_TERABYTES",
      "comboId": "627160707e3d8066494d41e3"
    },
    {
      "id": "627160717e3d8066494d4240",
      "label": "M_TOTAL_ELAPSED_TIME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d431b",
      "label": "M_TOTAL_ELAPSED_TIME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4241",
      "label": "M_TOTAL_ELAPSED_TIME_SECONDS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d431c",
      "label": "M_TOTAL_ELAPSED_TIME_SECONDS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4242",
      "label": "M_TRANSACTION_BLOCKED_TIME",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d431d",
      "label": "M_TRANSACTION_BLOCKED_TIME",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "627160717e3d8066494d4243",
      "label": "M_TRANSACTION_BLOCKED_TIME_SECONDS",
      "comboId": "6271606f7e3d8066494d41d8"
    },
    {
      "id": "627160807e3d8066494d431e",
      "label": "M_TRANSACTION_BLOCKED_TIME_SECONDS",
      "comboId": "6271607c7e3d8066494d42cd"
    },
    {
      "id": "62715f917e3d8066494d4114",
      "label": "NAME",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f907e3d8066494d4083",
      "label": "NEXT_VALUE",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d4061",
      "label": "NULL_IF",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f8f7e3d8066494d3fc3",
      "label": "NUMERIC_PRECISION",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f907e3d8066494d407d",
      "label": "NUMERIC_PRECISION",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f917e3d8066494d40cf",
      "label": "NUMERIC_PRECISION",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f8f7e3d8066494d3fc4",
      "label": "NUMERIC_PRECISION_RADIX",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f907e3d8066494d407e",
      "label": "NUMERIC_PRECISION_RADIX",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f917e3d8066494d40d0",
      "label": "NUMERIC_PRECISION_RADIX",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f8f7e3d8066494d3fc5",
      "label": "NUMERIC_SCALE",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f907e3d8066494d407f",
      "label": "NUMERIC_SCALE",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f917e3d8066494d40d1",
      "label": "NUMERIC_SCALE",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f8f7e3d8066494d3fb7",
      "label": "OBJECTS_MODIFIED",
      "comboId": "62715f8e7e3d8066494d3fa6"
    },
    {
      "id": "62715f917e3d8066494d40c9",
      "label": "ORDINAL_POSITION",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d4017",
      "label": "ORGANIZATION_NAME",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f907e3d8066494d4008",
      "label": "OUTBOUND_DATA_TRANSFER_BYTES",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4006",
      "label": "OUTBOUND_DATA_TRANSFER_CLOUD",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4007",
      "label": "OUTBOUND_DATA_TRANSFER_REGION",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ffb",
      "label": "PARTITIONS_SCANNED",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ffc",
      "label": "PARTITIONS_TOTAL",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f917e3d8066494d412b",
      "label": "PASSWORD_LAST_SET_TIME",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f907e3d8066494d3ff1",
      "label": "PERCENTAGE_SCANNED_FROM_CACHE",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f8f7e3d8066494d3fb2",
      "label": "QUERY_ID",
      "comboId": "62715f8e7e3d8066494d3fa6"
    },
    {
      "id": "62715f8f7e3d8066494d3fda",
      "label": "QUERY_ID",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4014",
      "label": "QUERY_LOAD_PERCENT",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f8f7e3d8066494d3fb3",
      "label": "QUERY_START_TIME",
      "comboId": "62715f8e7e3d8066494d3fa6"
    },
    {
      "id": "62715f8f7e3d8066494d3fe9",
      "label": "QUERY_TAG",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f8f7e3d8066494d3fdb",
      "label": "QUERY_TEXT",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f8f7e3d8066494d3fe0",
      "label": "QUERY_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4004",
      "label": "QUEUED_OVERLOAD_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4002",
      "label": "QUEUED_PROVISIONING_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4003",
      "label": "QUEUED_REPAIR_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4056",
      "label": "RECORD_DELIMITER",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f917e3d8066494d40ac",
      "label": "REFERENCE_GENERATION",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f907e3d8066494d401b",
      "label": "REGION",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f907e3d8066494d4074",
      "label": "RELATED_EVENT_ID",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d400e",
      "label": "RELEASE_VERSION",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d406d",
      "label": "REPORTED_CLIENT_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d406e",
      "label": "REPORTED_CLIENT_VERSION",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f907e3d8066494d402c",
      "label": "RETAINED_FOR_CLONE_BYTES",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f917e3d8066494d40c0",
      "label": "RETENTION_TIME",
      "comboId": "62715f8e7e3d8066494d3fa4"
    },
    {
      "id": "62715f917e3d8066494d40aa",
      "label": "RETENTION_TIME",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f8f7e3d8066494d3fe3",
      "label": "ROLE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ff8",
      "label": "ROWS_DELETED",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ff6",
      "label": "ROWS_INSERTED",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ff5",
      "label": "ROWS_PRODUCED",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ff9",
      "label": "ROWS_UNLOADED",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d3ff7",
      "label": "ROWS_UPDATED",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d403f",
      "label": "ROW_COUNT",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d40a8",
      "label": "ROW_COUNT",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f907e3d8066494d4040",
      "label": "ROW_PARSED",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d4031",
      "label": "SCHEMA_CREATED",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d4032",
      "label": "SCHEMA_DROPPED",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f8f7e3d8066494d3fde",
      "label": "SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4038",
      "label": "SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f8f7e3d8066494d3fdf",
      "label": "SCHEMA_NAME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4039",
      "label": "SCHEMA_NAME",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f917e3d8066494d40e1",
      "label": "SCOPE_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40e3",
      "label": "SCOPE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40e2",
      "label": "SCOPE_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d4070",
      "label": "SECOND_AUTHENTICATION_FACTOR",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f917e3d8066494d40ab",
      "label": "SELF_REFERENCING_COLUMN_NAME",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f907e3d8066494d407a",
      "label": "SEQUENCE_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d4079",
      "label": "SEQUENCE_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d4075",
      "label": "SEQUENCE_ID",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d4076",
      "label": "SEQUENCE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d407b",
      "label": "SEQUENCE_OWNER",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d4078",
      "label": "SEQUENCE_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d4077",
      "label": "SEQUENCE_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d401c",
      "label": "SERVICE_LEVEL",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f907e3d8066494d4020",
      "label": "SERVICE_TYPE",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f8f7e3d8066494d3fe1",
      "label": "SESSION_ID",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4058",
      "label": "SKIP_HEADER",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f917e3d8066494d4120",
      "label": "SNOWFLAKE_LOCK",
      "comboId": "62715f8e7e3d8066494d3fae"
    },
    {
      "id": "62715f8f7e3d8066494d3fd8",
      "label": "STAGE_BYTES",
      "comboId": "62715f8e7e3d8066494d3faa"
    },
    {
      "id": "62715f917e3d8066494d410b",
      "label": "STAGE_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d410a",
      "label": "STAGE_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d4106",
      "label": "STAGE_ID",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d4107",
      "label": "STAGE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d410f",
      "label": "STAGE_OWNER",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d410d",
      "label": "STAGE_REGION",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d4109",
      "label": "STAGE_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d4108",
      "label": "STAGE_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d410e",
      "label": "STAGE_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f917e3d8066494d410c",
      "label": "STAGE_URL",
      "comboId": "62715f8e7e3d8066494d3fa9"
    },
    {
      "id": "62715f8f7e3d8066494d3fed",
      "label": "START_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4047",
      "label": "START_TIME",
      "comboId": "62715f8e7e3d8066494d3fb0"
    },
    {
      "id": "62715f907e3d8066494d4080",
      "label": "START_VALUE",
      "comboId": "62715f8e7e3d8066494d3fa7"
    },
    {
      "id": "62715f907e3d8066494d403e",
      "label": "STATUS",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f8f7e3d8066494d3fd7",
      "label": "STORAGE_BYTES",
      "comboId": "62715f8e7e3d8066494d3faa"
    },
    {
      "id": "62715f907e3d8066494d4095",
      "label": "TABLE_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d4026",
      "label": "TABLE_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d40a3",
      "label": "TABLE_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40c8",
      "label": "TABLE_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40fb",
      "label": "TABLE_CATALOG",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f907e3d8066494d4025",
      "label": "TABLE_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f917e3d8066494d40fa",
      "label": "TABLE_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f907e3d8066494d40a2",
      "label": "TABLE_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f907e3d8066494d4094",
      "label": "TABLE_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f917e3d8066494d40c7",
      "label": "TABLE_CATALOG_ID",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d402e",
      "label": "TABLE_CREATED",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d402f",
      "label": "TABLE_DROPPED",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d4030",
      "label": "TABLE_ENTERED_FAILSAFE",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d4036",
      "label": "TABLE_ID",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d409e",
      "label": "TABLE_ID",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40c3",
      "label": "TABLE_ID",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40f6",
      "label": "TABLE_ID",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f907e3d8066494d4090",
      "label": "TABLE_ID",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d4022",
      "label": "TABLE_NAME",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d4037",
      "label": "TABLE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa2"
    },
    {
      "id": "62715f907e3d8066494d4091",
      "label": "TABLE_NAME",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d409f",
      "label": "TABLE_NAME",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40c4",
      "label": "TABLE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40f7",
      "label": "TABLE_NAME",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f917e3d8066494d40fc",
      "label": "TABLE_OWNER",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f907e3d8066494d40a4",
      "label": "TABLE_OWNER",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f907e3d8066494d4093",
      "label": "TABLE_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f907e3d8066494d4024",
      "label": "TABLE_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f917e3d8066494d40c6",
      "label": "TABLE_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f907e3d8066494d40a1",
      "label": "TABLE_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40f9",
      "label": "TABLE_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f907e3d8066494d4023",
      "label": "TABLE_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f907e3d8066494d40a0",
      "label": "TABLE_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f907e3d8066494d4092",
      "label": "TABLE_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fab"
    },
    {
      "id": "62715f917e3d8066494d40c5",
      "label": "TABLE_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40f8",
      "label": "TABLE_SCHEMA_ID",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f907e3d8066494d40a5",
      "label": "TABLE_TYPE",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f8f7e3d8066494d3fd5",
      "label": "TARGET_PATH",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f907e3d8066494d405b",
      "label": "TIMESTAMP_FORMAT",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d405a",
      "label": "TIME_FORMAT",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f907e3d8066494d402a",
      "label": "TIME_TRAVEL_BYTES",
      "comboId": "62715f8e7e3d8066494d3fac"
    },
    {
      "id": "62715f8f7e3d8066494d3fef",
      "label": "TOTAL_ELAPSED_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d4005",
      "label": "TRANSACTION_BLOCKED_TIME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d405f",
      "label": "TRIM_SPACE",
      "comboId": "62715f8e7e3d8066494d3fa0"
    },
    {
      "id": "62715f917e3d8066494d40de",
      "label": "UDT_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40e0",
      "label": "UDT_NAME",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f917e3d8066494d40df",
      "label": "UDT_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fa8"
    },
    {
      "id": "62715f8f7e3d8066494d3fd6",
      "label": "USAGE_DATE",
      "comboId": "62715f8e7e3d8066494d3faa"
    },
    {
      "id": "62715f917e3d8066494d40f0",
      "label": "USAGE_DATE",
      "comboId": "62715f8e7e3d8066494d3f9f"
    },
    {
      "id": "62715f907e3d8066494d401d",
      "label": "USAGE_TYPE",
      "comboId": "62715f8e7e3d8066494d3fb1"
    },
    {
      "id": "62715f917e3d8066494d40ad",
      "label": "USER_DEFINED_TYPE_CATALOG",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40af",
      "label": "USER_DEFINED_TYPE_NAME",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f917e3d8066494d40ae",
      "label": "USER_DEFINED_TYPE_SCHEMA",
      "comboId": "62715f8e7e3d8066494d3fad"
    },
    {
      "id": "62715f8f7e3d8066494d3fb4",
      "label": "USER_NAME",
      "comboId": "62715f8e7e3d8066494d3fa6"
    },
    {
      "id": "62715f8f7e3d8066494d3fe2",
      "label": "USER_NAME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d406b",
      "label": "USER_NAME",
      "comboId": "62715f8e7e3d8066494d3fa3"
    },
    {
      "id": "62715f917e3d8066494d40fd",
      "label": "VIEW_DEFINITION",
      "comboId": "62715f8e7e3d8066494d3faf"
    },
    {
      "id": "62715f8f7e3d8066494d3fc8",
      "label": "VOLATILITY",
      "comboId": "62715f8e7e3d8066494d3fa1"
    },
    {
      "id": "62715f907e3d8066494d4049",
      "label": "WAREHOUSE_ID",
      "comboId": "62715f8e7e3d8066494d3fb0"
    },
    {
      "id": "62715f8f7e3d8066494d3fe4",
      "label": "WAREHOUSE_ID",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f8f7e3d8066494d3fe5",
      "label": "WAREHOUSE_NAME",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f907e3d8066494d404a",
      "label": "WAREHOUSE_NAME",
      "comboId": "62715f8e7e3d8066494d3fb0"
    },
    {
      "id": "62715f8f7e3d8066494d3fe6",
      "label": "WAREHOUSE_SIZE",
      "comboId": "62715f8e7e3d8066494d3fa5"
    },
    {
      "id": "62715f8f7e3d8066494d3fe7",
      "label": "WAREHOUSE_TYPE",
      "comboId": "62715f8e7e3d8066494d3fa5"
    }
  ],
  "edges": [
    {
      "source": "627160727e3d8066494d425d",
      "target": "627160657e3d8066494d41ae"
    },
    {
      "source": "627160837e3d8066494d4342",
      "target": "627160657e3d8066494d4190"
    },
    {
      "source": "627160837e3d8066494d4337",
      "target": "627160657e3d8066494d4185"
    },
    {
      "source": "627160727e3d8066494d4249",
      "target": "627160647e3d8066494d4163"
    },
    {
      "source": "627160727e3d8066494d427b",
      "target": "627160647e3d8066494d4140"
    },
    {
      "source": "627160727e3d8066494d427d",
      "target": "627160647e3d8066494d4142"
    },
    {
      "source": "627160837e3d8066494d4356",
      "target": "627160657e3d8066494d41a4"
    },
    {
      "source": "627160837e3d8066494d4341",
      "target": "627160657e3d8066494d418f"
    },
    {
      "source": "627160727e3d8066494d427a",
      "target": "627160647e3d8066494d413f"
    },
    {
      "source": "627160727e3d8066494d4266",
      "target": "627160657e3d8066494d41b7"
    },
    {
      "source": "627160727e3d8066494d428c",
      "target": "627160647e3d8066494d4151"
    },
    {
      "source": "627160837e3d8066494d4346",
      "target": "627160657e3d8066494d4194"
    },
    {
      "source": "627160727e3d8066494d427e",
      "target": "627160647e3d8066494d4143"
    },
    {
      "source": "627160727e3d8066494d428b",
      "target": "627160647e3d8066494d4150"
    },
    {
      "source": "6271606f7e3d8066494d41d5",
      "target": "627160657e3d8066494d41c6"
    },
    {
      "source": "627160727e3d8066494d4282",
      "target": "627160647e3d8066494d4147"
    },
    {
      "source": "627160827e3d8066494d4323",
      "target": "627160647e3d8066494d4171"
    },
    {
      "source": "627160727e3d8066494d4288",
      "target": "627160647e3d8066494d414d"
    },
    {
      "source": "627160727e3d8066494d4267",
      "target": "627160657e3d8066494d41b8"
    },
    {
      "source": "627160837e3d8066494d4334",
      "target": "627160657e3d8066494d4182"
    },
    {
      "source": "627160727e3d8066494d427f",
      "target": "627160647e3d8066494d4144"
    },
    {
      "source": "627160727e3d8066494d428f",
      "target": "627160647e3d8066494d4154"
    },
    {
      "source": "627160727e3d8066494d4260",
      "target": "627160657e3d8066494d41b1"
    },
    {
      "source": "627160727e3d8066494d425a",
      "target": "627160657e3d8066494d41ab"
    },
    {
      "source": "627160727e3d8066494d4251",
      "target": "627160647e3d8066494d416b"
    },
    {
      "source": "627160727e3d8066494d4290",
      "target": "627160647e3d8066494d4155"
    },
    {
      "source": "627160727e3d8066494d4248",
      "target": "627160647e3d8066494d4162"
    },
    {
      "source": "627160727e3d8066494d4275",
      "target": "627160647e3d8066494d413a"
    },
    {
      "source": "627160727e3d8066494d4289",
      "target": "627160647e3d8066494d414e"
    },
    {
      "source": "627160727e3d8066494d4287",
      "target": "627160647e3d8066494d414c"
    },
    {
      "source": "627160727e3d8066494d4279",
      "target": "627160647e3d8066494d413e"
    },
    {
      "source": "627160727e3d8066494d4280",
      "target": "627160647e3d8066494d4145"
    },
    {
      "source": "627160827e3d8066494d4320",
      "target": "627160647e3d8066494d416e"
    },
    {
      "source": "627160727e3d8066494d4286",
      "target": "627160647e3d8066494d414b"
    },
    {
      "source": "627160837e3d8066494d433e",
      "target": "627160657e3d8066494d418c"
    },
    {
      "source": "627160727e3d8066494d4285",
      "target": "627160647e3d8066494d414a"
    },
    {
      "source": "627160727e3d8066494d428e",
      "target": "627160647e3d8066494d4153"
    },
    {
      "source": "627160727e3d8066494d4274",
      "target": "627160647e3d8066494d4139"
    },
    {
      "source": "627160727e3d8066494d426e",
      "target": "627160657e3d8066494d41bf"
    },
    {
      "source": "627160727e3d8066494d428a",
      "target": "627160647e3d8066494d414f"
    },
    {
      "source": "627160727e3d8066494d4284",
      "target": "627160647e3d8066494d4149"
    },
    {
      "source": "627160727e3d8066494d427c",
      "target": "627160647e3d8066494d4141"
    },
    {
      "source": "627160727e3d8066494d4271",
      "target": "627160657e3d8066494d41c2"
    },
    {
      "source": "627160727e3d8066494d428d",
      "target": "627160647e3d8066494d4152"
    },
    {
      "source": "627160727e3d8066494d4276",
      "target": "627160647e3d8066494d413b"
    },
    {
      "source": "627160717e3d8066494d41f8",
      "target": "627160717e3d8066494d4246"
    },
    {
      "source": "627160727e3d8066494d424a",
      "target": "627160647e3d8066494d4164"
    },
    {
      "source": "627160727e3d8066494d4270",
      "target": "627160657e3d8066494d41c1"
    },
    {
      "source": "627160727e3d8066494d4277",
      "target": "627160647e3d8066494d413c"
    },
    {
      "source": "627160727e3d8066494d4278",
      "target": "627160647e3d8066494d413d"
    },
    {
      "source": "627160727e3d8066494d4256",
      "target": "627160657e3d8066494d41a7"
    },
    {
      "source": "627160717e3d8066494d41ff",
      "target": "627160757e3d8066494d42a2"
    },
    {
      "source": "627160727e3d8066494d4259",
      "target": "627160657e3d8066494d41aa"
    },
    {
      "source": "627160727e3d8066494d4283",
      "target": "627160647e3d8066494d4148"
    },
    {
      "source": "627160727e3d8066494d4281",
      "target": "627160647e3d8066494d4146"
    },
    {
      "source": "627160727e3d8066494d4250",
      "target": "627160647e3d8066494d416a"
    },
    {
      "source": "627160727e3d8066494d424e",
      "target": "627160647e3d8066494d4168"
    },
    {
      "source": "627160727e3d8066494d424d",
      "target": "627160647e3d8066494d4167"
    },
    {
      "source": "627160727e3d8066494d4269",
      "target": "627160657e3d8066494d41ba"
    },
    {
      "source": "6271606f7e3d8066494d41d4",
      "target": "627160657e3d8066494d41c5"
    },
    {
      "source": "6271606f7e3d8066494d41d3",
      "target": "627160657e3d8066494d41c4"
    },
    {
      "source": "627160837e3d8066494d4331",
      "target": "627160657e3d8066494d417f"
    },
    {
      "source": "627160837e3d8066494d432d",
      "target": "627160647e3d8066494d417b"
    },
    {
      "source": "627160717e3d8066494d41f8",
      "target": "627160757e3d8066494d42a3"
    },
    {
      "source": "627160837e3d8066494d433a",
      "target": "627160657e3d8066494d4188"
    },
    {
      "source": "627160837e3d8066494d432a",
      "target": "627160647e3d8066494d4178"
    },
    {
      "source": "627160727e3d8066494d424b",
      "target": "627160647e3d8066494d4165"
    },
    {
      "source": "627160837e3d8066494d432f",
      "target": "627160657e3d8066494d417d"
    },
    {
      "source": "627160727e3d8066494d426b",
      "target": "627160657e3d8066494d41bc"
    },
    {
      "source": "627160727e3d8066494d425c",
      "target": "627160657e3d8066494d41ad"
    },
    {
      "source": "627160837e3d8066494d432e",
      "target": "627160647e3d8066494d417c"
    },
    {
      "source": "627160837e3d8066494d4352",
      "target": "627160657e3d8066494d41a0"
    },
    {
      "source": "627160837e3d8066494d4343",
      "target": "627160657e3d8066494d4191"
    },
    {
      "source": "627160727e3d8066494d4254",
      "target": "627160657e3d8066494d41a5"
    },
    {
      "source": "627160717e3d8066494d41ff",
      "target": "627160717e3d8066494d4245"
    },
    {
      "source": "627160837e3d8066494d4324",
      "target": "627160647e3d8066494d4172"
    },
    {
      "source": "627160837e3d8066494d433c",
      "target": "627160657e3d8066494d418a"
    },
    {
      "source": "6271607a7e3d8066494d42c9",
      "target": "627160647e3d8066494d415d"
    },
    {
      "source": "627160837e3d8066494d4329",
      "target": "627160647e3d8066494d4177"
    },
    {
      "source": "627160837e3d8066494d434e",
      "target": "627160657e3d8066494d419c"
    },
    {
      "source": "627160837e3d8066494d4327",
      "target": "627160647e3d8066494d4175"
    },
    {
      "source": "627160727e3d8066494d4265",
      "target": "627160657e3d8066494d41b6"
    },
    {
      "source": "627160717e3d8066494d41ff",
      "target": "627160767e3d8066494d42b4"
    },
    {
      "source": "627160727e3d8066494d425b",
      "target": "627160657e3d8066494d41ac"
    },
    {
      "source": "627160727e3d8066494d424f",
      "target": "627160647e3d8066494d4169"
    },
    {
      "source": "627160727e3d8066494d426a",
      "target": "627160657e3d8066494d41bb"
    },
    {
      "source": "627160837e3d8066494d4347",
      "target": "627160657e3d8066494d4195"
    },
    {
      "source": "627160837e3d8066494d4348",
      "target": "627160657e3d8066494d4196"
    },
    {
      "source": "627160727e3d8066494d4261",
      "target": "627160657e3d8066494d41b2"
    },
    {
      "source": "627160837e3d8066494d4330",
      "target": "627160657e3d8066494d417e"
    },
    {
      "source": "627160837e3d8066494d434c",
      "target": "627160657e3d8066494d419a"
    },
    {
      "source": "627160837e3d8066494d4326",
      "target": "627160647e3d8066494d4174"
    },
    {
      "source": "627160837e3d8066494d432c",
      "target": "627160647e3d8066494d417a"
    },
    {
      "source": "627160837e3d8066494d4350",
      "target": "627160657e3d8066494d419e"
    },
    {
      "source": "627160837e3d8066494d4339",
      "target": "627160657e3d8066494d4187"
    },
    {
      "source": "627160837e3d8066494d4325",
      "target": "627160647e3d8066494d4173"
    },
    {
      "source": "6271607a7e3d8066494d42c5",
      "target": "627160647e3d8066494d4159"
    },
    {
      "source": "6271607a7e3d8066494d42c4",
      "target": "627160647e3d8066494d4158"
    },
    {
      "source": "627160727e3d8066494d426c",
      "target": "627160657e3d8066494d41bd"
    },
    {
      "source": "627160727e3d8066494d425e",
      "target": "627160657e3d8066494d41af"
    },
    {
      "source": "627160837e3d8066494d434d",
      "target": "627160657e3d8066494d419b"
    },
    {
      "source": "627160837e3d8066494d4336",
      "target": "627160657e3d8066494d4184"
    },
    {
      "source": "627160837e3d8066494d4328",
      "target": "627160647e3d8066494d4176"
    },
    {
      "source": "6271607a7e3d8066494d42cc",
      "target": "627160647e3d8066494d4160"
    },
    {
      "source": "627160837e3d8066494d4340",
      "target": "627160657e3d8066494d418e"
    },
    {
      "source": "627160837e3d8066494d4335",
      "target": "627160657e3d8066494d4183"
    },
    {
      "source": "627160727e3d8066494d4264",
      "target": "627160657e3d8066494d41b5"
    },
    {
      "source": "627160837e3d8066494d4353",
      "target": "627160657e3d8066494d41a1"
    },
    {
      "source": "6271607a7e3d8066494d42ca",
      "target": "627160647e3d8066494d415e"
    },
    {
      "source": "627160837e3d8066494d433f",
      "target": "627160657e3d8066494d418d"
    },
    {
      "source": "627160837e3d8066494d432b",
      "target": "627160647e3d8066494d4179"
    },
    {
      "source": "6271607a7e3d8066494d42c7",
      "target": "627160647e3d8066494d415b"
    },
    {
      "source": "6271607a7e3d8066494d42c3",
      "target": "627160647e3d8066494d4157"
    },
    {
      "source": "62715f917e3d8066494d40c2",
      "target": "627160837e3d8066494d432f"
    },
    
    {
      "source": "62715f917e3d8066494d4114",
      "target": "627160727e3d8066494d427f"
    },
    
    {
      "source": "62715f917e3d8066494d4114",
      "target": "627160727e3d8066494d4280"
    },
    
    
    {
      "source": "62715f917e3d8066494d40bc",
      "target": "627160727e3d8066494d424b"
    },
    {
      "source": "62715f917e3d8066494d40b9",
      "target": "627160727e3d8066494d4249"
    },
    {
      "source": "62715f917e3d8066494d40b8",
      "target": "627160727e3d8066494d4249"
    },
    {
      "source": "62715f917e3d8066494d40bd",
      "target": "627160727e3d8066494d424d"
    },
    {
      "source": "62715f917e3d8066494d40bf",
      "target": "627160727e3d8066494d424e"
    },
    {
      "source": "62715f917e3d8066494d40c0",
      "target": "627160727e3d8066494d424e"
    },
    {
      "source": "62715f917e3d8066494d40be",
      "target": "627160727e3d8066494d424c"
    },
    {
      "source": "62715f917e3d8066494d40c0",
      "target": "627160727e3d8066494d424c"
    },
    {
      "source": "62715f917e3d8066494d40c0",
      "target": "627160727e3d8066494d4250"
    },
    {
      "source": "62715f917e3d8066494d40b9",
      "target": "62715f917e3d8066494d40f2"
    },    
    {
      "source": "62715f917e3d8066494d40bf",
      "target": "62715f917e3d8066494d40f3"
    },
    {
      "source": "627160767e3d8066494d42a9",
      "target": "62715f917e3d8066494d40f5"
    },
    {
      "source": "627160767e3d8066494d42a8",
      "target": "62715f917e3d8066494d40f4"
    },
    {
      "source": "627160767e3d8066494d42a5",
      "target": "62715f917e3d8066494d40f0"
    },
    
    {
      "source": "62715f907e3d8066494d409f",
      "target": "627160727e3d8066494d4261"
    },
    {
      "source": "62715f907e3d8066494d40a1",
      "target": "627160727e3d8066494d4263"
    },
    {
      "source": "62715f907e3d8066494d40a0",
      "target": "627160727e3d8066494d4263"
    },
    
        //62715f8e7e3d8066494d3fad
        //62715f8e7e3d8066494d3fac
    
    {
      "source": "62715f907e3d8066494d409f",
      "target": "62715f907e3d8066494d4022"
    },
     
    {
      "source": "",
      "target": ""
    }, 
    {
      "source": "",
      "target": ""
    }, 
    {
      "source": "",
      "target": ""
    }, 
    {
      "source": "",
      "target": ""
    },
  ]
};