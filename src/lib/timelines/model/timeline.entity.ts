import { createEntityAdapter } from "@reduxjs/toolkit";

export type Timeline = {
  id: string;
  user: string;
  messages: string[];
};

export const timelinesAdapter = createEntityAdapter<Timeline>();
