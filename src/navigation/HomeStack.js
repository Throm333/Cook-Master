import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailRecipeScreen from "../screens/DetailRecipeScreen";

const Stack = createStackNavigator();

// Stack Navigator ermöglich es vom HomeScreen direkt zum DetailRecipeScreen zu gelangen
// da es sich um eine verschachelte Navigation handelt, nutzen wir den Stack Navigator

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailRecipe"
        component={DetailRecipeScreen}
        options={{ headerTitle: false, headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
