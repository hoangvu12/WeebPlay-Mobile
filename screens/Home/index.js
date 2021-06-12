/* eslint-disable react/prop-types */
import React from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useQuery } from "react-query";
import { OptimizedFlatList } from "react-native-optimized-flatlist";

import API from "../../api";

import AnimeCard, { CARD_HEIGHT } from "../../shared/AnimeCard";
import { LoadingLoader, WarningLoader } from "../../shared/Loader";
import Section from "../../shared/Section";

import { moderateScale } from "../../utils/scale";
import CarouselCard from "./AnimeCarouselCard";

const { width: screenWidth } = Dimensions.get("screen");

export default function Home({ navigation }) {
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

  if (isLoading) {
    return <LoadingLoader />;
  }

  if (isError) {
    return <WarningLoader />;
  }

  const sections = [
    { title: "Mới cập nhật", items: data.latest },
    { title: "Anime đề cử", items: data.recommended },
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
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
          {sections.map((section, index) => (
            <Section
              style={{ marginBottom: moderateScale(20) }}
              title={section.title}
              key={index}
            >
              <FlatList
                horizontal
                data={section.items}
                renderItem={renderSectionItem}
                keyExtractor={(item) => item.slug}
                getItemLayout={getItemLayout}
                initialNumToRender={12}
              />
            </Section>
          ))}
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
