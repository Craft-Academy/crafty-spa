import { format as timeAgo } from "timeago.js";
import { AppDispatch, RootState } from "@/lib/create-store";
import {
  selectErrorMessage,
  selectMessagesOrderedByPublicationDateDesc,
} from "@/lib/timelines/slices/messages.slice";
import {
  selectIsUserTimelineLoading,
  selectTimelineForUser,
} from "@/lib/timelines/slices/timelines.slice";
import { postMessage } from "@/lib/timelines/usecases/post-message.usecase";
import { selectUser } from "@/lib/users/slices/users.slice";

export enum ProfileTimelineViewModelType {
  NoTimeline = "NO_TIMELINE",
  LoadingTimeline = "LOADING_TIMELINE",
  EmptyTimeline = "EMPTY_TIMELINE",
  WithMessages = "TIMELINE_WITH_MESSAGES",
}

export const createProfileTimelineViewModel =
  ({
    userId,
    getNow,
    dispatch,
  }: {
    userId: string;
    getNow: () => string;
    dispatch: AppDispatch;
  }) =>
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
          id: string;
          messages: {
            id: string;
            userId: string;
            username: string;
            profilePictureUrl: string;
            publishedAt: string;
            text: string;
            failedToBePosted: boolean;
            backgroundColor: string;
            errorMessage?: string;
            retryToPostMessage: () => void;
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

    const messages = selectMessagesOrderedByPublicationDateDesc(
      timeline.messages,
      rootState
    )
      .map((msg) => {
        const maybeErrorMessage = selectErrorMessage(msg.id, rootState);
        const failedToBePosted = maybeErrorMessage !== undefined;
        const retryToPostMessage = () =>
          dispatch(
            postMessage({
              messageId: msg.id,
              text: msg.text,
              timelineId: timeline.id,
            })
          );
        const author = selectUser(msg.author, rootState);
        if (!author) return null;
        return {
          id: msg.id,
          userId: msg.author,
          username: author.username,
          profilePictureUrl: author.profilePicture,
          publishedAt: timeAgo(msg.publishedAt, "", { relativeDate: now }),
          text: msg.text,
          failedToBePosted,
          backgroundColor: failedToBePosted ? "red.50" : "white",
          errorMessage: maybeErrorMessage,
          retryToPostMessage,
        };
      })
      .filter(Boolean);

    return {
      timeline: {
        id: timeline.id,
        type: ProfileTimelineViewModelType.WithMessages,
        messages,
      },
    };
  };
