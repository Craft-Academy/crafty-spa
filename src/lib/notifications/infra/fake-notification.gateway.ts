import { Notification } from "../model/notification.entity";
import { NotificationGateway } from "../model/notification.gateway";

export class FakeNotificationGateway implements NotificationGateway {
  notifications = new Map<string, Notification[]>();
  listenerByUser = new Map<string, (notification: Notification) => void>();
  lastMarkedNotificationsAsReadForUser!: string;

  getNotifications({
    authUserId,
  }: {
    authUserId: string;
  }): Promise<Notification[]> {
    const notifications = this.notifications.get(authUserId) ?? [];
    return Promise.resolve(notifications);
  }

  onNewNotificationReceived(
    authUserId: string,
    listener: (notification: Notification) => void
  ): void {
    this.listenerByUser.set(authUserId, listener);
  }

  markAllNotificationsAsRead(authUserId: string): Promise<void> {
    this.lastMarkedNotificationsAsReadForUser = authUserId;
    const notifications = this.notifications.get(authUserId) ?? [];

    notifications.forEach((n) => (n.read = true));

    return Promise.resolve();
  }

  simulateNewNotificationReceived(
    authUserId: string,
    notification: Notification
  ) {
    this.listenerByUser.get(authUserId)?.(notification);
  }
}
