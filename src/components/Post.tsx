import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MdErrorOutline } from "react-icons/md";
import { LikeButton } from "./LikeButton";
import { Link } from "react-router-dom";

export const Post = (props: {
  id: string;
  profilePictureUrl: string;
  username: string;
  publishedAt: string;
  text: string;
  userId: string;
  failedToBePosted: boolean;
  backgroundColor: string;
  errorMessage?: string;
  retryToPostMessage: () => void;
}) => {
  const { retryToPostMessage, ...msg } = props;
  return (
    <Stack
      key={msg.id}
      fontSize="sm"
      px="4"
      spacing="4"
      backgroundColor={msg.backgroundColor}
    >
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
        {msg.failedToBePosted && (
          <>
            <Text color="red.400">
              <Icon
                as={MdErrorOutline}
                boxSize={7}
                position={"relative"}
                top={2}
                mr={2}
              />
              Error while trying to post this message.
              <Button
                fontWeight={"bold"}
                ml={2}
                variant="link"
                size="sm"
                color="red.500"
                onClick={retryToPostMessage}
              >
                Try again
              </Button>
            </Text>
          </>
        )}
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
      <LikeButton messageId={msg.id} />
    </Stack>
  );
};
