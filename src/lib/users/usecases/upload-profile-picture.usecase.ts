import { createAppAsyncThunk } from "@/lib/create-app-thunk";
import { Picture } from "../model/picture";
import { createAction } from "@reduxjs/toolkit";
import { selectAuthUserId } from "@/lib/auth/reducer";

export type UploadProfilePictureParams = {
  picture: Picture;
};

export const profilePictureUploading = createAction<{
  authUserId: string;
  preview: string;
}>("users/profilePictureUploading");

export const uploadProfilePicture = createAppAsyncThunk(
  "users/uploadProfilePicture",
  async (
    params: UploadProfilePictureParams,
    { extra: { userGateway }, getState, dispatch }
  ) => {
    const authUserId = selectAuthUserId(getState());
    dispatch(
      profilePictureUploading({
        authUserId,
        preview: userGateway.createLocalObjectUrlFromFile(params.picture),
      })
    );
    const profilePictureUrl = await userGateway.uploadProfilePicture({
      userId: authUserId,
      picture: params.picture,
    });

    return {
      userId: authUserId,
      profilePictureUrl,
    };
  }
);
