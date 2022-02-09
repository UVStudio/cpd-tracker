import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Auth from '../screens/auth/Auth';
import Profile from '../screens/auth/Profile';
import Privacy from '../screens/auth/Privacy';
import ForgotPassword from '../screens/auth/ForgotPassword';
import Verification from '../screens/auth/Verification';
import ResetPassword from '../screens/auth/ResetPassword';
import Stats from '../screens/stats/Stats';
import CertHoursDetails from '../screens/stats/CertHoursDetails';
import NonVerHoursDetails from '../screens/stats/NonVerHoursDetails';
import TotalCPDHoursDetails from '../screens/stats/TotalCPDHoursDetails';
import PastCPDHoursInput from '../screens/stats/PastCPDHoursInput';
import OverwriteCPDHours from '../screens/stats/OverwriteCPDHours';
import EditNonVerSession from '../screens/stats/EditNonVerSession';
import EditCertCourse from '../screens/stats/EditCertCourse';
import Timer from '../screens/timer/Timer';
import Rules from '../screens/rules/Rules';
import Records from '../screens/records/Records';
import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitleStyle: {
    fontFamily: 'avenir-bold',
    fontSize: 24,
  },
  headerBackTitleVisible: false,
  headerTintColor: 'white',
};

const AuthStackNavigator = createNativeStackNavigator();
export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Auth"
        component={Auth}
        options={{ headerTitle: 'Login / Register' }}
      />
      <AuthStackNavigator.Screen name="Profile" component={Profile} />
      <AuthStackNavigator.Screen
        name="Forgot Password"
        component={ForgotPassword}
      />
      <AuthStackNavigator.Screen
        name="Verification Code"
        component={Verification}
      />
      <AuthStackNavigator.Screen
        name="Reset Password"
        component={ResetPassword}
      />
    </AuthStackNavigator.Navigator>
  );
};

const CPDStackNavigator = createNativeStackNavigator();
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
      <CPDStackNavigator.Screen
        name="Edit Verifiable Course"
        component={EditCertCourse}
      />
    </CPDStackNavigator.Navigator>
  );
};
const TimerStackNavigator = createNativeStackNavigator();
const TimerNavigator = () => {
  return (
    <TimerStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <TimerStackNavigator.Screen
        name="Non-Verifiable Hours"
        component={Timer}
      />
    </TimerStackNavigator.Navigator>
  );
};
const RecordsStackNavigator = createNativeStackNavigator();
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
const RulesStackNavigator = createNativeStackNavigator();
const RulesNavigator = () => {
  return (
    <RulesStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <RulesStackNavigator.Screen
        name="Provincial CPD Rules"
        component={Rules}
      />
    </RulesStackNavigator.Navigator>
  );
};
const ProfileStackNavigator = createNativeStackNavigator();
const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfileStackNavigator.Screen name="Your Profile" component={Profile} />
      <ProfileStackNavigator.Screen
        name="Privacy Statement"
        component={Privacy}
      />
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
});
