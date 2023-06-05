import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "../create-store";
import { authenticateWithGoogle } from "./usecases/authenticate-with-google.usecase";
import { authenticateWithGithub } from "./usecases/authenticate-with-github.usecase";
import { AuthUser } from "./model/auth.gateway";

export type AuthState = {
  authUser?: AuthUser;
};

export const userAuthenticated = createAction<{ authUser: AuthUser }>(
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

export const selectAuthUserId = (rootState: RootState) =>
  rootState.auth.authUser?.id ?? "";
