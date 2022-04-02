import React, { useState, useCallback, useReducer } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomRowSpace from '../../components/CustomRowSpace';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomConfirmActionCard from '../../components/CustomConfirmActionCard';
import CustomScreenContainer from '../../components/CustomScreenContainer';

import * as authActions from '../../store/actions/auth';
import * as certActions from '../../store/actions/cert';

import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';

const OverwriteCPDHours = (props) => {
  const { showYear } = props.route.params;

  const [error, setError] = useState('');
  const [savingCPD, setSavingCPD] = useState(false);
  const [confirmCardText, setConfirmCardText] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth.user);

  const user = authState;

  const userHoursArr = user.hours;
  const thisYearHours = userHoursArr.find((elem) => elem.year === showYear);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      CertHours: thisYearHours.verifiable.toString(),
      NonVerHours: thisYearHours.nonVerifiable.toString(),
      EthicsHours: thisYearHours.ethics.toString(),
    },
    inputValidities: {
      CertHours: false,
      NonVerHours: false,
      EthicsHours: false,
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

  const overwriteHandler = () => {
    setConfirmCardText(
      `Are you sure you want to overwrite your CPD hours for ${showYear}?`
    );
  };

  const saveDataHandler = async () => {
    setSavingCPD(true);
    try {
      await dispatch(
        authActions.overrideHours(
          showYear,
          formState.inputValues.CertHours,
          formState.inputValues.NonVerHours,
          formState.inputValues.EthicsHours
        )
      );
      await dispatch(certActions.deleteAllCertsByUserYear(showYear));
      setSavingCPD(false);
      setConfirmCardText('');
      navigation.navigate('Your CPD Statistics');
    } catch (err) {
      setSavingCPD(false);
      setConfirmCardText('');
      console.log(err.message);
      setError(
        'There is something wrong with our network. We cannot overwrite your past CPD data at the moment. Please try again later.'
      );
    }
  };

  return (
    <CustomScreenContainer>
      <CustomTitle>Overwrite CPD Hours for {showYear}</CustomTitle>
      <CustomGreyLine />
      <CustomText>
        You can overwrite your CPD Hours for {showYear} here. Please be careful,
        as once overwritten, your CPD Hours in Statistics will no longer match
        the data from your Verifiable and Non-Verifiable sessions. If you have
        entered session data incorrectly, we advise that you update those
        session records instead.
      </CustomText>
      <CustomStatsInfoBox>
        <View style={{ width: '100%' }}>
          <CustomRowSpace>
            <View style={{ width: '50%' }}>
              <CustomText style={{ top: 5 }}>Verifiable Hours:</CustomText>
            </View>
            <View style={{ width: '40%' }}>
              <CustomInput
                id="CertHours"
                keyboardType="numeric"
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                initialValue={thisYearHours.verifiable.toFixed(1).toString()}
                initiallyValid="true"
                required
                style={styles.textInput}
              />
            </View>
          </CustomRowSpace>
          <CustomRowSpace>
            <View style={{ width: '50%' }}>
              <CustomText style={{ top: 5 }}>Non-Verifiable Hours:</CustomText>
            </View>
            <View style={{ width: '40%' }}>
              <CustomInput
                id="NonVerHours"
                keyboardType="numeric"
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                initialValue={thisYearHours.nonVerifiable.toFixed(1).toString()}
                initiallyValid="true"
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
                id="EthicsHours"
                keyboardType="numeric"
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                initialValue={thisYearHours.ethics.toFixed(1).toString()}
                initiallyValid="true"
                required
                style={styles.textInput}
              />
            </View>
          </CustomRowSpace>
        </View>
      </CustomStatsInfoBox>

      <CustomButton onSelect={overwriteHandler}>Overwrite</CustomButton>
      {confirmCardText !== '' ? (
        <CustomConfirmActionCard
          text={confirmCardText}
          actionLoading={savingCPD}
          toShow={setConfirmCardText}
          confirmAction={saveDataHandler}
          buttonText="Yes! Overwrite data"
          savingButtonText="Overwriting data..."
        />
      ) : null}
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
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

export default OverwriteCPDHours;
