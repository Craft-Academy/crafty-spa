import { selectAuthUser } from "@/lib/auth/reducer";
import { createAppAsyncThunk } from "@/lib/create-app-thunk";
import { createAction } from "@reduxjs/toolkit";

export const unfollowUserPending = createAction<{
  userId: string;
  followingId: string;
}>("users/unfollowUserPending");

export const unfollowUser = createAppAsyncThunk(
  "users/unfollowUser",
  (
    params: { followingId: string },
    { extra: { userGateway }, dispatch, getState }
  ) => {
    const authUserId = selectAuthUser(getState());
    dispatch(
      unfollowUserPending({
        userId: authUserId,
        followingId: params.followingId,
      })
    );
    return userGateway.unfollowUser({
      user: authUserId,
      followingId: params.followingId,
    });
  }
);
