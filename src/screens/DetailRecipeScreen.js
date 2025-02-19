import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DetailRecipeController } from "../controller/DetailRecipeContrroller";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();
const windowHeight = Dimensions.get("window").height;

const IngredientsScreen = ({ ingredients, servings, updateServings }) => (
  <View style={styles.tabContent}>
    <View style={styles.servingsContainer}>
      <TouchableOpacity
        onPress={() => updateServings(servings - 1)}
        style={styles.servingsButton}
      >
        <Text style={styles.servingsButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.servingsText}>🍲 Servings: {servings}</Text>
      <TouchableOpacity
        onPress={() => updateServings(servings + 1)}
        style={styles.servingsButton}
      >
        <Text style={styles.servingsButtonText}>+</Text>
      </TouchableOpacity>
    </View>

    {ingredients?.length > 0 ? (
      ingredients.map((ingredient, index) => (
        <View key={index}>
          <View style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      ))
    ) : (
      <Text style={styles.ingredientText}>Keine Zutaten verfügbar</Text>
    )}
  </View>
);

const InstructionsScreen = ({ instructions }) => (
  <View style={styles.tabContent}>
    {instructions?.length > 0 ? (
      instructions.map((step, index) => (
        <View key={index} style={styles.instructionContainer}>
          <Text style={styles.stepNumber}>{step.stepNumber}</Text>
          <Text style={styles.instructionText}>{step.text}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.instructionText}>Keine Anleitung verfügbar</Text>
    )}
  </View>
);

const DetailRecipeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const {
    recipe,
    isFavorite,
    isLoading,
    toggleFavorite,
    servings,
    updateServings,
  } = DetailRecipeController(id);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="tomato" />
        </TouchableOpacity>
        {recipe.image && (
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{recipe.title}</Text>
          <TouchableOpacity style={styles.heartIcon} onPress={toggleFavorite}>
            <Text style={{ fontSize: 25 }}>{isFavorite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryContainer}>
          {recipe.recipe_categories?.map((category, index) => (
            <Text key={index} style={styles.categoryText}>
              {category.categories.name}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.tabContainer}>
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
              <IngredientsScreen
                ingredients={recipe.ingredients}
                servings={servings}
                updateServings={updateServings}
              />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    position: "relative",
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
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 40,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  categoryText: {
    fontSize: 14,
    color: "white",
    backgroundColor: "tomato",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 5,
  },
  heartIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 10,
  },
  tabContainer: {
    flex: 1,
    minHeight: windowHeight,
  },
  tabContent: {
    padding: 20,
  },
  servingsContainer: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  servingsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  servingsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  ingredientName: {
    fontSize: 16,
    color: "#333",
  },
  ingredientAmount: {
    fontSize: 16,
    color: "#666",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 5,
    width: "100%",
    alignSelf: "center",
  },
  ingredientText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  servingsButton: {
    backgroundColor: "tomato",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  servingsButtonText: {
    fontSize: 30,
    color: "white",
  },
  servingsText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  stepNumber: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
    color: "#666",
  },
  instructionText: {
    fontSize: 16,
    flexShrink: 1,
    color: "#666",
    marginBottom: 15,
  },
});

export default DetailRecipeScreen;
