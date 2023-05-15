import { Avatar, Box, HStack, Text } from "@chakra-ui/react";

export const UserProfile = ({
  username,
  profilePicture,
}: {
  username: string;
  profilePicture: string;
}) => {
  return (
    <HStack spacing="3" ps="2">
      <Avatar name={username} src={profilePicture} boxSize="10" />
      <Box>
        <Text color="on-accent" fontWeight="medium" fontSize="sm">
          {username}
        </Text>
      </Box>
    </HStack>
  );
};
