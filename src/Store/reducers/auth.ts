// slices/authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
export interface AuthState {
  initialized:boolean;
	accessToken: string | null;
	// refreshToken: string | null;
}

const initialState: AuthState = {
  initialized:false,
	accessToken: null, 
};

export const setTokens = createAsyncThunk(
	"auth/setTokens",
	async (value: {
    accessToken: string;
    // refreshToken: string
  }) => {
		await AsyncStorage.setItem("accessToken", value.accessToken);
    return value
	}
);

export const clearTokens = createAsyncThunk("auth/clearTokens", async () => {
	await AsyncStorage.removeItem("accessToken");
});

export const fetchTokens = createAsyncThunk("auth/fetchTokens", async () => {
	return {
    accessToken: await AsyncStorage.getItem("accessToken")
  }
});


const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
	},
  extraReducers:(builder)=>{
    builder.addCase(setTokens.fulfilled, (state, action) => {
      state.accessToken=action.payload.accessToken
    })
    builder.addCase(clearTokens.fulfilled, (state, action) => {
      state.accessToken=null
    })
    builder.addCase(fetchTokens.fulfilled, (state, action) => {
      state.accessToken=action.payload.accessToken
      state.initialized=true
    })
  }
});

export const selectAccessToken = (state: { auth: AuthState }) =>
	state.auth.accessToken;
// export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;

export const authReducer = authSlice.reducer;
