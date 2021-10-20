import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomScrollView from '../../components/CustomScrollView';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';

import * as authActions from '../../store/actions/auth';
import * as nonVerActions from '../../store/actions/nonVer';
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
  const [msgCard, setMsgCard] = useState(false);

  const user = useSelector((state) => state.auth.user);

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
  const hours = Number((seconds / 3600).toFixed(2));

  const recordSession = async () => {
    // console.log('session length second ', seconds);
    // console.log('session length hours ', hours);
    // console.log('typeof hours ', typeof hours);
    // console.log('formatted todays date: ', today);
    // console.log('current year: ', currentYear);
    // console.log('formState: ', formState);

    const sessionName = formState.inputValues.sessionName;

    try {
      await dispatch(
        nonVerActions.addNonVerSession(currentYear, today, hours, sessionName)
      );
      await dispatch(authActions.getUser());
      setMsgCard(true);
      setSeconds(0);
      setSessionLength('');
      formState.inputValues.sessionName = '';
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

  if (!user) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
      {msgCard ? (
        <CustomMessageCard
          toShow={setMsgCard}
          text="Non-Verifiable session has been successfully saved."
        />
      ) : null}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
