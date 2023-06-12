import { CardContent } from "@/components/profile/CardContent";
import { CardWithAvatar } from "@/components/profile/CardWithAvatar";
import { NavTab } from "@/components/profile/NavTab";
import { Box, Button, Heading, TabList, Tabs } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { createProfileLayoutViewModel } from "./profile-layout.viewmodel";
import { HiPhotograph } from "react-icons/hi";

export const ProfileLayout = () => {
  const params = useParams();
  const userId = params.userId as string;
  const viewModel = useSelector(createProfileLayoutViewModel({ userId }));

  return (
    <>
      <Box as="section" pt="20" pb="12" position="relative">
        <Box position="absolute" inset="0" height="32" bg="blue.600" />
        <CardWithAvatar
          maxW="xl"
          avatarProps={{
            src: viewModel.profilePicture,
            name: viewModel.username,
            uploading: false,
          }}
          action={
            viewModel.isAuthUserProfile ? (
              <>
                <Button size="sm" leftIcon={<HiPhotograph />}>
                  Upload photo
                </Button>
              </>
            ) : null
          }
        >
          <CardContent>
            <Heading size="lg" fontWeight="extrabold" letterSpacing="tight">
              {viewModel.username}
            </Heading>
          </CardContent>
        </CardWithAvatar>
      </Box>
      <Tabs size="lg">
        <TabList>
          <NavTab to={viewModel.timelineLink}>Timeline</NavTab>
          <NavTab to={viewModel.followingLink}>
            {viewModel.tabs.following}
          </NavTab>
          <NavTab to={viewModel.followersLink}>
            {viewModel.tabs.followers}
          </NavTab>
        </TabList>
      </Tabs>

      <Outlet />
    </>
  );
};
