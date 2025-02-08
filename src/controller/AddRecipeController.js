import supabase from "../data/API_Config"; // Importieren Sie die Supabase-Client-Konfiguration
export const addNewRecipe = async (recipe) => {
  try {
    // Rezept in der Tabelle `recipes` speichern
    const { data: recipeData, error: recipeError } = await supabase
      .from("recipes")
      .insert([
        {
          title: recipe.title,
          image: recipe.image,
          instructions: recipe.instruction.join("\n"),
          servings: recipe.servings,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (recipeError) throw recipeError;

    const recipeId = recipeData.id;

    for (const ingredient of recipe.ingredient) {
      const { error: ingredientError } = await supabase
        .from("ingredients")
        .insert({
          recipe_id: recipeId,
          name: ingredient.name,
          amount: ingredient.amount,
        });

      if (ingredientError) throw ingredientError;
    }
    return recipeData;
  } catch (error) {
    console.error("Error saving recipe:", error.message);
    return null;
  }
};