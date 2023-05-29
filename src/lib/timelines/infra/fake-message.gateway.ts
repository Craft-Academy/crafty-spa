import { MessageGateway } from "../model/message.gateway";

export class FakeMessageGateway implements MessageGateway {
  postMessageCount = 0;
  lastPostedMessage!: {
    id: string;
    author: string;
    text: string;
    publishedAt: string;
    timelineId: string;
  };
  postMessage(message: {
    id: string;
    author: string;
    text: string;
    publishedAt: string;
    timelineId: string;
  }): Promise<void> {
    this.lastPostedMessage = message;
    return this.postMessageCount++ % 2 === 0
      ? Promise.resolve()
      : Promise.reject(new Error("Cannot send message. Please retry later"));
  }
}
