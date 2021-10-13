import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomScreenContainer = (props) => {
  return (
    <View style={styles.ScreenContainer}>
      <View style={styles.InnerContainer}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  InnerContainer: {
    width: '94%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomScreenContainer;
