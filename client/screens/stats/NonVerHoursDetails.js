import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as nonVerActions from '../../store/actions/nonVer';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomFaintThinGreyLine from '../../components/CustomFaintThinGreyLine';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomIndicator from '../../components/CustomIndicator';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomScrollView from '../../components/CustomScrollView';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const NonVerHoursDetails = (props) => {
  const { year } = props.route.params;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

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

  if (loading) {
    <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Non-Verifiable Hours for {year}</CustomTitle>
        <CustomGreyLine />
        {nonVerYearState.map((nonver, index) => (
          <CustomOperationalContainer key={index} style={{ marginVertical: 0 }}>
            <CustomStatsInfoBox style={{ marginVertical: 5 }}>
              <CustomText>Session Name: {nonver.sessionName}</CustomText>
              <CustomText>Date: {nonver.date}</CustomText>
              <CustomText>Hours: {nonver.hours}</CustomText>
            </CustomStatsInfoBox>
            <CustomFaintThinGreyLine />
          </CustomOperationalContainer>
        ))}
      </CustomScrollView>
      {error !== '' ? (
        <CustomErrorCard error={error} toShow={setError} />
      ) : null}
    </CustomScreenContainer>
  );
};

export default NonVerHoursDetails;
