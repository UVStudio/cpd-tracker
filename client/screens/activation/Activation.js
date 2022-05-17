import React, { useEffect, useState, useCallback, useReducer } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomImageBackground from '../../components/CustomImageBackground';
import CustomFormCard from '../../components/CustomFormCard';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import CustomErrorCard from '../../components/CustomErrorCard';

import * as authActions from '../../store/actions/auth';
import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';
import CustomSpinner from '../../components/CustomSpinner';

const Activation = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const authState = useSelector((state) => state.auth.user);
  const active = authState.active;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      veriCode: '',
    },
    inputValidities: {
      veriCode: false,
    },
    formIsValid: false,
  });

  // useEffect(() => {
  //   if (active) navigation.navigate('Statistics');
  // }, [active]);

  const activationCodeHandler = async (code) => {
    setError('');
    setIsLoading(true);
    try {
      await dispatch(authActions.verifyCode(code));
    } catch (err) {
      setError(err.messsage);
    }
    setIsLoading(false);
  };

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

  return (
    <CustomImageBackground>
      <CustomFormCard style={styles.authCard}>
        <CustomText style={{ marginBottom: 20 }}>
          A 6-digit account activation code has been sent to your email. Please
          verify the code to activate your account.
        </CustomText>
        <CustomInput
          id="veriCode"
          label="Activation Code"
          keyboardType="number-pad"
          autoCapitalize="none"
          errorText="Please enter your Activation code"
          onInputChange={inputChangeHandler}
          initialValue=""
          required
          style={styles.textInput}
        />
        {isLoading ? (
          <CustomButton style={{ marginVertical: 20 }}>
            Confirming {'  '} <CustomSpinner />
          </CustomButton>
        ) : (
          <CustomButton
            onSelect={() =>
              activationCodeHandler(formState.inputValues.veriCode)
            }
            style={{ marginVertical: 20 }}
          >
            Confirm Activation Code
          </CustomButton>
        )}
      </CustomFormCard>
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
    </CustomImageBackground>
  );
};

const styles = StyleSheet.create({
  authCard: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 22,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 16,
  },
});

export default Activation;
