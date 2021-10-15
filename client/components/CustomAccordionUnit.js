import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
