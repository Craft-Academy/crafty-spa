import { createEntityAdapter } from "@reduxjs/toolkit";

export type User = {
  id: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  followingCount: number;
  isFollowedByAuthUser: boolean;
};

export const usersAdapter = createEntityAdapter<User>();
