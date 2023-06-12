import { postMessage as postMessageUseCase } from "@/lib/timelines/usecases/post-message.usecase";
import { describe, test, expect, vitest } from "vitest";
import { createAddPostFormViewModel } from "../add-post-form.viewmodel";
import { AppDispatch, RootState, createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";

const createTestAddPostFormViewModel = ({
  dispatch = vitest.fn(),
  messageId = "",
  timelineId = "",
  maxCharacters = Infinity,
  charactersCount = 42,
  setCharactersCount = () => {
    return;
  },
  state = stateBuilder().build(),
}: {
  dispatch?: AppDispatch;
  messageId?: string;
  timelineId?: string;
  maxCharacters?: number;
  charactersCount?: number;
  setCharactersCount?: (newCharactersCount: number) => void;
  state?: RootState;
} = {}) =>
  createAddPostFormViewModel({
    dispatch,
    messageId,
    timelineId,
    maxCharacters,
    charactersCount,
    setCharactersCount,
  })(state);

describe("AddPostForm view model", () => {
  test("postMessage correctly dispatches the postMessage use case", () => {
    const store = createTestStore();
    const { postMessage } = createTestAddPostFormViewModel({
      messageId: "message-id",
      timelineId: "alice-timeline-id",
      dispatch: store.dispatch,
    });

    postMessage("Hello World");

    expect(store.getDispatchedUseCaseArgs(postMessageUseCase)).toEqual({
      messageId: "message-id",
      timelineId: "alice-timeline-id",
      text: "Hello World",
    });
  });

  test("postMessage correctly dispatches the postMessage use case with trimmed message text", () => {
    const store = createTestStore();
    const { postMessage } = createTestAddPostFormViewModel({
      messageId: "message-id",
      timelineId: "alice-timeline-id",
      dispatch: store.dispatch,
    });

    postMessage("   Hello World   ");

    expect(store.getDispatchedUseCaseArgs(postMessageUseCase)).toEqual({
      messageId: "message-id",
      timelineId: "alice-timeline-id",
      text: "Hello World",
    });
  });

  test("characters count is reset when posting the message", () => {
    let charactersCount = 42;
    const { postMessage } = createTestAddPostFormViewModel({
      setCharactersCount: (newCharactersCount) => {
        charactersCount = newCharactersCount;
      },
    });

    postMessage("Hello World");

    expect(charactersCount).toEqual(0);
  });

  test("cannot post a message if text is empty", () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      charactersCount: 0,
    });

    expect(canSubmit).toBe(false);
  });

  test("can post a message if text is not empty", () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      charactersCount: 1,
    });

    expect(canSubmit).toBe(true);
  });

  test("can post a message if text size is inferior to max characters allowed", () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      maxCharacters: 100,
      charactersCount: 99,
    });

    expect(canSubmit).toBe(true);
  });

  test("can post a message if text size is equal to max characters allowed", () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      maxCharacters: 100,
      charactersCount: 100,
    });

    expect(canSubmit).toBe(true);
  });

  test("returns the remaining characters", () => {
    expect(
      createTestAddPostFormViewModel({
        maxCharacters: 10,
        charactersCount: 0,
      }).remaining
    ).toEqual(10);

    expect(
      createTestAddPostFormViewModel({
        maxCharacters: 10,
        charactersCount: 1,
      }).remaining
    ).toEqual(9);

    expect(
      createTestAddPostFormViewModel({
        maxCharacters: 20,
        charactersCount: 30,
      }).remaining
    ).toEqual(-10);
  });

  test("can handle new text size on input changed", () => {
    let charactersCount = 0;
    const { handleTextChange } = createTestAddPostFormViewModel({
      setCharactersCount: (newCharactersCount) => {
        charactersCount = newCharactersCount;
      },
    });

    handleTextChange("Hello World");

    expect(charactersCount).toEqual(11);
  });

  test("leading and trailing spaces should not be added to the characters count", () => {
    let charactersCount = 0;
    const { handleTextChange } = createTestAddPostFormViewModel({
      setCharactersCount: (newCharactersCount) => {
        charactersCount = newCharactersCount;
      },
    });

    handleTextChange("   Hello World   ");

    expect(charactersCount).toEqual(11);
  });

  test("should notify visually about maximum characters being reached if current count is over max count", () => {
    const { inputBackroundColor, charCounterColor } =
      createTestAddPostFormViewModel({
        maxCharacters: 99,
        charactersCount: 100,
      });

    expect(inputBackroundColor).toEqual("red.300");
    expect(charCounterColor).toEqual("red.300");
  });

  test("should not notify visually about maximum characters being reached if current count is inferior to max count", () => {
    const { inputBackroundColor, charCounterColor } =
      createTestAddPostFormViewModel({
        maxCharacters: 100,
        charactersCount: 99,
      });

    expect(inputBackroundColor).toEqual("white");
    expect(charCounterColor).toEqual("muted");
  });

  test("should not notify about maximum characters being reached if current count is equal to max count", () => {
    const { inputBackroundColor, charCounterColor } =
      createTestAddPostFormViewModel({
        maxCharacters: 100,
        charactersCount: 100,
      });

    expect(inputBackroundColor).toEqual("white");
    expect(charCounterColor).toEqual("muted");
  });

  test("should return the auth user profile picture and profile url", () => {
    const state = stateBuilder()
      .withAuthUser({
        authUser: {
          id: "alice-id",
          profilePicture: "alice.png",
          username: "Alice",
        },
      })
      .build();

    const viewModel = createTestAddPostFormViewModel({ state });

    expect(viewModel.authUser).toEqual({
      profilePicture: "alice.png",
      profileUrl: "/u/alice-id",
    });
  });
});
