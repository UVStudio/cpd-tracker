import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

const CustomRedButton = (props) => {
  return (
    <View style={{ ...styles.buttonContainer, ...props.style }}>
      <View style={styles.shadow}>
        <Pressable
          style={styles.button}
          onPress={props.onSelect}
          android_ripple={{ color: Colors.lightRed }}
        >
          <Text style={styles.buttonText}>{props.children}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '80%',
    marginVertical: 5,
  },
  button: {
    backgroundColor: Colors.red,
  },
  buttonText: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'avenir-demibold',
  },
  shadow: {
    shadowColor: '#888',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
});

export default CustomRedButton;
