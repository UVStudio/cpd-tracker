import React, { useEffect, useState, useCallback, useReducer } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomImageBackground from '../../components/CustomImageBackground';
import CustomFormCard from '../../components/CustomFormCard';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import CustomSpinner from '../../components/CustomSpinner';
import CustomErrorCard from '../../components/CustomErrorCard';

import * as authActions from '../../store/actions/auth';
import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const veriCode = useSelector((state) => state.auth.veriCode);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
    },
    inputValidities: {
      email: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (veriCode) navigation.navigate('Verification Code');
  }, [veriCode]);

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

  const verificationHandler = async (email) => {
    setError('');
    setIsLoading(true);
    try {
      await dispatch(authActions.forgotPassword(email));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <CustomImageBackground>
      <CustomFormCard style={styles.authCard}>
        <CustomText style={{ marginBottom: 20 }}>
          Please enter your CPD Tracker account email here to retrieve a 6 digit
          verification code. This code will be emailed to you.
        </CustomText>
        <CustomInput
          id="email"
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          errorText="Please enter your email"
          onInputChange={inputChangeHandler}
          initialValue=""
          required
          style={styles.textInput}
        />
        {isLoading ? (
          <CustomButton style={{ marginVertical: 20 }}>
            Generating Code {'  '} <CustomSpinner />
          </CustomButton>
        ) : (
          <CustomButton
            style={{ marginVertical: 20 }}
            onSelect={() => verificationHandler(formState.inputValues.email)}
          >
            Email Me Verification Code
          </CustomButton>
        )}
        {/* <CustomButton
          style={{ marginVertical: 20 }}
          onSelect={() => navigation.navigate('Verification Code')}
        >
          Cheat to Verification
        </CustomButton> */}
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

export default ForgotPassword;
