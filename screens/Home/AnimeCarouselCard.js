import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { moderateScale } from "../../utils/scale";

export default function AnimeCarouselCard({ onPress, ...props }) {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => onPress({ ...props })}>
        <Image
          source={{
            uri: props.thumbnail,
          }}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
    borderRadius: 7,
  },
});
