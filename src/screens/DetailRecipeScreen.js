import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import supabase from "../data/API_Config";
import { ScrollView } from "react-native-gesture-handler";

const Tab = createMaterialTopTabNavigator();

const IngredientsScreen = ({ ingredients }) => (
  <View style={styles.tabContainer}>
    {ingredients?.length > 0 ? (
      ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredientText}>
          • {ingredient.amount} {ingredient.name}
        </Text>
      ))
    ) : (
      <Text style={styles.ingredientText}>Keine Zutaten verfügbar</Text>
    )}
  </View>
);

const InstructionsScreen = ({ instructions }) => (
  <View style={styles.tabContainer}>
    <Text style={styles.instructionText}>
      {instructions || "Keine Anleitung verfügbar"}
    </Text>
  </View>
);

const DetailRecipeScreen = () => {
  const [recipe, setRecipe] = useState({});
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  useEffect(() => {
    fetchRecipeDetails();
  }, []);

  const fetchRecipeDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select(
          `
          *,
          ingredients (name, amount),
          recipe_categories (categories (name))
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      setRecipe(data || {});
    } catch (error) {
      console.error("Error fetching recipe details:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#007BFF" />
      </TouchableOpacity>
      {recipe.image && (
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.categoryContainer}>
          {recipe.recipe_categories?.map((category, index) => (
            <Text key={index} style={styles.categoryText}>
              {category.categories.name}
            </Text>
          ))}
        </View>

        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "tomato",
            tabBarIndicatorStyle: { backgroundColor: "tomato" },
            tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
          }}
        >
          <Tab.Screen
            name="Zutaten"
            children={() => (
              <IngredientsScreen ingredients={recipe.ingredients} />
            )}
          />
          <Tab.Screen
            name="Anleitung"
            children={() => (
              <InstructionsScreen instructions={recipe.instructions} />
            )}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
  },
  recipeImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  categoryText: {
    fontSize: 14,
    color: "#007BFF",
    backgroundColor: "#E6F2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 5,
  },
  tabContainer: {
    flex: 1,
    padding: 10,
  },
  ingredientText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});

export default DetailRecipeScreen;
