import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

import Colors from '../constants/Colors';
import CustomButton from './CustomButton';

import delayButton from '../utils/delayButton';

const CustomConfirmActionCard = (props) => {
  const {
    text,
    toShow,
    buttonText,
    savingButtonText,
    confirmAction,
    actionLoading,
  } = props;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{text}</Text>
        <CustomButton onSelect={() => delayButton(toShow, '', 250)}>
          Nevermind!
        </CustomButton>
        {actionLoading ? (
          <CustomButton style={{ marginTop: 15 }}>
            {savingButtonText}
          </CustomButton>
        ) : (
          <CustomButton
            style={{ marginTop: 15 }}
            onSelect={() => confirmAction()}
          >
            {buttonText}
          </CustomButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '86%',
    backgroundColor: '#fff',
    opacity: 1,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: Colors.primary,
    //iOS shadow
    shadowColor: '#171717',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    //android shadow
    elevation: 10,
    shadowColor: '#000000',
  },
  innerContainer: {
    width: '100%',
    padding: 20,
    marginBottom: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-condensed'
        : 'AvenirNextCondensed-Medium',
  },
});

export default CustomConfirmActionCard;
