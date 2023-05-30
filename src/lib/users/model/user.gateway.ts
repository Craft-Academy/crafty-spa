import { User } from "./user.entity";

export type GetUserFollowersResponse = {
  followers: User[];
};

export type GetUserFollowingResponse = {
  following: User[];
};

export interface UserGateway {
  getUser(userId: string): Promise<User>;
  getUserFollowers({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowersResponse>;
  getUserFollowing({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowingResponse>;
}
