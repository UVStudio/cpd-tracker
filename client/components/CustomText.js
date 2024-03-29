import React from 'react';
import { Text, StyleSheet } from 'react-native';
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
    fontFamily: 'avenir-medium',
  },
});

export default CustomText;
