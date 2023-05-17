import { PostList } from "@/components/PostList";
import { TimelineDivider } from "@/components/TimelineDivider";
import { useSelector } from "react-redux";
import { HomeViewModelType, selectHomeViewModel } from "./home.viewmodel";
import { RootState } from "@/lib/create-store";
import { ReactNode } from "react";
import { exhaustiveGuard } from "@/lib/common/utils/exhaustive-guard";
import { Text } from "@chakra-ui/react";

export const Home = () => {
  const viewModel = useSelector<
    RootState,
    ReturnType<typeof selectHomeViewModel>
  >((rootState) =>
    selectHomeViewModel(rootState, () => new Date().toISOString())
  );

  const timelineNode: ReactNode = (() => {
    switch (viewModel.timeline.type) {
      case HomeViewModelType.NoTimeline:
        return null;
      case HomeViewModelType.LoadingTimeline:
        return <Text>{viewModel.timeline.info}</Text>;
      case HomeViewModelType.EmptyTimeline:
        return <Text>{viewModel.timeline.info}</Text>;
      case HomeViewModelType.WithMessages:
        return <PostList messages={viewModel.timeline.messages} />;
      default:
        return exhaustiveGuard(viewModel.timeline);
    }
  })();

  return (
    <>
      <TimelineDivider text="For you" />
      {timelineNode}
    </>
  );
};
