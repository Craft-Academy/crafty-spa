import { RootState } from "@/lib/create-store";
import {
  selectAreFollowingOfLoading,
  selectFollowingOf,
} from "@/lib/users/slices/relationships.slice";

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
      followers: {
        id: string;
        username: string;
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
      followers: following.map((followingId) => ({
        id: followingId,
        username: followingId,
        profilePicture: `https://picsum.photos/200?random=${followingId}`,
        link: `/u/${followingId}`,
      })),
    };
  };
