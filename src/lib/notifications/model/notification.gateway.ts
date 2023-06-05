import { Notification } from "./notification.entity";

export interface NotificationGateway {
  getNotifications({
    authUserId,
  }: {
    authUserId: string;
  }): Promise<Notification[]>;
  onNewNotificationReceived(
    authUserId: string,
    listener: (notification: Notification) => void
  ): void;
}
