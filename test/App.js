import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

export default function App() {
  const getPDF = async () => {
    try {
      const response = await axios.get(`http://192.168.0.198:5000/api/pdf/`);

      // if (response) {
      //   await WebBrowser.openBrowserAsync('http://192.168.0.198:5000/api/pdf/');
      // }
    } catch (err) {
      console.log(err);
    }
  };

  getPDF();

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
