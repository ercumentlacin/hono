/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createBrowserRouter } from "react-router-dom";
import ProtoctedLayout from "./layouts/protected";
import RootBoundary from "./pages/error";
import HomePage from "./pages/page";

const lazy = async <T,>(promise: Promise<T>) => {
  const mod = await promise;

  return {
    ...mod,
    Component: undefined,
    // @ts-expect-error aa
    element: <mod.default />,
  };
};

export const router = createBrowserRouter([
  {
    path: "/auth",
    lazy: async () => lazy(import("./layouts/root")),
    errorElement: <RootBoundary />,
    children: [
      {
        path: "register",
        lazy: async () => lazy(import("./pages/auth/register/page")),
      },
      {
        index: true,
        path: "login",
        lazy: async () => lazy(import("./pages/auth/login/page")),
      },
    ],
  },
  {
    path: "/",
    element: <ProtoctedLayout />,
    errorElement: <RootBoundary />,
    children: [
      {
        index: true,
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);
