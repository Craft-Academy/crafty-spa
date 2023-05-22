import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "../create-store";
import { authenticateWithGoogle } from "./usecases/authenticate-with-google.usecase";
import { authenticateWithGithub } from "./usecases/authenticate-with-github.usecase";

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
    builder
      .addCase(userAuthenticated, (state, action) => {
        state.authUser = action.payload.authUser;
      })
      .addCase(authenticateWithGoogle.fulfilled, (state, action) => {
        state.authUser = action.payload;
      })
      .addCase(authenticateWithGithub.fulfilled, (state, action) => {
        state.authUser = action.payload;
      });
  }
);

export const selectIsUserAuthenticated = (rootState: RootState) =>
  rootState.auth.authUser !== undefined;

export const selectAuthUser = (rootState: RootState) =>
  rootState.auth.authUser ?? "";
