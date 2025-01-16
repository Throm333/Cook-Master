import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, Text, View, Button, Image } from "react-native";
import { RollInRight } from 'react-native-reanimated';
import Abend from '../../assets/images/abendsIcon.jpg';


const Weekplanerscreen = () => {
  const days = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
  const times = [
  <Image source={require('../../assets/images/morgensIcon.jpg')} style={{ width: 50, height: 50 }}/>, 
  <Image source={require('../../assets/images/mittagsIcon.jpg')} style={{ width: 50, height: 50 }}/>, 
  <Image source={require('../../assets/images/abendsIcon.jpg')} style={{ width: 50, height: 50 }}/>
                ];
  const [modalVisible, setModalVisible] = useState(false);

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
                  style={styles.cell}
                  key={`${day}-${time}`}
                  onPress={() => setModalVisible(true)}
                >
                  <Text>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Zutatenliste.</Text>

      </View>
      <View style={styles.container}>

      {/* Modal-Komponente */}
      <Modal
        animationType="slide"        // Optionen: 'none', 'slide', 'fade'
        transparent={true}          // HIntergrund transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        {/* Container für den halbtransparenten Hintergrund */}
        <View style={styles.modalOverlay}>
          {/* Inhalt des Modals */}
          <View style={styles.modalContent}>

            <Text style={styles.modalText}>Favorites</Text>
            
            <View style={styles.modalExit}>

              <Button title="X" onPress={() => setModalVisible(false)} />

            </View>

          </View>
        </View>
      </Modal>
    </View>
    </View>
  );
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
    borderWidth: 0,
    borderRadius: 0,
    overflow: "hidden",
    width: "95%",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 0,
    textAlign: "center",
    borderWidth: 0,
    borderColor: "#ccc",
    fontSize: 16,
    color: "#000",
  },
  headerCell: {
    padding: 5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Abdunkelung des Hintergrundes
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    fontSize: 25,
  },
  modalExit: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
});

export default Weekplanerscreen;
