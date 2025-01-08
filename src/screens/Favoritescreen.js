import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Modal, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Favoritescreen = () => {
  const [favorites, setFavorites] = useState([

    { id: 1, name: "Lasagne", isFavorite: true, image: "https://www.malteskitchen.de/wp-content/uploads/2022/09/lasagne-bolognese-8.jpg" },
    { id: 2, name: "Nudelauflauf", isFavorite: true, image: "https://images.mrcook.app/recipe-image/018dc649-76b5-7b1d-a2d0-d0671570a970" },
    { id: 3, name: "Reis mit Hähnchen", isFavorite: true, image: "https://lh3.googleusercontent.com/proxy/F78G0gduWweAl_5m9SRcljNWY61k_bmz_Or6Q1pb6I2WwiOEen9kpiwRfLkoNTjcMdg_M2yP0oLgDzHcn198nK7XDiQvo4bSnDwOPSlToQJ1GfOchPplPvKH1ffgADXid963lyE" },
    { id: 4, name: "Steak", isFavorite: true, image: "data:image/jpeg;base64,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" },

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
