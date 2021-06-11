import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";

import BrowseScreen from "../screens/Browse";

import { options } from "../screens";

const screens = [
  {
    name: "Browse",
    component: BrowseScreen,
  },
];

const Stack = createStackNavigator();

export default function BrowseStackScreen() {
  return (
    <Stack.Navigator initialRouteName="Browse" screenOptions={options}>
      {screens.map((screen) => (
        <Stack.Screen {...screen} key={screen.name} />
      ))}
    </Stack.Navigator>
  );
}
