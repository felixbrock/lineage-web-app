import { InjectionMode, asClass, createContainer } from 'awilix';
import SnowflakeApiRepo from './infrastructure/snowflake-api/snowflake-api-repo';

const iocContainer = createContainer({ injectionMode: InjectionMode.CLASSIC });

iocContainer.register({
  snowflakeApiRepo: asClass(SnowflakeApiRepo),
});

export default iocContainer;
