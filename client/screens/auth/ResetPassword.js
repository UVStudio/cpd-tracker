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
import CustomRedirectCard from '../../components/CustomRedirectCard';

import * as authActions from '../../store/actions/auth';
import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';

const ResetPassword = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const veriCode = useSelector((state) => state.auth.veriCode);
  const newPasswordState = useSelector((state) => state.auth.newPassword);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      password: '',
      passwordConfirm: '',
    },
    inputValidities: {
      password: false,
      passwordConfirm: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (newPasswordState) {
      setMessage('Your new password is ready. Please try logging in.');
    }
  }, [newPasswordState]);

  const toAuthScreen = () => {
    navigation.navigate('Auth');
  };

  const setNewPasswordHandler = async (password, confirmPassword, veriCode) => {
    setError('');
    setIsLoading(true);
    try {
      await dispatch(
        authActions.setNewPassword(password, confirmPassword, veriCode)
      );
    } catch (err) {
      setError(err.message);
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
          Your verification code is confirmed. Please enter your new password,
          then confirm it by entering your new password again.
        </CustomText>
        <CustomInput
          id="password"
          label="Password"
          keyboardType="default"
          secureTextEntry
          autoCapitalize="none"
          minLength={8}
          errorText="Please enter a valid password"
          onInputChange={inputChangeHandler}
          initialValue=""
          required
          style={styles.textInput}
        />
        <CustomInput
          id="passwordConfirm"
          label="Confirm Password"
          keyboardType="default"
          secureTextEntry
          autoCapitalize="none"
          minLength={8}
          errorText="Please confirm your password"
          onInputChange={inputChangeHandler}
          initialValue=""
          required
          style={styles.textInput}
        />
        {isLoading ? (
          <CustomButton style={{ marginVertical: 20 }}>
            Resetting Password...
          </CustomButton>
        ) : (
          <CustomButton
            onSelect={() =>
              setNewPasswordHandler(
                formState.inputValues.password,
                formState.inputValues.passwordConfirm,
                veriCode
              )
            }
            style={{ marginVertical: 20 }}
          >
            Reset Password
          </CustomButton>
        )}
      </CustomFormCard>
      {message !== '' ? (
        <CustomRedirectCard
          text={message}
          toShow={setMessage}
          toRedirect={toAuthScreen}
        />
      ) : null}
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
export default ResetPassword;
