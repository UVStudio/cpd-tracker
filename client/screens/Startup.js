import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

const Startup = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        dispatch(authActions.setDidTryAL());
        return;
      }
      const transformedData = JSON.parse(userData);
      //destructuring - names have to be same as keys in set Item in AsyncStorage
      //from saveDataToStorage
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);
      if (expirationDate <= new Date() || !token || !userId) {
        dispatch(authActions.setDidTryAL());
        return;
      }
      const expirationTime = expirationDate.getTime() - new Date().getTime();
      dispatch(authActions.authenticate(token, userId, expirationTime));
    };
    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Startup;
