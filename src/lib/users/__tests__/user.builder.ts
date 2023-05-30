import { User } from "../model/user.entity";

export const buildUser = ({
  id,
  username = "username",
  profilePicture = "username.png",
  followersCount = 42,
  followingCount = 17,
}: {
  id: string;
  username?: string;
  profilePicture?: string;
  followersCount?: number;
  followingCount?: number;
}): User => ({
  id,
  username,
  profilePicture,
  followersCount,
  followingCount,
});
