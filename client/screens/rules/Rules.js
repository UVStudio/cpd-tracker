import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const Rules = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <View style={styles.container}>
      {/* <Text>Hello {user.name}!</Text> */}
      <Text>Rules Screen</Text>
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

export default Rules;
