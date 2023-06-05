import {
  AnyAction,
  AsyncThunk,
  Middleware,
  ThunkDispatch,
  configureStore,
  isAsyncThunkAction,
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
import { UserGateway } from "./users/model/user.gateway";
import { FakeUserGateway } from "./users/infra/fake-user.gateway";
import { NotificationGateway } from "./notifications/model/notification.gateway";
import { FakeNotificationGateway } from "./notifications/infra/fake-notification.gateway";
import { getNotificationsOnUserAuthenticated } from "./notifications/listeners/get-notifications-on-user-authenticated.listener";

export const EMPTY_ARGS = "EMPTY_ARGS" as const;

export type Dependencies = {
  authGateway: AuthGateway;
  timelineGateway: TimelineGateway;
  messageGateway: MessageGateway;
  userGateway: UserGateway;
  notificationGateway: NotificationGateway;
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
      }).prepend(logActionsMiddleware, getNotificationsOnUserAuthenticated());
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
    userGateway = new FakeUserGateway(),
    notificationGateway = new FakeNotificationGateway(),
    dateProvider = new RealDateProvider(),
  }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) => {
  const store = createStore(
    {
      authGateway,
      timelineGateway,
      messageGateway,
      userGateway,
      notificationGateway,
      dateProvider,
    },
    preloadedState
  );

  return {
    ...store,
    getDispatchedUseCaseArgs(useCase: AsyncThunk<any, any, any>) {
      const pendingUseCaseAction = store
        .getActions()
        .find((a) => a.type === useCase.pending.toString());

      if (!pendingUseCaseAction) return;

      if (!isAsyncThunkAction(pendingUseCaseAction)) return;

      return pendingUseCaseAction.meta.arg ?? EMPTY_ARGS;
    },
  };
};

type AppStoreWithGetActions = ReturnType<typeof createStore>;
export type AppStore = Omit<AppStoreWithGetActions, "getActions">;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, AnyAction>;
