/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useQuery } from "react-query";
import API from "../../api";
import AnimeCard, { CARD_HEIGHT } from "../../shared/AnimeCard";
import { LoadingLoader, WarningLoader } from "../../shared/Loader";
import Section from "../../shared/Section";
import { moderateScale } from "../../utils/scale";
import Storage from "../../utils/Storage";
import CarouselCard from "./AnimeCarouselCard";

const { width: screenWidth } = Dimensions.get("screen");

const storageKey = "recently-watched";

export default function Home({ navigation }) {
  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setIsFetchingData(true);

      // Storage.clear();

      const items = await Storage.find(storageKey);

      setRecentlyWatched(items);
      setIsFetchingData(false);
    };

    getData();
  }, []);

  const { isLoading, isError, data } = useQuery("animeList", API.getAnimeList);

  const getItemLayout = (data, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const handleCardPress = (data) => navigation.navigate("Watch", { ...data });

  const renderCarouselItem = ({ item }) => (
    <CarouselCard {...item} onPress={handleCardPress} />
  );

  const renderSectionItem = ({ item }) => (
    <AnimeCard
      {...item}
      title={item.name}
      containerStyle={{ marginRight: moderateScale(20) }}
      description={item.time}
      onPress={handleCardPress}
    />
  );

  if (isLoading || isFetchingData) {
    return <LoadingLoader />;
  }

  if (isError) {
    return <WarningLoader />;
  }

  const sections = [
    { title: "Xem gần đây", items: recentlyWatched },
    { title: "Mới cập nhật", items: data.latest },
    { title: "Anime đề cử", items: data.recommended },
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <Carousel
          data={data.slide}
          renderItem={renderCarouselItem}
          sliderWidth={screenWidth - 40}
          itemWidth={screenWidth - 20}
          loop
          autoplay
        />
      </View>

      <View style={{ flex: 2 }}>
        <ScrollView>
          {sections.map((section) => {
            return (
              section.items.length !== 0 && (
                <Section
                  style={{ marginBottom: moderateScale(20) }}
                  title={section.title}
                  key={section.title}
                >
                  <FlatList
                    horizontal
                    data={section.items}
                    renderItem={renderSectionItem}
                    keyExtractor={(item, index) => index.toString()}
                    getItemLayout={getItemLayout}
                    initialNumToRender={12}
                  />
                </Section>
              )
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
  },
});
