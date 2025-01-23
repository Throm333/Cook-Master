import React, { useState } from "react";
import {StyleSheet, Text, View, Image, Button, TextInput, ScrollView, TouchableOpacity} from "react-native";
import * as ImagePicker from 'expo-image-picker'; // Um ein Bild auzuwählen
import DropDownPicker from 'react-native-dropdown-picker'

const AddRecipesScreen = () => {
  const [newRecipe, setNewRecipe] = useState("");
  const [portions, setPortions] = useState(2); // Startwert für die Portionenanzahl ist 2
  const [image, setImage] = useState(null); // Speichert den URI des ausgewählten Bildes
  const [ingredientInput, setIngredientInput] = useState({quantity: "", unit: "ml", name: "",}); // Eingabefeld für Zutaten
  const [ingredients, setIngredients] = useState([]); // Liste der eingegebenen Zutaten
  const [showUnits, setShowUnits] = useState(false); // Alle möglichen Mengeneinheiten werden angezeit
  const [instructionInput, setInstructionInput] = useState("");
  const [instruction, setInstruction] = useState([]);

  // Funktion um ein Bild aus der Galerie auswählen zu können
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    console.log(result);

    if (!result.canceled) {           // Wenn der User ein Bild auswählt
      setImage(result.assets[0].uri);
    }
  };
  // Funktion um Zutaten hinzuzufügen
  const addIngredient = () => { 
    if (ingredientInput.quantity.trim() && ingredientInput.name.trim()) {  // Entfernt Leerzeichen am Anfang und Ende "   Apfel   " -> "Apfel", leere Eingaben (nur Leerzeichen) werden nicht angenommen
      setIngredients([...ingredients, ingredientInput]); 
      setIngredientInput({ quantity: "", unit: "ml", name: "" }); // Leert das Eingabefeld, nachdem die Zutat hinzugefügt wurde
    }
  };
  // Funktion um Zubereitungsschritte hinzuzufügen
  const addStep = () => {
    if (instructionInput.trim()) {
      setInstruction([...instruction, instructionInput]);
      setInstructionInput("");
    }
  };
  // Funktion um Zutaten zu entfernen
  const removeIngredient = (index) => { // Index gibt die Postion der zu löschenden Zutat an
    setIngredients(ingredients.filter((_,i) => i !== index)); 
  };
  const unitOptions = [
    {label: "", value: "none"}, // Muss überarbeitet werden
    {label: "ml", value: "ml"},
    {label: "g", value: "g"},
    {label: "tbsp", value: "tbsp"},
    {label: "tsp", value: "tsp"},
  ];
  const handleSaveRecipe = () => {
    if (!newRecipe.trim() || ingredients.length === 0 || instruction.length === 0) {
      alert("You haven't finished your recipe yet :(");
      return;
    }
    alert("Recipe saved! Looks delicious, may I take a byte?");
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.title}>Recipe Title</Text>
      <View style={styles.box}>
        <TextInput                    // Rezepttitel
          style={styles.boxText}
          placeholder="What is your recipe called?"
          placeholderTextColor="#888"
          value={newRecipe.title}
          onChangeText={setNewRecipe}
        />
      </View>

      <Text style={styles.title}>Recipe Image</Text>
      <View style={styles.imageContainer}> 
        <Image
          style={image ? styles.recipeImage : styles.recipeAddImage}
          source={image ? { uri: image } : require('../../assets/images/add-image.png')} // Platzhalter wird solange gezeigt bis ein eigenes Bild hochgeladen wird
        />
        {!image && (<Button title="Choose Image" onPress={pickImage} color="#3c8241" /> // Der Button existiert nur mit dem Platzhalter
        )}
      </View>

      {image && (
        <View style={styles.buttonContainer}>
          <Button title="Choose Image" onPress={pickImage} color="#3c8241"/>
        </View>
      )}
      
      <Text style={styles.title}>Serving size</Text>
      <View style={styles.box}>   
        <Text style={styles.portionLabel}>Portions:</Text>
        <View style={styles.portionControls}>
          <Button title="-" onPress={() => setPortions(portions > 1 ? portions - 1 : 1)} color="#3c8241"/>
          <TextInput
            style={styles.portionsInput}
            value={String(portions)} // Der Wert des TextInput ist mit `portions` verbunden
            keyboardType="numeric"  // Man kann nur Zahlen eintragen
            onChangeText={(value) => {
              const numericValue = Number(value);
              setPortions(numericValue > 0 ? numericValue : ""); // Setze nur positive Werte, sonst leeres Feld
            }}
          />
          <Button title="+" onPress={() => setPortions(portions + 1)} color="#3c8241"/>
        </View>
      </View>

      <Text style={styles.title}>Ingredients</Text>
      <View style={styles.ingredientContainer}>
         <TextInput                    // Anzahl
          style={[styles.ingredientText, { width: 40 }]}
          placeholder="Qty"
          placeholderTextColor="#888"
          value={ingredientInput.quantity}
          keyboardType="numeric"
          onChangeText={(value) => {
            const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3);  // Maximale Menge ist 999
            setIngredientInput({ ...ingredientInput, quantity: numericValue});
          }}
        />
        <View style={styles.separator} /> 
          <DropDownPicker
            open={showUnits}
            value={ingredientInput.unit}
            items={unitOptions}
            setOpen={setShowUnits}
            listMode="SCROLLVIEW"
            setValue={(callback) => {
              setIngredientInput((prev) => ({ ...prev, unit: callback(prev.unit) }));
              }
            }
            style={{
              backgroundColor: "#dfebe2",
              justifyContent: "center",
              borderWidth: 0,
              width: 85,
            }}
            containerStyle={{
              width: 85,
            }}
            textStyle={{
              textAlign: "center",
              fontSize: 16
            }}
            selectedItemContainerStyle={{
              backgroundColor: "#abc4b1",
            }}
            dropDownContainerStyle= {{
              backgroundColor: '#dfebe2',
              borderColor: "#ccc",
              borderWidth: 0,
            }}
            dropDownDirection="BOTTOM"
          />
        <View style={styles.separator} />
        
        <TextInput                    // Rezepttitel
          style={styles.boxText}
          placeholder="Add an ingredient"
          placeholderTextColor="#888"
          value={ingredientInput.name}
          onChangeText={(value) => setIngredientInput({ ...ingredientInput, name: value })}
        />
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {ingredients.map((ingredient, index) => (                 // Array für die Zutaten
        <View key={index} style={styles.ingredientContainer}>   
          <Text style={styles.boxText}>
          {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </Text>
          <TouchableOpacity style={styles.removeButton} onPress={() => removeIngredient(index)}>
            <Text style={styles.removeButtonText}>-</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.title}>Instructions</Text>
      <View style={styles.box}>
        <TextInput                    
          style={styles.boxText}
          placeholder="Add a step"
          placeholderTextColor="#888"
          value={instructionInput}
          onChangeText={setInstructionInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={addStep}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {instruction.length > 0 && (    // Wenn es keine Steps gibt wird der Container auch nicht angezeigt
        <View style={styles.instructionContainer}>
          {instruction.map((step, index) => (
            <Text key={index} style={styles.boxText}>
              {`Step ${index + 1}: ${step}\n`}
            </Text>
          ))}
        </View>
      )} 
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
          <Text style={styles.saveButtonText}>Save Recipe</Text>
        </TouchableOpacity>

      <View style={{ height: 200 }} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  box: {                  // Für Title, Ingredients und Instructions
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    height: 60,
  },
  
  boxText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3c8241",
    borderRadius: 50,
    width: 30,
    height: 30,
  },

  addButtonText: {
    fontSize: 21,
    color: "#fff",
    fontWeight: "bold",
    lineHeight: 21,
    textAlign: "center",    // Button ist nicht ganz mittig, später korrigieren!!!!!
  },

  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d14949",
    borderRadius: 50,
    width: 30,
    height: 30,
  },
  
  removeButtonText: {
    fontSize: 21,
    color: "#fff",
    fontWeight: "bold",
    lineHeight: 21,
    textAlign: "center",
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
    borderColor: "#ccc",
    marginBottom: 16,
    width: "100%",
    height: 300,
    overflow: 'hidden', // Damit das Bild nicht außerhalb der Box zu sehen ist
  },

  recipeAddImage: {     // Platzhalter für das Bild später
    width: 150,
    height: 150,
  },

  recipeImage: {        // Rezeptbild
    width: "100%",
    height: '100%',
  },

  buttonContainer: {    // Bild-Button nach der Auswahl eines Bildes
    alignItems: "center",
    marginBottom: 16,
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    height: 60,
    zIndex: 10,   // Damit Dropdown vor den unteren Containern erscheint
  },

  ingredientText: {
    fontSize: 16,
    color: "#000",
  },

  separator: {      // Trennstrich
    width: 1, 
    backgroundColor: "#ccc",
    height: "90%", 
    marginHorizontal: 10,
  },

  instructionContainer: {       // Zubereitungsschritte
    flexDirection: "column",     
    alignItems: "flex-start",
    justifyContent: "center",   
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },

  saveButton: {
    backgroundColor: "#3c8241",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: "center",
    marginTop: 16, 
  },

  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },  

  saveImage: {
    width: "110%",
    aspectRatio: 5,
  },

});

export default AddRecipesScreen;