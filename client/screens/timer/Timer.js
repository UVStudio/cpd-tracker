import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomIndicator from '../../components/CustomIndicator';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomSelectField from '../../components/CustomSelectField';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomScrollView from '../../components/CustomScrollView';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';

import * as userActions from '../../store/actions/user';
import * as nonVerActions from '../../store/actions/nonVer';
import { secondsToHms, secondsToTime } from '../../utils/timeConversions';
import { formReducer } from '../../utils/formReducer';
import currentYear from '../../utils/currentYear';
import Colors from '../../constants/Colors';
import { FORM_INPUT_UPDATE } from '../../store/types';

const Timer = () => {
  const [showInputType, setShowInputType] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startButton, setStartButton] = useState('Start');
  const [sessionLength, setSessionLength] = useState('');
  const [cardText, setCardText] = useState('');
  const [error, setError] = useState('');
  const [savingDirect, setSavingDirect] = useState(false);
  const [savingTimed, setSavingTimed] = useState(false);

  //for direct Input only
  const [date, setDate] = useState(new Date(Date.now()));
  const [show, setShow] = useState(false);

  const authState = useSelector((state) => state.auth.user);
  const userState = useSelector((state) => state.user.user);

  const user = userState ? userState : authState;

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      sessionName: '',
      directHours: '',
    },
    inputValidities: {
      sessionName: false,
      directHours: false,
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

  const today = new Date(Date.now()).toDateString(); //watch this line in production
  const hours = Number((seconds / 3600).toFixed(2));

  const saveTimedSession = async () => {
    // console.log('session length second ', seconds);
    // console.log('session length hours ', hours);
    // console.log('typeof hours ', typeof hours);
    // console.log('formatted todays date: ', today);
    // console.log('current year: ', currentYear);
    // console.log('formState: ', formState);
    setSavingTimed(true);
    const sessionName = formState.inputValues.sessionName;

    try {
      await dispatch(
        nonVerActions.addNonVerSession(currentYear, today, hours, sessionName)
      );
      await dispatch(userActions.getUser());
      setSavingTimed(false);
      setCardText('Non-Verifiable session successfully saved');
      setSeconds(0);
      setSessionLength('');
      formState.inputValues.sessionName = '';
    } catch (err) {
      setSavingTimed(false);
      console.log(err.message);
      setError(err.message);
    }
  };

  const toggle = () => {
    if (seconds === 0) {
      setCardText(
        'The phone will stay awake while the timer is running. You might want to keep your phone charged.'
      );
    }
    activateKeepAwake();
    setIsActive(!isActive);
  };

  const finish = () => {
    if (seconds < 60) {
      return setCardText(
        'The shortest timed session you can save is one minute. Please study for a bit longer.'
      );
    }
    deactivateKeepAwake();
    setIsActive(false);
    setSessionLength(secondsToTime(seconds));
  };

  const cancel = () => {
    deactivateKeepAwake();
    setIsActive(false);
    setSeconds(0);
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

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const formattedDate = date.toDateString();
  const year = formattedDate.split(' ').pop();
  //console.log('direct input date formatted: ', formattedDate);
  //console.log('year: ', year);

  const saveDirectSession = async () => {
    setSavingDirect(true);
    const sessionName = formState.inputValues.sessionName;
    const directHours = Number(formState.inputValues.directHours);

    try {
      await dispatch(
        nonVerActions.addNonVerSession(
          year,
          formattedDate,
          directHours,
          sessionName
        )
      );
      await dispatch(userActions.getUser());
      setCardText('Non-Verifiable session successfully saved');
      setSavingDirect(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setSavingDirect(false);
    }
  };

  if (!user) {
    return <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <Pressable
          style={{ alignSelf: 'flex-start' }}
          onPress={() => setShowInputType('timer')}
        >
          <CustomTitle>Time Your Session</CustomTitle>
        </Pressable>
        <CustomGreyLine />
        {showInputType === 'timer' ? (
          <CustomOperationalContainer>
            <View style={styles.timerContainer}>
              <Text style={styles.timeText}>{secondsToHms(seconds)}</Text>
            </View>
            <CustomButton onSelect={() => toggle()}>{startButton}</CustomButton>
            <CustomButton onSelect={() => finish()}>
              Finish Session
            </CustomButton>
            {seconds > 0 && !isActive && sessionLength === '' ? (
              <CustomButton onSelect={() => cancel()}>
                Cancel Session
              </CustomButton>
            ) : null}
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
                {savingTimed ? (
                  <CustomButton style={{ marginVertical: 20 }}>
                    Saving Session...
                  </CustomButton>
                ) : (
                  <CustomButton
                    onSelect={saveTimedSession}
                    style={{ marginVertical: 20 }}
                  >
                    Save Timed Session
                  </CustomButton>
                )}
              </View>
            ) : null}
          </CustomOperationalContainer>
        ) : null}

        <Pressable
          style={{ alignSelf: 'flex-start' }}
          onPress={() => setShowInputType('direct')}
        >
          <CustomTitle>Direct Session Input</CustomTitle>
        </Pressable>
        <CustomGreyLine />
        {showInputType === 'direct' ? (
          <CustomOperationalContainer>
            <View style={{ width: '100%' }}>
              <Pressable onPress={() => setShow(true)}>
                <CustomSelectField
                  id="directDate"
                  label="Session Date"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  errorText="Please enter session year"
                  placeholderColor={Colors.darkGrey}
                  value={formattedDate}
                  required
                />
              </Pressable>
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
            <CustomInput
              id="sessionName"
              label="Session Name"
              keyboardType="default"
              autoCapitalize="characters"
              errorText="Please enter verifiable course name"
              placeholder="ie: ACCOUNTING MAGAZINE READING"
              placeholderColor={Colors.lightGrey}
              onInputChange={inputChangeHandler}
              initialValue=""
              required
            />
            <CustomInput
              id="directHours"
              label="Session Duration (hours)"
              keyboardType="numeric"
              autoCapitalize="none"
              errorText="Please enter session duration"
              placeholder="ie: 2"
              placeholderColor={Colors.lightGrey}
              onInputChange={inputChangeHandler}
              initialValue=""
              required
            />
            {savingDirect ? (
              <CustomButton style={{ marginVertical: 20 }}>
                Saving Direct Session...
              </CustomButton>
            ) : (
              <CustomButton
                onSelect={saveDirectSession}
                style={{ marginVertical: 20 }}
              >
                Save Direct Session
              </CustomButton>
            )}
          </CustomOperationalContainer>
        ) : null}
      </CustomScrollView>
      {cardText !== '' ? (
        <CustomMessageCard text={cardText} toShow={setCardText} />
      ) : null}
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
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
    fontSize: 40,
    color: Colors.darkGrey,
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-condensed'
        : 'AvenirNextCondensed-UltraLight',
  },
  sessionLengthText: {
    fontSize: 20,
    marginBottom: 15,
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-condensed'
        : 'AvenirNextCondensed-Medium',
  },
  passFromOperationalContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Timer;
