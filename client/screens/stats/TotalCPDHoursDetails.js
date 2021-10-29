import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import CustomTitle from '../../components/CustomTitle';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const TotalCPDHoursDetails = (props) => {
  const { year } = props.route.params;

  return (
    <CustomScreenContainer>
      <CustomTitle>Total CPD Hours for {year}</CustomTitle>
      <CustomGreyLine />
    </CustomScreenContainer>
  );
};

export default TotalCPDHoursDetails;
