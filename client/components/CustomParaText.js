import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import Colors from '../constants/Colors';

const CustomParaText = (props) => {
  return (
    <Text style={{ ...styles.text, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 16,
    color: Colors.darkGrey,
    fontFamily: 'avenir-medium',
    alignSelf: 'flex-start',
  },
});

export default CustomParaText;
