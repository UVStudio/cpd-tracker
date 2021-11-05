import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { downloadToFolder } from 'expo-file-dl';

import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import * as userActions from '../../store/actions/user';
import * as reportActions from '../../store/actions/report';

import CustomText from '../../components/CustomText';
import CustomBoldText from '../../components/CustomBoldText';
import CustomTitle from '../../components/CustomTitle';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomButton from '../../components/CustomButton';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomAccordionUnit from '../../components/CustomAccordionUnit';
import CustomStatsDivider from '../../components/CustomStatsDivider';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomIndicator from '../../components/CustomIndicator';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomProgressBar from '../../components/CustomProgressBar';
import CustomScreenContainer from '../../components/CustomScreenContainer';

import currentYear from '../../utils/currentYear';
import { hoursRequiredLogic } from '../../utils/hoursRequiredLogic';

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

const Stats = ({ navigation }) => {
  const [showYear, setShowYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState('0%');
  const [error, setError] = useState('');
  const [cardText, setCardText] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);

  const authState = useSelector((state) => state.auth.user);
  const userState = useSelector((state) => state.user.user);
  const reportReady = useSelector((state) => state.report.report);

  const user = userState ? userState : authState;
  const userHours = user.hours;

  const yearsToOverride = userHours
    .filter((hours) => hours.historic)
    .filter((hours) => !hours.overriden);

  const dispatch = useDispatch();

  const loadUser = async () => {
    setLoading(true);
    try {
      await dispatch(userActions.getUser());
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const hoursRequired = hoursRequiredLogic(user);
  // console.log('hours required: ', hoursRequired);
  // console.log('yearsOverride: ', yearsToOverride.length);

  const {
    currentYearNeedCPDHours,
    currentYearNeedVerHours,
    currentYearNeedEthicsHours,
  } = hoursRequired;

  useEffect(() => {
    if (yearsToOverride.length > 0) {
      navigation.navigate('CPD Hours Setup', { yearsToOverride });
      return;
    }
    if (currentYearNeedCPDHours === 20 && yearsToOverride.length === 0) {
      setCardText(
        'While you are only required to obtain 20 CPD hours this year, 10 of which needs to be verifiable, you are encouraged to get 2x as many, so you will have an easier time meeting the CPD 3 year rolling requirement in the near future.'
      );
    }
  }, [userState]);
  //[userState, currentYearNeedCPDHours, yearsToOverride]

  //CPD Month proration calculation helper
  //console.log(Math.round(((12 - (user.cpdMonth - 1)) / 12) * 20));

  const refreshUser = async () => {
    setRefreshingData(true);
    try {
      await dispatch(userActions.getUser());
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
    setRefreshingData(false);
  };

  //Session details
  const verifiableHoursDetails = () => {
    navigation.navigate('Verifiable Details', { year: showYear });
  };

  const totalCPDHoursDetails = () => {
    navigation.navigate('Total CPD Details', { year: showYear });
  };

  const nonVerHoursDetails = () => {
    navigation.navigate('Non-Verifiable Details', { year: showYear });
  };

  //Ethics Required vs Recommended
  const ethicsReqOrRec = () => {
    return userHours[0].year === currentYear &&
      showYear === currentYear &&
      userHours.length === 3
      ? ' required'
      : userHours[0].year === currentYear &&
        showYear === currentYear &&
        userHours.length < 3
      ? ' recommended'
      : null;
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
      setCardText(
        `Report succesfully downloaded. For Android users, the PDF is located in Documents > Download folder.

For iOS users, the PDF is where you have chosen to save it.`
      );
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

  if (loading) {
    return <CustomIndicator />;
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
              {elem.historic ? (
                <CustomBoldText style={{ marginBottom: 10 }}>
                  Past CPD Hours Data
                </CustomBoldText>
              ) : null}
              <CustomStatsDivider>
                <Pressable onPress={() => verifiableHoursDetails()}>
                  <CustomText>
                    Verifiable Hours:{' '}
                    {!elem.historic
                      ? Number(elem.verifiable).toFixed(1) +
                        ' ' +
                        '/' +
                        ' ' +
                        Number(currentYearNeedVerHours).toFixed(1)
                      : Number(elem.verifiable).toFixed(1)}
                    {userHours[0].year === showYear ? ' required' : null}
                  </CustomText>
                  {!elem.historic ? (
                    <CustomProgressBar
                      progress={elem.verifiable}
                      hoursRequired={hoursRequired}
                      type="verifiable"
                    />
                  ) : null}
                </Pressable>
              </CustomStatsDivider>
              <CustomStatsDivider>
                <Pressable onPress={() => totalCPDHoursDetails()}>
                  <CustomText>
                    Total CPD Hours:{' '}
                    {!elem.historic
                      ? Number(elem.nonVerifiable + elem.verifiable).toFixed(
                          1
                        ) +
                        ' ' +
                        '/' +
                        ' ' +
                        Number(currentYearNeedCPDHours).toFixed(1)
                      : Number(elem.nonVerifiable + elem.verifiable).toFixed(1)}
                    {userHours[0].year === showYear ? ' required' : null}
                  </CustomText>
                  {!elem.historic ? (
                    <CustomProgressBar
                      progress={elem.nonVerifiable + elem.verifiable}
                      hoursRequired={hoursRequired}
                      type="total-CPD"
                    />
                  ) : null}
                </Pressable>
              </CustomStatsDivider>
              <CustomStatsDivider>
                <Pressable onPress={() => nonVerHoursDetails()}>
                  <CustomText>
                    Non-Verifiable Hours:{' '}
                    {Number(elem.nonVerifiable).toFixed(1)}
                  </CustomText>
                </Pressable>
              </CustomStatsDivider>
              <CustomStatsDivider>
                <CustomText>
                  Ethics Hours:{' '}
                  {!elem.historic
                    ? Number(elem.ethics).toFixed(1) +
                      ' ' +
                      '/' +
                      ' ' +
                      Number(currentYearNeedEthicsHours).toFixed(1)
                    : Number(elem.ethics).toFixed(1)}
                  {ethicsReqOrRec()}
                </CustomText>
              </CustomStatsDivider>

              {!elem.historic ? (
                <View style={styles.fullWidthCenter}>
                  {reportReady ? null : generatingPDF ? (
                    <View style={styles.fullWidthCenter}>
                      <CustomButton style={{ marginTop: 15, width: '100%' }}>
                        Generating Your PDF...
                      </CustomButton>
                    </View>
                  ) : (
                    <View style={styles.fullWidthCenter}>
                      <CustomButton
                        style={{ marginTop: 15, width: '100%' }}
                        onSelect={() => generatePDFHandler(showYear)}
                      >
                        Generate PDF Report
                      </CustomButton>
                    </View>
                  )}
                </View>
              ) : null}

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
        <CustomButton onSelect={() => refreshUser()}>
          Refreshing Your Data...
        </CustomButton>
      ) : (
        <CustomButton onSelect={() => loadUser()}>Refresh Data</CustomButton>
      )}
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
      {cardText !== '' ? (
        <CustomMessageCard text={cardText} toShow={setCardText} />
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
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
  },
});

export default Stats;
