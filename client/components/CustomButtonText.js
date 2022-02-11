import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomButtonText = (props) => {
  return (
    <Text style={{ ...styles.text, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    alignSelf: 'flex-start',
    color: 'white',
    fontFamily: 'avenir-medium',
  },
});

export default CustomButtonText;
