import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomAccordionUnit = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default CustomAccordionUnit;
