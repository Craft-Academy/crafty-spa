import { Center, SimpleGrid, SkeletonText } from "@chakra-ui/react";
import { LoadingCardWithAvatar } from "./RelationshipCard/CardWithAvatar";
import { RelationshipCard } from "./RelationshipCard/RelationshipCard";

export const LoadingRelationshipGrid = () => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 3, lg: 3, xl: 5 }}
      spacing="6"
      mt={10}
      mb={5}
    >
      {new Array(20).fill(null).map((_, i) => {
        return (
          <LoadingCardWithAvatar key={i}>
            <Center>
              <SkeletonText>Some username</SkeletonText>
            </Center>
          </LoadingCardWithAvatar>
        );
      })}
    </SimpleGrid>
  );
};

export const RelationshipGrid = ({
  relationshipCards,
}: {
  relationshipCards: {
    id: string;
    username: string;
    profilePicture: string;
    link: string;
  }[];
}) => {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 3, lg: 3, xl: 5 }}
      spacing="6"
      mt={10}
      mb={5}
    >
      {relationshipCards.map((user) => (
        <RelationshipCard
          key={user.id}
          {...user}
          followersCount={42}
          isFollowedByAuthUser={false}
        />
      ))}
    </SimpleGrid>
  );
};
