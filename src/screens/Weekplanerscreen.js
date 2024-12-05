import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

const Weekplanerscreen = () => {
  const days = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
  const times = ["Früh", "Mittag", "Abend"];

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Weekly Planner</Text>

      <View style={styles.table}>
        <View style={styles.row}>
          {days.map((day) => (
            <Text style={[styles.cell, styles.headerCell]} key={day}>
              {day}
            </Text>
          ))}
        </View>

        {times.map((time) => (
          <View style={styles.row} key={time}>
            {days.map((day) => (
              <Text style={styles.cell} key={`${day}-${time}`}>
                {time}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
});

export default Weekplanerscreen;
