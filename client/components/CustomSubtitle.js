import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import Colors from '../constants/Colors';

const CustomSubtitle = (props) => {
  return (
    <Text style={{ ...styles.subtitle, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 22,
    color: Colors.primary,
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-condensed'
        : 'AvenirNextCondensed-Medium',
  },
});

export default CustomSubtitle;
