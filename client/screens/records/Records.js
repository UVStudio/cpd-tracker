import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from 'expo-notifications';
import { downloadToFolder } from 'expo-file-dl';
import CustomButton from '../../components/CustomButton';

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
  console.log('user: ', user);

  const [downloadProgress, setDownloadProgress] = useState('0%');

  async function setNotificationChannel() {
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
  }

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

  const downloadPDFHandler = async () => {
    await downloadToFolder(pdfUri, fileName, 'Download', channelId, {
      downloadProgressCallback: downloadProgressUpdater,
    });
  };

  useEffect(() => {
    getMediaLibraryPermissions();
  });

  useEffect(() => {
    getNotificationPermissions();
  });

  const pdfUri =
    'https://cpdtracker.s3.us-east-2.amazonaws.com/reports/615ec3a7e949ec0444b8d233-2021-CPD-report.pdf';

  const fileName = 'CPD-report.pdf';

  return (
    <View style={styles.container}>
      <Text>Records Screen</Text>
      <Text>Hello {user.name}!</Text>
      <CustomButton onSelect={downloadPDFHandler}>
        Download PDF Report
      </CustomButton>
      <Text>{downloadProgress}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Records;
