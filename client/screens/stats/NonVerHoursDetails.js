import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import * as nonVerActions from '../../store/actions/nonVer';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomFaintThinGreyLine from '../../components/CustomFaintThinGreyLine';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomIndicator from '../../components/CustomIndicator';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomScrollView from '../../components/CustomScrollView';
import CustomFullWidthContainer from '../../components/CustomFullWidthContainer';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const NonVerHoursDetails = (props) => {
  const { year } = props.route.params;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const nonVerYearState = useSelector((state) => state.nonVer.nonver);

  const loadNonVer = async () => {
    setLoading(true);
    try {
      await dispatch(nonVerActions.getAllNonVerObjsByYear(year));
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
    loadNonVer();
  }, []);

  const editSessionHandler = (nonver) => {
    navigation.navigate('Edit Non-Verifiable Session', { nonver });
  };

  if (loading) {
    <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Non-Verifiable Hours for {year}</CustomTitle>
        <CustomGreyLine />
        {nonVerYearState.map((nonver, index) => (
          <CustomFullWidthContainer key={index}>
            <CustomStatsInfoBox style={{ marginVertical: 5 }}>
              <Pressable onLongPress={() => editSessionHandler(nonver)}>
                <CustomText>Session Name: {nonver.sessionName}</CustomText>
                <CustomText>Date: {nonver.date}</CustomText>
                <CustomText>Hours: {nonver.hours}</CustomText>
              </Pressable>
            </CustomStatsInfoBox>

            <CustomFaintThinGreyLine />
          </CustomFullWidthContainer>
        ))}
      </CustomScrollView>
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
    </CustomScreenContainer>
  );
};

export default NonVerHoursDetails;
