import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
// import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import "../style/globals.scss";
import { routeTree } from "./routeTree.gen";
import { ToastProvider } from "./context";
// import theme from "@config/theme";

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// const theme = extendTheme({
//   colors: {
//     primary: {
//       100: "#a5c339",
//     },
//   },
// });

function App() {
  return (
    <ChakraProvider resetCSS>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ChakraProvider>
  );
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
