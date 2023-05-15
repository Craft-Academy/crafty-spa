import { Box, Container, Flex, useBreakpointValue } from "@chakra-ui/react";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  return (
    <Flex
      as="section"
      direction={{ base: "column", lg: "row" }}
      height="100vh"
      bg="bg-canvas"
      overflowY="auto"
    >
      {isDesktop ? <Sidebar /> : <Navbar />}
      <Box bg="bg-accent" pt={{ base: "0", lg: "3" }} flex="1">
        <Box
          bg="bg-canvas"
          borderTopLeftRadius={{ base: "none", lg: "2rem" }}
          height="full"
        >
          <Container py="8" height="full" maxW="100%">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Flex>
  );
};
