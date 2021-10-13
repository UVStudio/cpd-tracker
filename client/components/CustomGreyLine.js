import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomGreyLine = () => {
  return <View style={styles.greyline}></View>;
};

const styles = StyleSheet.create({
  greyline: {
    width: '100%',
    borderBottomColor: Colors.grey,
    borderBottomWidth: 2,
  },
});

export default CustomGreyLine;
