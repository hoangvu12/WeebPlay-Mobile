import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";

import BrowseScreen from "../screens/Browse";

import { screenOptions } from "../navigation/stacks";

const screens = [
  {
    name: "Browse",
    component: BrowseScreen,
  },
];

const Stack = createStackNavigator();

export default function BrowseStackScreen() {
  return (
    <Stack.Navigator initialRouteName="Browse" screenOptions={screenOptions}>
      {screens.map((screen) => (
        <Stack.Screen {...screen} key={screen.name} />
      ))}
    </Stack.Navigator>
  );
}
