import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton';

const Timer = (props) => {
  return (
    <View style={styles.container}>
      <Text>Timer Screen</Text>
      <CustomButton onSelect={() => props.navigation.navigate('UploadSession')}>
        Upload Session
      </CustomButton>
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

export default Timer;
