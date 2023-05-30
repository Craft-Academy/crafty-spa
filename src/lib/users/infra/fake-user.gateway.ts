import { User } from "../model/user.entity";
import {
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from "../model/user.gateway";

export class FakeUserGateway implements UserGateway {
  willRespondForGetUserFollowers = new Map<string, GetUserFollowersResponse>();
  willRespondForGetUserFollowing = new Map<string, GetUserFollowingResponse>();
  users = new Map<string, User>();
  lastFollowedUserBy!: { user: string; followingId: string };
  lastUnfollowedUserBy!: { user: string; followingId: string };
  getUser(userId: string): Promise<User> {
    const user = this.users.get(userId);
    if (user) {
      return Promise.resolve(user);
    }
    return Promise.reject();
  }
  getUserFollowers({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowersResponse> {
    const response = this.willRespondForGetUserFollowers.get(userId);
    if (!response) {
      return Promise.reject();
    }
    return Promise.resolve(response);
  }

  getUserFollowing({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowingResponse> {
    const response = this.willRespondForGetUserFollowing.get(userId);
    if (!response) {
      return Promise.reject();
    }
    return Promise.resolve(response);
  }

  followUser({
    user,
    followingId,
  }: {
    user: string;
    followingId: string;
  }): Promise<void> {
    this.lastFollowedUserBy = { user, followingId };

    return Promise.resolve();
  }

  unfollowUser({
    user,
    followingId,
  }: {
    user: string;
    followingId: string;
  }): Promise<void> {
    this.lastUnfollowedUserBy = { user, followingId };

    return Promise.resolve();
  }

  givenGetUserFollowersResponseFor({
    user,
    followers,
  }: {
    user: string;
    followers: User[];
  }) {
    this.willRespondForGetUserFollowers.set(user, {
      followers,
    });
  }

  givenGetUserFollowingResponseFor({
    user,
    following,
  }: {
    user: string;
    following: User[];
  }) {
    this.willRespondForGetUserFollowing.set(user, {
      following,
    });
  }
}
