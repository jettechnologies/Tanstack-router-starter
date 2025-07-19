import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import { AuthContextProps } from "@/context/auth-provider";

// type AuthenticationContext = {
//   auth: AuthContextProps;
// };

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  );
}
