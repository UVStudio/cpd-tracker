import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as authActions from '../../store/actions/auth';

import CustomButton from '../../components/CustomButton';
import CustomRedCard from '../../components/CustomRedCard';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const Profile = () => {
  const [cardText, setCardText] = useState('');
  const [errorFromCard, setErrorFromCard] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await dispatch(authActions.logout());
  };

  const cardTextHandler = async () => {
    setCardText(
      `Are you sure you want to delete your account? 

All data and certificates will be erased permanently. The app does not keep any backup data.`
    );
  };

  return (
    <CustomScreenContainer>
      <Text>Profile Screen</Text>
      <Text>Hello {user.name}!</Text>
      <Text>You report to {user.province}.</Text>
      <Text>Your CPD year: {user.cpdYear}</Text>
      <Text>Your CPD month: {user.cpdMonth}</Text>
      <CustomButton onSelect={logoutHandler}>Logout</CustomButton>
      <CustomButton onSelect={cardTextHandler}>
        Delete Your Account
      </CustomButton>
      {cardText ? (
        <CustomRedCard
          text={cardText}
          toShow={setCardText}
          toPassError={setErrorFromCard}
        />
      ) : null}
      {errorFromCard ? <CustomErrorCard /> : null}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Profile;
