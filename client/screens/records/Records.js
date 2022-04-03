import React, { useState, useReducer, useCallback } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

//import * as DocumentPicker from 'expo-document-picker';
import * as DocumentPicker from 'react-native-document-picker';
import * as certActions from '../../store/actions/cert';
import * as authActions from '../../store/actions/auth';

import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import CustomBoldText from '../../components/CustomBoldText';
import CustomTitle from '../../components/CustomTitle';
import CustomInput from '../../components/CustomInput';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomPieMessageCard from '../../components/CustomPieMessageCard';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';
import CustomSpinner from '../../components/CustomSpinner';

import currentYear from '../../utils/currentYear';
import Colors from '../../constants/Colors';
import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';
import { hoursRequiredLogic } from '../../utils/hoursRequiredLogic';

const Records = () => {
  const [showYear, setShowYear] = useState(currentYear);
  const [cert, setCert] = useState(null); //if true, app uploads a cert. if not, app uploads default no-cert.jpg from S3
  const [cardText, setCardText] = useState('');
  const [error, setError] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);

  const authState = useSelector((state) => state.auth.user);

  const user = authState;
  const userHours = user.hours;

  const placeholderYear = currentYear.toString();

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      year: placeholderYear,
      hours: '',
      ethicsHours: '0',
      courseName: '',
    },
    inputValidities: {
      year: false,
      hours: false,
      ethicsHours: false,
      courseName: false,
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

  const year = Number(formState.inputValues.year);
  const hours = Number(formState.inputValues.hours);
  const ethicsHours = Number(formState.inputValues.ethicsHours);
  const { courseName } = formState.inputValues;

  const yearObj = userHours.filter((hours) => hours.year === year);

  let earnedVerifiable;
  earnedVerifiable = yearObj[0].verifiable;

  const hoursRequired = hoursRequiredLogic(user, currentYear);

  const {
    currentYearNeedVerHours,
    // currentYearNeedEthicsHours,
  } = hoursRequired;

  const addCertHandler = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: Platform.OS === 'ios' ? 'public.item' : '*/*',
        copyToCacheDirectory: false,
      });

      if (file.size > 0) {
        setCert(file);
      }
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
  };

  const saveVerifiableCourse = async () => {
    setSavingCourse(true);

    if (!year || !hours || !courseName) {
      setCardText(
        'Session Year, Course Name, and Session Duration are all required.'
      );
      setSavingCourse(false);
      return;
    }

    try {
      if (cert) {
        await dispatch(
          certActions.saveVerCourse(year, hours, ethicsHours, courseName, cert)
        );
      } else {
        const noCert = {
          name: 'no-cert.jpg',
          uri: 'https://cpdtracker.s3.us-east-2.amazonaws.com/cert/no-cert.jpg',
        };

        await dispatch(
          certActions.saveVerCourse(
            year,
            hours,
            ethicsHours,
            courseName,
            noCert
          )
        );
      }
      setCert(null);
      await dispatch(authActions.getUser());
      setCardText('Verifiable session successfully saved');
      setSavingCourse(false);
    } catch (err) {
      console.log(err.message);
      setSavingCourse(false);
      setError(
        'There is something wrong with our network. Please try saving course again later.'
      );
    }
  };

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Add Verifiable Session</CustomTitle>
        <CustomGreyLine />
        <CustomOperationalContainer>
          <CustomInput
            id="year"
            label="Session Year"
            keyboardType="numeric"
            onInputChange={inputChangeHandler}
            initialValue={placeholderYear}
            required
          />
          <CustomInput
            id="courseName"
            label="Course Name"
            keyboardType="default"
            autoCapitalize="characters"
            placeholder="ie: ETHICS IN ACCOUNTING"
            placeholderColor={Colors.lightGrey}
            onInputChange={inputChangeHandler}
            initialValue=""
            required
          />
          <CustomInput
            id="hours"
            label="Course Duration (hours)"
            keyboardType="numeric"
            autoCapitalize="none"
            placeholder="ie: 2"
            placeholderColor={Colors.lightGrey}
            onInputChange={inputChangeHandler}
            initialValue=""
            required
          />
          <CustomInput
            id="ethicsHours"
            label="Ethics hours (hours count as ethics)"
            keyboardType="numeric"
            autoCapitalize="none"
            onInputChange={inputChangeHandler}
            initialValue="0"
            required
          />

          <CustomButton
            style={{ marginTop: 20 }}
            onSelect={() => addCertHandler()}
          >
            Select Course Certificate
          </CustomButton>
          <CustomBoldText>
            {cert !== null ? 'file: ' + cert.name : null}
          </CustomBoldText>
          {savingCourse ? (
            <CustomButton style={{ marginTop: 10 }}>
              Saving Course {'  '} <CustomSpinner />
            </CustomButton>
          ) : (
            <CustomButton
              style={{ marginTop: 10 }}
              onSelect={() => saveVerifiableCourse(year)}
            >
              Save Verifiable Course
            </CustomButton>
          )}
          <CustomText style={{ marginTop: 20 }}>
            Please make every effort to ensure that the CPD data you upload are
            correct. It is the sole responsibility of the user, you, to present
            correct data to the provincial CPA governing bodies in the event of
            an audit.
          </CustomText>
        </CustomOperationalContainer>
      </CustomScrollView>

      {cardText !== '' && year !== currentYear ? (
        <CustomMessageCard text={cardText} toShow={setCardText} />
      ) : null}
      {cardText !== '' && year === currentYear ? (
        <CustomPieMessageCard
          text={cardText}
          toShow={setCardText}
          required={currentYearNeedVerHours}
          progress={earnedVerifiable}
          type={'verifiable'}
          year={year}
        />
      ) : null}
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Records;
