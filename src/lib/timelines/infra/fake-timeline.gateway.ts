import {
  GetUserTimelineResponse,
  TimelineGateway,
} from "../model/timeline.gateway";

export class FakeTimelineGateway implements TimelineGateway {
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
