import { useState, useEffect, useCallback } from "react";
import supabase from "../data/API_Config";

export const DetailRecipeController = (id) => {
  const [recipe, setRecipe] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecipeDetails = useCallback(async () => {
    setIsLoading(true);
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

      const { data: favoriteData } = await supabase
        .from("favorites")
        .select("*")
        .eq("recipe_id", id)
        .single();

      setIsFavorite(!!favoriteData);
    } catch (error) {
      console.error("Fehler beim Abrufen der Rezeptdetails:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const toggleFavorite = useCallback(async () => {
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("recipe_id", id);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ recipe_id: id });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(
        "Fehler beim Umschalten des Favoritenstatus:",
        error.message
      );
    }
  }, [id, isFavorite]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  return {
    recipe,
    isFavorite,
    isLoading,
    toggleFavorite,
  };
};
