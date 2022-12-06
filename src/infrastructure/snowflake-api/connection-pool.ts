import IntegrationApiRepo from "../integration-api/integration-api-repo";

export type DbOptions = {account: string, username: string, password: string, warehouse: string};

export interface IConnectionPool {
    use<U>(cb: (resource: unknown) => U | Promise<U>): Promise<U>;
    drain(): Promise<void>;
    clear(): Promise<void>;
  }

export const createConnectionPool = async (
    jwt: string,
    createPool: (
      options: DbOptions,
      poolOptions: { min: number; max: number }
    ) => IConnectionPool,
  ): Promise<IConnectionPool> => {
    const profile = await IntegrationApiRepo.getSnowflakeProfile(jwt);

    if(!profile) throw new Error('Snowflake Profile not found');
  
    const options: DbOptions = {
      account: profile.accountId,
      password: profile.password,
      username: profile.username,
      warehouse: profile.warehouseName,
    };
  
    return createPool(options, {
      max: 10,
      min: 0,
    });
  };