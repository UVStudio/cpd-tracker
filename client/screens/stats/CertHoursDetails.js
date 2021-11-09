import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as certsActions from '../../store/actions/cert';

import CustomTitle from '../../components/CustomTitle';
import CustomText from '../../components/CustomText';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const CertHoursDetails = (props) => {
  const { year } = props.route.params;

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth.user);
  const userState = useSelector((state) => state.user.user);
  const certsYearState = useSelector((state) => state.cert.certsYear);

  const user = userState ? userState : authState;

  const loadCerts = async () => {
    try {
      await dispatch(certsActions.getAllCertObjsByYear(year));
    } catch (error) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  return (
    <CustomScreenContainer>
      <CustomTitle>Verifiable Hours for {year}</CustomTitle>
      <CustomGreyLine />
      {certsYearState.map((cert, index) => (
        <CustomOperationalContainer key={index} style={{ marginVertical: 5 }}>
          <CustomStatsInfoBox style={{ marginVertical: 0 }}>
            <CustomText>Course Name: {cert.courseName}</CustomText>
            <CustomText>Hours: {cert.hours}</CustomText>
            <CustomText>Ethics Hours: {cert.ethicsHours}</CustomText>
          </CustomStatsInfoBox>
          <CustomThinGreyLine />
        </CustomOperationalContainer>
      ))}
    </CustomScreenContainer>
  );
};

export default CertHoursDetails;
