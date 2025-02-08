import React, { useState } from "react";
import {StyleSheet, Text, View, Image, Button, TextInput, ScrollView, TouchableOpacity} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker'
import { useNavigation } from '@react-navigation/native';
import { addNewRecipe } from "../controller/AddRecipeController";

const AddRecipesScreen = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); // Speichert den URI des ausgewählten Bildes
  const [portions, setPortions] = useState(2); // Startwert für die Portionenanzahl ist 2
  const [ingredientInput, setIngredientInput] = useState({quantity: "", unit: "ml", name: "",}); // Eingabefeld für Zutaten
  const [ingredients, setIngredients] = useState([]); // Liste der eingegebenen Zutaten
  const [showUnits, setShowUnits] = useState(false); // Alle möglichen Mengeneinheiten werden angezeit
  const [instructionInput, setInstructionInput] = useState("");
  const [instruction, setInstruction] = useState([]);
  const [editingStep, setEditedStep] = useState(null);

  const navigation = useNavigation();

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
  // Funktion um Zutaten zu entfernen
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_,i) => i !== index)); 
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
    setInstruction(instruction.filter((_,i) => i !== index)); 
  };
  const unitOptions = [
    {label: "", value: "none"},
    {label: "ml", value: "ml"},
    {label: "g", value: "g"},
    {label: "tbsp", value: "tbsp"},
    {label: "tsp", value: "tsp"},
  ];
  const handleSaveRecipe = async () => {
    if (!title.trim() || ingredients.length === 0 || instruction.length === 0) {
      alert("You haven't finished your recipe yet :(");
      return;
    }
    const recipe = {
      title,
      image,
      portions,
      ingredients,
      instruction,
    };
    console.log(recipe);
    const savedRecipe = await addNewRecipe(recipe);
    if (savedRecipe) {
      alert("Recipe saved! Looks delicious, may I take a byte?");
      navigation.navigate("Home");
    } else {
      alert("Failed to save the recipe. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.title}>Recipe Title</Text>
      <View style={styles.box}>
        <TextInput                    
          style={styles.boxText}
          placeholder="What is your recipe called?"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <Text style={styles.title}>Recipe Image</Text>
      <View style={styles.imageContainer}> 
        <Image
          style={image ? styles.recipeImage : styles.recipeAddImage}
          source={image ? { uri: image } : require('../../assets/images/add-image.png')} // Platzhalter wird solange gezeigt bis ein eigenes Bild hochgeladen wird
        />
        {!image && (
        <TouchableOpacity style={styles.chooseImageButton} onPress={pickImage}>
          <Text style={styles.chooseImageButtonText}>Choose Image</Text>
        </TouchableOpacity>
      )}
      </View>
      {image && (
        <TouchableOpacity style={styles.chooseImageButton} onPress={pickImage}>
          <Text style={styles.chooseImageButtonText}>Choose Image</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Serving size</Text>
      <View style={styles.box}>   
        <Text style={styles.portionLabel}>Portions:</Text>
        <View style={styles.portionControls}>
          <Button title="-" onPress={() => setPortions(portions > 1 ? portions - 1 : 1)} color="#FF6347"/>
          <TextInput
            style={styles.portionsInput}
            value={String(portions)}
            keyboardType="numeric"  // Man kann nur Zahlen eintragen
            onChangeText={(value) => {
              const numericValue = Number(value);
              setPortions(numericValue > 0 ? numericValue : ""); // Setze nur positive Werte, sonst leeres Feld
            }}
          />
          <Button title="+" onPress={() => setPortions(portions + 1)} color="#FF6347"/>
        </View>
      </View>
      <Text style={styles.title}>Ingredients</Text>
      <View style={styles.ingredientContainer}>
         <TextInput                  
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
              backgroundColor: "#FF6347",
              justifyContent: "center",
              borderWidth: 0,
              width: 85,
            }}
            containerStyle={{
              width: 85,
            }}
            textStyle={{
              textAlign: "center",
              color: "white",
              fontSize: 16
            }}
            selectedItemContainerStyle={{
              backgroundColor: "#D9391C",
            }}
            dropDownContainerStyle= {{
              backgroundColor: '#FF6347',
              borderColor: "#ccc",
              borderWidth: 0,
            }}
            dropDownDirection="BOTTOM"
          />
        <View style={styles.separator} />
        
        <TextInput                    
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

      {ingredients.map((ingredient, index) => (               
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
          placeholder={editingStep !== null ? "" : "Add a step"}
          placeholderTextColor="#888"
          value={instructionInput}
          onChangeText={setInstructionInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={editingStep !== null ? saveEditedStep : addStep}>
          <Text style={styles.addButtonText}>{editingStep !== null ? "✓" : "+"}</Text>
        </TouchableOpacity>
      </View>

      {instruction.length > 0 && (    
        <View style={styles.instructionContainer}>
          {instruction.map((step, index) => (
            <View key={index} style={styles.steps}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => {setInstructionInput(step); setEditedStep(index);}}>
              <Text key={index} style={styles.boxText}>{`Step ${index + 1}: ${step}\n`}</Text>
              <View style={styles.separatorHorizontal}></View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeStep(index)}>
                <Text style={styles.removeButtonText}>-</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: "#FF6347",
    borderRadius: 50,
    width: 30,
    height: 30,
  },
  addButtonText: {
    fontSize: 21,
    color: "#fff",
    fontWeight: "bold",
    lineHeight: 21,
    textAlign: "center",    // Button ist nicht ganz mittig, später korrigieren!
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9391C",
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
  chooseImageButton: {
    backgroundColor: "tomato",   
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,            
    alignSelf: "center",         
    marginTop: 5,               
  },
  chooseImageButtonText: {
    fontSize: 16,
    color: "#fff",               
    textAlign: "center",        
  },
  recipeImage: {        
    width: "100%",
    height: '100%',
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
  ingredientContainer: {      
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    height: 60,
    zIndex: 100,   // Damit Dropdown vor den unteren Containern erscheint
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  steps: {                  
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 5,
  },
  separatorHorizontal: {      
    backgroundColor: "#ccc",
    height: 1, 
    width: "90%",
  },
  saveButton: {
    backgroundColor: "tomato",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 5, 
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },  
});
export default AddRecipesScreen;