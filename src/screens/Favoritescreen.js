"use client";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FavoriteController } from "../controller/FavoriteController";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

const RecipeList = ({
  recipes,
  onRemoveFavorite,
  onNavigateToDetail,
  showFavoriteButton,
}) => (
  <ScrollView>
    {recipes.length === 0 ? (
      <Text style={styles.noResults}>Keine Rezepte gefunden</Text>
    ) : (
      recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          style={styles.recipeItem}
          onPress={() => onNavigateToDetail(recipe.id)}
        >
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          <Text style={styles.recipeName}>{recipe.name}</Text>
          {showFavoriteButton && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onRemoveFavorite(recipe.id);
              }}
            >
              <Ionicons name="heart" size={24} color="red" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))
    )}
  </ScrollView>
);

const FavoriteRecipesScreen = ({
  favorites,
  onRemoveFavorite,
  onNavigateToDetail,
}) => (
  <View style={styles.tabContent}>
    <RecipeList
      recipes={favorites}
      onRemoveFavorite={onRemoveFavorite}
      onNavigateToDetail={onNavigateToDetail}
      showFavoriteButton={true}
    />
  </View>
);

const UserRecipesScreen = ({ userRecipes, onNavigateToDetail }) => (
  <View style={styles.tabContent}>
    <RecipeList
      recipes={userRecipes}
      onNavigateToDetail={onNavigateToDetail}
      showFavoriteButton={false}
    />
  </View>
);

const Favoritescreen = () => {
  const {
    searchQuery,
    filteredFavorites,
    filteredUserRecipes,
    handleSearch,
    handleRemoveFavorite,
    navigateToRecipeDetail,
  } = FavoriteController();

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Suche nach Rezepten..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => handleSearch(searchQuery)}>
          <Ionicons name="search" size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
          },
          tabBarIndicatorStyle: { backgroundColor: "#FF6347" },
        }}
      >
        <Tab.Screen name="Favoriten">
          {() => (
            <FavoriteRecipesScreen
              favorites={filteredFavorites}
              onRemoveFavorite={handleRemoveFavorite}
              onNavigateToDetail={navigateToRecipeDetail}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Meine Rezepte">
          {() => (
            <UserRecipesScreen
              userRecipes={filteredUserRecipes}
              onNavigateToDetail={navigateToRecipeDetail}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  recipeName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  noResults: {
    fontSize: 18,
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  tabContent: {
    paddingTop: 16,
  },
});

export default Favoritescreen;
