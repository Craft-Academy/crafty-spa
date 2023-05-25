import { Box, Center, Stack, StackDivider } from "@chakra-ui/react";
import { AddPostForm } from "./AddPostForm";
import { Post } from "./Post";

export const PostList = ({
  messages,
  timelineId,
  addPostPlaceholder = "What's on your mind ?",
}: {
  messages: {
    id: string;
    profilePictureUrl: string;
    username: string;
    publishedAt: string;
    text: string;
    userId: string;
  }[];
  timelineId: string;
  addPostPlaceholder?: string;
}) => {
  return (
    <Center mx="auto" py={{ base: "4", md: "8" }}>
      <Box bg="bg-surface" py="4" width="full">
        <Stack divider={<StackDivider />} spacing="4">
          <AddPostForm
            placeholder={addPostPlaceholder}
            timelineId={timelineId}
          />
          {messages.map((msg) => (
            <Post key={msg.id} {...msg} />
          ))}
        </Stack>
      </Box>
    </Center>
  );
};
