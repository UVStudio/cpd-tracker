import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Records = () => {
  return (
    <View style={styles.container}>
      <Text>Records Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Records;
