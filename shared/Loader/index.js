import React from "react";
import AnimatedLoader from "react-native-animated-loader";
import { StyleSheet, Text, LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);

export default function Loader({
  text,
  textStyle,
  visible = true,
  animationStyle,
}) {
  return (
    <AnimatedLoader
      visible={visible}
      overlayColor="rgba(0, 0, 0, 0.25)"
      source={animationStyle || require("./loading.json")}
      animationStyle={styles.lottie}
      speed={1}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </AnimatedLoader>
  );
}

export function WarningLoader() {
  return (
    <Loader
      text="Lỗi hệ thống"
      visible
      animationStyle={require("./warning.json")}
    />
  );
}

export function LoadingLoader() {
  return <Loader text="Vui lòng chờ" visible />;
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  text: {
    color: "#fff",
  },
});
