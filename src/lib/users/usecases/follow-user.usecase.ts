import { selectAuthUserId } from "@/lib/auth/reducer";
import { createAppAsyncThunk } from "@/lib/create-app-thunk";
import { createAction } from "@reduxjs/toolkit";

export const followUserPending = createAction<{
  userId: string;
  followingId: string;
}>("users/followUserPending");

export const followUser = createAppAsyncThunk(
  "users/followUser",
  (
    params: { followingId: string },
    { extra: { userGateway }, dispatch, getState }
  ) => {
    const authUserId = selectAuthUserId(getState());
    dispatch(
      followUserPending({ userId: authUserId, followingId: params.followingId })
    );
    return userGateway.followUser({
      user: authUserId,
      followingId: params.followingId,
    });
  }
);
