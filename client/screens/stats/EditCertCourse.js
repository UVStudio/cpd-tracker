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
import * as certActions from '../../store/actions/cert';
import { formReducer } from '../../utils/formReducer';
import Colors from '../../constants/Colors';
import { FORM_INPUT_UPDATE } from '../../store/types';

const EditCertCourse = (props) => {
  const { cert } = props.route.params;
  const [cardText, setCardText] = useState('');
  const [error, setError] = useState('');
  const [updatingCourse, setUpdatingCourse] = useState(false);

  const authState = useSelector((state) => state.auth.user);
  const userState = useSelector((state) => state.user.user);

  const user = userState ? userState : authState;

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      courseName: '',
    },
    inputValidities: {
      courseName: false,
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

  const editCourse = async (id) => {
    setUpdatingCourse(true);
    const courseName = formState.inputValues.courseName;
    try {
      await dispatch(certActions.editCertCourseById(courseName, id));
      await dispatch(userActions.getUser());
      setCardText('Verifiable course name successfully updated');
      setUpdatingCourse(false);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setUpdatingCourse(false);
    }
  };

  if (!user) {
    return <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Edit Verifiable Course Name</CustomTitle>
        <CustomGreyLine />
        <CustomOperationalContainer>
          <CustomInput
            id="courseName"
            label="Edit Course Name"
            keyboardType="default"
            autoCapitalize="characters"
            errorText="Please enter verifiable course name"
            placeholder={cert.courseName}
            placeholderColor={Colors.lightGrey}
            onInputChange={inputChangeHandler}
            initialValue=""
            required
          />
          {updatingCourse ? (
            <CustomButton style={{ marginVertical: 20 }}>
              Updating Course...
            </CustomButton>
          ) : (
            <CustomButton
              onSelect={() => editCourse(cert._id)}
              style={{ marginVertical: 20 }}
            >
              Update Verifiable Course
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

export default EditCertCourse;
