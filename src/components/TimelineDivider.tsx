import { Box, Container, Divider, HStack, Text } from "@chakra-ui/react";

export const TimelineDivider = ({ text }: { text: string }) => (
  <Box bg="bg-surface">
    <Container py={{ base: "4", md: "8" }}>
      <HStack>
        <Divider />
        <Text fontSize="lg" fontWeight="medium" whiteSpace="nowrap">
          {text}
        </Text>
        <Divider />
      </HStack>
    </Container>
  </Box>
);
