import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';

import * as reportActions from '../../store/actions/report';
import * as certActions from '../../store/actions/cert';

import { downloadToFolder } from 'expo-file-dl';
import CustomButton from '../../components/CustomButton';
import CustomScreenContainer from '../../components/CustomScreenContainer';

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

const channelId = 'DownloadInfo';

const Records = () => {
  const user = useSelector((state) => state.auth.user);
  const reportReady = useSelector((state) => state.report.report);

  console.log('report state: ', reportReady);

  const dispatch = useDispatch();

  const [downloadProgress, setDownloadProgress] = useState('0%');

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

  const addCertHandler = async (year) => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (file.type === 'success') {
        console.log('success');
        //await dispatch(certActions.addCert(file, year));
      }
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

  return (
    <CustomScreenContainer>
      <Text>Hello {user.name}!</Text>

      <CustomButton onSelect={() => addCertHandler(2021)}>
        Add Course Certificate
      </CustomButton>

      <CustomButton onSelect={() => generatePDFHandler(2021)}>
        Generate PDF Report
      </CustomButton>

      <Text>Records Screen</Text>
      {reportReady ? (
        <View>
          <CustomButton onSelect={downloadPDFHandler}>
            Download PDF Report
          </CustomButton>
          <Text>{downloadProgress}</Text>
        </View>
      ) : null}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Records;
