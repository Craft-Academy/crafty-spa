import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "./Provider.tsx";
import { createStore } from "./lib/create-store.ts";
import { FakeAuthGateway } from "./lib/auth/infra/fake-auth.gateway.ts";
import { FakeTimelineGateway } from "./lib/timelines/infra/fake-timeline.gateway.ts";
import { createRouter } from "./router.tsx";

const authGateway = new FakeAuthGateway();
authGateway.authUser = "Alice";

const timelineGateway = new FakeTimelineGateway(1000);
timelineGateway.timelinesByUser.set(authGateway.authUser, {
  id: "alice-timeline-id",
  user: "Alice",
  messages: [
    {
      id: "msg1-id",
      text: "Hello it's Bob",
      author: "Bob",
      publishedAt: "2023-05-16T12:06:00.000Z",
    },
    {
      id: "msg2-id",
      text: "Hello it's Alice",
      author: "Alice",
      publishedAt: "2023-05-16T12:05:00.000Z",
    },
  ],
});

const store = createStore({
  authGateway,
  timelineGateway,
});

const router = createRouter({ store });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store} router={router} />
  </React.StrictMode>
);
