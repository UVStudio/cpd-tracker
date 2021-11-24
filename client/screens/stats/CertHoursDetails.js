import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import * as certsActions from '../../store/actions/cert';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomFaintThinGreyLine from '../../components/CustomFaintThinGreyLine';
import CustomErrorCard from '../../components/CustomErrorCard';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomIndicator from '../../components/CustomIndicator';
import CustomScrollView from '../../components/CustomScrollView';
import CustomFullWidthContainer from '../../components/CustomFullWidthContainer';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const CertHoursDetails = (props) => {
  const { year } = props.route.params;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const certsYearState = useSelector((state) => state.cert.certsYear);

  const loadCerts = async () => {
    setLoading(true);
    try {
      await dispatch(certsActions.getAllCertObjsByYear(year));
    } catch (error) {
      console.log(err.message);
      setLoading(false);
      setError(
        'There is something wrong with our network. Please try again later.'
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCerts();
  }, []);

  if (loading) {
    return <CustomIndicator />;
  }

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>Verifiable Hours for {year}</CustomTitle>
        <CustomGreyLine />
        {certsYearState.map((cert, index) => (
          <CustomFullWidthContainer key={index}>
            <CustomStatsInfoBox style={{ marginVertical: 5 }}>
              <CustomText>Course Name: {cert.courseName}</CustomText>
              <CustomText>Hours: {cert.hours}</CustomText>
              <CustomText>Ethics Hours: {cert.ethicsHours}</CustomText>
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

export default CertHoursDetails;
