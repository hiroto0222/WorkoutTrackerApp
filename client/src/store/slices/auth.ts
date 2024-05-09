import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

export interface AuthState {
  isAuthenticating?: boolean;
  userId?: string;
  userCreds?: User;
}

const initialState: AuthState = {
  isAuthenticating: false,
  userCreds: undefined,
  userId: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticating = false;
      state.userCreds = action.payload.userCreds;
      state.userId = action.payload.userId;
    },
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
  },
});

export const { setAuth, setIsAuthenticating } = authSlice.actions;

export default authSlice.reducer;
