import React, { useState, useCallback, useReducer } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomRowSpace from '../../components/CustomRowSpace';
import CustomScrollView from '../../components/CustomScrollView';
import CustomBoldText from '../../components/CustomBoldText';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomScreenContainer from '../../components/CustomScreenContainer';

import * as authActions from '../../store/actions/auth';

import { FORM_INPUT_UPDATE } from '../../store/types';
import CustomSpinner from '../../components/CustomSpinner';

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

const PastCPDHoursInput = (props) => {
  const { yearsToOverride } = props.route.params;

  const [error, setError] = useState('');
  const [savingCPD, setSavingCPD] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      '0CertHours': 0,
      '0NonVerHours': 0,
      '0EthicsHours': 0,
      '1CertHours': 0,
      '1NonVerHours': 0,
      '1EthicsHours': 0,
    },
    inputValidities: {
      '0CertHours': false,
      '0NonVerHours': false,
      '0EthicsHours': false,
      '1CertHours': false,
      '1NonVerHours': false,
      '1EthicsHours': false,
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

  const saveDataHandler = async () => {
    setError('');
    setSavingCPD(true);
    try {
      await dispatch(
        authActions.overrideHours(
          yearsToOverride[0].year,
          formState.inputValues['0CertHours'],
          formState.inputValues['0NonVerHours'],
          formState.inputValues['0EthicsHours']
        )
      );
      if (yearsToOverride[1]) {
        await dispatch(
          authActions.overrideHours(
            yearsToOverride[1].year,
            formState.inputValues['1CertHours'],
            formState.inputValues['1NonVerHours'],
            formState.inputValues['1EthicsHours']
          )
        );
      }
      setSavingCPD(false);
      //await dispatch(authActions.getUser());
      navigation.navigate('Your CPD Statistics');
    } catch (err) {
      setSavingCPD(false);
      console.log(err.message);
      setError(
        'There is something wrong with our network. We cannot save your past CPD data at the moment. Please try again later.'
      );
    }
  };

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Past CPD Hours Input</CustomTitle>
        <CustomGreyLine />
        <View style={{ alignSelf: 'flex-start', marginBottom: 15 }}>
          <CustomText>
            Hello, thank you for using CPD Tracker. Please keep your previous
            record keeping system in place for at least the prevous 2 years as a
            backup.
          </CustomText>
        </View>
        {yearsToOverride.length === 1 ? (
          <CustomText>
            In order for the app to function well for you, it needs you to input
            your CPD data for {yearsToOverride[0].year}.
          </CustomText>
        ) : (
          <CustomText>
            In order for the app to function well for you, it needs you to input
            your CPD data for {yearsToOverride[0].year} and{' '}
            {yearsToOverride[1].year}.
          </CustomText>
        )}
        <CustomThinGreyLine style={{ marginVertical: 10 }} />
        {yearsToOverride.map((elem, index) => (
          <CustomStatsInfoBox key={index}>
            <CustomBoldText style={{ marginBottom: 10 }}>
              Input CPD Hours for {elem.year}
            </CustomBoldText>
            <View style={{ width: '100%' }}>
              <CustomRowSpace>
                <View style={{ width: '50%' }}>
                  <CustomText style={{ top: 5 }}>Verifiable Hours:</CustomText>
                </View>
                <View style={{ width: '40%' }}>
                  <CustomInput
                    id={index + 'CertHours'}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    onInputChange={inputChangeHandler}
                    initialValue="0"
                    required
                    style={styles.textInput}
                  />
                </View>
              </CustomRowSpace>
              <CustomRowSpace>
                <View style={{ width: '50%' }}>
                  <CustomText style={{ top: 5 }}>
                    Non-Verifiable Hours:
                  </CustomText>
                </View>
                <View style={{ width: '40%' }}>
                  <CustomInput
                    id={index + 'NonVerHours'}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    onInputChange={inputChangeHandler}
                    initialValue="0"
                    required
                    style={styles.textInput}
                  />
                </View>
              </CustomRowSpace>
              <CustomRowSpace>
                <View style={{ width: '50%' }}>
                  <CustomText style={{ top: 5 }}>Ethics Hours:</CustomText>
                </View>
                <View style={{ width: '40%' }}>
                  <CustomInput
                    id={index + 'EthicsHours'}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    onInputChange={inputChangeHandler}
                    initialValue="0"
                    required
                    style={styles.textInput}
                  />
                </View>
              </CustomRowSpace>
            </View>
          </CustomStatsInfoBox>
        ))}
        {savingCPD ? (
          <CustomButton>
            Saving CPD Data {'  '} <CustomSpinner />
          </CustomButton>
        ) : (
          <CustomButton onSelect={() => saveDataHandler()}>
            Save CPD Data
          </CustomButton>
        )}
      </CustomScrollView>
      {error ? <CustomErrorCard text={error} toShow={setError} /> : null}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 22,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 16,
  },
});

export default PastCPDHoursInput;
