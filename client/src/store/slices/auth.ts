import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticating?: boolean;
  accessToken?: string;
  userId?: string;
}

const initialState: AuthState = {
  isAuthenticating: false,
  accessToken: undefined,
  userId: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticating = false;
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
    },
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
  },
});

export const { setAuth, setIsAuthenticating } = authSlice.actions;

export default authSlice.reducer;
