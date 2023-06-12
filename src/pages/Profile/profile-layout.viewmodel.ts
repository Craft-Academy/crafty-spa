import { selectAuthUserId } from "@/lib/auth/reducer";
import { AppDispatch, RootState } from "@/lib/create-store";
import { Picture } from "@/lib/users/model/picture";
import {
  selectIsProfilePictureUploading,
  selectUser,
} from "@/lib/users/slices/users.slice";
import { uploadProfilePicture } from "@/lib/users/usecases/upload-profile-picture.usecase";

export const createProfileLayoutViewModel =
  ({ userId, dispatch }: { userId: string; dispatch: AppDispatch }) =>
  (state: RootState) => {
    const user = selectUser(userId, state);
    const authUserId = selectAuthUserId(state);
    const isAuthUserProfile = authUserId === userId;
    const isProfilePictureUploading = selectIsProfilePictureUploading(state);

    return {
      username: user?.username ?? "Unknown",
      profilePicture: user?.profilePicture ?? "",
      isAuthUserProfile,
      timelineLink: `/u/${userId}`,
      followingLink: `/u/${userId}/following`,
      followersLink: `/u/${userId}/followers`,
      tabs: {
        following: `Following (${user?.followingCount ?? 0})`,
        followers: `Followers (${user?.followersCount ?? 0})`,
      },
      profilePictureUploading: isAuthUserProfile && isProfilePictureUploading,
      onClick(picture: Picture) {
        return dispatch(uploadProfilePicture({ picture }));
      },
    };
  };
