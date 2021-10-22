import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { downloadToFolder } from 'expo-file-dl';

import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import * as authActions from '../../store/actions/auth';
import * as reportActions from '../../store/actions/report';

import CustomText from '../../components/CustomText';
import CustomTitle from '../../components/CustomTitle';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomButton from '../../components/CustomButton';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomAccordionUnit from '../../components/CustomAccordionUnit';
import CustomStatsDivider from '../../components/CustomStatsDivider';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomProgressBar from '../../components/CustomProgressBar';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import currentYear from '../../utils/currentYear';
import Colors from '../../constants/Colors';

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

const Stats = () => {
  const [showYear, setShowYear] = useState(currentYear);
  const [downloadProgress, setDownloadProgress] = useState('0%');
  const [error, setError] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const reportReady = useSelector((state) => state.report.report);

  const userHours = user.hours;

  const dispatch = useDispatch();

  //Load User
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setRefreshingData(true);
    try {
      await dispatch(authActions.getUser());
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
    setRefreshingData(false);
  };

  //PDF report begins
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

  //Generate PDF Report
  const generatePDFHandler = async (year) => {
    try {
      setGeneratingPDF(true);
      await dispatch(reportActions.buildReport(year));
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
    setGeneratingPDF(false);
  };

  //Download PDF Report
  const pdfUri = `https://cpdtracker.s3.us-east-2.amazonaws.com/reports/${
    user._id
  }-${showYear.toString()}-CPD-report.pdf`;
  const fileName = `${user.name}-${showYear.toString()}-CPD-report.pdf`;

  const downloadPDFHandler = async () => {
    setDownloadingPDF(true);
    const AWSFileName = `${user._id}-${showYear.toString()}-CPD-report.pdf`;
    try {
      await downloadToFolder(pdfUri, fileName, 'Download', channelId, {
        downloadProgressCallback: downloadProgressUpdater,
      });
      await dispatch(reportActions.deleteReport(AWSFileName));
      setDownloadProgress('0%');
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
    setDownloadingPDF(false);
  };

  useEffect(() => {
    getMediaLibraryPermissions();
  });

  useEffect(() => {
    getNotificationPermissions();
  });

  if (!user) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <CustomScreenContainer>
      <CustomTitle>Statistics Overview</CustomTitle>
      <CustomGreyLine />
      {userHours.map((elem, index) => (
        <CustomAccordionUnit key={index}>
          <Pressable
            onPress={() => setShowYear(userHours[index].year)}
            disabled={reportReady}
          >
            <CustomSubtitle>{elem.year}</CustomSubtitle>
          </Pressable>
          <CustomThinGreyLine />
          {showYear === elem.year ? (
            <CustomStatsInfoBox>
              <CustomStatsDivider>
                <CustomText>
                  Verifiable Hours: {Number(elem.verifiable).toFixed(2)}
                </CustomText>
                <CustomProgressBar
                  progress={elem.verifiable}
                  type="verifiable"
                />
              </CustomStatsDivider>
              <CustomStatsDivider>
                <CustomText>
                  Non-Verifiable Hours: {Number(elem.nonVerifiable).toFixed(2)}
                </CustomText>
                <CustomProgressBar
                  progress={elem.nonVerifiable}
                  type="nonVerifiable"
                />
              </CustomStatsDivider>
              <CustomStatsDivider>
                <CustomText>
                  Ethics Hours: {Number(elem.ethics).toFixed(2)}
                </CustomText>
              </CustomStatsDivider>
              {reportReady ? null : generatingPDF ? (
                <View style={styles.fullWidthCenter}>
                  <CustomButton style={{ marginTop: 10, width: '100%' }}>
                    Generating Your PDF...
                  </CustomButton>
                </View>
              ) : (
                <View style={styles.fullWidthCenter}>
                  <CustomButton
                    style={{ marginTop: 10, width: '100%' }}
                    onSelect={() => generatePDFHandler(showYear)}
                  >
                    Generate PDF Report
                  </CustomButton>
                </View>
              )}
              {reportReady ? (
                downloadingPDF ? (
                  <View style={styles.fullWidthCenter}>
                    <CustomButton style={{ width: '100%' }}>
                      Downloading Your Report...
                    </CustomButton>
                    <CustomText style={{ alignSelf: 'center' }}>
                      {downloadProgress}
                    </CustomText>
                  </View>
                ) : (
                  <View style={styles.fullWidthCenter}>
                    <CustomButton
                      onSelect={downloadPDFHandler}
                      style={{ width: '100%' }}
                    >
                      Click To Download Report
                    </CustomButton>
                    <CustomText style={{ alignSelf: 'center' }}>
                      {downloadProgress}
                    </CustomText>
                  </View>
                )
              ) : null}
            </CustomStatsInfoBox>
          ) : null}
        </CustomAccordionUnit>
      ))}
      {refreshingData ? (
        <CustomButton onSelect={() => loadUser()}>
          Refreshing Your Data...
        </CustomButton>
      ) : (
        <CustomButton onSelect={() => loadUser()}>Refresh Data</CustomButton>
      )}
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthCenter: {
    width: '100%',
    alignSelf: 'center',
  },
});

export default Stats;
