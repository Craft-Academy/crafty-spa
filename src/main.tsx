import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "./Provider.tsx";
import { createStore } from "./lib/create-store.ts";
import { FakeAuthGateway } from "./lib/auth/infra/fake-auth.gateway.ts";
import { createRouter } from "./router.tsx";
import { FakeStorageAuthGateway } from "./lib/auth/infra/fake-storage-auth.gateway.ts";
import { users } from "./lib/fake-data.ts";
import { FakeDataTimelineGateway } from "./lib/timelines/infra/fake-data-timeline.gateway.ts";
import { FakeMessageGateway } from "./lib/timelines/infra/fake-message.gateway.ts";
import { RealDateProvider } from "./lib/timelines/infra/real-date-provider.ts";

const fakeAuthGateway = new FakeAuthGateway(500);
fakeAuthGateway.willSucceedForGoogleAuthForUser = [...users.values()][0];
fakeAuthGateway.willSucceedForGithubAuthForUser = [...users.values()][1];
const messageGateway = new FakeMessageGateway();
const authGateway = new FakeStorageAuthGateway(fakeAuthGateway);
const dateProvider = new RealDateProvider();

const timelineGateway = new FakeDataTimelineGateway();

const store = createStore({
  authGateway,
  messageGateway,
  timelineGateway,
  dateProvider,
});

const router = createRouter({ store });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store} router={router} />
  </React.StrictMode>
);
