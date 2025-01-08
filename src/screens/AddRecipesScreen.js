import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Button, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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

        <TextInput                    // Portionenmenge, nur Zahlen sind erlaubt
          style={styles.portions}
          placeholder="Serving size"
          placeholderTextColor="#888"
          keyboardType="numeric"      // Öffnet Zahlen keyboard auf dem Handy
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
    borderRadius: 8,
    borderWidth: 1, // Create border
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
    color: "#000",
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  recipeImage: {
    borderRadius: 8,
    borderWidth: 2,
  },

  portions: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1, // Create border
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


