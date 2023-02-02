/* eslint-disable @typescript-eslint/dot-notation */
import { ReactElement, useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';

interface SnowflakeProps {
  jwt: string;
  parentHandleSaveClick: () => unknown;
}

export default ({
  jwt,
  parentHandleSaveClick,
}: SnowflakeProps): ReactElement => {
  const [buttonText, setButtonText] = useState('Save');
  const [form, setForm] = useState({
    accountId: '',
    username: '',
    password: '',
    warehouseName: '',
  });

  const handleSaveClick = async (): Promise<void> => {
    const snowflakeProfile = await IntegrationApiRepo.getSnowflakeProfile(jwt);

    if (!snowflakeProfile)
      await IntegrationApiRepo.postSnowflakeProfile(form, jwt);
    else await IntegrationApiRepo.updateSnowflakeProfile(form, jwt);

    setButtonText('Saved');

    parentHandleSaveClick();

    await IntegrationApiRepo.postSnowflakeEnvironment(jwt);
  };

  useEffect(() => {
    IntegrationApiRepo.getSnowflakeProfile(jwt)
      .then((res) => {
        if (!res) return;

        setForm({
          accountId: res.accountId,
          username: res.username,
          password: res.password,
          warehouseName: res.warehouseName,
        });
      })
      .catch((error: any) => {
        console.trace(error);
      });
  }, []);

  return (
    <>
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Connect to Snowflake
            </h3>
            <p className="mt-1 text-sm text-gray-500">Placeholder paragraph</p>
          </div>

          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Account ID
                <input
                  type="text"
                  value={form.accountId}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      accountId: e.target.value.replaceAll('.', '-'),
                    });
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </label>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Username
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      username: e.target.value,
                    });
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </label>
            </div>

            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      password: e.target.value,
                    });
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </label>
            </div>

            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Warehouse Name
                <input
                  type="text"
                  value={form.warehouseName}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      warehouseName: e.target.value,
                    });
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </label>
            </div>

            <div className="col-span-6">
              <button
                onClick={handleSaveClick}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
