import { format as timeAgo } from "timeago.js";
import { RootState } from "@/lib/create-store";
import { selectMessages } from "@/lib/timelines/slices/messages.slice";
import {
  selectIsUserTimelineLoading,
  selectTimelineForUser,
} from "@/lib/timelines/slices/timelines.slice";

export enum ProfileTimelineViewModelType {
  NoTimeline = "NO_TIMELINE",
  LoadingTimeline = "LOADING_TIMELINE",
  EmptyTimeline = "EMPTY_TIMELINE",
  WithMessages = "TIMELINE_WITH_MESSAGES",
}

export const selectProfileTimelineViewModel =
  ({ userId, getNow }: { userId: string; getNow: () => string }) =>
  (
    rootState: RootState
  ): {
    timeline:
      | {
          type: ProfileTimelineViewModelType.NoTimeline;
        }
      | {
          type: ProfileTimelineViewModelType.LoadingTimeline;
          info: string;
        }
      | {
          type: ProfileTimelineViewModelType.EmptyTimeline;
          info: string;
        }
      | {
          type: ProfileTimelineViewModelType.WithMessages;
          messages: {
            id: string;
            userId: string;
            username: string;
            profilePictureUrl: string;
            publishedAt: string;
            text: string;
          }[];
        };
  } => {
    const now = getNow();
    const timeline = selectTimelineForUser(userId, rootState);
    const isUserTimelineLoading = selectIsUserTimelineLoading(
      userId,
      rootState
    );

    if (isUserTimelineLoading) {
      return {
        timeline: {
          type: ProfileTimelineViewModelType.LoadingTimeline,
          info: "Loading...",
        },
      };
    }

    if (!timeline) {
      return {
        timeline: {
          type: ProfileTimelineViewModelType.NoTimeline,
        },
      };
    }

    if (timeline.messages.length === 0) {
      return {
        timeline: {
          type: ProfileTimelineViewModelType.EmptyTimeline,
          info: "There is no messages yet",
        },
      };
    }

    const messages = selectMessages(timeline.messages, rootState).map(
      (msg) => ({
        id: msg.id,
        userId: msg.author,
        username: msg.author,
        profilePictureUrl: `https://picsum.photos/200?random=${msg.author}`,
        publishedAt: timeAgo(msg.publishedAt, "", { relativeDate: now }),
        text: msg.text,
      })
    );

    return {
      timeline: {
        type: ProfileTimelineViewModelType.WithMessages,
        messages,
      },
    };
  };
