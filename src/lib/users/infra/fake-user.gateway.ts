import {
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from "../model/user.gateway";

export class FakeUserGateway implements UserGateway {
  willRespondForGetUserFollowers = new Map<string, GetUserFollowersResponse>();
  willRespondForGetUserFollowing = new Map<string, GetUserFollowingResponse>();
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

  givenGetUserFollowersResponseFor({
    user,
    followers,
  }: {
    user: string;
    followers: string[];
  }) {
    this.willRespondForGetUserFollowers.set(user, {
      followers: followers.map((id) => ({ id })),
    });
  }

  givenGetUserFollowingResponseFor({
    user,
    following,
  }: {
    user: string;
    following: string[];
  }) {
    this.willRespondForGetUserFollowing.set(user, {
      following: following.map((id) => ({ id })),
    });
  }
}
