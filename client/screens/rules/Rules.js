import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import newCPARules from '../../utils/newCPARulesText';
import cpdWebsites from '../../constants/CPDWebsites';
import { provinceObjs } from '../../constants/Provinces';

import CustomText from '../../components/CustomText';
import CustomBoldText from '../../components/CustomBoldText';
import CustomTitle from '../../components/CustomTitle';
import CustomSubtitle from '../../components/CustomSubtitle';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomOperationalContainer from '../../components/CustomOperationalContainer';
import CustomThinGreyLine from '../../components/CustomThinGreyLine';
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const Rules = () => {
  const authState = useSelector((state) => state.auth.user);
  const userState = useSelector((state) => state.user.user);

  const user = userState ? userState : authState;

  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>CPA {user.province}</CustomTitle>
        <CustomGreyLine />
        <CustomOperationalContainer>
          <CustomSubtitle style={{ alignSelf: 'flex-start' }}>
            Annual Minimum CPD Hours
          </CustomSubtitle>
          <CustomThinGreyLine />
          <CustomText style={{ marginBottom: 10 }}>
            {user.province}, along with most other provincial jurisdictions,
            require each CPA member to obtain at least 20 hours of CPD, of
            which, at least 10 hours are required to be verifiable hours.
          </CustomText>
          <CustomText style={{ marginBottom: 10 }}>
            While 20 hours is the minimum required, the CPD Tracker by Sheriff
            Consulting highly recommends that CPA's in Canada should strive to
            obtain 40 hours per year. This will alleviate the pressure to
            fulfill your 3-year rolling requirement.
          </CustomText>
          <CustomSubtitle style={{ alignSelf: 'flex-start', marginTop: 10 }}>
            3-Year Rolling CPD Hours Requirement
          </CustomSubtitle>
          <CustomThinGreyLine />
          <CustomText style={{ marginBottom: 10 }}>
            All provinces require their CPD members to fulfill 120 hours of CPD
            over a period of 3 years, at least 60 hours need to be verifiable.
          </CustomText>
          <CustomText style={{ marginBottom: 10 }}>
            4 verifiable hours need to be on the subject of Ethics.
          </CustomText>
          {user.province === provinceObjs.newBrunswick.name ? (
            <CustomText style={{ marginBottom: 10 }}>
              The jurisdiction of {user.province} allows CPA's to carry over a
              maximum of 40 verifiable CPD hours in excess of the minimum
              requirement in one year to the next. Please see their website for
              details: {cpdWebsites(user.province)}
            </CustomText>
          ) : null}
          <CustomSubtitle style={{ alignSelf: 'flex-start', marginTop: 10 }}>
            New CPA {user.province} Members
          </CustomSubtitle>
          <CustomThinGreyLine />
          <CustomText style={{ marginBottom: 20 }}>
            {newCPARules(user.province)}
          </CustomText>
          <CustomText>
            For more information regarding CPD reporting rules, please visit
            your provincial CPA website here: {cpdWebsites(user.province)}
          </CustomText>
        </CustomOperationalContainer>
      </CustomScrollView>
    </CustomScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Rules;
