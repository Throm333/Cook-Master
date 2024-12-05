import { StyleSheet, Text, View } from "react-native";

const Favoritescreen = () => {
  return (
    <View style={styles.container}>
      <Text>Fav!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Favoritescreen;
