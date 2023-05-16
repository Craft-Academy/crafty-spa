import { AnyAction, ThunkDispatch, configureStore } from "@reduxjs/toolkit";
import { AuthGateway } from "./auth/model/auth.gateway";
import { TimelineGateway } from "./timelines/model/timeline.gateway";
import { reducer as timelinesReducer } from "./timelines/reducer";

export type Dependencies = {
  authGateway: AuthGateway;
  timelineGateway: TimelineGateway;
};

const rootReducer = timelinesReducer;

export const createStore = (dependencies: Dependencies) =>
  configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      });
    },
  });

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, AnyAction>;
