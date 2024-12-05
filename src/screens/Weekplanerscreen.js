import { StyleSheet, Text, View } from "react-native";

const Weekplanerscreen = () => {
  return (
    <View style={styles.container}>
      <Text>Create a weekly planner here</Text>
    </View>
  );
};

const Weekplanner = () => {
  return (
    <body>
      <table>
        <thead>
          <tr>
            <th>MO</th>
            <th>DI</th>
            <th>MI</th>
            <th>DO</th>
            <th>FR</th>
            <th>SA</th>
            <th>SO</th>
          </tr>
        </thead>
        <tbody>
         
          <tr>
            <td>Früh</td>
            <td>Früh</td>
            <td>Früh</td>
            <td>Früh</td>
            <td>Früh</td>
            <td>Früh</td>
            <td>Früh</td>
          </tr>
          <tr>
            <td>Mittag</td>
            <td>Mittag</td>
            <td>Mittag</td>
            <td>Mittag</td>
            <td>Mittag</td>
            <td>Mittag</td>
            <td>Mittag</td>
          </tr>
          <tr>
            <td>Abend</td>
            <td>Abend</td>
            <td>Abend</td>
            <td>Abend</td>
            <td>Abend</td>
            <td>Abend</td>
            <td>Abend</td>
          </tr>
        </tbody>
      </table>
    </body>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Weekplanerscreen;
