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

const Verification = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const verified = useSelector((state) => state.auth.verified);

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

  useEffect(() => {
    if (verified) navigation.navigate('Reset Password');
  }, [verified]);

  const verificationCodeHandler = async (code) => {
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
          The verification code has been sent to your email. Please verify the
          code to reset your password.
        </CustomText>
        <CustomInput
          id="veriCode"
          label="Verification Code"
          keyboardType="number-pad"
          autoCapitalize="none"
          errorText="Please enter your verification code"
          onInputChange={inputChangeHandler}
          initialValue=""
          required
          style={styles.textInput}
        />
        {isLoading ? (
          <CustomButton style={{ marginVertical: 20 }}>
            Confirming...
          </CustomButton>
        ) : (
          <CustomButton
            onSelect={() =>
              verificationCodeHandler(formState.inputValues.veriCode)
            }
            style={{ marginVertical: 20 }}
          >
            Confirm Verification Code
          </CustomButton>
        )}
        {/* <CustomButton
          style={{ marginVertical: 20 }}
          onSelect={() => navigation.navigate('Reset Password')}
        >
          Cheat to Reset Password
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

export default Verification;
