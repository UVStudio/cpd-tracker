import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomFullWidthContainer = (props) => {
  return (
    <View style={{ ...styles.operationalContainer, ...props.style }}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  operationalContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomFullWidthContainer;
