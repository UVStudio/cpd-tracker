import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import * as authActions from '../../store/actions/auth';

const Profile = () => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await dispatch(authActions.logout());
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <CustomButton onSelect={logoutHandler}>Logout</CustomButton>
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

export default Profile;
