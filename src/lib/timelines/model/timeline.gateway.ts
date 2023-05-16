export type GetUserTimelineResponse = {
  timeline: {
    id: string;
    user: string;
    messages: {
      id: string;
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
