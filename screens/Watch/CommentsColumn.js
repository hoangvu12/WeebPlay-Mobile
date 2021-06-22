/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useInfiniteQuery } from "react-query";
import API from "../../api";
import { windowWidth } from "../../constants";
import { LoadingLoader, WarningLoader } from "../../shared/Loader";
import { notifyMessage } from "../../utils";
import { moderateScale } from "../../utils/scale";
import Comment from "./Comment";
import ListColumn from "./ListColumn";

export default function CommentsColumn({ info }) {
  const [isFetchable, setIsFetchable] = useState(true);

  const renderItem = ({ item }) => (
    <Comment {...item}>
      {item.replies.total > 0 &&
        item.replies.data.map((comment) => (
          <Comment {...comment} key={comment.id} />
        ))}
    </Comment>
  );

  const { data, isError, isLoading, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      ["comments", info.id],
      ({ pageParam = { nextPage: 1, isEnd: false }, queryKey }) => {
        const { nextPage, isEnd } = pageParam;

        if (isEnd) setIsFetchable(false);

        // eslint-disable-next-line no-unused-vars
        const [_, animeId] = queryKey;

        return API.getComments(animeId, nextPage);
      },
      {
        getNextPageParam: (lastPage) => ({
          nextPage: lastPage.nextPage,
          isEnd: lastPage.isEnd,
        }),
      }
    );

  const handleEndReached = () => {
    if (isFetchingNextPage || isLoading || !isFetchable) {
      return;
    }

    notifyMessage("Đang tải bình luận...");

    fetchNextPage();
  };

  if (isLoading && !isFetchingNextPage) return <LoadingLoader />;

  if (isError) return <WarningLoader />;

  // console.log(data);

  const list = data.pages.map((page) => page.data).flat();

  return (
    <ListColumn
      title="Bình luận"
      key="episodes"
      data={list}
      keyExtractor={(item) => item.id.toString()}
      initialNumToRender={12}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.05}
      style={styles.column}
    />
  );
}

const styles = StyleSheet.create({
  column: {
    width: windowWidth - moderateScale(30),
  },
});
