import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import CustomTitle from '../../components/CustomTitle';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const NonVerHoursDetails = (props) => {
  const { year } = props.route.params;

  const sessions = useSelector((state) => state.nonVer);
  console.log(sessions);

  return (
    <CustomScreenContainer>
      <CustomTitle>Non-Verifiable Hours for {year}</CustomTitle>
      <CustomGreyLine />
    </CustomScreenContainer>
  );
};

export default NonVerHoursDetails;
