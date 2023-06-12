import { Button } from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { createLikeButtonViewModel } from "./like-button.viewmodel";
import { nanoid } from "@reduxjs/toolkit";
import { AppDispatch } from "@/lib/create-store";

const generateLikeId = () => nanoid();

export const LikeButton = ({ messageId }: { messageId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const viewModel = useSelector(
    createLikeButtonViewModel({ messageId, dispatch, generateLikeId })
  );
  return (
    <Button
      leftIcon={
        viewModel.isLikedByAuthUser ? <AiFillHeart /> : <AiOutlineHeart />
      }
      colorScheme="pink"
      variant="ghost"
      onClick={viewModel.onClick}
      m={0}
      maxWidth={20}
    >
      {viewModel.likesCount}
    </Button>
  );
};
