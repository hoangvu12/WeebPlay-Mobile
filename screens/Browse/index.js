/* eslint-disable react/prop-types */
import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { Dimensions, View } from "react-native";
import {
  MaterialTabBar,
  Tabs,
  useFocusedTab,
} from "react-native-collapsible-tab-view";
import { useInfiniteQuery } from "react-query";
import API from "../../api";
import AnimeCard, { CARD_HEIGHT } from "../../shared/AnimeCard";
import { LoadingLoader, WarningLoader } from "../../shared/Loader";
import { notifyMessage } from "../../utils";
import { moderateScale } from "../../utils/scale";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

const genres = [
  { slug: "hanh-dong", name: "Hành Động" },
  { slug: "vien-tuong", name: "Viễn Tưởng" },
  { slug: "lang-man", name: "Lãng Mạn" },
  { slug: "kinh-di", name: "Kinh Dị" },
  { slug: "vo-thuat", name: "Võ Thuật" },
  { slug: "hai-huoc", name: "Hài Hước" },
  { slug: "truong-hoc", name: "Trường Học" },
  { slug: "trinh-tham", name: "Trinh Thám" },
  { slug: "am-nhac", name: "Âm Nhạc" },
  { slug: "phieu-luu", name: "Phiêu Lưu" },
  { slug: "sieu-nhien", name: "Siêu Nhiên" },
  { slug: "doi-thuong", name: "Đời Thường" },
  { slug: "gia-tuong", name: "Giả Tưởng" },
  { slug: "robot", name: "Robot" },
  { slug: "game", name: "Game" },
  { slug: "the-thao", name: "Thể Thao" },
  { slug: "kich-tinh", name: "Kịch Tính" },
];

export function CardScreen({ slug }) {
  const navigation = useNavigation();

  const focusedTab = useFocusedTab();
  const handleCardPress = (data) => navigation.navigate("Watch", { ...data });

  const getItemLayout = (data, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const renderItem = useCallback(
    ({ item }) => (
      <AnimeCard
        {...item}
        title={item.name}
        containerStyle={{
          marginRight: 20,
          marginBottom: 20,
          width: moderateScale(160),
        }}
        description={item.time}
        onPress={handleCardPress}
      />
    ),
    []
  );

  const { data, isError, isLoading, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      [`animeType-${slug}`, slug],
      ({ pageParam, queryKey }) => {
        const [key, slug] = queryKey;

        return API.getAnimeListFromType(slug, pageParam || 1);
      },
      {
        getNextPageParam: (lastPage, pages) => lastPage.nextPage,
      }
    );

  const handleEndReached = () => {
    notifyMessage("Đang tải dữ liệu.");
    fetchNextPage();
  };

  if (focusedTab !== slug) return <View></View>;

  if (isError) {
    return <WarningLoader />; // use something like https://github.com/chramos/react-native-skeleton-placeholder
  }
  if (isLoading && !isFetchingNextPage) {
    return <LoadingLoader />; // use something like https://github.com/chramos/react-native-skeleton-placeholder
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs.FlatList
        key={slug}
        numColumns={2}
        data={data.pages.map((page) => page.data).flat()}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        getItemLayout={getItemLayout}
        initialNumToRender={24}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
        }}
      />
    </View>
  );
}

export default function BrowseScreen() {
  return (
    <Tabs.Container
      renderTabBar={(props) => (
        <MaterialTabBar
          {...props}
          style={{ backgroundColor: "#18191A" }}
          labelStyle={{ color: "white" }}
          indicatorStyle={{ backgroundColor: "#FF6500" }}
          scrollEnabled={true}
        />
      )}
    >
      {genres.map((genre) => (
        <Tabs.Tab name={genre.slug} label={genre.name} key={genre.slug}>
          <View width={screenWidth} height={screenHeight}>
            <View style={{ flex: 1, paddingTop: 20 }}>
              <CardScreen {...genre} />
            </View>
          </View>
        </Tabs.Tab>
      ))}
    </Tabs.Container>
  );
}
