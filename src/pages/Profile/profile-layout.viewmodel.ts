import { selectAuthUserId } from "@/lib/auth/reducer";
import { RootState } from "@/lib/create-store";
import { selectUser } from "@/lib/users/slices/users.slice";

export const createProfileLayoutViewModel =
  ({ userId }: { userId: string }) =>
  (state: RootState) => {
    const user = selectUser(userId, state);
    const authUserId = selectAuthUserId(state);

    return {
      username: user?.username ?? "Unknown",
      profilePicture: user?.profilePicture ?? "",
      isAuthUserProfile: authUserId === userId,
      timelineLink: `/u/${userId}`,
      followingLink: `/u/${userId}/following`,
      followersLink: `/u/${userId}/followers`,
      tabs: {
        following: `Following (${user?.followingCount ?? 0})`,
        followers: `Followers (${user?.followersCount ?? 0})`,
      },
    };
  };
