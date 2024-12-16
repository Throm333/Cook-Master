import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import CreateRecipescreen from "../screens/CreateRecipescreen";
import Weekplanerscreen from "../screens/Weekplanerscreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import Homescreen from "../screens/Homescreen";
import Favoritescreen from "../screens/Favoritescreen";

const Tab = createBottomTabNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Favorites") {
              iconName = focused ? "heart" : "heart-outline";
            } else if (route.name === "Planner") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Create Recipe") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={Homescreen} />
        <Tab.Screen name="Favorites" component={Favoritescreen} />
        <Tab.Screen name="Planner" component={Weekplanerscreen} />
        <Tab.Screen name="Create Recipe" component={CreateRecipescreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
