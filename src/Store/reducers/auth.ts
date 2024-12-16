// slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  // refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'), // Load from localStorage
  // refreshToken: localStorage.getItem('refreshToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ accessToken: string; 
      // refreshToken: string
     }>) => {
      state.accessToken = action.payload.accessToken;
      // state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
      // localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    clearTokens: (state) => {
      state.accessToken = null;
      // state.refreshToken = null;
      localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
    },
  },
});

export const { setTokens, clearTokens } = authSlice.actions;

export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
// export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;

export const authReducer= authSlice.reducer;
