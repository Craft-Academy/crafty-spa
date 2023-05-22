import { createAction, createReducer } from "@reduxjs/toolkit";

export type AuthState = {
  authUser?: string;
};

export const userAuthenticated = createAction<{ authUser: string }>(
  "auth/userAuthenticated"
);

export const reducer = createReducer<AuthState>(
  {
    authUser: undefined,
  },
  (builder) => {
    builder.addCase(userAuthenticated, (state, action) => {
      state.authUser = action.payload.authUser;
    });
  }
);
