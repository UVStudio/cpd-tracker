import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

// import CustomThinGreyLine from './CustomThinGreyLine';

const CustomAccordionUnit = (props) => {
  return <View style={styles.container}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 5,
  },
});

export default CustomAccordionUnit;
