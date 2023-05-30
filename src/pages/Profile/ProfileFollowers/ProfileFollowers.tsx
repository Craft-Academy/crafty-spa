import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  ProfileFollowersViewModelType,
  createProfileFollowersViewModel,
} from "./profile-followers.viewmodel";
import { exhaustiveGuard } from "@/lib/common/utils/exhaustive-guard";
import { Button, Center } from "@chakra-ui/react";
import { RelationshipGrid } from "@/components/profile/RelationshipGrid";

export const ProfileFollowers = () => {
  const { userId } = useParams() as { userId: string };
  const viewModel = useSelector(
    createProfileFollowersViewModel({ of: userId })
  );

  switch (viewModel.type) {
    case ProfileFollowersViewModelType.ProfileFollowersLoading:
      return <p>Loading...</p>;
    case ProfileFollowersViewModelType.ProfileFollowersLoaded:
      return (
        <>
          <RelationshipGrid relationshipCards={viewModel.followers} />
          <Center>
            <Button mb={10} colorScheme="twitter">
              Voir plus
            </Button>
          </Center>
        </>
      );
    default:
      exhaustiveGuard(viewModel);
  }

  return null;
};
