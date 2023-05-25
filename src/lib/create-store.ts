import {
  AnyAction,
  Middleware,
  ThunkDispatch,
  configureStore,
} from "@reduxjs/toolkit";
import { AuthGateway } from "./auth/model/auth.gateway";
import { TimelineGateway } from "./timelines/model/timeline.gateway";
import { FakeAuthGateway } from "./auth/infra/fake-auth.gateway";
import { FakeTimelineGateway } from "./timelines/infra/fake-timeline.gateway";
import { rootReducer } from "./root-reducer";
import { onAuthStateChangedListener } from "./auth/listeners/on-auth-state-changed.listener";
import { DateProvider } from "./timelines/model/date-provider";
import { RealDateProvider } from "./timelines/infra/real-date-provider";
import { MessageGateway } from "./timelines/model/message.gateway";
import { FakeMessageGateway } from "./timelines/infra/fake-message.gateway";

export type Dependencies = {
  authGateway: AuthGateway;
  timelineGateway: TimelineGateway;
  messageGateway: MessageGateway;
  dateProvider: DateProvider;
};

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: Partial<RootState>
) => {
  const actions: AnyAction[] = [];
  const logActionsMiddleware: Middleware = () => (next) => (action) => {
    actions.push(action);
    return next(action);
  };

  const store = configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      }).prepend(logActionsMiddleware);
    },
    preloadedState,
  });

  onAuthStateChangedListener({
    store,
    authGateway: dependencies.authGateway,
  });

  return {
    ...store,
    getActions() {
      return actions;
    },
  };
};

export const createTestStore = (
  {
    authGateway = new FakeAuthGateway(),
    timelineGateway = new FakeTimelineGateway(),
    messageGateway = new FakeMessageGateway(),
    dateProvider = new RealDateProvider(),
  }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) =>
  createStore(
    {
      authGateway,
      timelineGateway,
      messageGateway,
      dateProvider,
    },
    preloadedState
  );

type AppStoreWithGetActions = ReturnType<typeof createStore>;
export type AppStore = Omit<AppStoreWithGetActions, "getActions">;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, AnyAction>;
