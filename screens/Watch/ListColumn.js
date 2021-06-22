/* eslint-disable react/prop-types */
import React from "react";
import { FlatList, Text } from "react-native";
import { moderateScale } from "../../utils/scale";
import Column from "./Column";

export default function ListColumn({ title, style, ...props }) {
  return (
    <Column style={style}>
      <Text
        style={{
          color: "white",
          fontSize: moderateScale(18),
          fontWeight: "bold",
          paddingBottom: 14,
        }}
      >
        {title}
      </Text>

      <FlatList {...props} />
    </Column>
  );
}
