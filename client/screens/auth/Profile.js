import React, { useEffect, useState, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';

import CustomButton from '../../components/CustomButton';
import CustomTitle from '../../components/CustomTitle';
import CustomInput from '../../components/CustomInput';
import CustomSelectField from '../../components/CustomSelectField';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomRedCard from '../../components/CustomRedCard';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';
import CustomProvinceSelectionCard from '../../components/CustomProvinceSelectionCard';

import currentYear from '../../utils/currentYear';
import Colors from '../../constants/Colors';
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

const Profile = () => {
  const [cardText, setCardText] = useState('');
  const [errorFromCard, setErrorFromCard] = useState(false);
  const [provinceCard, setProvinceCard] = useState(false);
  const [province, setProvince] = useState('');

  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: user.name,
      email: user.email,
      province: user.province,
      cpdMonth: user.cpdMonth.toString(),
      cpdYear: user.cpdYear.toString(),
    },
    inputValidities: {
      name: false,
      email: false,
      province: false,
      cpdMonth: false,
      cpdYear: false,
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

  useEffect(() => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: province === '' ? user.province : province,
      isValid: true,
      input: 'province',
    });
  }, [province]);

  const pwRegex = new RegExp(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16})$/);

  const updateProfileHandler = async () => {
    try {
      await dispatch(userActions.updateUser(formState));
    } catch (err) {
      console.log(err.message);
    }
  };

  const selectProvinceHandler = () => {
    setProvinceCard(true);
  };

  const logoutHandler = async () => {
    try {
      await dispatch(authActions.logout());
    } catch (err) {
      console.log(err.message);
    }
  };

  const cardTextHandler = async () => {
    setCardText(
      `Are you sure you want to delete your account? 

All data and certificates will be erased permanently. The app does not keep any backup data.`
    );
  };

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Edit Profile</CustomTitle>
        <CustomGreyLine />
        <CustomOperationalContainer>
          <CustomSubtitle style={{ alignSelf: 'flex-start' }}>
            Profile Info
          </CustomSubtitle>
          <CustomThinGreyLine style={{ marginBottom: 8 }} />
          <CustomInput
            id="name"
            label="Name"
            keyboardType="default"
            autoCapitalize="none"
            onInputChange={inputChangeHandler}
            initialValue={user.name}
            initiallyValid="true"
            required
          />
          <CustomInput
            id="email"
            label="Email"
            keyboardType="default"
            autoCapitalize="none"
            onInputChange={inputChangeHandler}
            initialValue={user.email}
            initiallyValid="true"
            required
          />
          <Pressable
            style={{ width: '100%' }}
            onPress={() => selectProvinceHandler()}
          >
            <CustomSelectField
              id="province"
              label="Province"
              keyboardType="default"
              autoCapitalize="words"
              initialValue={user.province}
              value={province}
              required
            />
          </Pressable>
          <View>
            <Text style={styles.label}>CPA Membership Join Date: mm/yyyy</Text>
            <View style={styles.rowSpaceBetween}>
              <View style={{ width: '49%' }}>
                <CustomInput
                  id="cpdMonth"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  minLength={2}
                  onInputChange={inputChangeHandler}
                  initialValue={user.cpdMonth.toString()}
                  initiallyValid="true"
                  month
                  required
                />
              </View>
              <View style={{ width: '49%' }}>
                <CustomInput
                  id="cpdYear"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  minLength={4}
                  onInputChange={inputChangeHandler}
                  initialValue={user.cpdYear.toString()}
                  initiallyValid="true"
                  required
                />
              </View>
            </View>
          </View>
          <CustomButton onSelect={updateProfileHandler}>
            Update Profile
          </CustomButton>
          <CustomButton onSelect={logoutHandler}>Logout</CustomButton>
          <CustomButton onSelect={cardTextHandler}>
            Delete Your Account
          </CustomButton>
        </CustomOperationalContainer>
      </CustomScrollView>
      {cardText ? (
        <CustomRedCard
          text={cardText}
          toShow={setCardText}
          toPassError={setErrorFromCard}
        />
      ) : null}
      {errorFromCard ? <CustomErrorCard /> : null}
      {provinceCard ? (
        <CustomProvinceSelectionCard
          toShow={setProvinceCard}
          toSet={setProvince}
        />
      ) : null}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 2,
    marginTop: 4,
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-condensed'
        : 'AvenirNextCondensed-Medium',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Profile;
