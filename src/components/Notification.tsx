import { Avatar, Box, BoxProps, Flex, HStack, Text } from "@chakra-ui/react";

export const Notification = ({
  profilePicture,
  title,
  text,
  occuredAt,
  ...boxProps
}: {
  profilePicture: string;
  title: string;
  text: string;
  url: string;
  occuredAt: string;
} & BoxProps) => {
  return (
    <Box as="section">
      <Flex direction="row-reverse">
        <Box
          width="full"
          boxShadow="md"
          bg="bg-surface"
          borderRadius="lg"
          backgroundColor={"twitter.700"}
          color="white"
          p={2}
          {...boxProps}
        >
          <HStack spacing="4" p="4" flex="1">
            <Avatar src={profilePicture} boxSize="10" />
            <Box>
              <Text fontWeight="medium" fontSize="sm">
                {title}
              </Text>
              <Text color="muted" fontSize="sm">
                {text}
              </Text>
            </Box>
          </HStack>
          <Text color="muted" fontSize="sm" textAlign={"right"} px={2}>
            {occuredAt}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
