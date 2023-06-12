import {
  followersByUser,
  followingByUser,
  isAuthUserFollowsUser,
  users,
} from "@/lib/fake-data";
import {
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from "../model/user.gateway";
import { User } from "../model/user.entity";
import { Picture } from "../model/picture";

export class FakeDataUserGateway implements UserGateway {
  getUser(userId: string): Promise<User> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const user = users.get(userId);
        if (!user) {
          return reject(new Error("No user found"));
        }

        const followersCount = (followersByUser.get(userId) ?? []).length;
        const followingCount = (followingByUser.get(userId) ?? []).length;
        return resolve({
          ...user,
          isFollowedByAuthUser: isAuthUserFollowsUser(userId),
          followersCount,
          followingCount,
        });
      }, 500)
    );
  }
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
                isFollowedByAuthUser: isAuthUserFollowsUser(userId),
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
                isFollowedByAuthUser: isAuthUserFollowsUser(userId),
                followersCount,
                followingCount,
              };
            })
            .filter(Boolean),
        });
      }, 500);
    });
  }

  followUser({
    user,
    followingId,
  }: {
    user: string;
    followingId: string;
  }): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const existingFollowers = followersByUser.get(user) ?? [];
        followersByUser.set(user, existingFollowers.concat(followingId));
        resolve();
      }, 500)
    );
  }

  unfollowUser({
    user,
    followingId,
  }: {
    user: string;
    followingId: string;
  }): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const existingFollowers = followersByUser.get(user) ?? [];
        followersByUser.set(
          user,
          existingFollowers.filter((u) => u !== followingId)
        );
        const followings = followingByUser.get(followingId) ?? [];
        followingByUser.set(
          followingId,
          followings.filter((u) => u !== user)
        );
        resolve();
      }, 500)
    );
  }

  createLocalObjectUrlFromFile(picture: Picture): string {
    return URL.createObjectURL(picture);
  }

  uploadProfilePicture({
    userId,
    picture,
  }: {
    userId: string;
    picture: Picture;
  }): Promise<string> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(this.createLocalObjectUrlFromFile(picture));
      }, 2000)
    );
  }
}
