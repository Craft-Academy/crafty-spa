import { Notification } from "../model/notification.entity";
import { NotificationGateway } from "../model/notification.gateway";

export class FakeStorageNotificationGateway implements NotificationGateway {
  getNotifications({
    authUserId,
  }: {
    authUserId: string;
  }): Promise<Notification[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const notificationsJson =
          localStorage.getItem(`notifications:${authUserId}`) ??
          JSON.stringify([]);

        try {
          const notifications = JSON.parse(notificationsJson) as Notification[];

          resolve(notifications);
        } catch (err) {
          reject(err);
        }
      }, 500);
    });
  }
  onNewNotificationReceived(
    authUserId: string,
    listener: (notification: Notification) => void
  ): void {
    const storageListener = (event: StorageEvent) => {
      if (event.key === `notifications:${}`)
    }
  }
}
