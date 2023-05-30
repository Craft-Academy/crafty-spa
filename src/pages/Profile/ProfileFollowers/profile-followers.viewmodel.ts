import { RootState } from "@/lib/create-store";
import {
  selectAreFollowersOfLoading,
  selectFollowersOf,
} from "@/lib/users/slices/relationships.slice";
import { selectUser } from "@/lib/users/slices/users.slice";

export enum ProfileFollowersViewModelType {
  ProfileFollowersLoading = "PROFILE_FOLLOWERS_LOADING",
  ProfileFollowersLoaded = "PROFILE_FOLLOWERS_LOADED",
}

export type ProfileFollowersViewModel =
  | {
      type: ProfileFollowersViewModelType.ProfileFollowersLoading;
    }
  | {
      type: ProfileFollowersViewModelType.ProfileFollowersLoaded;
      followers: {
        id: string;
        username: string;
        followersCount: number;
        isFollowedByAuthUser: boolean;
        profilePicture: string;
        link: string;
      }[];
    };

export const createProfileFollowersViewModel =
  ({ of }: { of: string }) =>
  (rootState: RootState): ProfileFollowersViewModel => {
    const areFollowersLoading = selectAreFollowersOfLoading(of, rootState);

    if (areFollowersLoading) {
      return {
        type: ProfileFollowersViewModelType.ProfileFollowersLoading,
      };
    }

    const followers = selectFollowersOf(of, rootState);

    return {
      type: ProfileFollowersViewModelType.ProfileFollowersLoaded,
      followers: followers
        .map((followerId) => {
          const user = selectUser(followerId, rootState);
          if (!user) {
            return null;
          }
          return {
            id: followerId,
            username: user.username,
            followersCount: user.followersCount,
            isFollowedByAuthUser: user.isFollowedByAuthUser,
            profilePicture: user.profilePicture,
            link: `/u/${followerId}`,
          };
        })
        .filter(Boolean),
    };
  };
