import { MessageGateway } from "../model/message.gateway";

export class FakeMessageGateway implements MessageGateway {
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
    return Promise.resolve();
  }
}
