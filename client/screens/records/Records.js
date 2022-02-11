import React, { useState, useReducer, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import * as DocumentPicker from 'expo-document-picker';
import * as certActions from '../../store/actions/cert';
import * as authActions from '../../store/actions/auth';

import CustomButton from '../../components/CustomButton';
import CustomButtonLoading from '../../components/CustomButtonLoading';
import CustomBoldText from '../../components/CustomBoldText';
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

import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';
import CustomSpinner from '../../components/CustomSpinner';

const Records = () => {
  const [cert, setCert] = useState(null); //if true, app uploads a cert. if not, app uploads default no-cert.jpg from S3
  const [cardText, setCardText] = useState('');
  const [error, setError] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);

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

  // console.log('formState: ', formState);

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
      setCardText('Verifiable session successfully saved');
      await dispatch(authActions.getUser());
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
