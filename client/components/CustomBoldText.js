import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomBoldText = (props) => {
  return (
    <Text style={{ ...styles.subtitle, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontFamily: 'sans-serif-condensed',
    color: Colors.dark,
  },
});

export default CustomBoldText;
