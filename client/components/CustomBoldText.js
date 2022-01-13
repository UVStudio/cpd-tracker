import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomBoldText = (props) => {
  return (
    <Text style={{ ...styles.subtitle, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontFamily: 'avenir-demibold',
    color: Colors.dark,
  },
});

export default CustomBoldText;
