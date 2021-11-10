import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomFaintThinGreyLine = (props) => {
  return <View style={{ ...styles.greyline, ...props.style }}></View>;
};

const styles = StyleSheet.create({
  greyline: {
    width: '100%',
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 1,
    opacity: 0.5,
    marginVertical: 2,
  },
});

export default CustomFaintThinGreyLine;
