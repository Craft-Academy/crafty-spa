import { Button } from "@chakra-ui/react";
import { AiOutlineHeart } from "react-icons/ai";

export const LikeButton = () => {
  return (
    <Button
      leftIcon={<AiOutlineHeart />}
      colorScheme="pink"
      variant="ghost"
      m={0}
      maxWidth={20}
    >
      42
    </Button>
  );
};
