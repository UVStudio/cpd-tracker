import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CustomScrollView from '../../components/CustomScrollView';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';

import * as certActions from '../../store/actions/cert';
import { secondsToHms, secondsToTime } from '../../utils/timeConversions';
import currentYear from '../../utils/currentYear';
import Colors from '../../constants/Colors';
import { FORM_INPUT_UPDATE } from '../../store/types';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startButton, setStartButton] = useState('Start');
  const [sessionLength, setSessionLength] = useState('');

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      sessionName: '',
    },
    inputValidities: {
      sessionName: false,
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const today = new Date(Date.now()).toDateString();
  const hours = Math.round(seconds / 3600) / 100;

  //console.log('formState: ', formState);

  const recordSession = async () => {
    console.log('session length second ', seconds);
    console.log('session length hours ', hours);
    console.log('formatted todays date: ', today);
    console.log('current year: ', currentYear);

    const verifiable = 0;
    const ethics = 0;

    try {
      await dispatch(
        certActions.addCPDHours(currentYear, verifiable, hours, ethics)
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  const finish = () => {
    setIsActive(false);
    setSessionLength(secondsToTime(seconds));
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
      setStartButton('Pause');
      setSessionLength('');
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
      setStartButton('Resume');
    }
    return () => {
      clearInterval(interval);
      setStartButton('Start');
    };
  }, [isActive, seconds]);

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Record your session</CustomTitle>
        <CustomGreyLine />
        <CustomOperationalContainer>
          <View style={styles.timerContainer}>
            <Text style={styles.timeText}>{secondsToHms(seconds)}</Text>
          </View>
          <CustomButton onSelect={() => toggle()}>{startButton}</CustomButton>
          <CustomButton onSelect={() => finish()}>Finish Session</CustomButton>
          <CustomThinGreyLine style={{ marginVertical: 20 }} />
          {sessionLength !== '' ? (
            <View style={styles.passFromOperationalContainer}>
              <Text style={styles.sessionLengthText}>
                Session Length: {sessionLength}
              </Text>
              <CustomInput
                id="sessionName"
                label="Session Name"
                keyboardType="default"
                autoCapitalize="characters"
                errorText="Please enter session name"
                initialValue=""
                required
                onInputChange={inputChangeHandler}
              />
              <CustomButton
                onSelect={recordSession}
                style={{ marginVertical: 20 }}
              >
                Save Session
              </CustomButton>
            </View>
          ) : null}
        </CustomOperationalContainer>
      </CustomScrollView>
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    width: '100%',
    height: 70,
    borderWidth: 1,
    borderColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontFamily: 'sans-serif-light',
    fontSize: 40,
    color: Colors.darkGrey,
  },
  sessionLengthText: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 20,
    marginBottom: 15,
  },
  passFromOperationalContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Timer;
