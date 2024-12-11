import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const Favoritescreen = () => {
  // Zustand für die Favoriten-Rezepte
  const [favorites, setFavorites] = useState([
    { id: 1, name: "Lasagne", isFavorite: true },
    { id: 2, name: "Nudelauflauf", isFavorite: true },
    { id: 3, name: "Reis mit Hähnchen", isFavorite: true },
    { id: 4, name: "Steak", isFavorite: true },
  ]);

  return (
    <View style={styles.container}>
      {/* Rezeptliste */}
      <ScrollView style={styles.recipeList}>
        {favorites.map((recipe) => (
          <View key={recipe.id} style={styles.recipeItem}>
            {/* Nur das Herz-Symbol anzeigen */}
            <Ionicons
              name="heart"
              size={24}
              color="red"
            />
            <Text style={styles.recipeName}>{recipe.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50, // Abstand von oben
  },
  recipeList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30, // Rezeptliste weiter nach unten verschieben
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  recipeName: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default Favoritescreen;
