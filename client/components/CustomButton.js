import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

const CustomButton = (props) => {
  return (
    <View style={styles.shadow}>
      <Pressable
        style={{ ...styles.button, ...props.style }}
        onPress={props.onSelect}
      >
        <Text style={styles.buttonText}>{props.children}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'sans-serif-condensed',
  },
  shadow: {
    shadowColor: '#888',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
});

export default CustomButton;
