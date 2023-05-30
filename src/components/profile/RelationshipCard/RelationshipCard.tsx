import { Button, HStack, useMultiStyleConfig } from "@chakra-ui/react";
import { CardWithAvatar } from "./CardWithAvatar";
import { FollowersCount } from "./FollowersCount";
import { UserInfo } from "./UserInfo";
import { Link } from "react-router-dom";
import { HiOutlineUserPlus } from "react-icons/hi2";

export const RelationshipCard = (user: {
  id: string;
  username: string;
  profilePicture: string;
  isFollowedByAuthUser: boolean;
  followersCount: number;
  link: string;
}) => {
  const buttonProps = {
    variant: "outline",
    colorScheme: "blue",
    rounded: "full",
    size: "sm",
    width: "full",
  };
  const buttonStyles = useMultiStyleConfig("Button", buttonProps);

  return (
    <CardWithAvatar
      key={user.id}
      avatarProps={{ src: user.profilePicture, name: user.username }}
    >
      <UserInfo mt="3" name={user.username} />
      <FollowersCount my="4" count={user.followersCount} />
      <HStack spacing={5}>
        <Link to={user.link}>
          <Button {...buttonProps}>View Profile</Button>
        </Link>
        {user.isFollowedByAuthUser ? (
          <Button
            {...buttonProps}
            colorScheme="black"
            _after={{
              content: "'Following'",
            }}
            _hover={{
              ...buttonStyles._hover,
              bg: "red.50",
              borderColor: "red.100",
              textColor: "red.500",
              _after: {
                content: "'Unfollow'",
              },
            }}
          />
        ) : (
          <Button {...buttonProps} leftIcon={<HiOutlineUserPlus />}>
            Follow
          </Button>
        )}
      </HStack>
    </CardWithAvatar>
  );
};
