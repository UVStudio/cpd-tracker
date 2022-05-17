import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from '../navigation/TrackerNavigator';
import { AuthNavigator } from './TrackerNavigator';
import { ActivateNavigator } from './TrackerNavigator';
import CustomIndicator from '../components/CustomIndicator';
import Startup from '../screens/Startup';

const AppNavigator = () => {
  const [isActive, setIsActive] = useState(false);

  const isAuth = useSelector((state) => !!state.auth.token);
  const isUserSet = useSelector((state) => !!state.auth.user);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  const authState = useSelector((state) => state.auth.user);

  //console.log('authState: ', authState);

  useEffect(() => {
    if (authState) {
      setIsActive(authState.active);
    }
    // console.log('authState: ', isActive);
  }, [authState]);

  console.log('isActive: ', isActive);

  return (
    <NavigationContainer>
      {isAuth && isUserSet && isActive && <BottomTabNavigator />}
      {isAuth && isUserSet && !isActive && <ActivateNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <Startup />}
      {isAuth && !isUserSet && <CustomIndicator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
