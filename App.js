import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import screens, { options as screenOptions } from "./screens";
import { LoadingLoader } from "./shared/Loader";
import tabs, { options as tabsOptions } from "./tabs";

const prefix = Linking.createURL("/");

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
  // useEffect(() => {
  //   Linking.getInitialURL().then((url) => {
  //     console.log(Linking.parse(url), "initialUrl");
  //   });

  //   const handleUrl = (event) => {
  //     const data = Linking.parse(event.url);

  //     console.log(data);
  //   };

  //   Linking.addEventListener("url", handleUrl);

  //   return () => Linking.removeEventListener("url", handleUrl);
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer linking={linking} fallback={<LoadingLoader />}>
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
