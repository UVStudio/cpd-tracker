import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomThinGreyLine = (props) => {
  return <View style={{ ...styles.greyline, ...props.style }}></View>;
};

const styles = StyleSheet.create({
  greyline: {
    width: '100%',
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
    marginVertical: 2,
    marginBottom: 5,
  },
});

export default CustomThinGreyLine;
