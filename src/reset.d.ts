import "@total-typescript/ts-reset";

declare global {
  interface Window {
    __NOTIF__: FakeStorageNotificationGateway;
  }
}
