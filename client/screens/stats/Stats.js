import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';

import CustomText from '../../components/CustomText';
import CustomTitle from '../../components/CustomTitle';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomAccordionUnit from '../../components/CustomAccordionUnit';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const Stats = () => {
  const user = useSelector((state) => state.auth.user);
  // const authState = useSelector((state) => state.auth);
  // console.log('authState: ', authState);
  const userHours = user.hours;

  const [showYear, setShowYear] = useState(false);
  console.log('showYear: ', showYear);

  // const showHandler = (index) => {
  //   setShowYear(userHours[index].year);
  //   console.log('showYear: ', showYear);
  // };

  return (
    <CustomScreenContainer>
      <CustomTitle>Statistics Overview</CustomTitle>
      <CustomGreyLine />
      {userHours.map((elem, index) => (
        <CustomAccordionUnit key={index}>
          <Pressable onPress={() => setShowYear(userHours[index].year)}>
            <CustomSubtitle>{elem.year}</CustomSubtitle>
          </Pressable>
          <CustomThinGreyLine />
          {showYear === elem.year ? (
            <View>
              <CustomText>Verifiable Hours: {elem.verifiable}</CustomText>
              <CustomText>
                Non-Verifiable Hours: {elem.nonVerifiable}
              </CustomText>
              <CustomText>Ethics Hours: {elem.ethics}</CustomText>
            </View>
          ) : null}
        </CustomAccordionUnit>
      ))}
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Stats;
