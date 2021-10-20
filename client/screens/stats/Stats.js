import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import currentYear from '../../utils/currentYear';
import * as authActions from '../../store/actions/auth';

import CustomText from '../../components/CustomText';
import CustomTitle from '../../components/CustomTitle';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomButton from '../../components/CustomButton';
import CustomAccordionUnit from '../../components/CustomAccordionUnit';
import CustomStatsDivider from '../../components/CustomStatsDivider';
import CustomStatsInfoBox from '../../components/CustomStatsInfoBox';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomProgressBar from '../../components/CustomProgressBar';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import Colors from '../../constants/Colors';

const Stats = () => {
  const [showYear, setShowYear] = useState(currentYear);

  const user = useSelector((state) => state.auth.user);
  const userHours = user.hours;

  const dispatch = useDispatch();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      await dispatch(authActions.getUser());
    } catch (err) {
      console.log(err.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
            <CustomStatsInfoBox>
              <CustomStatsDivider>
                <CustomText>
                  Verifiable Hours: {Number(elem.verifiable).toFixed(2)}
                </CustomText>
                <CustomProgressBar
                  progress={elem.verifiable}
                  type="verifiable"
                />
              </CustomStatsDivider>
              <CustomStatsDivider>
                <CustomText>
                  Non-Verifiable Hours: {Number(elem.nonVerifiable).toFixed(2)}
                </CustomText>
                <CustomProgressBar
                  progress={elem.nonVerifiable}
                  type="nonVerifiable"
                />
              </CustomStatsDivider>
              <CustomStatsDivider>
                <CustomText>
                  Ethics Hours: {Number(elem.ethics).toFixed(2)}
                </CustomText>
              </CustomStatsDivider>
            </CustomStatsInfoBox>
          ) : null}
        </CustomAccordionUnit>
      ))}
      <CustomButton onSelect={() => loadUser()}>Refresh Data</CustomButton>
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardContainer: {
    position: 'absolute',
    width: '86%',
    height: 300,
    backgroundColor: '#fff',
    opacity: 1,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: Colors.primary,
    //iOS shadow
    shadowColor: '#171717',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    //android shadow
    elevation: 10,
    shadowColor: '#000000',
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Stats;
