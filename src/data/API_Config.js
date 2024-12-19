import axios from "axios";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://umxefhpogivleljntkdz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteGVmaHBvZ2l2bGVsam50a2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjgxMDM4NiwiZXhwIjoyMDQ4Mzg2Mzg2fQ.C7W5--V-arhbd_d6QnOj9RXFzIFJTCisXPFwDb11eCc";

const spoonacularApiKey = "a4f80292b4794312bab3783a88014418";

const supabase = createClient(supabaseUrl, supabaseKey);

const api = axios.create({
  baseURL: "https://api.spoonacular.com/recipes",
  params: {
    apiKey: spoonacularApiKey,
  },
});

export default supabase;

async function insertRecipes() {
  try {
    const response = await api.get("/complexSearch", {
      params: { number: 15 },
    });

    const recipes = response.data.results;

    console.log(`${recipes.length} Rezepte erfolgreich abgerufen.`);

    for (const recipe of recipes) {
      const recipeDetailsResponse = await api.get(`/${recipe.id}/information`);

      const recipeDetails = recipeDetailsResponse.data;

      /* -----------------------------Zutaten, Kategorie und Anleitung werden extrahiert-------------------------------------- */

      const ingredients = Array.isArray(recipeDetails.extendedIngredients)
        ? recipeDetails.extendedIngredients.map((ing) => ({
            amount: `${ing.amount} ${ing.unit}`,
            name: ing.name,
          }))
        : [];

      const categories = Array.isArray(recipeDetails.dishTypes)
        ? recipeDetails.dishTypes
        : ["Keine Kategorie"];

      const instructions =
        recipeDetails.instructions ||
        (recipeDetails.analyzedInstructions?.length > 0
          ? recipeDetails.analyzedInstructions[0].steps
              .map((step) => step.step)
              .join(" ")
          : "Keine Anleitung verfügbar");

      /* --------------------------Rezepte in Datenbank Tabelle recipes speichern------------------------------------------*/

      const { data: recipeData, error: recipeError } = await supabase
        .from("recipes")
        .insert([
          {
            title: recipeDetails.title || "",
            image: recipeDetails.image || null,
            instructions: instructions,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (recipeError) {
        console.error(
          `Fehler beim Einfügen von "${recipeDetails.title}":`,
          recipeError.message
        );
        continue;
      }

      const recipeId = recipeData[0].id;

      //console.log("Eingefügtes Rezept:", recipeData);

      /* -------------------------Zutaten in DB Tabelle ingredients speichern---------------------------------------------*/

      for (const ingredient of ingredients) {
        const { error: ingredientError } = await supabase
          .from("ingredients")
          .insert({
            recipe_id: recipeId,
            name: ingredient.name,
            amount: ingredient.amount,
          });

        if (ingredientError) {
          console.error(
            `Fehler beim Einfügen von Zutaten für "${recipeDetails.title}":`,
            ingredientError.message
          );
        }
      }

      /* -------------------------Kategorie in DB categories speichern-----------------------------------------------------*/

      for (const category of categories) {
        const { data: existingCategory, error: categoryError } = await supabase
          .from("categories")
          .select("*")
          .eq("name", category)
          .limit(1);

        if (categoryError) {
          console.error(
            `Fehler beim Überprüfen der Kategorie "${category}":`,
            categoryError.message
          );
          continue;
        }

        let categoryId;

        //Überprüfung, ob Kategorie bereits existiert, wenn nicht, wird eine neue erstellt
        if (existingCategory.length > 0) {
          categoryId = existingCategory[0].id;
        } else {
          const { data: newCategory, error: newCategoryError } = await supabase
            .from("categories")
            .insert({ name: category })
            .select();

          if (newCategoryError) {
            console.error(
              `Fehler beim Hinzufügen der Kategorie "${category}":`,
              newCategoryError.message
            );
            continue;
          }

          categoryId = newCategory[0].id;
        }

        /* -----------------------Verbindung zw. Rezepte und Kategorie in DB hinzufügen-----------------------------------*/

        const { error: recipeCategoryError } = await supabase
          .from("recipe_categories")
          .insert({
            recipe_id: recipeId,
            category_id: categoryId,
          });

        if (recipeCategoryError) {
          console.error(
            `Fehler beim Hinzufügen der Kategorie für "${recipeDetails.title}":`,
            recipeCategoryError.message
          );
        }
      }

      //console.log(`Rezept "${recipeDetails.title}" erfolgreich hinzugefügt.`);
    }
  } catch (error) {
    console.error(
      "Fehler beim Abrufen oder Einfügen von Rezepten:",
      error.message
    );
  }
}

insertRecipes();
