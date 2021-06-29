/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { useQuery, useQueryClient } from "react-query";
import API from "../../api";
import useOrientation from "../../hooks/useOrientation";
import AnimeCard, { CARD_HEIGHT } from "../../shared/AnimeCard";
import {
  DialogLoader,
  LoadingLoader,
  WarningLoader,
} from "../../shared/Loader";
import { moderateScale } from "../../utils/scale";
import Storage from "../../utils/Storage";
import Column from "./Column";
import CommentsColumn from "./CommentsColumn";
import InfoColumn from "./InfoColumn";
import ListColumn from "./ListColumn";
import Video from "./Video";

const storageKey = "recently-watched";

export default function Watch({ route }) {
  const [episode, setEpisode] = useState(1);
  const [showNumber, setShowNumber] = useState(24);

  const { slug } = route.params;

  const navigation = useNavigation();

  useEffect(() => {
    const setStoredEpisode = async () => {
      try {
        const storedData = await Storage.findOne(storageKey, { slug });

        // if object is not empty
        if (JSON.stringify(storedData) !== "{}") {
          setEpisode(storedData.episode);
        }
      } catch (err) {
        // console.log(err);
      }
    };

    setStoredEpisode();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        const data = { ...route.params, episode };

        await Storage.update(storageKey, { slug }, data);
      } catch (err) {
        // console.log(err);
      }
    };

    storeData();
  }, [episode]);

  const getItemLayout = (_, index) => ({
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

  const currentEpisode = animeInfo.episodes[episode - 1];

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={styles.videoContainer}>
        <Video
          source={episodeInfo.videoSource}
          topOverlayTitle={animeInfo.name}
          topOverlayDescription={currentEpisode.full_name}
          isTopOverlayEnabled={orientation === "LANDSCAPE"}
          onPreviousPress={handlePreviousPress}
          onNextPress={handleNextPress}
          previousButtonDisable={episode <= 1}
          nextButtonDisable={episode >= animeInfo.episodes.length}
        />
      </View>
      <View
        style={[
          styles.infoContainer,
          { display: orientation === "LANDSCAPE" ? "none" : "flex" },
        ]}
      >
        <ScrollView horizontal style={{ flex: 1 }}>
          {/* Anime info column */}
          <InfoColumn info={animeInfo} />

          {/* Episode column */}
          <ListColumn
            key="episodes"
            numColumns={2}
            data={animeInfo.episodes.slice(0, showNumber)}
            renderItem={handleEpisodeItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleEndReached}
            onEndReachedThreshold={1}
            initialNumToRender={12}
            getItemLayout={getItemLayout}
            columnWrapperStyle={{ flex: 1, justifyContent: "center" }}
            title="Tập phim"
          />

          {/* Recommended anime list column */}
          {animeList && (
            <ListColumn
              key="recommended"
              numColumns={2}
              data={animeList.recommended}
              renderItem={handleAnimeItem}
              keyExtractor={(item) => item.id.toString()}
              initialNumToRender={12}
              getItemLayout={getItemLayout}
              columnWrapperStyle={{ flex: 1, justifyContent: "center" }}
              title="Hôm nay xem gì"
            />
          )}

          {/* Comments column */}
          <CommentsColumn info={animeInfo} />
        </ScrollView>
      </View>
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
});
