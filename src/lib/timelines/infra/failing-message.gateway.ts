import { MessageGateway } from "../model/message.gateway";

export class FailingMessageGateway implements MessageGateway {
  constructor(private readonly willFailWithError: string) {}

  postMessage(): Promise<void> {
    return Promise.reject(this.willFailWithError);
  }
}
