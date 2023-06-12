export interface MessageGateway {
  postMessage(message: {
    id: string;
    author: string;
    text: string;
    publishedAt: string;
    timelineId: string;
  }): Promise<void>;
  likeMessage(like: {
    id: string;
    userId: string;
    messageId: string;
  }): Promise<void>;
}
