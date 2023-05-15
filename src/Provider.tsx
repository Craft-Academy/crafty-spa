import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export const Provider = () => (
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
