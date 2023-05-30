import {
  Avatar,
  AvatarProps,
  Box,
  Flex,
  FlexProps,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface CardWithAvatarProps extends FlexProps {
  avatarProps: AvatarProps;
}

export const LoadingCardWithAvatar = (
  props: FlexProps & { children: ReactNode }
) => {
  const { children, ...rest } = props;
  return (
    <Flex
      direction="column"
      alignItems="center"
      rounded="md"
      padding="8"
      position="relative"
      bg={useColorModeValue("white", "gray.700")}
      shadow={{ md: "base" }}
      {...rest}
    >
      <Box
        position="absolute"
        inset="0"
        height="20"
        bg="blue.300"
        roundedTop="inherit"
      />
      <SkeletonCircle size="20" mt={-10} borderWidth="5px" />
      {children}
    </Flex>
  );
};

export const CardWithAvatar = (props: CardWithAvatarProps) => {
  const { children, avatarProps, ...rest } = props;
  return (
    <Flex
      direction="column"
      alignItems="center"
      rounded="md"
      padding="8"
      position="relative"
      bg={useColorModeValue("white", "gray.700")}
      shadow={{ md: "base" }}
      {...rest}
    >
      <Box
        position="absolute"
        inset="0"
        height="20"
        bg="blue.300"
        roundedTop="inherit"
      />
      <Avatar size="xl" {...avatarProps} />
      {children}
    </Flex>
  );
};
