import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from 'react-native';
//import { image } from '../../assets/bg-1.jpg';

const image = require('../../assets/bg-1.jpg');

const Auth = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/bg-1.jpg')}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.text}>Auth Screen</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Auth;
