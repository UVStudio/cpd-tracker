import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import CustomTitle from '../components/CustomTitle';
import Colors from '../constants/Colors';

const CustomIndicator = (props) => {
  const { text } = props;

  return (
    <View style={styles.indicatorContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <CustomTitle style={{ alignSelf: 'center' }}>{text}</CustomTitle>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomIndicator;
