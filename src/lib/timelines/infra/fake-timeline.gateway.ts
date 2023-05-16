import {
  GetUserTimelineResponse,
  TimelineGateway,
} from "../model/timeline.gateway";

export class FakeTimelineGateway implements TimelineGateway {
  timelinesByUser = new Map<
    string,
    {
      user: string;
      messages: {
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
    const timeline = this.timelinesByUser.get(userId);
    if (!timeline) {
      return Promise.reject();
    }

    return Promise.resolve({
      timeline,
    });
  }
}

export const timelineGateway = new FakeTimelineGateway();
