import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors.js';

const CustomCard = (props) => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 10,
    borderColor: Colors.primary,
    borderWidth: 4,
    width: '86%',
    backgroundColor: 'white',
  },
});

export default CustomCard;
