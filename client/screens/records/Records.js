import React, { useEffect, useState, useReducer, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { downloadToFolder } from 'expo-file-dl';

import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import * as reportActions from '../../store/actions/report';
import * as certActions from '../../store/actions/cert';

import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import CustomTitle from '../../components/CustomTitle';
import CustomInput from '../../components/CustomInput';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';
import currentYear from '../../utils/currentYear';
import Colors from '../../constants/Colors';
import { FORM_INPUT_UPDATE } from '../../store/types';

import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

const channelId = 'DownloadInfo';

const Records = () => {
  const user = useSelector((state) => state.auth.user);
  const reportReady = useSelector((state) => state.report.report);

  //console.log('report state: ', reportReady);

  const [downloadProgress, setDownloadProgress] = useState('0%');

  //if true, user is upload a cert. if not, app uploads default no-cert.jpg
  const [cert, setCert] = useState(null);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      year: '',
      date: '',
      name: '',
      hours: '',
    },
    inputValidities: {
      year: false,
      date: false,
      name: false,
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

  const setNotificationChannel = async () => {
    const loadingChannel = await Notifications.getNotificationChannelAsync(
      channelId
    );

    // if we didn't find a notification channel set how we like it, then we create one
    if (loadingChannel == null) {
      const channelOptions = {
        name: channelId,
        importance: AndroidImportance.HIGH,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: 'default',
        vibrationPattern: [250],
        enableVibrate: true,
      };
      await Notifications.setNotificationChannelAsync(
        channelId,
        channelOptions
      );
    }
  };

  useEffect(() => {
    setNotificationChannel();
  });

  const getMediaLibraryPermissions = async () => {
    await MediaLibrary.requestPermissionsAsync();
  };

  const getNotificationPermissions = async () => {
    await Notifications.requestPermissionsAsync();
  };

  const downloadProgressUpdater = ({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }) => {
    const pctg = 100 * (totalBytesWritten / totalBytesExpectedToWrite);
    setDownloadProgress(`${pctg.toFixed(0)}%`);
  };

  const addCertHandler = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (file.type === 'success') {
        console.log('success');
        setCert(file);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const saveVerfiableCourse = async (year, courseName) => {
    try {
      const courseName = 'courseName'; //fake course name for now

      if (cert) {
        await dispatch(certActions.saveVerCourse(cert, year, courseName));
      } else {
        const noCert = {
          name: 'no-cert.jpg',
          uri: 'https://cpdtracker.s3.us-east-2.amazonaws.com/cert/no-cert.jpg',
        };

        await dispatch(certActions.saveVerCourse(noCert, year, courseName));
      }
      setCert(null);
    } catch (err) {
      console.log(err.message);
    }
  };

  const generatePDFHandler = async (year) => {
    try {
      await dispatch(reportActions.buildReport(year));
    } catch (err) {
      console.log(err.message);
    }
  };

  const downloadPDFHandler = async () => {
    const AWSFileName = `${user._id}-2021-CPD-report.pdf`;
    try {
      await downloadToFolder(pdfUri, fileName, 'Download', channelId, {
        downloadProgressCallback: downloadProgressUpdater,
      });
      await dispatch(reportActions.deleteReport(AWSFileName));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getMediaLibraryPermissions();
  });

  useEffect(() => {
    getNotificationPermissions();
  });

  const pdfUri = `https://cpdtracker.s3.us-east-2.amazonaws.com/reports/${user._id}-2021-CPD-report.pdf`;
  const fileName = `${user.name}-CPD-report.pdf`;

  const placeholderYear = currentYear.toString();

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Add Verifiable Session</CustomTitle>
        <CustomGreyLine />
        <CustomOperationalContainer>
          <CustomInput
            id="year"
            label="Session Year"
            keyboardType="numeric"
            autoCapitalize="none"
            errorText="Please enter session year"
            placeholder={placeholderYear}
            placeholderColor={Colors.darkGrey}
            onInputChange={inputChangeHandler}
            initialValue={placeholderYear}
            required
          />
          <CustomInput
            id="date"
            label="Session Day and Month"
            keyboardType="default"
            autoCapitalize="none"
            errorText="Please enter session date"
            placeholder="dd/mm"
            placeholderColor={Colors.lightGrey}
            onInputChange={inputChangeHandler}
            initialValue=""
            required
          />
          <CustomInput
            id="name"
            label="Session Name"
            keyboardType="default"
            autoCapitalize="none"
            errorText="Please enter session name"
            placeholder="ie Ethics in Accounting"
            placeholderColor={Colors.lightGrey}
            onInputChange={inputChangeHandler}
            initialValue=""
            required
          />
          <CustomInput
            id="hours"
            label="Session Duration (hours)"
            keyboardType="default"
            autoCapitalize="none"
            errorText="Please enter session duration"
            placeholder="2"
            placeholderColor={Colors.lightGrey}
            onInputChange={inputChangeHandler}
            initialValue=""
            required
          />

          <CustomButton
            style={{ marginTop: 20 }}
            onSelect={() => addCertHandler()}
          >
            Choose Course Certificate
          </CustomButton>
          <CustomText>{cert !== null ? 'file: ' + cert.name : null}</CustomText>
          <CustomButton
            style={{ marginTop: 10 }}
            onSelect={() => saveVerfiableCourse(2021)}
          >
            Save Verifiable Course
          </CustomButton>
          <CustomButton
            style={{ marginTop: 20 }}
            onSelect={() => generatePDFHandler(2021)}
          >
            Generate PDF Report
          </CustomButton>
          {reportReady ? (
            <View>
              <CustomButton onSelect={downloadPDFHandler}>
                Download PDF Report
              </CustomButton>
              <Text>{downloadProgress}</Text>
            </View>
          ) : null}
        </CustomOperationalContainer>
      </CustomScrollView>
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Records;
