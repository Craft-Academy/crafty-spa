import { Notification } from "@/components/Notification";
import { Box, Center, Stack, StackDivider, keyframes } from "@chakra-ui/react";

export const Notifications = () => {
  const notifications = [
    {
      id: "n1",
      imageUrl: "https://picsum.photos/200?random=n1",
      title: "Last notification",
      text: "Coucou something happened !",
      occuredAt: "Few seconds ago",
      read: false,
      url: "",
    },
    {
      id: "n2",
      imageUrl: "https://picsum.photos/200?random=n2",
      title: "First notification",
      text: "Hello there !",
      occuredAt: "17 minutes ago",
      read: true,
      url: "",
    },
  ];
  return (
    <Center mx="auto" py={{ base: "4", md: "8" }}>
      <Box bg="bg-surface" py="4" width="full">
        <Stack divider={<StackDivider />} spacing={0}>
          {notifications.map((n) => (
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
};
