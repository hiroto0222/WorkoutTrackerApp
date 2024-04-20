import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "api/types";

export interface UserState {
  user?: IUser;
}

const initialState: UserState = {
  user: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    setUserInfo: (
      state,
      action: PayloadAction<{ name: string; weight: number; height: number }>
    ) => {
      if (state.user === undefined) return;
      state.user.name = action.payload.name;
      state.user.weight = action.payload.weight;
      state.user.height = action.payload.height;
    },
  },
});

export const { setUser, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
