import React, { useState, useReducer, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomIndicator from '../../components/CustomIndicator';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomScrollView from '../../components/CustomScrollView';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';

import * as userActions from '../../store/actions/user';
import * as nonVerActions from '../../store/actions/nonVer';
import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';

const EditNonVerSession = (props) => {
  const nonver = props.route.params.item || props.route.params.nonver;
  const [cardText, setCardText] = useState('');
  const [error, setError] = useState('');
  const [updateCourse, setUpdatingSession] = useState(false);

  const authState = useSelector((state) => state.auth.user);
  const userState = useSelector((state) => state.user.user);

  const user = userState ? userState : authState;

  const dispatch = useDispatch();

  const nonverHours = nonver.hours;
  const nonverHoursString = nonverHours.toString();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      sessionName: nonver.sessionName,
      hours: nonverHoursString,
    },
    inputValidities: {
      sessionName: false,
      hours: false,
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
    setUpdatingSession(true);
    const sessionName = formState.inputValues.sessionName;
    const hours = formState.inputValues.hours;
    try {
      await dispatch(nonVerActions.editNonVerSession(sessionName, hours, id));
      await dispatch(userActions.getUser());
      setCardText('Non-Verifiable session successfully updated');
      setUpdatingSession(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setUpdatingSession(false);
    }
  };

  if (!user) {
    return <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Edit Your Session</CustomTitle>
        <CustomGreyLine />
        <CustomOperationalContainer>
          <CustomInput
            id="sessionName"
            label="Edit Session Name"
            keyboardType="default"
            autoCapitalize="characters"
            onInputChange={inputChangeHandler}
            initialValue={nonver.sessionName}
            required
          />
          <CustomInput
            id="hours"
            label="Edit Session Duration (hours)"
            keyboardType="numeric"
            autoCapitalize="none"
            onInputChange={inputChangeHandler}
            initialValue={nonverHoursString}
            required
          />
          {updateCourse ? (
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

export default EditNonVerSession;
