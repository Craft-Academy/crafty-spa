import {
  Avatar,
  AvatarProps,
  Box,
  CircularProgress,
  Flex,
  FlexProps,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface CardWithAvatarProps extends FlexProps {
  avatarProps: AvatarProps & { uploading?: boolean };
  action?: ReactNode;
}

export const LoadingCardWithAvatar = (
  props: FlexProps & { children: ReactNode }
) => {
  const { children, ...rest } = props;
  return (
    <Flex
      position="relative"
      direction="column"
      align={{ sm: "center" }}
      maxW="2xl"
      mx="auto"
      bg={useColorModeValue("white", "gray.700")}
      shadow={{ sm: "base" }}
      rounded={{ sm: "lg" }}
      px={{ base: "6", md: "8" }}
      pb={{ base: "6", md: "8" }}
      {...rest}
    >
      <SkeletonCircle size={"20"} mt="-10" borderWidth="6px" />
      {children}
    </Flex>
  );
};

export const CardWithAvatar = (props: CardWithAvatarProps) => {
  const { action, avatarProps, children, ...rest } = props;
  return (
    <Flex
      position="relative"
      direction="column"
      align={{ sm: "center" }}
      maxW="2xl"
      mx="auto"
      bg={useColorModeValue("white", "gray.700")}
      shadow={{ sm: "base" }}
      rounded={{ sm: "lg" }}
      px={{ base: "6", md: "8" }}
      pb={{ base: "6", md: "8" }}
      {...rest}
    >
      <Avatar
        mt="-10"
        borderWidth="6px"
        borderColor={useColorModeValue("white", "gray.700")}
        size="xl"
        {...avatarProps}
      >
        {avatarProps.uploading && (
          <CircularProgress
            isIndeterminate
            color="twitter.300"
            position={"absolute"}
            size={"6.8rem"}
            thickness={"6px"}
            top={-3}
            left={-3}
          />
        )}
      </Avatar>
      {action && (
        <Box position="absolute" top="4" insetEnd={{ base: "6", md: "8" }}>
          {action}
        </Box>
      )}
      {children}
    </Flex>
  );
};
