import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import * as certsActions from '../../store/actions/cert';
import * as nonVerActions from '../../store/actions/nonVer';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomFaintThinGreyLine from '../../components/CustomFaintThinGreyLine';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomIndicator from '../../components/CustomIndicator';
import CustomAccordionUnit from '../../components/CustomAccordionUnit';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomScrollView from '../../components/CustomScrollView';
import CustomFullWidthContainer from '../../components/CustomFullWidthContainer';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomRowSpace from '../../components/CustomRowSpace';

import Colors from '../../constants/Colors';

const TotalCPDHoursDetails = (props) => {
  const { year } = props.route.params;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHours, setShowHours] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const certsYearState = useSelector((state) => state.cert.certsYear);
  const nonVerYearState = useSelector((state) => state.nonVer.nonver);

  const loadData = async () => {
    setLoading(true);
    try {
      await dispatch(nonVerActions.getAllNonVerObjsByYear(year));
      await dispatch(certsActions.getAllCertObjsByYear(year));
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const editSessionHandler = (nonver) => {
    navigation.navigate('Edit Non-Verifiable Session', { nonver });
  };

  if (loading) {
    return <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Total CPD Hours for {year}</CustomTitle>
        <CustomGreyLine />
        <CustomAccordionUnit>
          <Pressable onPress={() => setShowHours('cert')}>
            <CustomSubtitle>Verifiable Hours</CustomSubtitle>
          </Pressable>
          <CustomThinGreyLine />
          {showHours === 'cert'
            ? certsYearState.map((cert, index) => (
                <CustomFullWidthContainer key={index}>
                  <CustomRowSpace>
                    <CustomStatsInfoBox style={{ marginVertical: 5 }}>
                      <CustomText>Course Name: {cert.courseName}</CustomText>
                      <CustomText>Hours: {cert.hours}</CustomText>
                      <CustomText>Ethics Hours: {cert.ethicsHours}</CustomText>
                    </CustomStatsInfoBox>

                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color={Colors.darkGrey}
                      style={{ alignSelf: 'center' }}
                    />
                  </CustomRowSpace>
                  <CustomFaintThinGreyLine />
                </CustomFullWidthContainer>
              ))
            : null}
        </CustomAccordionUnit>
        <CustomAccordionUnit>
          <Pressable onPress={() => setShowHours('nonVer')}>
            <CustomSubtitle>Non-Verifiable Hours</CustomSubtitle>
          </Pressable>
          <CustomThinGreyLine />
          {showHours === 'nonVer'
            ? nonVerYearState.map((nonver, index) => (
                <CustomFullWidthContainer key={index}>
                  <CustomRowSpace>
                    <CustomStatsInfoBox style={{ marginVertical: 5 }}>
                      <Pressable onLongPress={() => editSessionHandler(nonver)}>
                        <CustomText>
                          Session Name: {nonver.sessionName}
                        </CustomText>
                        <CustomText>Date: {nonver.date}</CustomText>
                        <CustomText>Hours: {nonver.hours}</CustomText>
                      </Pressable>
                    </CustomStatsInfoBox>
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color={Colors.darkGrey}
                      style={{ alignSelf: 'center' }}
                    />
                  </CustomRowSpace>
                  <CustomFaintThinGreyLine />
                </CustomFullWidthContainer>
              ))
            : null}
        </CustomAccordionUnit>
      </CustomScrollView>
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
    </CustomScreenContainer>
  );
};

export default TotalCPDHoursDetails;
