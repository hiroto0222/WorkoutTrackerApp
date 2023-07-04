import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken?: string;
  userId?: string;
}

const initialState: AuthState = {
  accessToken: undefined,
  userId: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
    },
  },
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
