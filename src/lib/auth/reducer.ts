import { createAction, createReducer } from "@reduxjs/toolkit";
import { RootState } from "../create-store";
import { authenticateWithGoogle } from "./usecases/authenticate-with-google.usecase";
import { authenticateWithGithub } from "./usecases/authenticate-with-github.usecase";
import { AuthUser } from "./model/auth.gateway";
import {
  profilePictureUploading,
  uploadProfilePicture,
} from "../users/usecases/upload-profile-picture.usecase";

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
      })
      .addCase(profilePictureUploading, (state, action) => {
        if (state.authUser) {
          state.authUser.profilePicture = action.payload.preview;
        }
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        if (state.authUser) {
          state.authUser.profilePicture = action.payload.profilePictureUrl;
        }
      });
  }
);

export const selectIsUserAuthenticated = (rootState: RootState) =>
  rootState.auth.authUser !== undefined;

export const selectAuthUser = (rootState: RootState) => rootState.auth.authUser;

export const selectAuthUserId = (rootState: RootState) =>
  selectAuthUser(rootState)?.id ?? "";
