import React from "react";
import AnimatedLoader from "react-native-animated-loader";
import { StyleSheet, Text, LogBox, Button } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);

export const animations = {
  loading: require("./loading.json"),
  warning: require("./warning.json"),
};

export default function Loader({
  text,
  textStyle,
  visible = true,
  animationStyle,
  children,
}) {
  return (
    <AnimatedLoader
      visible={visible}
      overlayColor="rgba(0, 0, 0, 0.25)"
      source={animationStyle || animations.loading}
      animationStyle={styles.lottie}
      speed={1}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
      {children}
    </AnimatedLoader>
  );
}

export function DialogLoader({
  onPress,
  text,
  buttonTitle = "OK",
  buttonColor = "#FF6500",
  animationStyle,
}) {
  return (
    <Loader
      text={text || "Lỗi hệ thống"}
      textStyle={{ marginBottom: 10 }}
      visible
      animationStyle={animationStyle || animations.warning}
    >
      <Button title={buttonTitle} color={buttonColor} onPress={onPress} />
    </Loader>
  );
}

export function WarningLoader({ text }) {
  return (
    <Loader
      text={text || "Lỗi hệ thống"}
      visible
      animationStyle={animations.warning}
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
