import React, { useState , useEffect } from 'react';
import { Modal, StyleSheet, TouchableOpacity, Text, View, Button, Image, ScrollView,} from "react-native";
import { RollInRight } from 'react-native-reanimated';
import Abend from '../../assets/images/abendsIcon.jpg';
import { Ionicons } from "@expo/vector-icons";
import supabase from "../data/API_Config";


const Weekplanerscreen = () => {
  const days = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
  const times = [
  <Image source={require('../../assets/images/morgensIcon.jpg')} style={{ width: 50, height: 50 }}/>, 
  <Image source={require('../../assets/images/mittagsIcon.jpg')} style={{ width: 50, height: 50 }}/>, 
  <Image source={require('../../assets/images/abendsIcon.jpg')} style={{ width: 50, height: 50 }}/>
                ];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recipesArray, setRecipesArray] = useState(Array(21).fill(null));
  const [selectedCellId, setSelectedCellId] = useState(null);
  const [cellData, setCellData] = useState(Array(21).fill(null)); // Array mit 21 Plätzen

  useEffect(() => {
    fetchFavorites();

    const realTime = supabase
      .channel("favorites_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "favorites" },
        handleFavoritesChange
      )
      .subscribe();

    return () => {
      realTime.unsubscribe();
    };
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase.from("favorites").select(`
          recipe_id,
          recipes (
            id,
            title,
            image
          )
        `);

      if (error) throw error;

      const formattedFavorites = data.map((fav) => ({
        id: fav.recipes.id,
        name: fav.recipes.title,
        image: fav.recipes.image,
        isFavorite: true,
      }));

      setFavorites(formattedFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
    }
  };

  const handleFavoritesChange = () => {
    fetchFavorites();
  };

  const addRecipeToCell = (recipe) => {
    if (selectedCellId !== null) {
      const newCellData = [...cellData];
      newCellData[selectedCellId] = recipe; // Speichere das Rezept an der ID-Position
      setCellData(newCellData);
    }
    setModalVisible(false);
  };



  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <View style={styles.table}>
          <View style={styles.row}>
            {days.map((day) => (
              <Text style={[styles.cell, styles.headerCell]} key={day}>
                {day}
              </Text>
            ))}
          </View>
          {times.map((time, timeIndex) => (
            <View style={styles.row} key={timeIndex}>
              {days.map((day, dayIndex) => {
              const id = dayIndex * 3 + timeIndex; // Berechne die ID
              const recipe = cellData[id]; // Hole das Rezept für diese Zelle
            


                return (
                  <TouchableOpacity
                    style={styles.cell}
                    key={id}
                    onPress={() => {
                      setSelectedCellId(id); // Speichere die ID der ausgewählten Zelle
                      setModalVisible(true); // Öffne das Modal
                    }}
                  >
                    {recipe ? (
                      <Image
                        source={{ uri: recipe.image }}
                        style={{ width: 50, height: 50 }}
                      />
                    ) : (
                      <Text>{time}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Zutatenliste</Text>

        {selectedRecipe && ( // Nur anzeigen, wenn ein Rezept ausgewählt wurde
        <Text style={styles.selectedRecipeText}>
        Ausgewähltes Rezept: {selectedRecipe.name}
        </Text>
        )}                 

      </View>
      <View style={styles.container}>

      {/* Modal-Komponente */}
      <Modal
        animationType="slide"        // Optionen: 'none', 'slide', 'fade'
        transparent={true}          // HIntergrund transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        {/* Container für den halbtransparenten Hintergrund */}
        <View style={styles.modalOverlay}>
          {/* Inhalt des Modals */}
          <View style={styles.modalContent}>

            <Text style={styles.modalText}>Favorites</Text>
            {/* Favotirten inerhalb des Modals */}
            
                  <ScrollView style={styles.recipeList}>
                    {favorites.map((recipe) => (
                      <TouchableOpacity
                        key={recipe.id}
                        style={styles.recipeItem}
                        onPress={() => addRecipeToCell(recipe)}
                      >
                        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                        <Text style={styles.recipeName}>{recipe.name}</Text>

                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                
            <View style={styles.modalExit}>

              <Button title="X" onPress={() => setModalVisible(false)} />

            </View>

          </View>
        </View>
      </Modal>
    </View>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tableContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  table: {
    borderWidth: 0,
    borderRadius: 0,
    overflow: "hidden",
    width: "95%",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 0,
    textAlign: "center",
    borderWidth: 0,
    borderColor: "#ccc",
    fontSize: 16,
    color: "#000",
  },
  headerCell: {
    padding: 5,
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    color: "#000",
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Abdunkelung des Hintergrundes
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 25,
  },
  modalExit: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  recipeList: {
    paddingHorizontal: 2,
    width: '100%',
    marginTop: 10,
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  recipeName: {
    marginLeft: 10,
    marginRight: 40,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});

export default Weekplanerscreen;
