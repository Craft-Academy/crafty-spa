import {
  ActionCreatorWithPayload,
  createAction,
  createReducer,
} from "@reduxjs/toolkit";
import { RootState } from "./create-store";
import { Timeline, timelinesAdapter } from "./timelines/model/timeline.entity";
import { rootReducer } from "./root-reducer";
import { Message, messagesAdapter } from "./timelines/model/message.entity";

const initialState = rootReducer(undefined, createAction(""));

const withAuthUser = createAction<{ authUser: string }>("withAuthUser");
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

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAuthUser, (state, action) => {
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
      messagesAdapter.addMany(state.timelines.messages, action.payload);
    })
    .addCase(withMessageNotPosted, (state, action) => {
      state.timelines.messages.messagesNotPosted[action.payload.messageId] =
        action.payload.error;
    })
    .addCase(withNoMessagesHavingFailedToBePosted, (state) => {
      state.timelines.messages.messagesNotPosted = {};
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
