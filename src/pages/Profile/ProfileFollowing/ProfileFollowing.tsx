import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  ProfileFollowingViewModelType,
  createProfileFollowingViewModel,
} from "./profile-following.viewmodel";
import { exhaustiveGuard } from "@/lib/common/utils/exhaustive-guard";
import { Button, Center } from "@chakra-ui/react";
import { RelationshipGrid } from "@/components/profile/RelationshipGrid";

export const ProfileFollowing = () => {
  const { userId } = useParams() as { userId: string };
  const viewModel = useSelector(
    createProfileFollowingViewModel({ of: userId })
  );

  switch (viewModel.type) {
    case ProfileFollowingViewModelType.ProfileFollowingLoading:
      return <p>Loading...</p>;
    case ProfileFollowingViewModelType.ProfileFollowingLoaded:
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
