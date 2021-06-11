/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { moderateScale } from "../utils/scale";

export default function Section({
  style,
  children,
  title,
  titleStyle,
  showMoreButton = true,
}) {
  return (
    <View style={style}>
      <Section.Header style={styles.sectionHeader}>
        <Text style={[styles.text, styles.sectionTitle, titleStyle]}>
          {title}
        </Text>

        {showMoreButton && (
          <TouchableOpacity>
            <Text style={{ color: "#9CA3AF", fontSize: moderateScale(14) }}>
              Tất cả
            </Text>
          </TouchableOpacity>
        )}
      </Section.Header>
      <Section.Body>{children}</Section.Body>
    </View>
  );
}

Section.Header = ({ children, style }) => <View style={style}>{children}</View>;

Section.Body = ({ children, style }) => <View style={style}>{children}</View>;

const styles = StyleSheet.create({
  sectionHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    flexDirection: "row",
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
  },
});
