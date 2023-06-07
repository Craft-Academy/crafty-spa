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
import { ProfileFollowers } from "./pages/Profile/ProfileFollowers";
import { createProfileFollowersLoader } from "./pages/Profile/ProfileFollowers/create-profile-followers-loader";
import { ProfileFollowing } from "./pages/Profile/ProfileFollowing";
import { createProfileFollowingLoader } from "./pages/Profile/ProfileFollowing/create-profile-following-loader";
import { createProfileLoader } from "./pages/Profile/create-profile-loader";
import { Notifications } from "./pages/Notifications";
import { createNotificationsLoader } from "./pages/Notifications/notifications.loader";

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
          path: "notifications",
          element: <Notifications />,
          loader: createNotificationsLoader({ store }),
        },
        {
          path: "u/:userId",
          element: <ProfileLayout />,
          loader: createProfileLoader({ store }),
          children: [
            {
              index: true,
              element: <ProfileTimeline />,
              loader: createProfileTimelineLoader({ store }),
            },
            {
              path: "following",
              element: <ProfileFollowing />,
              loader: createProfileFollowingLoader({ store }),
            },
            {
              path: "followers",
              element: <ProfileFollowers />,
              loader: createProfileFollowersLoader({ store }),
            },
          ],
        },
      ],
    },
  ]);

export type AppRouter = ReturnType<typeof createRouter>;
