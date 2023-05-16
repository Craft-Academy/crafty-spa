export type GetUserTimelineResponse = {
  timeline: {
    user: string;
    messages: {
      text: string;
      author: string;
      publishedAt: string;
    }[];
  };
};

export interface TimelineGateway {
  getUserTimeline({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserTimelineResponse>;
}
