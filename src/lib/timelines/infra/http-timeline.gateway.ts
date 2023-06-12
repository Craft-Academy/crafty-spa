import { z } from "zod";
import {
  GetUserTimelineResponse,
  TimelineGateway,
} from "../model/timeline.gateway";
import axios from "axios";

const userDtoSchema = z.object({
  id: z.string(),
  username: z.string(),
  profilePicture: z.string().url(),
  followersCount: z.number(),
  followingCount: z.number(),
  isFollowedByAuthUser: z.boolean(),
});

const getUserTimelineDtoSchema = z.object({
  timeline: z.object({
    id: z.string(),
    user: userDtoSchema,
    messages: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
        author: userDtoSchema,
        publishedAt: z.string().datetime(),
        likes: z.array(
          z.object({
            id: z.string(),
            userId: z.string(),
            messageId: z.string(),
          })
        ),
      })
    ),
  }),
});

export class HttpTimelineGateway implements TimelineGateway {
  async getUserTimeline({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserTimelineResponse> {
    const unvalidatedResponse = await axios.get(
      `http://localhost:3000/timelines?userId=${userId}`
    );

    const result = getUserTimelineDtoSchema.safeParse(unvalidatedResponse.data);

    if (result.success) {
      return result.data;
    }

    console.dir(result.error);
    throw result.error;
  }
}
