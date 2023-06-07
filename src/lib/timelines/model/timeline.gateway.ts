import { User } from "@/lib/users/model/user.entity";

export type GetUserTimelineResponse = {
  timeline: {
    id: string;
    user: User;
    messages: {
      id: string;
      text: string;
      author: User;
      publishedAt: string;
      likes: string[];
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
