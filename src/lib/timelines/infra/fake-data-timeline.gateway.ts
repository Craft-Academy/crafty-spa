import {
  GetUserTimelineResponse,
  TimelineGateway,
} from "../model/timeline.gateway";
import {
  timelinesByUser,
  messages as messagesMap,
  users,
  followersByUser,
  followingByUser,
  isAuthUserFollowsUser,
} from "@/lib/fake-data";

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
      const user = users.get(timeline.user);
      if (!user) return reject("No user for timeline");
      const messages = timeline.messages
        .map((msgId) => {
          const message = messagesMap.get(msgId);
          if (!message) return null;
          const author = users.get(message?.authorId);
          if (!author) return null;
          return {
            id: message.id,
            text: message.text,
            author: {
              id: author.id,
              username: author.username,
              isFollowedByAuthUser: isAuthUserFollowsUser(user.id),
              profilePicture: author.profilePicture,
              followersCount: (followersByUser.get(author.id) ?? []).length,
              followingCount: (followingByUser.get(author.id) ?? []).length,
            },
            publishedAt: message.publishedAt.toISOString(),
          };
        })
        .filter(Boolean);

      setTimeout(() => {
        resolve({
          timeline: {
            id: timeline.id,
            user: {
              id: user.id,
              username: user.username,
              profilePicture: user.profilePicture,
              isFollowedByAuthUser: isAuthUserFollowsUser(user.id),
              followersCount: (followersByUser.get(user.id) ?? []).length,
              followingCount: (followingByUser.get(user.id) ?? []).length,
            },
            messages,
          },
        });
      }, 500);
    });
  }
}
