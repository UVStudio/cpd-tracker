import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomOperationalContainer = (props) => {
  return (
    <View style={{ ...styles.operationalContainer, ...props.style }}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  operationalContainer: {
    width: '90%',
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomOperationalContainer;
