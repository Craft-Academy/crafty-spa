import {
  GetUserTimelineResponse,
  TimelineGateway,
} from "../model/timeline.gateway";

export class FakeTimelineGateway implements TimelineGateway {
  constructor(private readonly delay = 0) {}

  timelinesByUser = new Map<
    string,
    {
      id: string;
      user: string;
      messages: {
        id: string;
        text: string;
        author: string;
        publishedAt: string;
      }[];
    }
  >();
  getUserTimeline({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserTimelineResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const timeline = this.timelinesByUser.get(userId);

        if (!timeline) {
          return reject();
        }

        return resolve({
          timeline,
        });
      }, this.delay)
    );
  }
}

export const timelineGateway = new FakeTimelineGateway();
