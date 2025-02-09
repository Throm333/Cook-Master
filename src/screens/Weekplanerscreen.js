import React, { useState , useEffect } from 'react';
import { Modal, StyleSheet, TouchableOpacity, Text, View, Button, Image, ScrollView,} from "react-native";
import { RollInRight } from 'react-native-reanimated';
import Abend from '../../assets/images/abendsIcon.jpg';
import { Ionicons } from "@expo/vector-icons";
import supabase from "../data/API_Config";
import { useWeekplannerController } from "../controller/WeekplannerController";
import { DetailRecipeController } from "../controller/DetailRecipeContrroller";

const Weekplanerscreen = () => {
  const days = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
  const times = [
    <Image source={require('../../assets/images/morgensIcon.jpg')} style={{ width: 50, height: 50 }} />,
    <Image source={require('../../assets/images/mittagsIcon.jpg')} style={{ width: 50, height: 50 }} />,
    <Image source={require('../../assets/images/abendsIcon.jpg')} style={{ width: 50, height: 50 }} />,
  ];

  const {
    modalVisible,
    setModalVisible,
    selectedCellId,
    setSelectedCellId,
    cellData,
    favorites,
    addRecipeToCell,
  } = useWeekplannerController();

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
                const id = dayIndex * 3 + timeIndex;
                const recipe = cellData[id];

                return (
                  <TouchableOpacity
                    style={styles.cell}
                    key={id}
                    onPress={() => {
                      setSelectedCellId(id);
                      setModalVisible(true);
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
  
  {cellData
    .filter((recipe) => recipe !== null) // Filtere alle Rezepte, die nicht null sind
    .map((recipe, index) => (
      <Text key={index} style={styles.recipeNameText}>
        {recipe.name}
      </Text>
    ))}
</View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Favorites</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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