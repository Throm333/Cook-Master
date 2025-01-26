import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import supabase from "../data/API_Config";

const Favoritescreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

  const handleRemoveFavorite = async (id) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("recipe_id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error removing favorite:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.recipeList}>
        {favorites.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.recipeItem}
            onPress={() => openModal(recipe)}
          >
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveFavorite(recipe.id)}>
              <Ionicons name="heart" size={24} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
                <Image
                  source={{ uri: selectedRecipe.image }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalTitle}>{selectedRecipe.name}</Text>
                <Text style={styles.modalDescription}>Rezeptdetails</Text>
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
