import { AppDispatch, createTestStore } from "@/lib/create-store";
import { stateBuilder } from "@/lib/state-builder";
import { describe, it, expect, vitest } from "vitest";
import { createLikeButtonViewModel } from "../like-button.viewmodel";
import { likeMessage } from "@/lib/timelines/usecases/like-message.usecase";
import { unlikeMessage } from "@/lib/timelines/usecases/unlike-message.usecase";

const createTestLikeButtonViewModel = ({
  messageId,
  dispatch = vitest.fn(),
  generateLikeId = () => "42",
}: {
  messageId: string;
  dispatch?: AppDispatch;
  generateLikeId?: () => string;
}) => createLikeButtonViewModel({ messageId, dispatch, generateLikeId });

describe("Like Button view model", () => {
  it("should return the likes count for the post", () => {
    const store = createTestStore(
      {},
      stateBuilder()
        .withLikes([
          {
            id: "alice-like-id",
            messageId: "m1",
            userId: "alice-id",
          },
          {
            id: "bob-like-id",
            messageId: "m1",
            userId: "bob-id",
          },
          {
            id: "bob-like-id",
            messageId: "m2",
            userId: "bob-id",
          },
        ])
        .build()
    );

    const viewModel = createTestLikeButtonViewModel({ messageId: "m1" })(
      store.getState()
    );

    expect(viewModel.likesCount).toEqual(2);
  });

  it("should know if the message is liked by auth user or not", () => {
    const store = createTestStore(
      {},
      stateBuilder()
        .withAuthUser({ authUser: "bob-id" })
        .withLikes([
          {
            id: "alice-like-id",
            messageId: "m1",
            userId: "alice-id",
          },
          {
            id: "bob-like-id",
            messageId: "m1",
            userId: "bob-id",
          },
          {
            id: "bob-like-id",
            messageId: "m2",
            userId: "bob-id",
          },
        ])
        .build()
    );

    const viewModel = createTestLikeButtonViewModel({ messageId: "m1" })(
      store.getState()
    );

    expect(viewModel.isLikedByAuthUser).toBe(true);
  });

  it("should dispatch likeMessage use case if the message was not liked by the user", async () => {
    const store = createTestStore(
      {},
      stateBuilder()
        .withAuthUser({ authUser: "bob-id" })
        .withLikes([
          {
            id: "alice-like-id",
            messageId: "m1",
            userId: "alice-id",
          },
        ])
        .build()
    );
    const viewModel = createTestLikeButtonViewModel({
      messageId: "m1",
      dispatch: store.dispatch,
      generateLikeId() {
        return "bob-like-id";
      },
    })(store.getState());

    await viewModel.onClick();

    expect(store.getDispatchedUseCaseArgs(likeMessage)).toEqual({
      likeId: "bob-like-id",
      messageId: "m1",
    });
  });

  it("should dispatch unlikeMessage use case if the message was liked by the user", async () => {
    const store = createTestStore(
      {},
      stateBuilder()
        .withAuthUser({ authUser: "bob-id" })
        .withLikes([
          {
            id: "bob-like-id",
            messageId: "m1",
            userId: "bob-id",
          },
        ])
        .build()
    );
    const viewModel = createTestLikeButtonViewModel({
      messageId: "m1",
      dispatch: store.dispatch,
    })(store.getState());

    await viewModel.onClick();

    expect(store.getDispatchedUseCaseArgs(unlikeMessage)).toEqual({
      likeId: "bob-like-id",
      messageId: "m1",
    });
  });
});
