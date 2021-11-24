import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Auth from '../screens/auth/Auth';
import Profile from '../screens/auth/Profile';
import Stats from '../screens/stats/Stats';
import CertHoursDetails from '../screens/stats/CertHoursDetails';
import NonVerHoursDetails from '../screens/stats/NonVerHoursDetails';
import TotalCPDHoursDetails from '../screens/stats/TotalCPDHoursDetails';
import PastCPDHoursInput from '../screens/stats/PastCPDHoursInput';
import OverwriteCPDHours from '../screens/stats/OverwriteCPDHours';
import EditNonVerSession from '../screens/stats/EditNonVerSession';
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
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-light'
        : 'AvenirNextCondensed-Medium',
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
      <CPDStackNavigator.Screen
        name="Verifiable Details"
        component={CertHoursDetails}
      />
      <CPDStackNavigator.Screen
        name="Non-Verifiable Details"
        component={NonVerHoursDetails}
      />
      <CPDStackNavigator.Screen
        name="Total CPD Details"
        component={TotalCPDHoursDetails}
      />
      <CPDStackNavigator.Screen
        name="CPD Hours Setup"
        component={PastCPDHoursInput}
      />
      <CPDStackNavigator.Screen
        name="Overwrite CPD Hours"
        component={OverwriteCPDHours}
      />
      <CPDStackNavigator.Screen
        name="Edit Non-Verifiable Session"
        component={EditNonVerSession}
      />
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
        name="Statistics"
        component={CPDNavigator}
        options={{ headerShown: false }}
      />
      <TrackerBottomTabNavigator.Screen
        name="Non-Verifiable"
        component={TimerNavigator}
        options={{ headerShown: false }}
      />
      <TrackerBottomTabNavigator.Screen
        name="Verifiable"
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

    if (route.name === 'Non-Verifiable') {
      iconName = focused ? 'timer' : 'timer-outline';
      return <Ionicons name={iconName} size={32} color={color} />;
    } else if (route.name === 'Verifiable') {
      iconName = focused ? 'document-attach' : 'document-attach-outline';
      return <Ionicons name={iconName} size={32} color={color} />;
    } else if (route.name === 'Rules') {
      iconName = focused ? 'script-text' : 'script-text-outline';
      return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
    } else if (route.name === 'Profile') {
      iconName = focused ? 'account' : 'account-outline';
      return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
    } else if (route.name === 'Statistics') {
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
