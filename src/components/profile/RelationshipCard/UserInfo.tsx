import { HStack, StackProps, Text, VStack } from "@chakra-ui/react";

interface UserInfoProps extends StackProps {
  name: string;
}

export const UserInfo = (props: UserInfoProps) => {
  const { name, ...stackProps } = props;
  return (
    <VStack spacing="1" flex="1" {...stackProps}>
      <HStack>
        <Text fontWeight="bold">{name}</Text>
      </HStack>
    </VStack>
  );
};
