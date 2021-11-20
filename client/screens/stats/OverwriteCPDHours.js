import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomRowSpace from '../../components/CustomRowSpace';
import CustomBoldText from '../../components/CustomBoldText';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomScreenContainer from '../../components/CustomScreenContainer';

import * as userActions from '../../store/actions/user';

import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';

const OverwriteCPDHours = (props) => {
  const { showYear } = props.route.params;

  const [error, setError] = useState('');
  const [savingCPD, setSavingCPD] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth.user);
  const userState = useSelector((state) => state.user.user);

  const user = userState ? userState : authState;

  const userHoursArr = user.hours;

  const thisYearHours = userHoursArr.find((elem) => elem.year === showYear);
  //console.log('this Year ', thisYearHours);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      CertHours: thisYearHours.verifiable,
      NonVerHours: thisYearHours.nonVerifiable,
      EthicsHours: thisYearHours.ethics,
    },
    inputValidities: {
      CertHours: false,
      NonVerHours: false,
      EthicsHours: false,
    },
    formIsValid: false,
  });

  //console.log('formState: ', formState);

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
        userActions.overrideHours(
          yearsToOverride[0].year,
          formState.inputValues.CertHours,
          formState.inputValues.NonVerHours,
          formState.inputValues.EthicsHours
        )
      );

      setSavingCPD(false);
      //await dispatch(userActions.getUser());
      navigation.navigate('Your CPD Statistics');
    } catch (err) {
      setSavingCPD(false);
      console.log(err.message);
      setError(
        'There is something wrong with our network. We cannot overwrite your past CPD data at the moment. Please try again later.'
      );
    }
  };

  return (
    <CustomScreenContainer>
      <CustomTitle>Past CPD Hours Input</CustomTitle>
      <CustomGreyLine />
      <Text>{showYear}</Text>
    </CustomScreenContainer>
  );
};

export default OverwriteCPDHours;
