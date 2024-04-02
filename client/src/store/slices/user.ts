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
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
