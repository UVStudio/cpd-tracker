import React, {
  useState,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { Transition, Transitioning } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomIndicator from '../../components/CustomIndicator';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomSelectField from '../../components/CustomSelectField';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomScrollView from '../../components/CustomScrollView';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';
import CustomSpinner from '../../components/CustomSpinner';

import * as authActions from '../../store/actions/auth';
import * as nonVerActions from '../../store/actions/nonVer';

import { secondsToHms, secondsToTime } from '../../utils/timeConversions';
import { formReducer } from '../../utils/formReducer';
import currentYear from '../../utils/currentYear';
import Colors from '../../constants/Colors';
import { FORM_INPUT_UPDATE } from '../../store/types';
import { hoursRequiredLogic } from '../../utils/hoursRequiredLogic';

const Timer = () => {
  const [showInputType, setShowInputType] = useState('timer');
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
  const user = authState;

  const dispatch = useDispatch();
  const ref = useRef();

  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={600} delayMs={100} />
      <Transition.Change />
      <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
  );

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
    setSavingTimed(true);
    const sessionName = formState.inputValues.sessionName;

    try {
      await dispatch(
        nonVerActions.addNonVerSession(currentYear, today, hours, sessionName)
      );
      await dispatch(authActions.getUser());
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
      await dispatch(authActions.getUser());
      setSavingDirect(false);
      setCardText('Non-Verifiable session successfully saved');
    } catch (err) {
      setSavingDirect(false);
      console.log(err.message);
      setError(err.message);
    }
  };

  const hoursRequired = hoursRequiredLogic(user, currentYear);
  const { currentYearNeedCPDHours } = hoursRequired;
  console.log('currentYearNeedCPDHours: ', currentYearNeedCPDHours);

  if (!user) {
    return <CustomIndicator />;
  }

  return (
    <Transitioning.View
      transition={transition}
      style={styles.container}
      ref={ref}
    >
      <CustomScreenContainer>
        <CustomScrollView>
          <Pressable
            style={{ alignSelf: 'flex-start' }}
            onPress={() => {
              setShowInputType('timer');
              ref.current.animateNextTransition();
            }}
          >
            <CustomTitle>Time Your Session</CustomTitle>
          </Pressable>
          <CustomGreyLine />
          {showInputType === 'timer' ? (
            <CustomOperationalContainer>
              <View style={styles.timerContainer}>
                <Text style={styles.timeText}>{secondsToHms(seconds)}</Text>
              </View>
              <CustomButton onSelect={() => toggle()}>
                {startButton}
              </CustomButton>
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
                      Saving Timed Session {'  '} <CustomSpinner />
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
            onPress={() => {
              setShowInputType('direct');
              ref.current.animateNextTransition();
            }}
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
                  Saving Direct Session {'  '} <CustomSpinner />
                </CustomButton>
              ) : (
                <CustomButton
                  onSelect={saveDirectSession}
                  style={{ marginVertical: 20 }}
                >
                  Save Direct Session
                </CustomButton>
              )}
              <CustomText style={{ marginTop: 10 }}>
                Please make every effort to ensure that the CPD data you upload
                are correct. It is the sole responsibility of the user, you, to
                present correct data to the provincial CPA governing bodies in
                the event of an audit.
              </CustomText>
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
    </Transitioning.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    fontFamily: 'avenir-medium',
  },
  sessionLengthText: {
    fontSize: 20,
    marginBottom: 15,
    fontFamily: 'avenir-medium',
  },
  passFromOperationalContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Timer;
