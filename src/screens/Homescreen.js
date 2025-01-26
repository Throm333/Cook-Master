import React from "react"
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { HomeController } from "../controller/HomeController"

const HomeScreen = () => {
  const navigation = useNavigation()
  const { recipes, favorites, searchQuery, setSearchQuery, toggleFavorite } = HomeController()

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate("DetailRecipe", { title: item.title, id: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Suche nach Rezepten..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity style={styles.searchIconContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.recipeList}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginVertical: 16,
    marginHorizontal: "2%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  searchIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  searchIcon: {
    fontSize: 24,
    color: "#007BFF",
  },
  recipeList: {
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  row: {
    flex: 1,
    justifyContent: "flex-start",
  },
  recipeCard: {
    flex: 0,
    width: "48%",
    margin: "1%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  recipeImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  recipeTitle: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  heartIcon: {
    position: "absolute",
    right: 2,
    top: 2,
  },
})

export default HomeScreen

