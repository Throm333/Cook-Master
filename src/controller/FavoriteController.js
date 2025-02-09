"use client";

import { useState, useEffect } from "react";
import supabase from "../data/API_Config";
import { useNavigation } from "@react-navigation/native";

export const FavoriteController = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [filteredUserRecipes, setFilteredUserRecipes] = useState([]);

  useEffect(() => {
    fetchFavorites();
    fetchUserRecipes();

    const realTimeFavorites = supabase
      .channel("favorites_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "favorites" },
        handleFavoritesChange
      )
      .subscribe();

    const realTimeUserRecipes = supabase
      .channel("user_recipes_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_recipes" },
        handleUserRecipesChange
      )
      .subscribe();

    return () => {
      realTimeFavorites.unsubscribe();
      realTimeUserRecipes.unsubscribe();
    };
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase.from("favorites").select(`
          recipe_id,
          recipes (
            id,
            title,
            image
          )
        `);

      if (error) throw error;

      const formattedFavorites = data.map((fav) => ({
        id: fav.recipes.id,
        name: fav.recipes.title,
        image: fav.recipes.image,
        isFavorite: true,
      }));

      setFavorites(formattedFavorites);
      setFilteredFavorites(formattedFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("user_recipes")
        .select("id, title, image");

      if (error) throw error;

      const formattedUserRecipes = data.map((recipe) => ({
        id: recipe.id,
        name: recipe.title,
        image: recipe.image,
      }));

      setUserRecipes(formattedUserRecipes);
      setFilteredUserRecipes(formattedUserRecipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error.message);
    }
  };

  const handleFavoritesChange = () => {
    fetchFavorites();
  };

  const handleUserRecipesChange = () => {
    fetchUserRecipes();
  };

  const handleRemoveFavorite = async (id) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("recipe_id", id);

      if (error) throw error;
      fetchFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error.message);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const lowercasedQuery = text.toLowerCase();
    const filteredFavs = favorites.filter((recipe) =>
      recipe.name.toLowerCase().includes(lowercasedQuery)
    );
    const filteredUser = userRecipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredFavorites(filteredFavs);
    setFilteredUserRecipes(filteredUser);
  };

  const navigateToRecipeDetail = (recipeId) => {
    if (!recipeId) {
      console.error("Fehler: ID existiert nicht für Recipe");
      return;
    }
    navigation.navigate("Home", {
      screen: "DetailRecipe",
      params: { id: recipeId },
    });
  };

  return {
    searchQuery,
    filteredFavorites,
    filteredUserRecipes,
    handleSearch,
    handleRemoveFavorite,
    navigateToRecipeDetail,
  };
};