import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "react-query";
import { createStackNavigator } from "@react-navigation/stack";

import tabs, { options as tabsOptions } from "./tabs";
import screens, { options as screenOptions } from "./screens";

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const Stack = createStackNavigator();

const Tabs = () => (
  <Tab.Navigator {...tabsOptions}>
    {tabs.map((tab) => (
      <Tab.Screen {...tab} key={tab.name} />
    ))}
  </Tab.Navigator>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions} initialRouteName="Tabs">
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          {screens.map((screen) => (
            <Stack.Screen {...screen} key={screen.name} />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
