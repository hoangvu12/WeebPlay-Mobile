/* eslint-disable react/prop-types */
import React, { useCallback, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";
import API from "../../api";
import AnimeCard, { CARD_HEIGHT } from "../../shared/AnimeCard";
import { LoadingLoader } from "../../shared/Loader";
import { moderateScale } from "../../utils/scale";

const DEBOUNCE_TIME = 1500; // Milliseconds

export default function Search({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const debounce = useRef(null);

  const search = async (searchQuery) => {
    if (!searchQuery) return;

    setIsLoading(true);

    const data = await API.searchAnime(searchQuery);

    setSearchResults(data);
    setIsLoading(false);
  };

  const getItemLayout = (data, index) => ({
    length: CARD_HEIGHT,
    offset: CARD_HEIGHT * index,
    index,
  });

  const handleCardPress = (data) => navigation.navigate("Watch", { ...data });

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

  const onChangeSearch = (query) => {
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]);

      return;
    }

    if (debounce.current) {
      clearTimeout(debounce.current);
    }

    debounce.current = setTimeout(() => search(query), DEBOUNCE_TIME);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        inputStyle={styles.inputStyle}
        style={styles.searchBarStyle}
        theme={{ colors: { text: "white", placeholder: "gray" } }}
      />
      <View style={styles.resultsContainer}>
        {isLoading ? (
          <LoadingLoader />
        ) : (
          <FlatList
            key={"search"}
            numColumns={2}
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id}
            getItemLayout={getItemLayout}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  inputStyle: {
    backgroundColor: "#000000",
  },
  searchBarStyle: {
    backgroundColor: "#000000",
    marginBottom: 20,
  },
});
