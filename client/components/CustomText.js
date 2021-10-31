import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Colors from '../constants/Colors';

const CustomText = (props) => {
  return (
    <Text style={{ ...styles.subtitle, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    color: Colors.darkGrey,
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-condensed'
        : 'AvenirNextCondensed-Medium',
  },
});

export default CustomText;
