import { RootState } from "@/lib/create-store";
import {
  selectAreFollowersOfLoading,
  selectFollowersOf,
} from "@/lib/users/slices/relationships.slice";

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
      followers: followers.map((followerId) => ({
        id: followerId,
        username: followerId,
        profilePicture: `https://picsum.photos/200?random=${followerId}`,
        link: `/u/${followerId}`,
      })),
    };
  };
