import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomTitle = (props) => {
  return (
    <Text style={{ ...styles.title, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontFamily: 'sans-serif-condensed',
    alignSelf: 'flex-start',
    marginTop: 10,
    color: Colors.primary,
  },
});

export default CustomTitle;
