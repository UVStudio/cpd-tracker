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
    marginVertical: 10,
    borderColor: Colors.primary,
    borderWidth: 4,
    width: '82%',
    backgroundColor: 'white',
    //iOS shadow
    shadowColor: '#171717',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    //android shadow
    elevation: 10,
    shadowColor: '#000000',
  },
});

export default CustomCard;
