import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from '../navigation/TrackerNavigator';
import { AuthNavigator } from './TrackerNavigator';
import Startup from '../screens/Startup';

const AppNavigator = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {isAuth && <BottomTabNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <Startup />}
    </NavigationContainer>
  );
};

export default AppNavigator;
