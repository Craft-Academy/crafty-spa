import { MessageGateway } from "../model/message.gateway";

export class FailingMessageGateway implements MessageGateway {
  constructor(private readonly willFailWithError: string) {}

  postMessage(message: {
    id: string;
    author: string;
    text: string;
    publishedAt: string;
    timelineId: string;
  }): Promise<void> {
    return Promise.reject(this.willFailWithError);
  }
}
