import React, { useEffect, useState, useReducer, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';
import CustomProvinceSelectionCard from '../../components/CustomProvinceSelectionCard';

import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE, PASSWORD_INPUT_UPDATE } from '../../store/types';

const Profile = () => {
  const [cardText, setCardText] = useState('');
  const [error, setError] = useState('');
  const [deleteText, setDeleteText] = useState('');
  const [errorFromCard, setErrorFromCard] = useState(false);
  const [provinceCard, setProvinceCard] = useState(false);
  const [province, setProvince] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [specialMessage, setSpecialMessage] = useState(false);

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

  const [passwordFormState, dispatchPasswordFormState] = useReducer(
    formReducer,
    {
      inputValues: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      inputValidities: {
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
      },
      formIsValid: false,
    }
  );

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

  const inputPasswordChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchPasswordFormState({
        type: PASSWORD_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchPasswordFormState]
  );

  //console.log('pw formState: ', passwordFormState);

  useEffect(() => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: province === '' ? user.province : province,
      isValid: true,
      input: 'province',
    });
  }, [province]);

  const updateProfileHandler = async () => {
    setUpdatingProfile(true);
    const { cpdMonth, cpdYear } = formState.inputValues;
    try {
      if (
        province !== user.proovince ||
        cpdMonth !== user.cpdMonth ||
        cpdYear !== user.cpdYear
      ) {
        setSpecialMessage(true);
      }
      await dispatch(userActions.updateUser(formState));
      setUpdatingProfile(false);

      setCardText(
        specialMessage
          ? `Your profile has been updated. 
          
Updating your Province or your CPD Membership Join Date might have material impact on your current CPD requirement. Please check your Statistics page.`
          : 'Your profile has been updated'
      );
      setSpecialMessage(false);
    } catch (err) {
      setUpdatingProfile(false);
      console.log(err.message);
      setError(
        'There is something wrong with our network. We cannot update your profile at this momemt. Please try again later.'
      );
    }
  };

  const pwRegex = new RegExp(/^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16})$/);

  const updatePasswordHandler = async () => {
    setUpdatingPassword(true);
    const { newPassword, confirmPassword } = passwordFormState.inputValues;

    if (newPassword !== confirmPassword) {
      setUpdatingPassword(false);
      setCardText('Please make sure your new password inputs are identical');
      return;
    }

    if (!pwRegex.test(newPassword)) {
      setUpdatingPassword(false);
      setCardText(`Please make sure your password has between 8 to 16 characters, including: 
1 uppercase letter, 
1 lowercase letter,
1 number.`);
      return;
    }

    try {
      await dispatch(userActions.updatePassword(passwordFormState));
      setUpdatingPassword(false);
      setCardText('Your password has been updated');
    } catch (err) {
      setUpdatingPassword(false);
      console.log(err.message);
      setError(
        'There is something wrong with our network. We cannot update your password at this momemt. Please try again later.'
      );
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
    setDeleteText(
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
          <View style={{ ...styles.fullWidthCenterItems, marginVertical: 10 }}>
            {updatingProfile ? (
              <CustomButton>Updating Profile...</CustomButton>
            ) : (
              <CustomButton onSelect={updateProfileHandler}>
                Update Profile
              </CustomButton>
            )}
          </View>
          <CustomSubtitle style={{ alignSelf: 'flex-start', marginTop: 5 }}>
            Password
          </CustomSubtitle>
          <CustomThinGreyLine style={{ marginBottom: 8 }} />
          <CustomInput
            id="oldPassword"
            label="Old Password"
            keyboardType="default"
            secureTextEntry
            autoCapitalize="none"
            minLength={8}
            onInputChange={inputPasswordChangeHandler}
            initialValue=""
            required
          />
          <CustomInput
            id="newPassword"
            label="New Password"
            keyboardType="default"
            secureTextEntry
            autoCapitalize="none"
            minLength={8}
            onInputChange={inputPasswordChangeHandler}
            initialValue=""
            required
          />
          <CustomInput
            id="confirmPassword"
            label="Confirm New Password"
            keyboardType="default"
            secureTextEntry
            autoCapitalize="none"
            minLength={8}
            onInputChange={inputPasswordChangeHandler}
            initialValue=""
            required
          />
          <View style={{ ...styles.fullWidthCenterItems, marginVertical: 10 }}>
            {updatingPassword ? (
              <CustomButton>Updating Password...</CustomButton>
            ) : (
              <CustomButton onSelect={updatePasswordHandler}>
                Update Password
              </CustomButton>
            )}
          </View>
          <CustomButton onSelect={logoutHandler}>Logout</CustomButton>
          <CustomButton onSelect={cardTextHandler}>
            Delete Your Account
          </CustomButton>
        </CustomOperationalContainer>
      </CustomScrollView>
      {cardText ? (
        <CustomMessageCard text={cardText} toShow={setCardText} />
      ) : null}
      {deleteText ? (
        <CustomRedCard
          text={deleteText}
          toShow={setDeleteText}
          toPassError={setErrorFromCard}
        />
      ) : null}
      {errorFromCard ? (
        <CustomErrorCard text={error} toShow={setError} />
      ) : null}
      {provinceCard ? (
        <CustomProvinceSelectionCard
          toShow={setProvinceCard}
          toSet={setProvince}
        />
      ) : null}
      {error !== '' ? <CustomErrorCard text={error} toShow={setError} /> : null}
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
  fullWidthCenterItems: {
    width: '100%',
    alignItems: 'center',
  },
});

export default Profile;
