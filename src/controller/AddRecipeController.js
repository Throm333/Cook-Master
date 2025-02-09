"use client";

import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import supabase from "../data/API_Config";

export const useAddRecipeController = (navigation) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [portions, setPortions] = useState(2);
  const [ingredientInput, setIngredientInput] = useState({
    quantity: "",
    unit: "ml",
    name: "",
  });
  const [ingredients, setIngredients] = useState([]);
  const [showUnits, setShowUnits] = useState(false);
  const [instructionInput, setInstructionInput] = useState("");
  const [instruction, setInstruction] = useState([]);
  const [editingStep, setEditedStep] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      // Wenn der User ein Bild auswählt
      setImage(result.assets[0].uri);
    }
  };

  // Funktion um Zutaten hinzuzufügen
  const addIngredient = () => {
    if (ingredientInput.quantity.trim() && ingredientInput.name.trim()) {
      // Entfernt Leerzeichen am Anfang und Ende "   Apfel   " -> "Apfel", leere Eingaben
      setIngredients([...ingredients, ingredientInput]);
      setIngredientInput({ quantity: "", unit: "ml", name: "" }); // Leert das Eingabefeld, nachdem die Zutat hinzugefügt wurde
    }
  };

  // Funktion um Zutaten zu entfernen
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Funktion um Zubereitungsschritte hinzuzufügen
  const addStep = () => {
    if (instructionInput.trim()) {
      setInstruction([...instruction, instructionInput]);
      setInstructionInput("");
    }
  };

  const saveEditedStep = () => {
    if (editingStep !== null && instructionInput.trim()) {
      const updatedInstructions = [...instruction];
      updatedInstructions[editingStep] = instructionInput;
      setInstruction(updatedInstructions);
      setInstructionInput("");
      setEditedStep(null);
    }
  };

  const removeStep = (index) => {
    setInstruction(instruction.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = async () => {
    try {
      // Fügt bzw speichert das Rezept in der DB
      const { data: recipeData, error: recipeError } = await supabase
        .from("user_recipes")
        .insert([
          {
            title,
            image,
            servings: portions,
            instructions: instruction.join("\n"),
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (recipeError) throw recipeError;

      const recipeId = recipeData[0].id;

      // Fügt bzw. speichert die Zutaten in die DB
      const ingredientPromises = ingredients.map((ingredient) =>
        supabase.from("user_ingredients").insert({
          recipe_id: recipeId,
          name: ingredient.name,
          amount: `${ingredient.quantity} ${ingredient.unit}`,
        })
      );

      await Promise.all(ingredientPromises);

      alert("Recipe successfully saved!");
      navigation.goBack();
    } catch (error) {
      console.error("Error save recipe:", error);
      alert("Failed to save recipe");
    }
  };

  return {
    title,
    setTitle,
    image,
    portions,
    setPortions,
    ingredientInput,
    setIngredientInput,
    ingredients,
    showUnits,
    setShowUnits,
    instructionInput,
    setInstructionInput,
    instruction,
    editingStep,
    pickImage,
    addIngredient,
    removeIngredient,
    addStep,
    saveEditedStep,
    removeStep,
    handleSaveRecipe,
  };
};
