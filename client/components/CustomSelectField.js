import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const CustomSelectField = (props) => {
  const { value, initialValue } = props;

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <Text {...props} style={styles.input}>
        {value === '' ? initialValue : value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
  },
  label: {
    marginVertical: 2,
    marginTop: 4,
    fontFamily: 'avenir-medium',
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderColor: '#ccc',
    borderWidth: 1,
    fontFamily: 'avenir-medium',
  },
  errorContainer: {
    marginVertical: 2,
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    fontFamily: 'avenir-medium',
  },
});

export default CustomSelectField;
