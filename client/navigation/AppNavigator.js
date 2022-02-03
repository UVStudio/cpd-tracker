import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from '../navigation/TrackerNavigator';
import { AuthNavigator } from './TrackerNavigator';
import CustomIndicator from '../components/CustomIndicator';
import Startup from '../screens/Startup';

const AppNavigator = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const isUserLoaded = useSelector((state) => !!state.auth.user);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);
  console.log('user loaded? ', isUserLoaded);

  return (
    <NavigationContainer>
      {isAuth && isUserLoaded && <BottomTabNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <Startup />}
      {isAuth && !isUserLoaded && <CustomIndicator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
