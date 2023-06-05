import { createEntityAdapter } from "@reduxjs/toolkit";

export type Notification = {
  id: string;
  title: string;
  text: string;
  occuredAt: string;
  url: string;
  read: boolean;
  imageUrl: string;
};

export const notificationsAdapter = createEntityAdapter<Notification>();
