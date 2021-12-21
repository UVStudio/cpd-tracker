import React from 'react';

import CustomTitle from '../../components/CustomTitle';
import CustomBoldText from '../../components/CustomBoldText';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomParaText from '../../components/CustomParaText';
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';

const Privacy = () => {
  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>CPD Track App</CustomTitle>
        <CustomGreyLine />
        <CustomParaText>
          Welcome to the mobile services of CPD Tracker App. (“CPD Tracker,”
          “we,” “us,”or “our” ).
        </CustomParaText>
        <CustomParaText>
          This privacy policy (the “Privacy Policy” or this “Policy”) outlines
          how we collect, use, disclose, manage and safeguard your personal
          information on our mobile services (the “Mobile Services”) which are
          provided in connection with www.sheriffconsulting.com. All terms not
          otherwise defined herein shall have the meanings ascribed to such
          terms under the Terms of Service.
        </CustomParaText>
        <CustomParaText></CustomParaText>
      </CustomScrollView>
    </CustomScreenContainer>
  );
};

export default Privacy;
