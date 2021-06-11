import React from "react";
import { TouchableOpacity } from "react-native";

export default function OverlayButton({ icon, disabled, onPress }) {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
}
