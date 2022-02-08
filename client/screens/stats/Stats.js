import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Pressable,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';

//import * as Notifications from 'expo-notifications';
import * as Sharing from 'expo-sharing';
import * as authActions from '../../store/actions/auth';
import * as reportActions from '../../store/actions/report';
//import * as MediaLibrary from 'expo-media-library';

import CustomText from '../../components/CustomText';
import CustomTextStats from '../../components/CustomTextStats';
import CustomBoldText from '../../components/CustomBoldText';
import CustomTitle from '../../components/CustomTitle';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomButton from '../../components/CustomButton';
import CustomPieChart from '../../components/CustomPieChart';
import CustomAnimatedPie from '../../components/CustomAnimatedPie';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomAccordionUnit from '../../components/CustomAccordionUnit';
import CustomStatsDivider from '../../components/CustomStatsDivider';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomIndicator from '../../components/CustomIndicator';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomDownloadProgressBar from '../../components/CustomDownloadProgressBar';

import { provinceObjs } from '../../constants/Provinces';
import Colors from '../../constants/Colors';

import currentYear from '../../utils/currentYear';
//const currentYear = 2023; //test currentYear;
import { hoursRequiredLogic } from '../../utils/hoursRequiredLogic';

// import {
//   AndroidImportance,
//   AndroidNotificationVisibility,
//   NotificationChannel,
//   NotificationChannelInput,
//   NotificationContentInput,
// } from 'expo-notifications';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

const channelId = 'DownloadInfo';

const Stats = ({ navigation }) => {
  const [showYear, setShowYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cardText, setCardText] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [dirPath, setDirPath] = useState(`${RNFS.DocumentDirectoryPath}`);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const authState = useSelector((state) => state.auth.user);
  const reportReady = useSelector((state) => state.report.report);

  useEffect(() => {
    console.log('stats screen loadUser()');
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      await dispatch(authActions.getUser()).then(() => {
        console.log('got User: ', authState.name);
      });
    } catch (err) {
      console.log(err.message);
      setError(
        'Attempting to retrieve user Info. There is something wrong with our network. Please try again later.'
      );
    }
    setLoading(false);
  };

  const user = authState;
  const userHours = user.hours;

  const yearsToOverride = userHours
    .filter((hours) => hours.historic)
    .filter((hours) => !hours.overriden);

  const dispatch = useDispatch();

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
  }, [user]);

  //Session details navigations
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
    )
      return showYear - user.cpdYear > 2 ? ' - Required' : ' - Recommended';
    return showYear - user.cpdYear > 1 ? ' - Required' : ' - Recommended';
  };

  //OverwriteCPD
  const overwriteCPDHandler = () => {
    navigation.navigate('Overwrite CPD Hours', { showYear });
  };

  //PDF report begins
  // const setNotificationChannel = async () => {
  //   const loadingChannel = await Notifications.getNotificationChannelAsync(
  //     channelId
  //   );

  //   // if we didn't find a notification channel set how we like it, then we create one
  //   if (loadingChannel == null) {
  //     const channelOptions = {
  //       name: channelId,
  //       importance: AndroidImportance.HIGH,
  //       lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
  //       sound: 'default',
  //       vibrationPattern: [250],
  //       enableVibrate: true,
  //     };
  //     await Notifications.setNotificationChannelAsync(
  //       channelId,
  //       channelOptions
  //     );
  //   }
  // };

  useEffect(() => {
    if (Platform.OS === 'android') {
      //setNotificationChannel();
      setDirPath(`${RNFS.DownloadDirectoryPath}/CPD`);
    }
  }, []);

  //Generate PDF Report
  const generatePDFHandler = async (year) => {
    try {
      setGeneratingPDF(true);
      await dispatch(reportActions.buildReport(year))
        .then(() => {})
        .catch(() => {});
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
  //set vars of names and paths
  const userFirstName = user.name.split(' ')[0];
  const pdfUri = `https://cpdtracker.s3.us-east-2.amazonaws.com/reports/${
    user._id
  }-${showYear.toString()}-CPD-report.pdf`;
  const fileName = `${userFirstName}-${showYear.toString()}-CPD-${Date.now()}.pdf`;
  const AWSFileName = `${user._id}-${showYear.toString()}-CPD-report.pdf`;

  //DocumentDirectoryPath
  const headers = {
    Accept: 'application/pdf',
    'Content-Type': 'application/pdf',
  };

  const downloadPDFHandler = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permission',
          message:
            'CPD Tracker needs your permission to save this report onto your phone',
        }
      );
      //for Android 10, if a CPD folder had been created on a prior date, a new folder will be created.
      //it seems to treat a folder created on a different date as a different folder
      //Android 11 doesn't suffer from the above bug
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        RNFS.mkdir(dirPath)
          .then(() => {
            console.log('folder built');
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setError(
          'We cannot proceed with downloading your report without your permission to access your media libary.'
        );
      }
    }

    const filePath = `${dirPath}/${fileName}`;

    const downloadReportOptions = {
      fromUrl: pdfUri,
      toFile: filePath,
      headers,
      begin: (res) => {
        console.log('file size: ', res.contentLength);
      },
      progressInterval: 20,
      progress: (res) => {
        let pctg = 100 * (res.bytesWritten / res.contentLength);
        setDownloadProgress(pctg.toFixed(0));
      },
    };

    try {
      setDownloadingPDF(true);
      setDownloadProgress(0);

      //for Android or iOS < 15, this will directly save file in CPD folder
      RNFS.downloadFile(downloadReportOptions)
        .promise.then((res) => {
          console.log('total written: ', res.bytesWritten);
        })
        .catch((error) => {
          console.log(error);
        });

      // iOS version < 15 does not require folder selection
      // current simulator setup:
      // 1) iPhone 8 - 12
      // 2) iPhone 8 - 13
      // 3) iPhone 11 - 14
      // 4) iPhone 13 - 15

      //this conditional is only for iOS 15 (and perhaps beyond)
      const majorVersionIOS = parseInt(Platform.Version, 10);
      if (
        Platform.OS === 'ios' &&
        majorVersionIOS > 14 &&
        (await Sharing.isAvailableAsync())
      ) {
        await Sharing.shareAsync('file://' + filePath);
      }
      //end of iOS 15 conditional requirement
      await dispatch(reportActions.deleteReport(AWSFileName))
        .then(() => {})
        .catch(() => {});
      setCardText(
        `Report succesfully downloaded! 
        
For Android users, the PDF is located in the CPD folder.

For iOS 14 and older users, the report is in the File > CPD Tracker folder.

For iOS 15 and beyond, the PDF is where you have chosen to save it.`
      );
      setDownloadProgress(0);
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Your Report cannot be downloaded at the moment. Please try again later.'
      );
    }
    setDownloadingPDF(false);
  };

  const statsFraction = (num, denom, num2) => {
    return (
      <Text>
        <Text style={{ color: Colors.dark, fontSize: 20 }}>
          {Number(num + num2).toFixed(1)}
        </Text>
        <Text>{'  /  '}</Text>
        <Text>{Number(denom).toFixed(1)}</Text>
      </Text>
    );
  };

  if (loading || !user) {
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
                        {/* <CustomAnimatedPie /> */}
                        <CustomTextStats>
                          Verifiable Hours:{'  '}
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
                          {!elem.historic ? ' - Required' : null}
                        </CustomTextStats>
                        {!elem.historic ? (
                          <CustomAnimatedPie
                            required={currentYearNeedVerHours}
                            progress={elem.verifiable}
                          />
                        ) : null}
                      </Pressable>
                    </CustomStatsDivider>
                    <CustomStatsDivider>
                      <Pressable onPress={() => totalCPDHoursDetails()}>
                        <CustomTextStats>
                          Total CPD Hours:{'  '}
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
                          {!elem.historic ? ' - Required' : null}
                        </CustomTextStats>
                        {!elem.historic ? (
                          <CustomAnimatedPie
                            required={currentYearNeedCPDHours}
                            progress={elem.nonVerifiable + elem.verifiable}
                          />
                        ) : null}
                      </Pressable>
                    </CustomStatsDivider>
                    <CustomStatsDivider>
                      <Pressable onPress={() => nonVerHoursDetails()}>
                        <CustomTextStats>
                          Non-Verifiable Hours:{'  '}
                          {!elem.historic ? (
                            <Text style={{ color: 'black', fontSize: 20 }}>
                              {Number(elem.nonVerifiable).toFixed(1)}
                            </Text>
                          ) : (
                            <Text style={{ color: 'black' }}>
                              {Number(elem.nonVerifiable).toFixed(1)}
                            </Text>
                          )}
                        </CustomTextStats>
                      </Pressable>
                    </CustomStatsDivider>
                    <CustomStatsDivider>
                      <CustomTextStats>
                        Ethics Hours:{'  '}
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
                        {!elem.historic ? ethicsReqOrRec() : null}
                      </CustomTextStats>
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
                            {downloadProgress + ' %'}
                          </CustomText>
                          <CustomDownloadProgressBar
                            progress={downloadProgress}
                            fileSize={100}
                          />
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
                            {downloadProgress + '%'}
                          </CustomText>
                        </View>
                      )
                    ) : null}
                  </View>
                )}
                {currentYear > showYear ? (
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
        <CustomButton onSelect={() => loadUser()}>Refresh Data</CustomButton>
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

// const getNotificationPermissions = async () => {
//   await Notifications.requestPermissionsAsync();
// };

// const getMediaLibraryPermissions = async () => {
//   await MediaLibrary.requestPermissionsAsync();
// };

// useEffect(() => {
//   getMediaLibraryPermissions();
// });

// useEffect(() => {
//   getNotificationPermissions();
// });
