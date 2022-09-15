/* eslint-disable @typescript-eslint/dot-notation */
import { ReactElement, useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Box, Button, TextField, Divider } from '@mui/material';
import IntegrationApiRepo from '../../../infrastructure/integration-api/integration-api-repo';

interface SnowflakeProps {
  jwt: string;
}

export default ({ jwt }: SnowflakeProps): ReactElement => {
  const [accountId, setAccountId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [warehouseName, setWarehouseName] = useState('');

  const [buttonText, setButtonText] = useState('Save');

  const handleAccountIdChange = (event: any): void => {
    setButtonText('Save');
    setAccountId(event.target.value);
  };

  const handleUsernameChange = (event: any): void => {
    setButtonText('Save');
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: any): void => {
    setButtonText('Save');
    setPassword(event.target.value);
  };

  const handleWarehouseNameChange = (event: any): void => {
    setButtonText('Save');
    setWarehouseName(event.target.value);
  };

  const handleSaveClick = async (): Promise<void> => {
    const snowflakeProfile = await IntegrationApiRepo.getSnowflakeProfile(jwt);

    if (!snowflakeProfile)
      await IntegrationApiRepo.postSnowflakeProfile(
        { accountId, password, username, warehouseName },
        jwt
      );
    else
      await IntegrationApiRepo.updateSnowflakeProfile(
        { accountId, password, username, warehouseName },
        jwt
      );

    setButtonText('Saved');

    await IntegrationApiRepo.postSnowflakeEnvironment(jwt);
  };

  useEffect(() => {
    IntegrationApiRepo.getSnowflakeProfile(jwt)
      .then((res) => {
        if (!res) return;

        setAccountId(res.accountId);
        setUsername(res.username);
        setPassword(res.password);
        setWarehouseName(res.warehouseName);
      })
      .catch((error: any) => {
        console.trace(error);
      });
  }, []);

  return (
    <>
      <h4>Connect to Snowflake</h4>

      <Divider />

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="snowflake-account-id"
          label="Snowflake Account Id"
          value={accountId}
          onChange={handleAccountIdChange}
          color="primary"
          variant="filled"
        />
        <TextField
          id="snowflake-username"
          label="Snowflake Username"
          value={username}
          onChange={handleUsernameChange}
          color="primary"
          variant="filled"
        />
        <TextField
          id="snowflake-password"
          label="Snowflake Password"
          value={password}
          onChange={handlePasswordChange}
          color="primary"
          type="password"
          variant="filled"
        />
        <TextField
          id="snowflake-warehouse-name"
          label="Snowflake Warehouse Name"
          value={warehouseName}
          onChange={handleWarehouseNameChange}
          color="primary"
          variant="filled"
        />
      </Box>
      <Button sx= {{fontWeight: 'bold'}} onClick={handleSaveClick}>{buttonText}</Button>
    </>
  );
};
