import { User } from "../model/user.entity";

export const buildUser = ({
  id,
  username = "username",
  profilePicture = "username.png",
  followersCount = 42,
  followingCount = 17,
  isFollowedByAuthUser = false,
}: {
  id: string;
  username?: string;
  profilePicture?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowedByAuthUser?: boolean;
}): User => ({
  id,
  username,
  profilePicture,
  followersCount,
  followingCount,
  isFollowedByAuthUser,
});
