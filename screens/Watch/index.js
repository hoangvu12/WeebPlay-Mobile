/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useQuery, useQueryClient } from "react-query";
import API from "../../api";
import useOrientation from "../../hooks/useOrientation";
import AnimeCard from "../../shared/AnimeCard";
import { LoadingLoader, WarningLoader } from "../../shared/Loader";
import { moderateScale } from "../../utils/scale";
import Video from "./Video";

const { width: screenWidth } = Dimensions.get("screen");

export default function Watch({ route }) {
  const [episode, setEpisode] = useState(1);
  const [showNumber, setShowNumber] = useState(24);

  const { slug } = route.params;

  const navigation = useNavigation();

  const handleEpisodeCardPress = (data) => setEpisode(data.name);
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

  const handleAnimeCardPress = (data) =>
    navigation.replace("Watch", { ...data });

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
    []
  );

  const handleAnimeItem = useCallback(
    ({ item }) => (
      <AnimeCard
        {...item}
        containerStyle={{
          marginRight: 20,
          marginBottom: 20,
        }}
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
      enabled: !!animeId,
    }
  );

  const handleEndReached = () => {
    if (showNumber >= animeInfo.episodes.length) return;

    setShowNumber((number) => number + 12);
  };

  const orientation = useOrientation();

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
            <ScrollView style={styles.column}>
              <View style={{ marginBottom: moderateScale(20) }}>
                <Text
                  style={{
                    fontSize: moderateScale(16),
                    fontWeight: "bold",
                    color: "#E2610E",
                  }}
                  numberOfLines={1}
                >
                  {animeInfo.name}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
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
                  Thể loại
                </Text>
                <Text
                  style={{
                    fontSize: moderateScale(12),
                    color: "gray",
                  }}
                  numberOfLines={1}
                >
                  {animeInfo.genres.join(", ")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: moderateScale(10),
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
                  {animeInfo.views}
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    fontSize: moderateScale(14),
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: moderateScale(20),
                  }}
                  numberOfLines={1}
                >
                  Nội dung
                </Text>

                <View
                  style={{
                    width: screenWidth - moderateScale(25),
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: moderateScale(12),
                    }}
                  >
                    {animeInfo.description}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <ScrollView
              style={styles.column}
              contentContainerStyle={{ flex: 1 }}
            >
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
                keyExtractor={(item, index) => index}
                onEndReached={handleEndReached}
                onEndReachedThreshold={1}
              />
            </ScrollView>
            <ScrollView
              style={styles.column}
              contentContainerStyle={{ flex: 1 }}
            >
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
                keyExtractor={(item, index) => index}
              />
            </ScrollView>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

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
