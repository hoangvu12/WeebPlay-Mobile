/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { decodeHTMLEntities } from "../../utils";
import { moderateScale } from "../../utils/scale";

const REGEX = /<[^>]*>/g; // Parse img html tag

export const COMMENT_HEIGHT = moderateScale(80);
export const AVATAR_HEIGHT = 30;
export const AVATAR_WIDTH = 30;

export default function Comment(props) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: props.author.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginRight: 10,
            }}
          >
            {props.author.full_name}
          </Text>

          <Text
            style={{
              color: "gray",
              fontSize: 12,
            }}
          >
            {new Date(props.created_at).toLocaleDateString("vi-VN")}
          </Text>
        </View>
        <Text style={{ color: "white" }}>
          {decodeHTMLEntities(props.content)
            .replace(REGEX, "")
            .replace(new RegExp(" {2}", "g"), " ")
            .trim()}
        </Text>
        <View style={styles.repliesContainer}>{props.children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 5,
    // alignItems: "center",
  },
  repliesContainer: {
    marginTop: 10,
  },
  avatar: {
    marginTop: 5,
    height: AVATAR_HEIGHT,
    width: AVATAR_WIDTH,
    borderRadius: AVATAR_HEIGHT / 2,
    marginRight: 10,
  },
});
