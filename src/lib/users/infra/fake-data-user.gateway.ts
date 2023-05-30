import { followersByUser, followingByUser } from "@/lib/fake-data";
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
          followers: followers.map((userId) => ({
            id: userId,
          })),
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
          following: following.map((userId) => ({
            id: userId,
          })),
        });
      }, 500);
    });
  }
}
