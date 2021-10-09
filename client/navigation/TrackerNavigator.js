import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Auth from '../screens/auth/Auth';
import Profile from '../screens/auth/Profile';
import Timer from '../screens/timer/Timer';
import Rules from '../screens/rules/Rules';
import Records from '../screens/records/Records';
import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitleStyle: {
    fontFamily: 'sans-serif-light',
    fontSize: 28,
  },
  headerBackTitleStyle: {
    fontSize: 28,
  },
  headerBackTitle: '',
  headerTintColor: 'white',
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Auth"
        component={Auth}
        options={{ headerTitle: 'Login / Register' }}
      />
      <AuthStackNavigator.Screen name="Profile" component={Profile} />
    </AuthStackNavigator.Navigator>
  );
};

const TimerStackNavigator = createStackNavigator();

export const TimerNavigator = () => {
  return (
    <TimerStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <TimerStackNavigator.Screen name="Timer" component={Timer} />
    </TimerStackNavigator.Navigator>
  );
};

const RecordsStackNavigator = createStackNavigator();

export const RecordsNavigator = () => {
  return (
    <RecordsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <RecordsStackNavigator.Screen name="Records" component={Records} />
    </RecordsStackNavigator.Navigator>
  );
};

const RulesStackNavigator = createStackNavigator();

export const RulesNavigator = () => {
  return (
    <RulesStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <RulesStackNavigator.Screen name="Rules" component={Rules} />
    </RulesStackNavigator.Navigator>
  );
};

const ProfileStackNavigator = createStackNavigator();

export const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfileStackNavigator.Screen name="Profile" component={Profile} />
    </ProfileStackNavigator.Navigator>
  );
};

const TrackerBottomTabNavigator = createBottomTabNavigator();

const bottomTabOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color }) => {
    let iconName;

    if (route.name === 'Timer') {
      iconName = focused ? 'timer' : 'timer-outline';
      return <Ionicons name={iconName} size={32} color={color} />;
    } else if (route.name === 'Records') {
      iconName = focused ? 'document-attach' : 'document-attach-outline';
      return <Ionicons name={iconName} size={32} color={color} />;
    } else if (route.name === 'Rules') {
      iconName = focused ? 'script-text' : 'script-text-outline';
      return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
    } else if (route.name === 'Profile') {
      iconName = focused ? 'account' : 'account-outline';
      return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
    }
  },
});

export const BottomTabNavigator = () => {
  return (
    <TrackerBottomTabNavigator.Navigator
      screenOptions={bottomTabOptions}
      tabBarOptions={{
        activeTintColor: Colors.primary,
        inactiveTintColor: 'gray',
        labelPosition: 'below-icon',
        style:
          Platform.OS === 'android'
            ? { paddingBottom: 4, paddingTop: 3 }
            : { paddingTop: 6 },
      }}
    >
      <TrackerBottomTabNavigator.Screen
        name="Timer"
        component={TimerNavigator}
      />
      <TrackerBottomTabNavigator.Screen
        name="Records"
        component={RecordsNavigator}
      />
      <TrackerBottomTabNavigator.Screen
        name="Rules"
        component={RulesNavigator}
      />
      <TrackerBottomTabNavigator.Screen
        name="Profile"
        component={ProfileNavigator}
      />
    </TrackerBottomTabNavigator.Navigator>
  );
};
