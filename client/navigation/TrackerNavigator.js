import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Auth from '../screens/auth/Auth';
import Profile from '../screens/auth/Profile';
import Stats from '../screens/stats/Stats';
import Timer from '../screens/timer/Timer';
import UploadSession from '../screens/timer/UploadSession';
import Rules from '../screens/rules/Rules';
import Records from '../screens/records/Records';
import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitleStyle: {
    fontFamily: 'sans-serif-light',
    fontSize: 24,
  },
  headerBackTitleStyle: {
    fontSize: 24,
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

const CPDStackNavigator = createStackNavigator();
const CPDNavigator = () => {
  return (
    <CPDStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <CPDStackNavigator.Screen name="Your CPD Statistics" component={Stats} />
    </CPDStackNavigator.Navigator>
  );
};
const TimerStackNavigator = createStackNavigator();
const TimerNavigator = () => {
  return (
    <TimerStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <TimerStackNavigator.Screen
        name="Non-Verifiable Hours"
        component={Timer}
      />
      <TimerStackNavigator.Screen
        name="UploadSession"
        component={UploadSession}
      />
    </TimerStackNavigator.Navigator>
  );
};
const RecordsStackNavigator = createStackNavigator();
const RecordsNavigator = () => {
  return (
    <RecordsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <RecordsStackNavigator.Screen
        name="Certificate Records"
        component={Records}
      />
    </RecordsStackNavigator.Navigator>
  );
};
const RulesStackNavigator = createStackNavigator();
const RulesNavigator = () => {
  return (
    <RulesStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <RulesStackNavigator.Screen name="CPD Rules" component={Rules} />
    </RulesStackNavigator.Navigator>
  );
};
const ProfileStackNavigator = createStackNavigator();
const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfileStackNavigator.Screen name="Your Profile" component={Profile} />
    </ProfileStackNavigator.Navigator>
  );
};

const TrackerBottomTabNavigator = createBottomTabNavigator();
export const BottomTabNavigator = () => {
  return (
    <TrackerBottomTabNavigator.Navigator screenOptions={bottomTabOptions}>
      <TrackerBottomTabNavigator.Screen
        name="CPD Stats"
        component={CPDNavigator}
        options={{ headerShown: false }}
      />
      <TrackerBottomTabNavigator.Screen
        name="Timer"
        component={TimerNavigator}
        options={{ headerShown: false }}
      />
      <TrackerBottomTabNavigator.Screen
        name="Records"
        component={RecordsNavigator}
        options={{ headerShown: false }}
      />
      <TrackerBottomTabNavigator.Screen
        name="Rules"
        component={RulesNavigator}
        options={{ headerShown: false }}
      />
      <TrackerBottomTabNavigator.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ headerShown: false }}
      />
    </TrackerBottomTabNavigator.Navigator>
  );
};

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
    } else if (route.name === 'CPD Stats') {
      iconName = focused ? 'stats-chart' : 'stats-chart-outline';
      return <Ionicons name={iconName} size={32} color={color} />;
    }
  },
  tabBarActiveTintColor: Colors.primary,
  tabBarInactiveTintColor: 'gray',
  tabBarLabelPosition: 'below-icon',
  tabBarStyle: [
    {
      display: 'flex',
    },
    null,
  ],
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitleStyle: {
    fontFamily: 'sans-serif-light',
    fontSize: 24,
  },
  headerBackTitleStyle: {
    fontSize: 24,
  },
  headerBackTitle: '',
  headerTintColor: 'white',
});
