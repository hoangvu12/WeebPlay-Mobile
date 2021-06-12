/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import { useQuery, useQueryClient } from "react-query";
import API from "../../api";
import useOrientation from "../../hooks/useOrientation";
import AnimeCard, { CARD_HEIGHT } from "../../shared/AnimeCard";
import {
  LoadingLoader,
  WarningLoader,
  DialogLoader,
} from "../../shared/Loader";
import { numberWithCommas } from "../../utils";
import { moderateScale } from "../../utils/scale";
import Video from "./Video";

const { width: screenWidth } = Dimensions.get("screen");

export default function Watch({ route }) {
  const [episode, setEpisode] = useState(1);
  const [showNumber, setShowNumber] = useState(24);

  const { slug } = route.params;

  const navigation = useNavigation();

  const getItemLayout = (data, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const handleEpisodeCardPress = (data) => setEpisode(data.name);
  const handleAnimeCardPress = (data) =>
    navigation.replace("Watch", { ...data });

  const handleNextPress = async (video) => {
    await video.current.pauseAsync();

    setEpisode(episode + 1);
  };
  const handlePreviousPress = async (video) => {
    await video.current.pauseAsync();

    setEpisode(episode - 1);
  };

  const queryClient = useQueryClient();
  const animeList = queryClient.getQueryData("animeList");

  const handleEpisodeItem = useCallback(
    ({ item }) => (
      <AnimeCard
        containerStyle={{
          marginRight: 20,
          marginBottom: 20,
        }}
        title={item.detail_name || item.full_name}
        titleStyle={{ color: item.name === episode ? "#FF6500" : "white" }}
        thumbnail={item.thumbnail_medium}
        description={item.full_name}
        onPress={handleEpisodeCardPress}
        {...item}
      />
    ),
    [episode]
  );

  const handleAnimeItem = useCallback(
    ({ item }) => (
      <AnimeCard
        {...item}
        containerStyle={{
          marginRight: 20,
          marginBottom: 20,
        }}
        title={item.name}
        description={item.episode || item.time}
        onPress={handleAnimeCardPress}
      />
    ),
    []
  );

  const {
    isLoading: isAnimeLoading,
    isError: isAnimeError,
    data: animeInfo,
  } = useQuery(["animeInfo", slug], ({ queryKey }) => {
    const [_, animeSlug] = queryKey;

    return API.getAnimeInfo(animeSlug);
  });

  const animeId = animeInfo?.id;

  // Get video source when animeId is available
  const {
    isIdle,
    data: episodeInfo,
    isLoading: isEpisodeLoading,
    isError: isEpisodeError,
  } = useQuery(
    ["episodeInfo", { animeId, episode }],
    ({ queryKey }) => {
      const [_, { animeId, episode }] = queryKey;

      return API.getEpisodeInfo(animeId, episode);
    },
    {
      enabled: !!animeId && animeInfo.episodes.length > 0,
    }
  );

  const handleEndReached = () => {
    if (showNumber >= animeInfo.episodes.length) return;

    setShowNumber((number) => number + 12);
  };

  const orientation = useOrientation();

  // If there is no episode, it means the anime is upcoming
  if (!isAnimeLoading && animeInfo.episodes.length === 0) {
    return (
      <DialogLoader
        text="Đây là phim sắp chiếu! Hãy quay lại sau"
        buttonTitle="Quay về"
        onPress={() => navigation.goBack()}
      />
    );
  }

  if (isAnimeLoading || isEpisodeLoading || isIdle) {
    return <LoadingLoader />;
  }

  if (isAnimeError || isEpisodeError) {
    return <WarningLoader />;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={styles.videoContainer}>
        <Video
          source={episodeInfo.videoSource}
          topOverlayTitle={animeInfo.name}
          topOverlayDescription={`Tập ${episode}`}
          onPreviousPress={handlePreviousPress}
          onNextPress={handleNextPress}
          previousButtonDisable={episode <= 1}
          nextButtonDisable={episode >= animeInfo.episodes.length}
        />
      </View>
      {orientation !== "LANDSCAPE" && (
        <View style={styles.infoContainer}>
          <ScrollView horizontal style={{ flex: 1 }}>
            <Column
              as={ScrollView}
              style={{
                width: screenWidth - moderateScale(25),
              }}
            >
              <InfoColumn info={animeInfo} />
            </Column>

            <Column>
              <Text
                style={{
                  color: "white",
                  fontSize: moderateScale(18),
                  fontWeight: "bold",
                  paddingBottom: 14,
                }}
              >
                Tập phim
              </Text>

              <FlatList
                key="episodes"
                numColumns={2}
                data={animeInfo.episodes.slice(0, showNumber)}
                renderItem={handleEpisodeItem}
                keyExtractor={(item) => item.id}
                onEndReached={handleEndReached}
                onEndReachedThreshold={1}
                initialNumToRender={12}
                getItemLayout={getItemLayout}
                columnWrapperStyle={{ flex: 1, justifyContent: "center" }}
              />
            </Column>

            <Column>
              <Text
                style={{
                  color: "white",
                  fontSize: moderateScale(18),
                  fontWeight: "bold",
                  paddingBottom: 14,
                }}
              >
                Hôm nay xem gì
              </Text>

              <FlatList
                key="recommended"
                numColumns={2}
                data={animeList.recommended}
                renderItem={handleAnimeItem}
                keyExtractor={(item) => item.id}
                initialNumToRender={12}
                getItemLayout={getItemLayout}
                columnWrapperStyle={{ flex: 1, justifyContent: "center" }}
              />
            </Column>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const Column = ({ as: Component = View, children, style }) => (
  <Component style={[styles.column, style]}>{children}</Component>
);

const InfoColumn = ({ info }) => (
  <>
    <View style={{ marginBottom: moderateScale(20) }}>
      <Text
        style={{
          fontSize: moderateScale(16),
          fontWeight: "bold",
          color: "#E2610E",
        }}
        numberOfLines={1}
      >
        {info.name}
      </Text>
    </View>

    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
      }}
    >
      <Text
        style={{
          fontSize: moderateScale(14),
          fontWeight: "bold",
          color: "white",
          marginRight: moderateScale(20),
        }}
        numberOfLines={1}
      >
        Thời lượng
      </Text>
      <Text
        style={{
          fontSize: moderateScale(12),
          color: "gray",
        }}
        numberOfLines={1}
      >
        {info.time}
      </Text>
    </View>
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
      }}
    >
      <Text
        style={{
          fontSize: moderateScale(14),
          fontWeight: "bold",
          color: "white",
          marginRight: moderateScale(20),
        }}
        numberOfLines={1}
      >
        Lượt xem
      </Text>
      <Text
        style={{
          fontSize: moderateScale(12),
          color: "gray",
        }}
        numberOfLines={1}
      >
        {numberWithCommas(info.views)} lượt xem
      </Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
  },
  infoContainer: {
    flex: 2,
  },
  column: {
    flex: 1,
    padding: moderateScale(20),
  },
});
