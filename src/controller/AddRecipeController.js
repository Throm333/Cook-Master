import supabase from "../data/API_Config";

export const addNewRecipe = async (recipe) => {
  try {
    console.log("Recipe to be inserted:", recipe);

    const { data, error } = await supabase
      .from("recipe")
      .insert([recipe]);

    if (error) {
      console.error("Supabase error:", error.message);
      throw error;
    }
    console.log("Recipe successfully saved:", data);
    return data;
  } catch (error) {
    console.error("Fehler beim Speichern des Rezepts:", error.message);  // Fehlernachricht von Supabase
    return null;
  }
};