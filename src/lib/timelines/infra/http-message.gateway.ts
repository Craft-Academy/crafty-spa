import { MessageGateway } from "../model/message.gateway";
import axios from "axios";

export class HttpMessageGateway implements MessageGateway {
  async postMessage(message: {
    id: string;
    author: string;
    text: string;
    publishedAt: string;
    timelineId: string;
  }): Promise<void> {
    await axios.post("http://localhost:3000/messages", message, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  likeMessage(like: {
    id: string;
    userId: string;
    messageId: string;
  }): Promise<void> {
    throw new Error("Method not implemented.");
  }

  unlikeMessage(likeId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
