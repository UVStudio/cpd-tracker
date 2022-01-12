import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import Colors from '../constants/Colors';

const CustomText = (props) => {
  return (
    <Text style={{ ...styles.text, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    alignSelf: 'flex-start',
    color: Colors.darkGrey,
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-condensed'
        : 'AvenirNextCondensed-Medium',
  },
});

export default CustomText;
