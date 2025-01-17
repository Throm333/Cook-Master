import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Button, TextInput, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker'; // Um ein Bild auzuwählen


const CreateRecipescreen = () => {
  const [newRecipe, setNewRecipe] = useState("");
  const [portions, setPortions] = useState(2); // Startwert für die Portionenanzahl
  const [image, setImage] = useState(null); // Speichert den URI des ausgewählten Bildes

  // Funktion um ein Bild aus der Galerie auswählen zu können
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1, // 1 = Maximale Qualität
    });
    console.log(result);

    if (!result.canceled) {           // Wenn der User ein Bild auswählt
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>

      <Text style={styles.title}>Recipe Title</Text>
      <View style={styles.titleBox}>
        <TextInput                    // Rezepttitel
          style={styles.titleInput}
          placeholder="What is your recipe called?"
          placeholderTextColor="#888"
          value={newRecipe.title}
          onChangeText={setNewRecipe}
        />
      </View>


      <Text style={styles.title}>Recipe Image</Text>
      <View style={styles.imageContainer}> 
        <Image
          style={image ? styles.recipeImage : styles.recipeAddImage}  // 
          source={image ? { uri: image } : require('../../assets/images/add-image.png')} // Platzhalter wird solange gezeigt bis ein eigenes Bild hochgeladen wird
        />
        {!image && (<Button title="Choose Image" onPress={pickImage} /> // Der Button existiert nur mit dem Platzhalter
        )}
      </View>

      {image && (
        <View style={styles.buttonContainer}>
          <Button title="Choose Image" onPress={pickImage} />
        </View>
      )}
      
      <Text style={styles.title}>Serving size</Text>
      <View style={styles.portionContainer}>   
        <Text style={styles.portionLabel}>Portions:</Text>
        <View style={styles.portionControls}>
          <Button title="-" onPress={() => setPortions(portions > 1 ? portions - 1 : 1)} />
          <TextInput
            style={styles.portionsInput}
            value={String(portions)} // Der Wert des TextInput ist mit `portions` verbunden
            keyboardType="numeric"  // Man kann nur Zahlen eintragen
            onChangeText={(value) => {
              const numericValue = Number(value);
              setPortions(numericValue > 0 ? numericValue : ""); // Setze nur positive Werte, sonst leeres Feld
            }}
          />
          <Button title="+" onPress={() => setPortions(portions + 1)} />
        </View>
      </View>

      <Text style={styles.title}>Ingredients</Text>
      <View style={styles.ingredientContainer}>
          
      </View>


      <Text style={styles.title}>Instructions</Text>
      <View style={styles.instructionContainer}>
          
      </View>

        <Button                       // Button um das Rezept zu speichern
          style={styles.saveButton}
          title= "Save Recipe"
          color= "#234a91"
        />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  titleBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
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

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  imageContainer: {       // Rezeptbild Container
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    width: "100%",
    height: 300,
    overflow: 'hidden', // Damit das Bild nicht außerhalb der Box zu sehen ist
  },

  recipeAddImage: {      // Platzhalter für das Bild später
    width: 150,
    height: 150,
  },

  recipeImage: {      // Rezeptbild
    width: "100%",
    height: '100%',
  },

  buttonContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  portionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
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

  ingredientContainer: {       // Zubereitung
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    width: "100%",
    height: 50,
  },

  instructionContainer: {       // Zubereitung
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    width: "100%",
    height: 50,
  },

});

export default CreateRecipescreen;