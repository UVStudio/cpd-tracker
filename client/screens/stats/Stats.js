import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, StyleSheet, Platform, Pressable } from 'react-native';
import { downloadToFolder } from 'expo-file-dl';
import { PieChart } from 'react-native-svg-charts';

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
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';

import { provinceObjs } from '../../constants/Provinces';
import Colors from '../../constants/Colors';

import currentYear from '../../utils/currentYear';
//test currentYear;
//const currentYear = 2023;
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

  const hoursRequired = hoursRequiredLogic(user, showYear);

  const {
    currentYearNeedCPDHours,
    currentYearNeedVerHours,
    currentYearNeedEthicsHours,
    pastShowYearNeedCPDHours,
    pastShowYearNeedVerHours,
    pastShowYearNeedEthicsHours,
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
    if (
      user.province === provinceObjs.alberta.name ||
      user.province === provinceObjs.nwtNu.name
    ) {
      return showYear - user.cpdYear > 2 ? ' required' : ' recommended';
    }
    return showYear - user.cpdYear > 1 ? ' required' : ' recommended';
  };

  //OverwriteCPD
  const overwriteCPDHandler = () => {
    navigation.navigate('Overwrite CPD Hours', { showYear });
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
    if (Platform.OS === 'android') {
      setNotificationChannel();
    }
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
      await downloadPDFHandler();
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Your Report cannot be generated at the moment. Please try again later.'
      );
    }
    setGeneratingPDF(false);
  };

  //Download PDF Report
  const userFirstName = user.name.split(' ')[0];

  const pdfUri = `https://cpdtracker.s3.us-east-2.amazonaws.com/reports/${
    user._id
  }-${showYear.toString()}-CPD-report.pdf`;

  const fileName = `${userFirstName}-${showYear.toString()}-CPD-report.pdf`;

  const downloadPDFHandler = async () => {
    await getMediaLibraryPermissions();
    const permResult = await MediaLibrary.getPermissionsAsync();
    if (permResult.status !== 'granted') {
      setError(
        'We cannot proceed with downloading your report without your permission to access your media libary.'
      );
      return;
    }

    const AWSFileName = `${user._id}-${showYear.toString()}-CPD-report.pdf`;
    try {
      setDownloadingPDF(true);
      await downloadToFolder(
        pdfUri,
        fileName,
        'CPD Tracker Folder',
        channelId,
        {
          downloadProgressCallback: downloadProgressUpdater,
        }
      );
      await dispatch(reportActions.deleteReport(AWSFileName));
      setCardText(
        `Report succesfully downloaded. For Android users, the PDF is located in the Documents > CPD Reports folder.

For iOS users, the PDF is where you have chosen to save it.`
      );
      setDownloadProgress('0%');
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Your Report cannot be downloaded at the moment. Please try again later.'
      );
    }
    setDownloadingPDF(false);
  };

  // useEffect(() => {
  //   getMediaLibraryPermissions();
  // });

  /* <CustomProgressBar
  progress={elem.verifiable}
  hoursRequired={hoursRequired}
  type="verifiable"
  /> */

  /* <CustomProgressBar
  progress={elem.nonVerifiable + elem.verifiable}
  hoursRequired={hoursRequired}
  type="total-CPD"
  /> */

  useEffect(() => {
    getNotificationPermissions();
  });

  const statsFraction = (num, denom, num2) => {
    return (
      <Text>
        <Text style={{ color: Colors.dark }}>
          {Number(num + num2).toFixed(1)}
        </Text>
        <Text> / </Text>
        <Text>{Number(denom).toFixed(1)}</Text>
      </Text>
    );
  };

  const pieRemainder = (required, progress) => {
    return required - progress > 0 ? required - progress : 0;
  };

  const pieColor = (required, progress) => {
    return required - progress > 0 ? Colors.light : Colors.brightGreen;
  };

  if (loading) {
    return <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
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
                {currentYear !== showYear &&
                elem.verifiable + elem.nonVerifiable === 0 ? (
                  <CustomText>
                    Looks like you did not use the CPD Tracker App for the year
                    of {showYear}. In order for the app to calculate how many
                    hours you need for {currentYear}, and beyond, properly,
                    please click on the 'Overwrite CPD Data' button to manually
                    input your CPD hours for {showYear}.
                  </CustomText>
                ) : (
                  <View style={styles.fullWidthCenter}>
                    {elem.historic ? (
                      <CustomBoldText style={{ marginBottom: 10 }}>
                        Past CPD Hours Data
                      </CustomBoldText>
                    ) : null}
                    <CustomStatsDivider>
                      <Pressable onPress={() => verifiableHoursDetails()}>
                        <CustomText>
                          Verifiable Hours:{' '}
                          {!elem.historic ? (
                            statsFraction(
                              elem.verifiable,
                              currentYearNeedVerHours,
                              null
                            )
                          ) : (
                            <Text style={{ color: Colors.dark }}>
                              {Number(elem.verifiable).toFixed(1)}
                            </Text>
                          )}
                          {userHours[0].year === showYear ? ' required' : null}
                        </CustomText>
                        {!elem.historic ? (
                          <PieChart
                            style={{ height: 160 }}
                            valueAccessor={({ item }) => item.portion}
                            spacing={1}
                            outerRadius={'85%'}
                            innerRadius={'50%'}
                            data={[
                              {
                                key: 1,
                                name: 'progress',
                                portion: elem.verifiable,
                                svg: {
                                  fill: pieColor(
                                    currentYearNeedVerHours,
                                    elem.verifiable
                                  ),
                                },
                              },
                              {
                                key: 2,
                                name: 'remainder',
                                portion: pieRemainder(
                                  currentYearNeedVerHours,
                                  elem.verifiable
                                ),
                                svg: { fill: Colors.lightGrey },
                              },
                            ]}
                          />
                        ) : null}
                      </Pressable>
                    </CustomStatsDivider>
                    <CustomStatsDivider>
                      <Pressable onPress={() => totalCPDHoursDetails()}>
                        <CustomText>
                          Total CPD Hours:{' '}
                          {!elem.historic ? (
                            statsFraction(
                              elem.nonVerifiable,
                              currentYearNeedCPDHours,
                              elem.verifiable
                            )
                          ) : (
                            <Text style={{ color: 'black' }}>
                              {Number(
                                elem.nonVerifiable + elem.verifiable
                              ).toFixed(1)}
                            </Text>
                          )}
                          {userHours[0].year === showYear ? ' required' : null}
                        </CustomText>
                        {!elem.historic ? (
                          <PieChart
                            style={{ height: 160 }}
                            valueAccessor={({ item }) => item.portion}
                            spacing={1}
                            outerRadius={'85%'}
                            innerRadius={'50%'}
                            data={[
                              {
                                key: 1,
                                name: 'progress',
                                portion: elem.nonVerifiable + elem.verifiable,
                                svg: {
                                  fill: pieColor(
                                    currentYearNeedCPDHours,
                                    elem.nonVerifiable + elem.verifiable
                                  ),
                                },
                              },
                              {
                                key: 2,
                                name: 'remainder',
                                portion: pieRemainder(
                                  currentYearNeedCPDHours,
                                  elem.nonVerifiable + elem.verifiable
                                ),
                                svg: { fill: Colors.lightGrey },
                              },
                            ]}
                          />
                        ) : null}
                      </Pressable>
                    </CustomStatsDivider>
                    <CustomStatsDivider>
                      <Pressable onPress={() => nonVerHoursDetails()}>
                        <CustomText>
                          Non-Verifiable Hours:{' '}
                          <Text style={{ color: 'black' }}>
                            {Number(elem.nonVerifiable).toFixed(1)}
                          </Text>
                        </CustomText>
                      </Pressable>
                    </CustomStatsDivider>
                    <CustomStatsDivider>
                      <CustomText>
                        Ethics Hours:{' '}
                        {!elem.historic ? (
                          statsFraction(
                            elem.ethics,
                            currentYearNeedEthicsHours,
                            null
                          )
                        ) : (
                          <Text style={{ color: 'black' }}>
                            {Number(elem.ethics).toFixed(1)}
                          </Text>
                        )}
                        {showYear === currentYear ? ethicsReqOrRec() : null}
                      </CustomText>
                    </CustomStatsDivider>

                    {!elem.historic ? (
                      <View style={styles.fullWidthCenter}>
                        {reportReady ? null : generatingPDF ? (
                          <View style={styles.fullWidthCenter}>
                            <CustomButton
                              style={{ marginTop: 15, width: '100%' }}
                            >
                              Generating Your PDF...
                            </CustomButton>
                          </View>
                        ) : (
                          <View style={styles.fullWidthCenter}>
                            <CustomButton
                              style={{ marginTop: 15, width: '100%' }}
                              onSelect={() => generatePDFHandler(showYear)}
                            >
                              Generate & Download PDF Report
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
                            Download Report
                          </CustomButton>
                          <CustomText style={{ alignSelf: 'center' }}>
                            {downloadProgress}
                          </CustomText>
                        </View>
                      )
                    ) : null}
                  </View>
                )}
                {currentYear !== showYear ? (
                  <View style={styles.fullWidthCenter}>
                    <CustomButton
                      onSelect={
                        downloadingPDF || generatingPDF
                          ? null
                          : overwriteCPDHandler
                      }
                      style={{ alignSelf: 'center', width: '100%' }}
                    >
                      Overwrite CPD Data
                    </CustomButton>
                  </View>
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
      </CustomScrollView>
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
  color: {
    color: 'black',
  },
});

export default Stats;
