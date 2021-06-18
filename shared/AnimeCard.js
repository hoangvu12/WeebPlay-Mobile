/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "../utils/scale";
import CachedImage from "./CachedImage";

const AnimeCard = React.memo(
  ({
    containerStyle,
    titleStyle,
    imageStyle,
    descriptionStyle,
    onPress,
    innerStyle,
    ...props
  }) => {
    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity
          onPress={() => onPress({ ...props })}
          style={[innerStyle]}
        >
          <CachedImage
            source={{
              uri: props.thumbnail,
            }}
            style={[styles.image, imageStyle]}
          />

          <Text
            style={[styles.title, { fontSize: moderateScale(13) }, titleStyle]}
            numberOfLines={1}
          >
            {props.title}
          </Text>

          {props.description && (
            <Text
              style={[
                styles.description,
                { fontSize: moderateScale(10) },
                descriptionStyle,
              ]}
              numberOfLines={1}
            >
              {props.description}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
);

export default AnimeCard;

export const CARD_HEIGHT = moderateScale(80);

const styles = StyleSheet.create({
  container: {
    width: moderateScale(150),
  },
  image: {
    resizeMode: "cover",
    width: "100%",
    height: CARD_HEIGHT,
    marginBottom: moderateScale(10),
    borderRadius: 7,
  },
  title: {
    color: "#fff",
    marginBottom: moderateScale(2),
  },
  description: {
    color: "#9CA3AF",
    fontSize: moderateScale(10),
  },
});
