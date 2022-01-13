import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomTitle = (props) => {
  return (
    <Text style={{ ...styles.title, ...props.style }}>{props.children}</Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    alignSelf: 'flex-start',
    marginTop: 10,
    color: Colors.primary,
    fontFamily: 'avenir-demibold',
  },
});

export default CustomTitle;
