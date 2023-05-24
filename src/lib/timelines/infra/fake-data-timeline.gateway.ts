import {
  GetUserTimelineResponse,
  TimelineGateway,
} from "../model/timeline.gateway";
import { timelinesByUser, messages as messagesMap } from "@/lib/fake-data";

export class FakeDataTimelineGateway implements TimelineGateway {
  getUserTimeline({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserTimelineResponse> {
    return new Promise((resolve, reject) => {
      const timeline = timelinesByUser.get(userId);
      if (!timeline) {
        return reject("No timeline");
      }
      const messages = timeline.messages
        .map((msgId) => {
          const message = messagesMap.get(msgId);
          if (!message) return null;
          return {
            id: message.id,
            text: message.text,
            author: message.authorId, // acts as username,
            publishedAt: message.publishedAt.toISOString(),
          };
        })
        .filter(Boolean);

      setTimeout(() => {
        resolve({
          timeline: {
            id: timeline.id,
            user: timeline.user,
            messages,
          },
        });
      }, 500);
    });
  }
}
