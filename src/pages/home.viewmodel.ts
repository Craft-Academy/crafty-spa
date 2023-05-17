import { RootState } from "@/lib/create-store";
import { selectMessages } from "@/lib/timelines/slices/messages.slice";
import { selectTimeline } from "@/lib/timelines/slices/timelines.slice";

export const selectHomeViewModel = (rootState: RootState) => {
  const timeline = selectTimeline("alice-timeline-id", rootState);

  if (!timeline) {
    return {
      timeline: {
        type: "NO_TIMELINE",
      },
    };
  }

  if (timeline.messages.length === 0) {
    return {
      timeline: {
        type: "EMPTY_TIMELINE",
        info: "There is no messages yet",
      },
    };
  }

  const messages = selectMessages(timeline.messages, rootState).map((msg) => ({
    id: msg.id,
    userId: msg.author,
    username: msg.author,
    profilePicture: `https://picsum.photos/200?random=${msg.author}`,
    publishedAt: msg.publishedAt,
    text: msg.text,
  }));

  return {
    timeline: {
      type: "TIMELINE_WITH_MESSAGES",
      messages,
    },
  };
};
