import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Colors from '../constants/Colors';

const CustomSubtitle = (props) => {
  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <Text style={{ ...styles.subtitle, ...props.style }}>
        {props.children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 22,
    color: Colors.primary,
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-condensed'
        : 'AvenirNextCondensed-Medium',
  },
});

export default CustomSubtitle;
