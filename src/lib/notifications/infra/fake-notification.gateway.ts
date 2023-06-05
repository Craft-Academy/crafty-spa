import { Notification } from "../model/notification.entity";
import { NotificationGateway } from "../model/notification.gateway";

export class FakeNotificationGateway implements NotificationGateway {
  notifications = new Map<string, Notification[]>();

  getNotifications({
    authUserId,
  }: {
    authUserId: string;
  }): Promise<Notification[]> {
    const notifications = this.notifications.get(authUserId) ?? [];
    return Promise.resolve(notifications);
  }
}
