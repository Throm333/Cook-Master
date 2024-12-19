import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const Weekplanerscreen = () => {
  const days = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
  const times = ["Früh", "Mittag", "Abend"];

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
          {times.map((time) => (
            <View style={styles.row} key={time}>
              {days.map((day) => (
                <TouchableOpacity
                style={styles.cell} key={`${day}-${time}`}
                onPress={() => handleCellPress(day, time)}
                >
                  <Text >
                    {time}
                 </Text>
                </TouchableOpacity>
              ))}
                
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>
          Zutatenliste.
        </Text>
      </View>
    </View>
  );
};

const handleCellPress = (day, time) => {
  alert(`Zelle ${day} ${time} wurde geklickt!`);
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    width: "90%",
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
    fontSize: 16,
    color: "#000",
  },
  headerCell: {
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
});

export default Weekplanerscreen;
