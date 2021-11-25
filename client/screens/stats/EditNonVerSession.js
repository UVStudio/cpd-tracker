import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomIndicator from '../../components/CustomIndicator';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomSelectField from '../../components/CustomSelectField';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomScrollView from '../../components/CustomScrollView';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';

import * as userActions from '../../store/actions/user';
import * as nonVerActions from '../../store/actions/nonVer';
import { formReducer } from '../../utils/formReducer';
import Colors from '../../constants/Colors';
import { FORM_INPUT_UPDATE } from '../../store/types';

const EditNonVerSession = (props) => {
  const { nonver } = props.route.params;
  const [cardText, setCardText] = useState('');
  const [error, setError] = useState('');
  const [savingDirect, setSavingDirect] = useState(false);

  const authState = useSelector((state) => state.auth.user);
  const userState = useSelector((state) => state.user.user);

  const user = userState ? userState : authState;

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      sessionName: '',
    },
    inputValidities: {
      sessionName: false,
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

  const editSession = async (id) => {
    setSavingDirect(true);
    const sessionName = formState.inputValues.sessionName;
    try {
      await dispatch(nonVerActions.editNonVerSession(sessionName, id));
      await dispatch(userActions.getUser());
      setCardText('Non-Verifiable session name successfully updated');
      setSavingDirect(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setSavingDirect(false);
    }
  };

  if (!user) {
    return <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Edit Your Session Name</CustomTitle>
        <CustomGreyLine />
        <CustomOperationalContainer>
          <CustomInput
            id="sessionName"
            label="Edit Session Name"
            keyboardType="default"
            autoCapitalize="characters"
            errorText="Please enter verifiable course name"
            placeholder={nonver.sessionName}
            placeholderColor={Colors.lightGrey}
            onInputChange={inputChangeHandler}
            initialValue=""
            required
          />
          {savingDirect ? (
            <CustomButton style={{ marginVertical: 20 }}>
              Updating Session...
            </CustomButton>
          ) : (
            <CustomButton
              onSelect={() => editSession(nonver._id)}
              style={{ marginVertical: 20 }}
            >
              Update Non-Verifiable Session
            </CustomButton>
          )}
        </CustomOperationalContainer>
      </CustomScrollView>
      {cardText !== '' ? (
        <CustomMessageCard text={cardText} toShow={setCardText} />
      ) : null}
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionLengthText: {
    fontSize: 20,
    marginBottom: 15,
    fontFamily:
      Platform.OS === 'android'
        ? 'sans-serif-condensed'
        : 'AvenirNextCondensed-Medium',
  },
  passFromOperationalContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EditNonVerSession;
