import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SignerConnectError, SignerConnectResponse, SignerConnectResult } from '../../hive-multisig-sdk/interfaces/multisig-backend/socket-message.interface';
import { KeychainKeyTypes } from 'hive-keychain-commons';
import { HiveMultisigSDK } from '../../hive-multisig-sdk';

const initialState: SignerConnectResponse = {
    errors: {},
    result: {}
    
};

interface ISingleSignerParam {
    username: string
    keyType: KeychainKeyTypes
}

export const singleSignerConnect = createAsyncThunk<SignerConnectResult,ISingleSignerParam,{rejectValue:SignerConnectError}>(
    'singleSigner/connect',
    async (param:ISingleSignerParam, thunkApi) => {
        const multisigSdk = new HiveMultisigSDK(window);
        const response = await multisigSdk.singleSignerConnect(param.username, param.keyType);
        if(response.errors) {
            return thunkApi.rejectWithValue(response.errors );
        }
        return response.result as SignerConnectResult;
      },
)

export const singleSigner = createSlice({
    name: 'singleSinger',
    initialState:initialState,
    reducers: {
    },
    extraReducers: (builder) =>{ 
        builder.addCase(singleSignerConnect.fulfilled, (state:SignerConnectResponse,action) => {
            state.result = action.payload;
        }),
        builder.addCase(singleSignerConnect.rejected, (state:SignerConnectResponse,action) => {
            state.errors = action.payload;
        })
    }
});