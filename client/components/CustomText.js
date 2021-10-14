import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomText = (props) => {
  return (
    <Text style={{ ...styles.subtitle, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    fontFamily: 'sans-serif-condensed',
    color: Colors.darkGrey,
  },
});

export default CustomText;
