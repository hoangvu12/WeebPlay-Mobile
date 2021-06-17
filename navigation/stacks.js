import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import SearchScreen from "../screens/Search";
import WatchScreen from "../screens/Watch";
import { moderateScale } from "../utils/scale";

export const screenOptions = ({ navigation }) => ({
  headerStyle: {
    backgroundColor: "#18191A",
  },
  headerTintColor: "#fff",
  headerRight: () => (
    <TouchableOpacity
      style={{ marginRight: moderateScale(12) }}
      onPress={() => navigation.navigate("Search")}
    >
      <AntDesign name="search1" size={moderateScale(24)} color="white" />
    </TouchableOpacity>
  ),
  headerTitle: (props) => <LogoTitle {...props} />,
  cardStyle: { backgroundColor: "#181818" },
});

export const screens = [
  {
    name: "Watch",
    component: WatchScreen,
    options: {
      headerShown: false,
    },
  },
  {
    name: "Search",
    component: SearchScreen,
    options: {
      headerShown: true,
    },
  },
];

function LogoTitle() {
  return (
    <Image
      style={{ width: moderateScale(145), height: moderateScale(30) }}
      // eslint-disable-next-line no-undef
      source={require("../images/logo.png")}
    />
  );
}

const options = {
  screenOptions: screenOptions,
  initialRouteName: "Tabs",
};

export default options;
