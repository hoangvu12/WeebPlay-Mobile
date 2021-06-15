import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

export default function InfoButton({
  title,
  titleStyle,
  icon,
  disabled,
  onPress,
  style,
}) {
  return (
    <View
      style={[
        {
          flexDirection: "column",
          alignItems: "center",
        },
        style,
      ]}
    >
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{ marginBottom: 10 }}
      >
        {icon}
      </TouchableOpacity>

      <Text style={[titleStyle]}>{title}</Text>
    </View>
  );
}
