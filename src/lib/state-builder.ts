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

const withTimeline = createAction<Timeline>("withTimeline");
const withLoadingTimelineOf = createAction<{ user: string }>(
  "withLoadingTimelineOf"
);
const withNotLoadingTimelineOf = createAction<{ user: string }>(
  "withNotLoadingTimelineOf"
);
const withMessages = createAction<Message[]>("withMessages");

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(withTimeline, (state, action) => {
    timelinesAdapter.addOne(state.timelines, action.payload);
  });
  builder.addCase(withLoadingTimelineOf, (state, action) => {
    state.timelines.loadingTimelinesByUser[action.payload.user] = true;
  });
  builder.addCase(withNotLoadingTimelineOf, (state, action) => {
    state.timelines.loadingTimelinesByUser[action.payload.user] = false;
  });
  builder.addCase(withMessages, (state, action) => {
    messagesAdapter.addMany(state.messages, action.payload);
  });
});

export const stateBuilder = (baseState = initialState) => {
  const reduce =
    <P>(actionCreator: ActionCreatorWithPayload<P>) =>
    (payload: P) =>
      stateBuilder(reducer(baseState, actionCreator(payload)));

  return {
    withTimeline: reduce(withTimeline),
    withLoadingTimelineOf: reduce(withLoadingTimelineOf),
    withNotLoadingTimelineOf: reduce(withNotLoadingTimelineOf),
    withMessages: reduce(withMessages),
    build(): RootState {
      return baseState;
    },
  };
};
