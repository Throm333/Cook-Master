import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Button, TextInput } from "react-native";
//import { TextInput } from "react-native-gesture-handler";

const CreateRecipescreen = () => {
  const [newRecipe, setNewRecipe] = useState("");

const PortionAmount = () => {
  const [portions, setPortions] = useState(2); // Startwert

  const increasePortions = () => setPortions((previous) => previous + 1);
  const decreasePortions = () => setPortions((previous) => previous - 1); 
}


  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
      
        <TextInput
          style={styles.titleInput}
          placeholder="Recipe titel"
          placeholderTextColor="#888"
          value={newRecipe.title}
          onChangeText={setNewRecipe}
        />
      </View>

      <View style={styles.imageContainer}>
        <Image
          style={styles.recipeImage}
        />
      </View>

        <TextInput
          style={styles.portions}
        />

        <Button
          style={styles.saveButton}
          title= "Save Recipe"
          color= "#234a91"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  titleBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
  },

  titleInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  recipeImage: {
    width: 550,
    height: 400,
    borderWidth: 2,
  },

  portions: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
  }
});

export default CreateRecipescreen;


