import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomStatsInfoBox = (props) => {
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'flex-start' }}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
});

export default CustomStatsInfoBox;
