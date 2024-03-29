import React, { useState, useReducer, useCallback } from 'react';
import { Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomIndicator from '../../components/CustomIndicator';
import CustomBoldText from '../../components/CustomBoldText';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomScrollView from '../../components/CustomScrollView';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';

import * as DocumentPicker from 'react-native-document-picker';
import * as authActions from '../../store/actions/auth';
import * as certActions from '../../store/actions/cert';
import { formReducer } from '../../utils/formReducer';
import { FORM_INPUT_UPDATE } from '../../store/types';
import CustomSpinner from '../../components/CustomSpinner';

const EditCertCourse = (props) => {
  const cert = props.route.params.item;
  const [certUpload, setCertUpload] = useState(null);
  const [cardText, setCardText] = useState('');
  const [error, setError] = useState('');
  const [updatingCourse, setUpdatingCourse] = useState(false);

  const authState = useSelector((state) => state.auth.user);

  const user = authState;

  const dispatch = useDispatch();

  const certHours = cert.hours;
  const certHoursString = certHours.toString();
  const ethicsHours = cert.ethicsHours;
  const ethicsHoursString = ethicsHours.toString();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      courseName: cert.courseName,
      hours: certHoursString,
      ethicsHours: ethicsHoursString,
    },
    inputValidities: {
      courseName: true,
      hours: true,
      ethicsHours: true,
    },
    formIsValid: false,
  });

  const addCertHandler = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: Platform.OS === 'ios' ? 'public.item' : '*/*',
        copyToCacheDirectory: false,
      });

      if (file.size > 0) {
        setCertUpload(file);
      }
    } catch (err) {
      console.log('err: ', err.message);
      if (
        err.message ===
          'RNCPromiseWrapper: user canceled the document picker, Error Domain=NSCocoaErrorDomain Code=3072 "The operation was cancelled."' ||
        err.message === 'User canceled document picker'
      )
        return;
      setError(
        'There is something wrong with our network. Please try again later.'
      );
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

  const editCourse = async (id) => {
    setUpdatingCourse(true);
    const courseName = formState.inputValues.courseName;
    const hours = formState.inputValues.hours;
    const ethicsHours = formState.inputValues.ethicsHours;

    //console.log('formState: ', formState);
    try {
      dispatch(authActions.dataRefresh());
      if (certUpload) {
        await dispatch(
          certActions.certUpdateById(
            courseName,
            certUpload,
            hours,
            ethicsHours,
            id
          )
        );
      } else {
        await dispatch(
          certActions.editCertCourseById(courseName, hours, ethicsHours, id)
        );
      }
      await dispatch(authActions.getUser());
      setCardText('Verifiable course successfully updated');
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
        <CustomTitle>Edit Verifiable Course</CustomTitle>
        <CustomGreyLine />
        <CustomOperationalContainer>
          <CustomInput
            id="courseName"
            label="Edit Course Name"
            keyboardType="default"
            onInputChange={inputChangeHandler}
            initialValue={cert.courseName}
            required
          />
          <CustomInput
            id="hours"
            label="Edit Course Duration (hours)"
            keyboardType="numeric"
            autoCapitalize="none"
            onInputChange={inputChangeHandler}
            initialValue={certHoursString}
            required
          />
          <CustomInput
            id="ethics"
            label="Edit Ethics Hours"
            keyboardType="numeric"
            autoCapitalize="none"
            onInputChange={inputChangeHandler}
            initialValue={ethicsHoursString}
            required
          />
          <CustomButton
            style={{ marginTop: 20 }}
            onSelect={() => addCertHandler()}
          >
            Select Course Certificate
          </CustomButton>
          <CustomBoldText>
            {certUpload !== null ? 'file: ' + certUpload.name : null}
          </CustomBoldText>
          {updatingCourse ? (
            <CustomButton style={{ marginVertical: 20 }}>
              Updating Course {'  '} <CustomSpinner />
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
