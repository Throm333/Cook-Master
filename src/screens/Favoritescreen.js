import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Favoritescreen = () => {
  const [favorites, setFavorites] = useState([

    { id: 1, name: "Lasagne", isFavorite: true, image: "https://www.malteskitchen.de/wp-content/uploads/2022/09/lasagne-bolognese-8.jpg" },
    { id: 2, name: "Nudelauflauf", isFavorite: true, image: "https://images.mrcook.app/recipe-image/018dc649-76b5-7b1d-a2d0-d0671570a970" },
    { id: 3, name: "Reis mit Hähnchen", isFavorite: true, image: "https://lh3.googleusercontent.com/proxy/F78G0gduWweAl_5m9SRcljNWY61k_bmz_Or6Q1pb6I2WwiOEen9kpiwRfLkoNTjcMdg_M2yP0oLgDzHcn198nK7XDiQvo4bSnDwOPSlToQJ1GfOchPplPvKH1ffgADXid963lyE" },
    { id: 4, name: "Steak", isFavorite: true, image: "https://www.adelmayer.de/wp-content/uploads/2024/02/bbnm.png" },
  ]);

  const [selectedRecipe, setSelectedRecipe] = useState(null); // Rezept für das Modal
  const [modalVisible, setModalVisible] = useState(false); // Steuerung der Modal-Sichtbarkeit

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter((recipe) => recipe.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Rezeptliste */}
      <ScrollView style={styles.recipeList}>
        {favorites.map((recipe) => (
          <TouchableOpacity key={recipe.id} style={styles.recipeItem} onPress={() => openModal(recipe)}>
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveFavorite(recipe.id)}>
              <Ionicons name="heart" size={24} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pop-up Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedRecipe && (
              <>
                <Image source={{ uri: selectedRecipe.image }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
                <Text style={styles.modalDescription}>
                  Rezeptdetails
                </Text>
                <Button title="Schließen" onPress={closeModal} />
              </>
            )}
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
    paddingTop: 50,
  },
  recipeList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
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
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Favoritescreen;
