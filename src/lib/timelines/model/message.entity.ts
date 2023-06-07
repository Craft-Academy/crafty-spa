import { createEntityAdapter } from "@reduxjs/toolkit";

export type Message = {
  id: string;
  text: string;
  author: string;
  publishedAt: string;
  likes: string[];
};

export const messagesAdapter = createEntityAdapter<Message>();
