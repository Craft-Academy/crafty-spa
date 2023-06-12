import { MessageGateway } from "../model/message.gateway";

export class FailingMessageGateway implements MessageGateway {
  constructor(private readonly willFailWithError?: string) {}

  postMessage(): Promise<void> {
    return Promise.reject(this.willFailWithError);
  }

  likeMessage(like: {
    id: string;
    userId: string;
    messageId: string;
  }): Promise<void> {
    return Promise.reject();
  }
}
