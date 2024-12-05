import { StyleSheet, Text, View } from "react-native";

const Weekplanerscreen = () => {
  return (
    <View style={styles.container}>
      <Text>Create a weekly planner here</Text>
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

export default Weekplanerscreen;
