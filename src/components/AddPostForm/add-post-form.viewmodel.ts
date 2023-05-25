import { AppDispatch } from "@/lib/create-store";
import { postMessage } from "@/lib/timelines/usecases/post-message.usecase";

export const createAddPostFormViewModel = ({
  dispatch,
  messageId,
  timelineId,
  maxCharacters,
  charactersCount,
  setCharactersCount,
}: {
  dispatch: AppDispatch;
  messageId: string;
  timelineId: string;
  maxCharacters: number;
  charactersCount: number;
  setCharactersCount: (newCharactersCount: number) => void;
}) => {
  const hasReachedMaxCount = charactersCount > maxCharacters;
  const canSubmit = charactersCount !== 0 && !hasReachedMaxCount;

  const inputBackroundColor = hasReachedMaxCount ? "red.300" : "white";
  const charCounterColor = hasReachedMaxCount ? "red.300" : "muted";

  return {
    postMessage(text: string) {
      dispatch(
        postMessage({
          messageId,
          timelineId,
          text: text.trim(),
        })
      );
      setCharactersCount(0);
    },
    handleTextChange(newText: string) {
      setCharactersCount(newText.trim().length);
    },
    canSubmit,
    inputBackroundColor,
    charCounterColor,
    remaining: maxCharacters - charactersCount,
  };
};
