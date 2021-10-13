import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const Timer = (props) => {
  const user = useSelector((state) => state.auth.user);
  const authState = useSelector((state) => state.auth);
  //console.log('user: ', user);
  console.log('authState: ', authState);

  return (
    <CustomScreenContainer>
      {/* <Text>Hello {user.name}!</Text> */}
      <Text>Timer Screen</Text>
      <CustomButton onSelect={() => props.navigation.navigate('UploadSession')}>
        Upload Session
      </CustomButton>
    </CustomScreenContainer>
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
