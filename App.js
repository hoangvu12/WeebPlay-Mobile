import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { LoadingLoader } from "./shared/Loader";

import tabOptions, { screens as tabScreens } from "./navigation/tabs";
import stackOptions, { screens as stackScreens } from "./navigation/stacks";

const prefix = Linking.createURL("/");

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const Stack = createStackNavigator();

const Tabs = () => (
  <Tab.Navigator {...tabOptions}>
    {tabScreens.map((tab) => (
      <Tab.Screen {...tab} key={tab.name} />
    ))}
  </Tab.Navigator>
);

export default function App() {
  const config = {
    screens: {
      Watch: "watch/:slug",
      Tabs: {
        screens: {
          Home: "/",
          Browse: "browse",
        },
      },
    },
  };

  const linking = {
    prefixes: [prefix],
    config,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer linking={linking} fallback={<LoadingLoader />}>
        <Stack.Navigator {...stackOptions}>
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          {stackScreens.map((screen) => (
            <Stack.Screen {...screen} key={screen.name} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
