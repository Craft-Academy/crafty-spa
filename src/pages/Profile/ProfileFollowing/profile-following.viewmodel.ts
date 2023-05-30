import { RootState } from "@/lib/create-store";
import {
  selectAreFollowingOfLoading,
  selectFollowingOf,
} from "@/lib/users/slices/relationships.slice";
import { selectUser } from "@/lib/users/slices/users.slice";

export enum ProfileFollowingViewModelType {
  ProfileFollowingLoading = "PROFILE_FOLLOWING_LOADING",
  ProfileFollowingLoaded = "PROFILE_FOLLOWING_LOADED",
}

export type ProfileFollowingViewModel =
  | {
      type: ProfileFollowingViewModelType.ProfileFollowingLoading;
    }
  | {
      type: ProfileFollowingViewModelType.ProfileFollowingLoaded;
      following: {
        id: string;
        username: string;
        followersCount: number;
        isFollowedByAuthUser: boolean;
        profilePicture: string;
        link: string;
      }[];
    };

export const createProfileFollowingViewModel =
  ({ of }: { of: string }) =>
  (rootState: RootState): ProfileFollowingViewModel => {
    const areFollowingLoading = selectAreFollowingOfLoading(of, rootState);

    if (areFollowingLoading) {
      return {
        type: ProfileFollowingViewModelType.ProfileFollowingLoading,
      };
    }

    const following = selectFollowingOf(of, rootState);

    return {
      type: ProfileFollowingViewModelType.ProfileFollowingLoaded,
      following: following
        .map((followingId) => {
          const user = selectUser(followingId, rootState);
          if (!user) {
            return null;
          }
          return {
            id: followingId,
            username: user.username,
            followersCount: user.followersCount,
            isFollowedByAuthUser: user.isFollowedByAuthUser,
            profilePicture: user.profilePicture,
            link: `/u/${followingId}`,
          };
        })
        .filter(Boolean),
    };
  };
