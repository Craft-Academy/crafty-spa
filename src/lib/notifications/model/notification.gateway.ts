import { Notification } from "./notification.entity";

export interface NotificationGateway {
  getNotifications({
    authUserId,
  }: {
    authUserId: string;
  }): Promise<Notification[]>;
}
