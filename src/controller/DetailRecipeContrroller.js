import { useState, useEffect, useCallback } from "react";
import supabase from "../data/API_Config";

export const DetailRecipeController = (id) => {
  const [recipe, setRecipe] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [servings, setServings] = useState(2);
  const extractNumber = (amount) => {
    const match = amount?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return [];
    return instructions
      .split("\n")
      .filter((step) => step.trim() !== "")
      .map((step, index) => ({
        stepNumber: `Step ${index + 1}:`,
        text: step.trim(),
      }));
  };

  const fetchRecipeDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select(
          `*,
          ingredients (name, amount),
          recipe_categories (categories (name))`
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      setRecipe({
        ...data,
        instructions: formatInstructions(data.instructions), // Anweisungen formatieren
      });

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

  const updateServings = (newServings) => {
    if (newServings < 1) return;

    const factor = newServings / servings;
    const updatedIngredients = recipe.ingredients.map((ingredient) => {
      const baseAmount = extractNumber(ingredient.amount);
      const scaledAmount = baseAmount
        ? (baseAmount * factor).toFixed(2)
        : ingredient.amount;

      return {
        ...ingredient,
        scaledAmount,
        unit: ingredient.amount.replace(/[\d.]+/, "").trim(),
      };
    });

    setRecipe({ ...recipe, ingredients: updatedIngredients });
    setServings(newServings);
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);

  return {
    recipe,
    isFavorite,
    isLoading,
    servings,
    updateServings,
    toggleFavorite,
  };
};
