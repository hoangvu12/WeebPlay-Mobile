import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import HomeStackScreen from "./stacks/Home";
import BrowseStackScreen from "./stacks/Browse";

const tabs = [
  {
    name: "Home",
    component: HomeStackScreen,
    options: {
      tabBarIcon: ({ color, size }) => (
        <AntDesign name="home" size={size} color={color} />
      ),
    },
  },
  {
    name: "Browse",
    component: BrowseStackScreen,
    options: {
      tabBarIcon: ({ color, size }) => (
        <Entypo name="menu" size={size} color={color} />
      ),
    },
  },
];

export const tabScreenOptions = {
  activeTintColor: "#FF6500",
  style: {
    backgroundColor: "#000000",
    borderTopWidth: 0,
  },

  showLabel: false,
};

export const options = {
  tabBarOptions: tabScreenOptions,
  initialRouteName: "Home",
};

export default tabs;
