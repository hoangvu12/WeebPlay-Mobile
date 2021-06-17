/* eslint-disable react/display-name */

import { AntDesign, Entypo } from "@expo/vector-icons";
import React from "react";
import BrowseStackScreen from "../stacks/Browse";
import HomeStackScreen from "../stacks/Home";

export const screenOptions = {
  activeTintColor: "#FF6500",
  style: {
    backgroundColor: "#000000",
    borderTopWidth: 0,
  },

  showLabel: false,
};

export const screens = [
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

const options = {
  tabBarOptions: screenOptions,
  initialRouteName: "Home",
};

export default options;
