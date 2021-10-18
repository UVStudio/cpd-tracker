import React, { useReducer, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomFormCard from '../../components/CustomFormCard';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import * as authActions from '../../store/actions/auth';
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

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [isSignup, setIsSignup] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: '',
      email: '',
      province: '',
      password: '',
      password2: '',
    },
    inputValidities: {
      name: false,
      email: false,
      province: false,
      password: false,
    },
    formIsValid: false,
  });

  console.log('formState: ', formState);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  //regex for min 8, max 15, 1 lower, 1 upper, 1 num
  const pwRegex = new RegExp(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16})$/);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      if (formState.inputValues.password !== formState.inputValues.password2) {
        Alert.alert(
          'Password Invalid',
          'Please make sure your confirm password is identical to your password',
          [{ text: 'Okay' }]
        );
        return;
      }

      if (!pwRegex.test(formState.inputValues.password)) {
        Alert.alert(
          'We need a strong Password',
          'Please make sure your password has at least 8 and fewer than 16 characters, 1 uppercase letter, 1 lowercase letter, and 1 number.',
          [{ text: 'Okay' }]
        );
        return;
      }

      setIsRegistering(true);
      action = authActions.register(
        formState.inputValues.name,
        formState.inputValues.email,
        formState.inputValues.province,
        formState.inputValues.password
      );
    } else {
      setIsLogging(true);
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    try {
      await dispatch(action);
    } catch (err) {
      setError(err.message);
      setIsLogging(false);
      setIsRegistering(false);
    }
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
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/bg-1.jpg')}
        resizeMode="cover"
        style={styles.image}
      >
        <CustomFormCard style={styles.authCard}>
          <ScrollView style={styles.scrollView}>
            {isSignup ? (
              <CustomInput
                id="name"
                label="Name"
                keyboardType="default"
                autoCapitalize="none"
                errorText="Please enter your name"
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
            ) : null}
            <CustomInput
              id="email"
              label="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              errorText="Please enter a valid email"
              onInputChange={inputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
            />
            {isSignup ? (
              <CustomInput
                id="province"
                label="Province"
                keyboardType="default"
                autoCapitalize="none"
                errorText="Please enter a valid provincial jurisdiction"
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
            ) : null}
            <CustomInput
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              autoCapitalize="none"
              minLength={6}
              errorText="Please enter a valid password"
              onInputChange={inputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
            />
            {isSignup ? (
              <CustomInput
                id="password2"
                label="Confirm Password"
                keyboardType="default"
                secureTextEntry
                autoCapitalize="none"
                minLength={6}
                errorText="Please confirm your password"
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
            ) : null}
            <View style={styles.buttonGroupContainer}>
              <CustomButton onSelect={authHandler}>
                {isSignup
                  ? isRegistering
                    ? 'Registering...'
                    : 'Register'
                  : isLogging
                  ? 'Logging in..'
                  : 'Login'}
              </CustomButton>
              <CustomButton
                onSelect={() => setIsSignup((prevState) => !prevState)}
              >
                {`Switch to ${isSignup ? 'Login' : 'Register'}`}
              </CustomButton>
              <CustomButton
                title="Forgot Password"
                onSelect={() => props.navigation.navigate('ForgotPassword')}
              >
                Forgot Password
              </CustomButton>
            </View>
          </ScrollView>
        </CustomFormCard>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authCard: {
    maxWidth: 400,
    maxHeight: 600,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: '86%',
  },
  textInput: {
    height: 22,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  buttonGroupContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
});

export default Auth;
