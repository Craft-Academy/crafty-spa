import { selectAuthUserId } from "@/lib/auth/reducer";
import { AppDispatch, RootState } from "@/lib/create-store";
import { selectLikesByMessage } from "@/lib/timelines/slices/likes.slice";
import { likeMessage } from "@/lib/timelines/usecases/like-message.usecase";
import { unlikeMessage } from "@/lib/timelines/usecases/unlike-message.usecase";

export const createLikeButtonViewModel =
  ({
    messageId,
    dispatch,
    generateLikeId,
  }: {
    messageId: string;
    dispatch: AppDispatch;
    generateLikeId: () => string;
  }) =>
  (state: RootState) => {
    const authUserId = selectAuthUserId(state);
    const likes = selectLikesByMessage(messageId, state);
    const authUserLike = likes.find((l) => l.userId === authUserId);
    const isLikedByAuthUser = authUserLike !== undefined;
    const likeId = isLikedByAuthUser ? authUserLike.id : generateLikeId();
    return {
      likesCount: likes.length,
      isLikedByAuthUser,
      onClick() {
        if (isLikedByAuthUser) {
          return dispatch(unlikeMessage({ likeId, messageId }));
        }
        return dispatch(likeMessage({ likeId, messageId }));
      },
    };
  };
