import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomRowLeft = (props) => {
  return (
    <View style={{ ...styles.rowSpaceLeft, ...props.style }}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  rowSpaceLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
  },
});

export default CustomRowLeft;
