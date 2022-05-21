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
import CustomSpinner from '../../components/CustomSpinner';
import CustomIndicator from '../../components/CustomIndicator';

import * as authActions from '../../store/actions/auth';
import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';

const Activation = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const user = useSelector((state) => state.auth.user);

  //activate state slice not used in any way
  //const activate = useSelector((state) => state.auth.activate);

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
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      if (!user.active) {
        setIsLoading(false);
        genActCodeHandler();
      }
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [user]);

  const genActCodeHandler = async () => {
    try {
      await dispatch(authActions.generateVeriCode(user.email));
    } catch (error) {
      console.log(err.message);
      setError(err.message);
    }
  };

  const resendActCodeHandler = async () => {
    try {
      setIsResending(true);
      await dispatch(authActions.generateVeriCode(user.email));
    } catch (error) {
      console.log(err.message);
      setError(err.message);
    }
    setIsResending(false);
  };

  const logoutHandler = () => {
    try {
      dispatch(authActions.logout());
    } catch (err) {
      console.log(err.message);
    }
  };

  const activationCodeHandler = async (code) => {
    setError('');
    setIsConfirming(true);
    setIsLoading(true);
    try {
      await dispatch(authActions.activateAccount(code));
      setIsLoading(false);
      setIsAuthSuccess(true);
      await dispatch(authActions.getUser());
    } catch (err) {
      console.log(err.message);
      setError('Account cannot be activated');
    }
    setIsAuthSuccess(false);
    setIsConfirming(false);
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

  if (isLoading) {
    return <CustomIndicator text="Loading..." />;
  }

  if (isAuthSuccess) {
    return <CustomIndicator text="Authentication Success!" />;
  }

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
        {isConfirming ? (
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
        <CustomButton onSelect={logoutHandler}>Logout</CustomButton>
        {isResending ? (
          <CustomButton>
            Resending {'  '} <CustomSpinner />
          </CustomButton>
        ) : (
          <CustomButton onSelect={resendActCodeHandler}>
            Resend Activation Code
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
