import { createEntityAdapter } from "@reduxjs/toolkit";

export type Like = {
  id: string;
  userId: string;
  messageId: string;
};

export const likesAdapter = createEntityAdapter<Like>();
