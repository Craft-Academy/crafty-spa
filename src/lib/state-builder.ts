import {
  ActionCreatorWithPayload,
  createAction,
  createReducer,
} from "@reduxjs/toolkit";
import { RootState } from "./create-store";
import { Timeline, timelinesAdapter } from "./timelines/model/timeline.entity";
import { rootReducer } from "./root-reducer";
import { Message, messagesAdapter } from "./timelines/model/message.entity";
import { relationshipsAdapter } from "./users/model/relationship.entity";
import { User, usersAdapter } from "./users/model/user.entity";
import { AuthUser } from "./auth/model/auth.gateway";
import {
  Notification,
  notificationsAdapter,
} from "./notifications/model/notification.entity";
import { Like, likesAdapter } from "./timelines/model/like.entity";

const initialState = rootReducer(undefined, createAction(""));

const withAuthUser = createAction<{ authUser: string | AuthUser }>(
  "withAuthUser"
);
const withTimeline = createAction<Timeline>("withTimeline");
const withLoadingTimelineOf = createAction<{ user: string }>(
  "withLoadingTimelineOf"
);
const withNotLoadingTimelineOf = createAction<{ user: string }>(
  "withNotLoadingTimelineOf"
);
const withMessages = createAction<Message[]>("withMessages");
const withMessageNotPosted = createAction<{ messageId: string; error: string }>(
  "withMessageNotPosted"
);
const withNoMessagesHavingFailedToBePosted = createAction<void>(
  "withNoMessagesHavingFailedToBePosted"
);
const withFollowers = createAction<{ of: string; followers: string[] }>(
  "withFollowers"
);
const withFollowersLoading = createAction<{ of: string }>(
  "withFollowersLoading"
);
const withFollowersNotLoading = createAction<{ of: string }>(
  "withFollowersNotLoading"
);
const withFollowing = createAction<{ of: string; following: string[] }>(
  "withFollowing"
);
const withFollowingLoading = createAction<{ of: string }>(
  "withFollowingLoading"
);
const withFollowingNotLoading = createAction<{ of: string }>(
  "withFollowingNotLoading"
);
const withUsers = createAction<User[]>("withUsers");
const withProfilePictureUploading = createAction("withProfilePictureUploading");
const withNotLoadingUser = createAction<{ userId: string }>(
  "withNotLoadingUser"
);
const withNotificationsNotLoading = createAction<void>(
  "withNotificationsNotLoading"
);
const withNotificationsLoading = createAction<void>("withNotificationsLoading");
const withNotifications = createAction<Notification[]>("withNotifications");
const withLikes = createAction<Like[]>("withLikes");
const withOnlyLikes = createAction<Like[]>("withOnlyLikes");

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAuthUser, (state, action) => {
      if (typeof action.payload.authUser === "string") {
        state.auth.authUser = {
          id: action.payload.authUser,
          username: action.payload.authUser,
        };
        return;
      }
      state.auth.authUser = action.payload.authUser;
    })
    .addCase(withTimeline, (state, action) => {
      timelinesAdapter.upsertOne(state.timelines.timelines, action.payload);
    })
    .addCase(withLoadingTimelineOf, (state, action) => {
      state.timelines.timelines.loadingTimelinesByUser[action.payload.user] =
        true;
    })
    .addCase(withNotLoadingTimelineOf, (state, action) => {
      state.timelines.timelines.loadingTimelinesByUser[action.payload.user] =
        false;
    })
    .addCase(withMessages, (state, action) => {
      messagesAdapter.upsertMany(state.timelines.messages, action.payload);
    })
    .addCase(withMessageNotPosted, (state, action) => {
      state.timelines.messages.messagesNotPosted[action.payload.messageId] =
        action.payload.error;
    })
    .addCase(withNoMessagesHavingFailedToBePosted, (state) => {
      state.timelines.messages.messagesNotPosted = {};
    })
    .addCase(withFollowers, (state, action) => {
      relationshipsAdapter.addMany(
        state.users.relationships,
        action.payload.followers.map((follows) => ({
          user: follows,
          follows: action.payload.of,
        }))
      );
    })
    .addCase(withFollowersLoading, (state, action) => {
      state.users.relationships.loadingFollowersOf[action.payload.of] = true;
    })
    .addCase(withFollowersNotLoading, (state, action) => {
      state.users.relationships.loadingFollowersOf[action.payload.of] = false;
    })
    .addCase(withFollowing, (state, action) => {
      relationshipsAdapter.addMany(
        state.users.relationships,
        action.payload.following.map((follows) => ({
          user: action.payload.of,
          follows,
        }))
      );
    })
    .addCase(withFollowingLoading, (state, action) => {
      state.users.relationships.loadingFollowingOf[action.payload.of] = true;
    })
    .addCase(withFollowingNotLoading, (state, action) => {
      state.users.relationships.loadingFollowingOf[action.payload.of] = false;
    })
    .addCase(withUsers, (state, action) => {
      usersAdapter.upsertMany(state.users.users, action.payload);
    })
    .addCase(withNotLoadingUser, (state, action) => {
      state.users.users.loadingUsers[action.payload.userId] = false;
    })
    .addCase(withProfilePictureUploading, (state) => {
      state.users.users.profilePictureUploading = true;
    })
    .addCase(withNotificationsNotLoading, (state) => {
      state.notifications.loading = false;
    })
    .addCase(withNotificationsLoading, (state) => {
      state.notifications.loading = true;
    })
    .addCase(withNotifications, (state, action) => {
      notificationsAdapter.upsertMany(state.notifications, action.payload);
    })
    .addCase(withLikes, (state, action) => {
      likesAdapter.upsertMany(state.timelines.likes, action.payload);
    })
    .addCase(withOnlyLikes, (state, action) => {
      likesAdapter.removeAll(state.timelines.likes);
      likesAdapter.addMany(state.timelines.likes, action.payload);
    });
});

export const stateBuilder = (baseState = initialState) => {
  const reduce =
    <P>(actionCreator: ActionCreatorWithPayload<P>) =>
    (payload: P) => {
      return stateBuilder(reducer(baseState, actionCreator(payload)));
    };

  return {
    withAuthUser: reduce(withAuthUser),
    withTimeline: reduce(withTimeline),
    withLoadingTimelineOf: reduce(withLoadingTimelineOf),
    withNotLoadingTimelineOf: reduce(withNotLoadingTimelineOf),
    withMessages: reduce(withMessages),
    withMessageNotPosted: reduce(withMessageNotPosted),
    withNoMessagesHavingFailedToBePosted: reduce(
      withNoMessagesHavingFailedToBePosted
    ),
    withFollowers: reduce(withFollowers),
    withFollowing: reduce(withFollowing),
    withFollowersLoading: reduce(withFollowersLoading),
    withFollowingLoading: reduce(withFollowingLoading),
    withFollowersNotLoading: reduce(withFollowersNotLoading),
    withFollowingNotLoading: reduce(withFollowingNotLoading),
    withUsers: reduce(withUsers),
    withNotLoadingUser: reduce(withNotLoadingUser),
    withProfilePictureUploading: reduce(withProfilePictureUploading),
    withNotificationsLoading: reduce(withNotificationsLoading),
    withNotificationsNotLoading: reduce(withNotificationsNotLoading),
    withNotifications: reduce(withNotifications),
    withLikes: reduce(withLikes),
    withOnlyLikes: reduce(withOnlyLikes),
    build(): RootState {
      return baseState;
    },
  };
};

export const stateBuilderProvider = () => {
  let builder = stateBuilder();
  return {
    getState() {
      return builder.build();
    },
    setState(updateFn: (_builder: StateBuilder) => StateBuilder) {
      builder = updateFn(builder);
    },
  };
};

export type StateBuilder = ReturnType<typeof stateBuilder>;
export type StateBuilderProvider = ReturnType<typeof stateBuilderProvider>;
