import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { ProtectedPageLayout } from "./pages/ProtectedPageLayout";
import { createHomeLoader } from "./pages/Home/create-home-loader";
import { AppStore } from "./lib/create-store";
import { Login } from "./pages/Login";
import { RedirectHomePage } from "./pages/RedirectHomePage";

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
      ],
    },
  ]);

export type AppRouter = ReturnType<typeof createRouter>;
