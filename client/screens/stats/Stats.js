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
import { FontAwesome } from '@expo/vector-icons';

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
import CustomConfirmActionCard from '../../components/CustomConfirmActionCard';
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
import CustomRemainingHours from '../../components/CustomRemainingHours';

import { provinceObjs } from '../../constants/Provinces';
import statsFraction from '../../utils/statsFraction';
import {
  requiredVerRules,
  requiredTotalCPDRules,
} from '../../utils/requiredRulesCardText';
import Colors from '../../constants/Colors';

import currentYear from '../../utils/currentYear';
//const currentYear = 2023; //test currentYear;
import {
  hoursRequiredLogic,
  showThreeYearRolling,
} from '../../utils/hoursRequiredLogic';
import CustomRowSpace from '../../components/CustomRowSpace';
import CustomRowLeft from '../../components/CustomRowLeft';

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
  const [erasePastCardText, setErasePastCardText] = useState('');
  const [eraseLoading, setEraseLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(true);
  const [dirPath, setDirPath] = useState(`${RNFS.DocumentDirectoryPath}`);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [forcedRefresh, setForcedRefresh] = useState(false);

  const authState = useSelector((state) => state.auth.user);
  const reportReady = useSelector((state) => state.report.report);

  const dispatch = useDispatch();
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
  } = hoursRequired;

  useEffect(() => {
    if (yearsToOverride.length > 0) {
      navigation.navigate('CPD Hours Setup', { yearsToOverride });
      return;
    }
    if (
      currentYearNeedCPDHours === 20 &&
      yearsToOverride.length === 0 &&
      currentYear === showYear
    ) {
      setCardText(
        'While you are only required to obtain 20 CPD hours this year, 10 of which needs to be verifiable, you are encouraged to get 2x as many, so you will have an easier time meeting the CPD 3-year rolling requirement in the near future.'
      );
    }
  }, [user]);

  const historicOrNot = () => {
    const showYearObj = userHours.filter((hours) => hours.year === showYear);
    return showYearObj[0].historic;
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      if (!historicOrNot()) {
        refreshData();
      }
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, showYear]);

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

  const retroUploads = () => {
    setErasePastCardText(`Are you sure you want to erase Past CPD Hours data for ${showYear}? Please only do this if: 
    
1 - You are ready to upload all previous verifiable and non-verifiable sessions for ${showYear}, and

2 - You are being audited and you need to show proof of your sessions for ${showYear} to be produced on your CPD hours report.

Otherwise, this is going to be a lot of work for nothing.`);
  };

  const updateHistoric = async (showYear) => {
    setEraseLoading(true);
    try {
      await dispatch(authActions.historicUpdate(showYear));
      setEraseLoading(false);
      setErasePastCardText('');
    } catch (err) {
      console.log(err.message);
      setEraseLoading(false);
      setErasePastCardText('');
    }
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
                <CustomTextStats>View Year:{'  '}</CustomTextStats>
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
                    <View>
                      <View>
                        <CustomText style={{ marginBottom: 10 }}>
                          Looks like you did not use the CPD Tracker App for the
                          year of {showYear}, or you have just erased the Past
                          CPD data for this year. In order for the app to
                          calculate how many hours you need for {currentYear}{' '}
                          and beyond, please either:
                        </CustomText>
                        <CustomText style={{ marginBottom: 10 }}>
                          1 - click on the 'Overwrite CPD Data' button to
                          directly input your CPD hours for {showYear}.
                        </CustomText>
                        <CustomText style={{ marginBottom: 10 }}>
                          2 - go to Verifiable and Non-Verifiable screens and
                          upload each session for {showYear}. Use this approach
                          especially if you are getting audited and need to show
                          proof of sessions.
                        </CustomText>
                      </View>
                    </View>
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
                        <CustomRowLeft>
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
                                <CustomTextStats style={{ color: Colors.dark }}>
                                  {Number(elem.verifiable).toFixed(1)}
                                </CustomTextStats>
                              )}
                            </CustomTextStats>
                          </Pressable>
                          {!elem.historic ? (
                            <Pressable
                              onPress={() =>
                                requiredVerRules(
                                  user.province,
                                  user.cpdYear,
                                  showYear,
                                  pastVerHours,
                                  totalRollingVerRequired,
                                  setCardText
                                )
                              }
                              style={{ flexDirection: 'row' }}
                            >
                              <CustomTextStats style={styles.required}>
                                {' '}
                                - Required
                              </CustomTextStats>
                              <FontAwesome
                                name="exclamation-circle"
                                size={20}
                                color={Colors.darkOrange}
                                style={styles.quotation}
                              />
                            </Pressable>
                          ) : null}
                        </CustomRowLeft>

                        {!elem.historic ? (
                          <CustomAnimatedPie
                            required={currentYearNeedVerHours}
                            progress={elem.verifiable}
                            CPDdetails={verifiableHoursDetails}
                          />
                        ) : null}
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
                        <CustomRowLeft>
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
                            </CustomTextStats>
                          </Pressable>
                          {!elem.historic ? (
                            <Pressable
                              onPress={() =>
                                requiredTotalCPDRules(
                                  user.province,
                                  user.cpdYear,
                                  showYear,
                                  pastVerHours,
                                  pastNonVerHours,
                                  totalRollingCPDHoursRequired,
                                  setCardText
                                )
                              }
                              style={{ flexDirection: 'row' }}
                            >
                              <CustomTextStats style={styles.required}>
                                {' '}
                                - Required
                              </CustomTextStats>
                              <FontAwesome
                                name="exclamation-circle"
                                size={20}
                                color={Colors.darkOrange}
                                style={styles.quotation}
                              />
                            </Pressable>
                          ) : null}
                        </CustomRowLeft>
                        {!elem.historic ? (
                          <CustomAnimatedPie
                            required={currentYearNeedCPDHours}
                            progress={elem.nonVerifiable + elem.verifiable}
                            CPDdetails={totalCPDHoursDetails}
                          />
                        ) : null}
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
                      <CustomStatsDivider
                        style={{ marginTop: 10, marginBottom: 25 }}
                      >
                        {!elem.historic ? (
                          <CustomRemainingHours
                            currentYearNeedVerHours={currentYearNeedVerHours}
                            currentYearNeedCPDHours={currentYearNeedCPDHours}
                            currentYearNeedEthicsHours={
                              currentYearNeedEthicsHours
                            }
                            verifiable={elem.verifiable}
                            nonVerifiable={elem.nonVerifiable}
                            ethics={elem.ethics}
                            showYear={showYear}
                          />
                        ) : null}
                      </CustomStatsDivider>

                      {showThreeYearRolling(
                        user.province,
                        user.cpdYear,
                        showYear
                      ) && !elem.historic ? (
                        <View>
                          <CustomStatsDivider>
                            {elem.historic ? null : (
                              <View>
                                <CustomSubtitle>
                                  3-Year Rolling CPD Requirement
                                </CustomSubtitle>
                              </View>
                            )}
                            <CustomThinGreyLine />
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
                                CPDdetails={null}
                              />
                            ) : null}
                          </CustomStatsDivider>
                          <CustomStatsDivider>
                            <CustomTextStats>
                              Non-Verifiable Hours:{'  '}
                              {!elem.historic ? (
                                <Text style={{ color: 'black', fontSize: 20 }}>
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
                          </CustomStatsDivider>
                          <CustomStatsDivider>
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
                                CPDdetails={null}
                              />
                            ) : null}
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

                      {reportReady ? null : generatingPDF ? (
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
                      )}

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
                            <View style={{ alignSelf: 'center' }}>
                              <CustomDownloadProgressBar
                                progress={downloadProgress}
                                fileSize={100}
                              />
                            </View>
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
                        onSelect={overwriteCPDHandler}
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
                    elem.retro ? null : (
                      <View style={[styles.fullWidthCenter, { marginTop: 30 }]}>
                        <CustomButton
                          onSelect={() => retroUploads()}
                          style={{ alignSelf: 'center', width: '100%' }}
                        >
                          Erase Past CPD Data
                        </CustomButton>
                        <CustomText style={{ marginTop: 10 }}>
                          If you are getting audited, and you need to provide
                          documents to your province for CPD year {showYear},
                          click this to erase this data and upload your previous
                          verifiable and non-verifiable hours.
                        </CustomText>
                      </View>
                    )
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
        {erasePastCardText !== '' ? (
          <CustomConfirmActionCard
            text={erasePastCardText}
            actionLoading={eraseLoading}
            toShow={setErasePastCardText}
            buttonText={'Erase Past CPD Data'}
            savingButtonText="Erasing Past CPD Data"
            confirmAction={() => updateHistoric(showYear)}
          />
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
  required: {
    transform: [{ translateY: 4 }],
    color: Colors.primary,
  },
  quotation: {
    transform: [{ translateY: 3 }],
    marginLeft: 5,
    opacity: 0.6,
  },
});

export default Stats;
