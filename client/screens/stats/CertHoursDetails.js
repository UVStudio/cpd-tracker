import React from 'react';
import { View, Text } from 'react-native';

import CustomTitle from '../../components/CustomTitle';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const CertHoursDetails = (props) => {
  const { year } = props.route.params;

  return (
    <CustomScreenContainer>
      <CustomTitle>Verifiable Hours for {year}</CustomTitle>
      <CustomGreyLine />
    </CustomScreenContainer>
  );
};

export default CertHoursDetails;
