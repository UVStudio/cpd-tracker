import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as authActions from '../../store/actions/auth';

import CustomButton from '../../components/CustomButton';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await dispatch(authActions.logout());
  };

  return (
    <CustomScreenContainer>
      <Text>Profile Screen</Text>
      <Text>Hello {user.name}!</Text>
      <Text>You report to {user.province}.</Text>
      <CustomButton onSelect={logoutHandler}>Logout</CustomButton>
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Profile;
