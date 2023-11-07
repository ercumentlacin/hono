/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createBrowserRouter } from "react-router-dom";

const lazy = async <T,>(promise: Promise<T>) => {
  const mod = await promise;

  return {
    ...mod,
    Component: undefined,
    // @ts-expect-error aa
    element: <mod.default />
  };
}

export const router = createBrowserRouter([
  {
    path: '/auth',
    lazy: async () => lazy(import("./layouts/root")),
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
    ]
  },
  {
    path: "/",
    lazy: async () => lazy(import("./layouts/protected")),
    children: [
      {
        index: true,
        lazy: async () => lazy(import("./App"))
      }
    ],
  },
]);