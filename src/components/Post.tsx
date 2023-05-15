import { Avatar, Box, HStack, Stack, Text } from "@chakra-ui/react";
import { LikeButton } from "./LikeButton";
import { Link } from "react-router-dom";

export const Post = (msg: {
  id: string;
  profilePictureUrl: string;
  username: string;
  publishedAt: string;
  text: string;
  userId: string;
}) => {
  return (
    <Stack key={msg.id} fontSize="sm" px="4" spacing="4">
      <Stack direction="row" justify="space-between" spacing="4">
        <HStack spacing="3">
          <Link to={`/u/${msg.userId}`}>
            <Avatar src={msg.profilePictureUrl} boxSize="10" />
          </Link>
          <Box>
            <Link to={`/u/${msg.userId}`}>
              <Text fontWeight="medium" color="emphasized">
                {msg.username}
              </Text>
            </Link>
          </Box>
        </HStack>
        <Text color="muted">{msg.publishedAt}</Text>
      </Stack>
      <Text
        color="muted"
        sx={{
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "2",
          overflow: "hidden",
          display: "-webkit-box",
        }}
      >
        {msg.text}
      </Text>
      <LikeButton />
    </Stack>
  );
};
