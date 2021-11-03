import React, { useEffect, useState, useReducer, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as DocumentPicker from 'expo-document-picker';
import * as certActions from '../../store/actions/cert';
import * as userActions from '../../store/actions/user';

import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import CustomTitle from '../../components/CustomTitle';
import CustomInput from '../../components/CustomInput';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';
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

const Records = () => {
  const user = useSelector((state) => state.auth.user);

  const [cert, setCert] = useState(null); //if true, app uploads a cert. if not, app uploads default no-cert.jpg from S3
  const [cardText, setCardText] = useState('');
  const [error, setError] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);

  const placeholderYear = currentYear.toString(); //Expo crashes if not set to string

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      year: placeholderYear,
      hours: '',
      ethicsHours: '',
      courseName: '',
    },
    inputValidities: {
      year: true,
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

  const addCertHandler = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (file.type === 'success') {
        setCert(file);
      }
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
  };

  const year = Number(formState.inputValues.year);
  const hours = Number(formState.inputValues.hours);
  const ethicsHours = Number(formState.inputValues.ethicsHours);
  const { courseName } = formState.inputValues;

  //console.log('formState: ', formState);

  const saveVerfiableCourse = async () => {
    setSavingCourse(true);
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
      setCardText('Verifiable session successfully saved');
      await dispatch(userActions.getUser());
      setSavingCourse(false);
    } catch (err) {
      console.log(err.message);
      setSavingCourse(false);
      setError(
        'There is something wrong with our network. Please try again later.'
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
            autoCapitalize="none"
            errorText="Please enter session year"
            placeholder={placeholderYear}
            placeholderColor={Colors.darkGrey}
            onInputChange={inputChangeHandler}
            //initialValue={placeholderYear}
            //value={placeholderYear}
            required
          />
          <CustomInput
            id="courseName"
            label="Course Name"
            keyboardType="default"
            autoCapitalize="characters"
            errorText="Please enter verifiable course name"
            placeholder="ie: ETHICS IN ACCOUNTING"
            placeholderColor={Colors.lightGrey}
            onInputChange={inputChangeHandler}
            initialValue=""
            required
          />
          <CustomInput
            id="hours"
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
          <CustomInput
            id="ethicsHours"
            label="Ethics hours (hours count as ethics)"
            keyboardType="numeric"
            autoCapitalize="none"
            errorText="Please enter ethics hours count"
            placeholder="ie: 0"
            placeholderColor={Colors.lightGrey}
            onInputChange={inputChangeHandler}
            initialValue=""
            required
          />

          <CustomButton
            style={{ marginTop: 20 }}
            onSelect={() => addCertHandler()}
          >
            Select Course Certificate
          </CustomButton>
          <CustomText>{cert !== null ? 'file: ' + cert.name : null}</CustomText>
          {savingCourse ? (
            <CustomButton style={{ marginTop: 10 }}>
              Saving Course...
            </CustomButton>
          ) : (
            <CustomButton
              style={{ marginTop: 10 }}
              onSelect={() => saveVerfiableCourse(year)}
            >
              Save Verifiable Course
            </CustomButton>
          )}
        </CustomOperationalContainer>
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

const styles = StyleSheet.create({});

export default Records;
