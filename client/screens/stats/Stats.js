import React, { useState, useEffect, useRef } from 'react';
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
import { Transition, Transitioning } from 'react-native-reanimated';

import * as Sharing from 'expo-sharing';
import * as authActions from '../../store/actions/auth';
import * as reportActions from '../../store/actions/report';

import CustomText from '../../components/CustomText';
import CustomTextStats from '../../components/CustomTextStats';
import CustomBoldText from '../../components/CustomBoldText';
import CustomSpinner from '../../components/CustomSpinner';
import CustomTitle from '../../components/CustomTitle';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomButton from '../../components/CustomButton';
import CustomAnimatedPie from '../../components/CustomAnimatedPie';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomMessageCard from '../../components/CustomMessageCard';
import CustomYearSelectionCard from '../../components/CustomYearSelectionCard';
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
import {
  hoursRequiredLogic,
  showThreeYearRolling,
} from '../../utils/hoursRequiredLogic';
import CustomRowSpace from '../../components/CustomRowSpace';

const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={600} delayMs={200} />
    <Transition.Change />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);

const Stats = ({ navigation }) => {
  const [showYear, setShowYear] = useState(currentYear);
  const [yearSelectionCard, setYearSelectionCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cardText, setCardText] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [dirPath, setDirPath] = useState(`${RNFS.DocumentDirectoryPath}`);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const authState = useSelector((state) => state.auth.user);
  const reportReady = useSelector((state) => state.report.report);
  const ref = useRef();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      await dispatch(authActions.getUser());
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
    totalRollingVerRequired,
    totalRollingCPDHoursRequired,
    totalRollingEthicsRequired,
    pastVerHours,
    pastNonVerHours,
    pastEthicsHours,
    // pastShowYearNeedCPDHours,
    // pastShowYearNeedVerHours,
    // pastShowYearNeedEthicsHours,
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

  //Refresh Data
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadUser();
    } catch (err) {
      console.log(err.message);
      setError(
        'Unable to refresh your data at this moment due to connectivity issues.'
      );
    }
    setIsRefreshing(false);
  };

  //OverwriteCPD
  const overwriteCPDHandler = () => {
    navigation.navigate('Overwrite CPD Hours', { showYear });
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      setDirPath(`${RNFS.DownloadDirectoryPath}/CPD`);
    }
  }, []);

  //Generate PDF Report
  const generatePDFHandler = async (year) => {
    setGeneratingPDF(true);
    try {
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
    setDownloadingPDF(true);
    setDownloadProgress(0);

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
          .then(() => {})
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
      begin: () => {},
      progressInterval: 20,
      progress: (res) => {
        let pctg = 100 * (res.bytesWritten / res.contentLength);
        setDownloadProgress(pctg.toFixed(0));
      },
    };

    try {
      //for Android or iOS < 15, this will directly save file in CPD folder
      await RNFS.downloadFile(downloadReportOptions)
        .promise.then((res) => {
          setDownloadProgress(100);
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

      await dispatch(reportActions.deleteReport(AWSFileName));
      setCardText(
        `Report succesfully downloaded! 
        
For Android users, the PDF is located in the CPD folder.

For iOS 14 and older users, the report is in the File > CPD Tracker folder.

For iOS 15 and beyond, the PDF is where you have chosen to save it.`
      );
    } catch (err) {
      console.log(err.message);
      setError(
        'There is something wrong with our network. Your Report cannot be downloaded at the moment. Please try again later.'
      );
    }
    setDownloadProgress(0);
    setDownloadingPDF(false);
  };

  const statsFraction = (num, num2, denom) => {
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

  const retroUploads = () => {
    console.log(`Retroactive uploads for ${showYear}`);
  };

  if (loading || !user) {
    return <CustomIndicator />;
  }

  return (
    <Transitioning.View
      transition={transition}
      style={styles.container}
      ref={ref}
    >
      <CustomScreenContainer>
        <CustomScrollView>
          <Pressable onPress={setYearSelectionCard} disabled={reportReady}>
            <CustomRowSpace style={{ marginBottom: 0, marginTop: 10 }}>
              <Text>
                <CustomTextStats>Choose Year:{'  '}</CustomTextStats>
                <CustomTitle>{showYear}</CustomTitle>
              </Text>
            </CustomRowSpace>
          </Pressable>
          <CustomGreyLine style={{ marginBottom: 0 }} />
          {userHours.map((elem, index) => (
            <CustomAccordionUnit key={index}>
              {showYear === elem.year ? (
                <CustomStatsInfoBox>
                  {currentYear !== showYear &&
                  elem.verifiable + elem.nonVerifiable === 0 ? (
                    <CustomText>
                      Looks like you did not use the CPD Tracker App for the
                      year of {showYear}. In order for the app to calculate how
                      many hours you need for {currentYear}, and beyond,
                      properly, please click on the 'Overwrite CPD Data' button
                      to manually input your CPD hours for {showYear}.
                    </CustomText>
                  ) : (
                    <View style={styles.fullWidthCenter}>
                      {elem.historic ? (
                        <CustomBoldText style={{ marginBottom: 10 }}>
                          Past CPD Hours Data
                        </CustomBoldText>
                      ) : null}
                      <CustomStatsDivider>
                        {elem.historic ? null : (
                          <View>
                            <CustomSubtitle>
                              {elem.year} annual CPD Requirement
                            </CustomSubtitle>
                            <CustomThinGreyLine />
                          </View>
                        )}
                        <Pressable onPress={() => verifiableHoursDetails()}>
                          <CustomTextStats>
                            Verifiable Hours:{'  '}
                            {!elem.historic ? (
                              statsFraction(
                                elem.verifiable,
                                null,
                                currentYearNeedVerHours
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
                                elem.verifiable,
                                elem.nonVerifiable,
                                currentYearNeedCPDHours
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
                        <CustomTextStats style={{ marginBottom: 10 }}>
                          Ethics Hours:{'  '}
                          {!elem.historic ? (
                            statsFraction(
                              elem.ethics,
                              null,
                              currentYearNeedEthicsHours
                            )
                          ) : (
                            <Text style={{ color: 'black' }}>
                              {Number(elem.ethics).toFixed(1)}
                            </Text>
                          )}
                          {!elem.historic ? ethicsReqOrRec() : null}
                        </CustomTextStats>
                      </CustomStatsDivider>
                      {showThreeYearRolling(
                        user.province,
                        user.cpdYear,
                        showYear
                      ) ? (
                        <View>
                          <CustomStatsDivider>
                            {elem.historic ? null : (
                              <View>
                                <CustomSubtitle>
                                  3 Year Rolling CPD Requirement
                                </CustomSubtitle>
                              </View>
                            )}
                            <CustomThinGreyLine />
                            <Pressable onPress={() => verifiableHoursDetails()}>
                              <CustomTextStats>
                                Verifiable Hours:{'  '}
                                {!elem.historic ? (
                                  statsFraction(
                                    pastVerHours,
                                    elem.verifiable,
                                    totalRollingVerRequired
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
                                  required={totalRollingVerRequired}
                                  progress={pastVerHours + elem.verifiable}
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
                                    pastNonVerHours,
                                    pastVerHours +
                                      elem.verifiable +
                                      elem.nonVerifiable,
                                    totalRollingCPDHoursRequired
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
                                  required={totalRollingCPDHoursRequired}
                                  progress={
                                    pastNonVerHours +
                                    pastVerHours +
                                    elem.verifiable +
                                    elem.nonVerifiable
                                  }
                                />
                              ) : null}
                            </Pressable>
                          </CustomStatsDivider>
                          <CustomStatsDivider>
                            <Pressable onPress={() => nonVerHoursDetails()}>
                              <CustomTextStats>
                                Non-Verifiable Hours:{'  '}
                                {!elem.historic ? (
                                  <Text
                                    style={{ color: 'black', fontSize: 20 }}
                                  >
                                    {Number(
                                      pastNonVerHours + elem.nonVerifiable
                                    ).toFixed(1)}
                                  </Text>
                                ) : (
                                  <Text style={{ color: 'black' }}>
                                    {Number(pastNonVerHours).toFixed(1)}
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
                                  pastEthicsHours,
                                  elem.ethics,
                                  totalRollingEthicsRequired
                                )
                              ) : (
                                <Text style={{ color: 'black' }}>
                                  {Number(elem.ethics).toFixed(1)}
                                </Text>
                              )}
                              {!elem.historic ? ethicsReqOrRec() : null}
                            </CustomTextStats>
                          </CustomStatsDivider>
                        </View>
                      ) : null}

                      {!elem.historic ? (
                        reportReady ? null : generatingPDF ? (
                          <View style={styles.fullWidthCenter}>
                            <CustomButton
                              style={{ marginTop: 15, width: '100%' }}
                            >
                              Generating Your PDF {'  '} <CustomSpinner />
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
                        )
                      ) : null}

                      {reportReady ? (
                        downloadingPDF ? (
                          <View style={styles.fullWidthCenter}>
                            <CustomButton
                              style={{ alignSelf: 'center', width: '80%' }}
                            >
                              Downloading Your Report {'   '}
                              <CustomSpinner />
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
                              style={{ alignSelf: 'center', width: '80%' }}
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
                  {elem.historic ? (
                    <View style={styles.fullWidthCenter}>
                      <CustomButton
                        onSelect={
                          downloadingPDF || generatingPDF
                            ? null
                            : overwriteCPDHandler
                        }
                        style={{ alignSelf: 'center', width: '100%' }}
                      >
                        Overwrite Data
                      </CustomButton>
                    </View>
                  ) : null}
                  <View style={[styles.fullWidthCenter, { marginBottom: 20 }]}>
                    {isRefreshing ? (
                      <CustomButton
                        style={{ alignSelf: 'center', width: '80%' }}
                      >
                        Refreshing Data...{'   '}
                        <CustomSpinner />
                      </CustomButton>
                    ) : (
                      <CustomButton
                        onSelect={refreshData}
                        style={{ alignSelf: 'center', width: '100%' }}
                      >
                        Refresh Data
                      </CustomButton>
                    )}
                  </View>
                  {elem.historic ? (
                    <View style={[styles.fullWidthCenter, { marginTop: 30 }]}>
                      <CustomButton
                        onSelect={
                          downloadingPDF || generatingPDF ? null : retroUploads
                        }
                        style={{ alignSelf: 'center', width: '100%' }}
                      >
                        Retroactive Courses Uploads
                      </CustomButton>
                      <CustomText>
                        If you are getting audited, and you need to provide
                        documents to your province for CPD year {showYear},
                        click this and upload your previous verifiable and
                        non-verifiable hours.
                      </CustomText>
                    </View>
                  ) : null}
                </CustomStatsInfoBox>
              ) : null}
            </CustomAccordionUnit>
          ))}
        </CustomScrollView>
        {error !== '' ? (
          <CustomErrorCard error={error} toShow={setError} />
        ) : null}
        {cardText !== '' ? (
          <CustomMessageCard text={cardText} toShow={setCardText} />
        ) : null}
        {yearSelectionCard ? (
          <CustomYearSelectionCard
            toShow={setYearSelectionCard}
            toSet={setShowYear}
            userHours={userHours}
          />
        ) : null}
      </CustomScreenContainer>
    </Transitioning.View>
  );
};

const styles = StyleSheet.create({
  fullWidthCenter: {
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Stats;

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
