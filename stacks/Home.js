import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";

import { screenOptions } from "../navigation/stacks";

import HomeScreen from "../screens/Home";

const screens = [
  {
    name: "Home",
    component: HomeScreen,
  },
];

const Stack = createStackNavigator();

export default function HomeStackScreen() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      {screens.map((screen) => (
        <Stack.Screen {...screen} key={screen.name} />
      ))}
    </Stack.Navigator>
  );
}
