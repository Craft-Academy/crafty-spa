import { describe, test, expect } from "vitest";
import nock from "nock";
import { GetUserTimelineResponse } from "../../model/timeline.gateway";
import { HttpTimelineGateway } from "../http-timeline.gateway";

describe("HttpTimelineGateway", () => {
  test("getUserTimeline", async () => {
    const fakeResponse: GetUserTimelineResponse = {
      timeline: {
        id: "alice-timeline-id",
        user: {
          id: "alice-id",
          followersCount: 12,
          followingCount: 20,
          isFollowedByAuthUser: true,
          profilePicture: "http://picture.com/alice.png",
          username: "Alice",
        },
        messages: [
          {
            id: "m1",
            author: {
              id: "alice-id",
              followersCount: 12,
              followingCount: 20,
              isFollowedByAuthUser: true,
              profilePicture: "http://picture.com/alice.png",
              username: "Alice",
            },
            likes: [
              {
                id: "alice-like-id",
                messageId: "m1",
                userId: "alice-id",
              },
            ],
            text: "alice message",
            publishedAt: "2023-06-12T20:44:00.000Z",
          },
        ],
      },
    };
    nock("http://localhost:3000")
      .get("/timelines?userId=alice-id")
      .reply(200, fakeResponse);
    const timelineGateway = new HttpTimelineGateway();

    const response = await timelineGateway.getUserTimeline({
      userId: "alice-id",
    });

    expect(response).toEqual(fakeResponse);
  });
});
