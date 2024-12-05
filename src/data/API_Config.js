const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://umxefhpogivleljntkdz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteGVmaHBvZ2l2bGVsam50a2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjgxMDM4NiwiZXhwIjoyMDQ4Mzg2Mzg2fQ.C7W5--V-arhbd_d6QnOj9RXFzIFJTCisXPFwDb11eCc";

const spoonacularApiKey = "a4f80292b4794312bab3783a88014418";

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAndInsertRecipes() {
  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      {
        params: {
          number: 10,
          apiKey: spoonacularApiKey,
        },
      }
    );

    const recipes = response.data.results;

    for (const recipe of recipes) {
      const recipeDetailsResponse = await axios.get(
        `https://api.spoonacular.com/recipes/${recipe.id}/information`,
        {
          params: {
            apiKey: spoonacularApiKey,
          },
        }
      );

      const recipeDetails = recipeDetailsResponse.data;

      const ingredients = Array.isArray(recipeDetails.extendedIngredients)
        ? recipeDetails.extendedIngredients.map((ing) => ({
            amount: `${ing.amount} ${ing.unit}`,
            name: ing.name,
          }))
        : [];

      const ingredientAmounts = ingredients.map((ing) => ing.amount).join(", ");
      const ingredientNames = ingredients.map((ing) => ing.name).join(", ");

      const category = Array.isArray(recipeDetails.dishTypes)
        ? recipeDetails.dishTypes.join(", ")
        : "Keine Kategorie verfügbar";

      const { error } = await supabase.from("Recipes").insert([
        {
          title: recipeDetails.title || "Unbekanntes Rezept",
          image: recipeDetails.image || null,
          ingredient_amount: ingredientAmounts,
          ingredient_name: ingredientNames,
          instructions:
            recipeDetails.instructions || "Keine Anleitung verfügbar",
          category: category,
          created_at: new Date().toISOString(),
        },
      ]);

      const instructions =
        recipeDetails.instructions ||
        (recipeDetails.analyzedInstructions?.length > 0
          ? recipeDetails.analyzedInstructions[0].steps
              .map((step) => step.step)
              .join(" ")
          : "Keine Anleitung verfügbar");

      if (error) {
        console.error(
          `Fehler beim Einfügen von "${recipeDetails.title}":`,
          error.message
        );
      } else {
        console.log(`Rezept "${recipeDetails.title}" erfolgreich hinzugefügt.`);
      }
    }
  } catch (error) {
    console.error(
      "Fehler beim Abrufen oder Einfügen von Rezepten:",
      error.message
    );
  }
}

fetchAndInsertRecipes();
