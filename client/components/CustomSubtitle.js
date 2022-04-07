import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const CustomSubtitle = (props) => {
  return (
    <View style={[{ alignSelf: 'flex-start' }, { ...props.style }]}>
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
    fontFamily: 'avenir-medium',
  },
});

export default CustomSubtitle;
