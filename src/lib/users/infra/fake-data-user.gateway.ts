import { followersByUser, followingByUser, users } from "@/lib/fake-data";
import {
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from "../model/user.gateway";

export class FakeDataUserGateway implements UserGateway {
  getUserFollowers({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowersResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const followers = followersByUser.get(userId);
        if (followers === undefined) {
          return resolve({
            followers: [],
          });
        }

        return resolve({
          followers: followers
            .map((userId) => {
              const user = users.get(userId);
              if (!user) return null;

              const followersCount = (followersByUser.get(userId) ?? []).length;
              const followingCount = (followingByUser.get(userId) ?? []).length;
              return {
                id: userId,
                username: user.username,
                profilePicture: user.profilePicture,
                followersCount,
                followingCount,
              };
            })
            .filter(Boolean),
        });
      }, 500);
    });
  }
  getUserFollowing({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowingResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const following = followingByUser.get(userId);
        if (following === undefined) {
          return resolve({
            following: [],
          });
        }

        return resolve({
          following: following
            .map((userId) => {
              const user = users.get(userId);
              if (!user) return null;

              const followersCount = (followersByUser.get(userId) ?? []).length;
              const followingCount = (followingByUser.get(userId) ?? []).length;
              return {
                id: userId,
                username: user.username,
                profilePicture: user.profilePicture,
                followersCount,
                followingCount,
              };
            })
            .filter(Boolean),
        });
      }, 500);
    });
  }
}
