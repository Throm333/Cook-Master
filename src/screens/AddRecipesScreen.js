import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Button, TextInput } from "react-native";


const CreateRecipescreen = () => {
  const [newRecipe, setNewRecipe] = useState("");
  const [portions, setPortions] = useState(2); // Startwert für die Portionenanzahl

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
      
        <TextInput                    // Rezepttitel
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

      <View style={styles.portionContainer}>   
        <Text style={styles.portionLabel}>Portionen:</Text>
        <View style={styles.portionControls}>
          <Button title="-" onPress={() => setPortions(portions > 1 ? portions - 1 : 1)} />
          <TextInput
            style={styles.portionsInput}
            value={String(portions)} // Der Wert des TextInput ist mit `portions` verbunden
            keyboardType="numeric"
            onChangeText={(value) => {
              const numericValue = Number(value);
              setPortions(numericValue > 0 ? numericValue : ""); // Setze nur positive Werte, sonst leeres Feld
            }}
          />
          <Button title="+" onPress={() => setPortions(portions + 1)} />
        </View>
      </View>

        <Button                       // Button um das Rezept zu speichern
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

  imageContainer: {       // Rezeptbild Container
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
    height: 300,
  },

  recipeImage: {      // Platzhalter für das Bild später
    borderRadius: 8,
    borderWidth: 2,
    width: "100%",
    height: "100%",
  },

  portionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",  // neu
    marginBottom: 16,
    padding: 10,  // instead of padding vertical and horizontel
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
  },

  portionLabel: {
    fontSize: 16,
    color: "#000",
  },

  portionControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  portionsInput: {
    fontSize: 16,
    textAlign: "center",
    width: 50,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 10,
  },

});

export default CreateRecipescreen;


