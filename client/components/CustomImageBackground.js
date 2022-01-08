import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

const CustomImageBackground = (props) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/bg-1.jpg')}
        resizeMode="cover"
        style={styles.image}
      >
        {props.children}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authCard: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomImageBackground;
