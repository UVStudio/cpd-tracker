import React, { useReducer, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import currentYear from '../utils/currentYear';

const CustomSelectField = (props) => {
  const { value } = props;

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <Text {...props} style={styles.input}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'sans-serif-condensed',
    marginVertical: 2,
    marginTop: 4,
  },
  input: {
    fontSize: 16,
    fontFamily: 'sans-serif-condensed',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  errorContainer: {
    marginVertical: 2,
    marginBottom: 4,
  },
  errorText: {
    fontFamily: 'sans-serif-condensed',
    color: 'red',
    fontSize: 13,
  },
});

export default CustomSelectField;
