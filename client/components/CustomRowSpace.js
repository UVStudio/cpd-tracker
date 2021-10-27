import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomRowSpace = (props) => {
  return <View style={styles.rowSpaceBetween}>{props.children}</View>;
};

const styles = StyleSheet.create({
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default CustomRowSpace;
