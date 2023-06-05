import { nanoid } from "@reduxjs/toolkit";
import { Notification } from "../model/notification.entity";
import { NotificationGateway } from "../model/notification.gateway";
import { randParagraph, randPost } from "@ngneat/falso";

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
    onNewNotification: (notification: Notification) => void
  ): void {
    const storageListener = (event: StorageEvent) => {
      if (event.key === `notifications:${authUserId}`) {
        const actualNotifications = JSON.parse(
          event.oldValue ?? JSON.stringify([])
        ) as Notification[];
        const receivedNotifications = JSON.parse(
          event.newValue ?? JSON.stringify([])
        ) as Notification[];
        receivedNotifications.forEach((notification) => {
          if (
            actualNotifications.findIndex((n) => n.id === notification.id) ===
            -1
          ) {
            onNewNotification(notification);
          }
        });
      }
    };
    window.addEventListener("storage", storageListener);
  }

  sendFakeNotificationTo(userId: string) {
    const notification: Notification = {
      id: nanoid(5),
      imageUrl: `https://picsum.photos/200?random=${nanoid(5)}`,
      occuredAt: new Date().toISOString(),
      read: false,
      text: randParagraph(),
      title: randPost().title,
      url: "",
    };
    const notificationsJson =
      localStorage.getItem(`notifications:${userId}`) ?? JSON.stringify([]);

    const notifications = JSON.parse(notificationsJson) as Notification[];

    localStorage.setItem(
      `notifications:${userId}`,
      JSON.stringify([notification, ...notifications])
    );
  }
}
