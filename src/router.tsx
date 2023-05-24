import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { ProtectedPageLayout } from "./pages/ProtectedPageLayout";
import { createHomeLoader } from "./pages/Home/create-home-loader";
import { AppStore } from "./lib/create-store";
import { Login } from "./pages/Login";
import { RedirectHomePage } from "./pages/RedirectHomePage";
import { ProfileLayout } from "./pages/Profile/ProfileLayout";
import { ProfileTimeline } from "./pages/Profile/ProfileTimeline";
import { createProfileTimelineLoader } from "./pages/Profile/ProfileTimeline/create-profile-timeline-loader";

export const createRouter = (
  { store }: { store: AppStore },
  createRouterFn = createBrowserRouter
) =>
  createRouterFn([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <ProtectedPageLayout />,
      children: [
        {
          index: true,
          element: <RedirectHomePage />,
        },
        {
          path: "home",
          loader: createHomeLoader({ store }),
          element: <Home />,
        },
        {
          path: "u/:userId",
          element: <ProfileLayout />,
          children: [
            {
              index: true,
              element: <ProfileTimeline />,
              loader: createProfileTimelineLoader({ store }),
            },
            {
              path: "following",
              element: <p>following</p>,
            },
            {
              path: "followers",
              element: <p>followers</p>,
            },
          ],
        },
      ],
    },
  ]);

export type AppRouter = ReturnType<typeof createRouter>;
