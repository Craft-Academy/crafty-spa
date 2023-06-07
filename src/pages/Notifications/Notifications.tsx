import { Notification } from "@/components/Notification";
import {
  Box,
  Button,
  Center,
  Stack,
  StackDivider,
  Text,
  keyframes,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import {
  NotificationsViewModelType,
  createNotificationsViewModel,
} from "./notifications.viewmodel";
import { exhaustiveGuard } from "@/lib/common/utils/exhaustive-guard";
import { useState } from "react";

export const Notifications = () => {
  const [lastSeenNotificationId, setLastSeenNotificationId] = useState("");
  const viewModel = useSelector(
    createNotificationsViewModel({
      now: new Date(),
      lastSeenNotificationId,
      setLastSeenNotificationId,
    })
  );

  switch (viewModel.type) {
    case NotificationsViewModelType.NotificationsLoading:
      return <Text>Loading...</Text>;
    case NotificationsViewModelType.NoNotifications:
      return (
        <Center>
          <Text>{viewModel.message}</Text>
        </Center>
      );
    case NotificationsViewModelType.NotificationsLoaded:
      return (
        <Center mx="auto" py={{ base: "4", md: "8" }}>
          <Box bg="bg-surface" py="4" width="full">
            <Stack divider={<StackDivider />} spacing={0}>
              {viewModel.newNotifications !== "" && (
                <Center>
                  <Button
                    variant="link"
                    onClick={viewModel.displayNewNotifications}
                  >
                    {viewModel.newNotifications}
                  </Button>
                </Center>
              )}
              {viewModel.notifications.map((n) => (
                <Notification
                  key={n.id}
                  boxShadow="none"
                  borderRadius="none"
                  color="blackAlpha.700"
                  bgColor="white"
                  profilePicture={n.imageUrl}
                  title={n.title}
                  text={n.text}
                  url={n.url}
                  occuredAt={n.occuredAt}
                  animation={
                    n.read
                      ? ""
                      : `${keyframes`
                from { background-color: rgba(200, 233, 251, 1); }
                to { background-color: rgba(200, 233, 251, 0) }
              `} 2s linear forwards`
                  }
                />
              ))}
            </Stack>
          </Box>
        </Center>
      );
    default:
      exhaustiveGuard(viewModel);
  }
};
