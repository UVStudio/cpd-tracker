import React, { useReducer, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Pressable,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import CustomButtonText from '../../components/CustomButtonText';
import CustomFormCard from '../../components/CustomFormCard';
import CustomInput from '../../components/CustomInput';
import CustomSpinner from '../../components/CustomSpinner';
import CustomButton from '../../components/CustomButton';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomSelectField from '../../components/CustomSelectField';
import CustomIndicator from '../../components/CustomIndicator';
import CustomProvinceSelectionCard from '../../components/CustomProvinceSelectionCard';

import * as authActions from '../../store/actions/auth';
import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';

const Auth = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [provinceCard, setProvinceCard] = useState(false);
  const [province, setProvince] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: '',
      email: '',
      province: '',
      cpdMonth: '',
      cpdYear: '',
      password: '',
      password2: '',
    },
    inputValidities: {
      name: false,
      email: false,
      province: false,
      cpdMonth: false,
      cpdYear: false,
      password: false,
    },
    formIsValid: false,
  });

  //regex for min 8, max 15, 1 lower, 1 upper, 1 num
  const pwRegex = new RegExp(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16})$/);

  const authHandler = async () => {
    let action;
    setError('');
    if (isSignup) {
      if (formState.inputValues.password !== formState.inputValues.password2) {
        setError(
          'Please make sure your "Confirm Password" is identical to your Password.'
        );
        return;
      }

      if (!pwRegex.test(formState.inputValues.password)) {
        setError(
          `Please make sure your password has between 8 to 16 characters, including: 
1 uppercase letter, 
1 lowercase letter,
1 number.`
        );
        return;
      }

      setIsRegistering(true);
      action = authActions.register(
        formState.inputValues.name,
        formState.inputValues.email,
        formState.inputValues.province,
        formState.inputValues.cpdMonth,
        formState.inputValues.cpdYear,
        formState.inputValues.password
      );
    } else {
      setIsLogging(true);
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError('');
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

  const selectProvinceHandler = () => {
    setProvinceCard(true);
  };

  useEffect(() => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: province,
      isValid: province !== '' ? true : false,
      input: 'province',
    });
  }, [province]);

  if (isLoading) {
    return <CustomIndicator />;
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
              <Pressable onPress={() => selectProvinceHandler()}>
                <CustomSelectField
                  id="province"
                  label="Province"
                  keyboardType="default"
                  autoCapitalize="words"
                  errorText="Please enter a valid provincial jurisdiction"
                  initialValue=""
                  value={province}
                  required
                  style={styles.textInput}
                />
              </Pressable>
            ) : null}
            {isSignup ? (
              <View>
                <Text style={styles.label}>
                  CPA Membership Join Date: mm/yyyy
                </Text>
                <View style={styles.rowSpaceBetween}>
                  <View style={{ width: '49%' }}>
                    <CustomInput
                      id="cpdMonth"
                      keyboardType="numeric"
                      autoCapitalize="none"
                      minLength={2}
                      placeholder="mm"
                      errorText="Please enter a valid month"
                      onInputChange={inputChangeHandler}
                      initialValue=""
                      month
                      required
                      style={styles.textInput}
                    />
                  </View>
                  <View style={{ width: '49%' }}>
                    <CustomInput
                      id="cpdYear"
                      keyboardType="numeric"
                      autoCapitalize="none"
                      minLength={4}
                      placeholder="yyyy"
                      errorText="Please enter a valid year"
                      onInputChange={inputChangeHandler}
                      initialValue=""
                      required
                      style={styles.textInput}
                    />
                  </View>
                </View>
              </View>
            ) : null}
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
            {isSignup ? (
              <CustomInput
                id="password2"
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
            ) : null}
            <View style={styles.buttonGroupContainer}>
              <CustomButton onSelect={authHandler}>
                {isSignup ? (
                  isRegistering ? (
                    <Text>
                      Registering {'  '}
                      <CustomSpinner />
                    </Text>
                  ) : (
                    'Register'
                  )
                ) : isLogging ? (
                  <Text>
                    Login in {'  '}
                    <CustomSpinner />
                  </Text>
                ) : (
                  'Login'
                )}
              </CustomButton>
              <CustomButton
                onSelect={() => setIsSignup((prevState) => !prevState)}
              >
                {`Switch to ${isSignup ? 'Login' : 'Register'}`}
              </CustomButton>
              <CustomButton
                onSelect={() => navigation.navigate('Forgot Password')}
              >
                Forgot Password
              </CustomButton>
            </View>
          </ScrollView>
        </CustomFormCard>
        {provinceCard ? (
          <CustomProvinceSelectionCard
            toShow={setProvinceCard}
            toSet={setProvince}
          />
        ) : null}
        {error !== '' ? (
          <CustomErrorCard error={error} toShow={setError} />
        ) : null}
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
  label: {
    marginVertical: 2,
    marginTop: 4,
    fontFamily: ' avenir-medium',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'avenir-demibold',
  },
});

export default Auth;
