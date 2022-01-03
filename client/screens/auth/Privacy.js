import React from 'react';

import CustomTitle from '../../components/CustomTitle';
import CustomBoldText from '../../components/CustomBoldText';
import CustomGreyLine from '../../components/CustomGreyLine';
import CustomFaintThinGreyLine from '../../components/CustomFaintThinGreyLine';
import CustomParaText from '../../components/CustomParaText';
import CustomScrollView from '../../components/CustomScrollView';
import CustomScreenContainer from '../../components/CustomScreenContainer';
import CustomSubtitle from '../../components/CustomSubtitle';

const Privacy = () => {
  return (
    <CustomScreenContainer>
      <CustomScrollView>
        <CustomTitle>CPD Track App</CustomTitle>
        <CustomGreyLine />
        <CustomParaText>
          This Privacy Policy was last revised on 01/01/2022. We may modify this
          Privacy Policy from time to time. Please see the revised date at the
          top of this page to see when this Privacy Policy was last revised.
        </CustomParaText>
        <CustomParaText>
          CPD Tracker App by Sheriff Consulting (CPD Tracking App, The App)
          understands the importance of protecting personal information. This
          Privacy Policy outlines how The App collects, uses, and discloses your
          personal information. You will also find information on how we protect
          your personal information.
        </CustomParaText>
        <CustomSubtitle>1. What information do we collect?</CustomSubtitle>
        <CustomFaintThinGreyLine />
        <CustomParaText>
          <CustomBoldText>Account information: </CustomBoldText>When you
          register a The App account, we collect your user name and email
          address. We use this information for account identification and email
          communication about account status and app updates.
        </CustomParaText>
        <CustomParaText>
          <CustomBoldText>CPD information: </CustomBoldText>The CPD Tracker
          App's primary benefit is to help CPA's across Canada to keep track of
          their CPD hours and their course certificates from their Verifiable
          Hours. The App retains this information for as long as the user keeps
          their account active.
        </CustomParaText>
        <CustomParaText>
          <CustomBoldText>Device information: </CustomBoldText>When you install
          the CPD Tracker App to your mobile device, we collect device ID/name
          and model. We use this information for device identification.
        </CustomParaText>
        <CustomParaText>
          <CustomBoldText>Log files: </CustomBoldText>When you install the CPD
          Tracker App to your mobile device, we collect device ID/name and
          model. We use this information for device identification.
        </CustomParaText>
        <CustomParaText>
          <CustomBoldText>Cookies: </CustomBoldText>We use cookies to keep you
          logged in and save your visit preferences.
        </CustomParaText>
        <CustomSubtitle>
          2. How long do we retain your information?
        </CustomSubtitle>
        <CustomFaintThinGreyLine />
        <CustomParaText>
          We will retain your non-CPD related information for as long as is
          reasonable to provide our service. Out-of-date information will be
          removed from our database. We will retain and use your information to
          the extent necessary to comply with our legal obligations (for
          example, if we are required to retain your data to comply with
          applicable laws), resolve disputes, and enforce our legal agreements
          and policies.
        </CustomParaText>
        <CustomParaText>
          We will also retain log files for internal analysis purposes. Log
          files are generally retained for a shorter period of time, except when
          this data is used to strengthen the security or to improve the
          functionality of our service, or we are legally obligated to retain
          this data for longer time periods.
        </CustomParaText>
        <CustomSubtitle>3. Where do we store your information?</CustomSubtitle>
        <CustomFaintThinGreyLine />
        <CustomParaText>
          We host our databases in MongoDB Atlas and our servers with Amazon Web
          Services.
        </CustomParaText>
        <CustomSubtitle>4. How do we protect your information?</CustomSubtitle>
        <CustomFaintThinGreyLine />
        <CustomParaText>
          We have implemented procedures to safeguard and secure the information
          we collect from loss, misuse, unauthorized access, disclosure,
          alteration, and destruction and to help maintain data accuracy and
          ensure that your personal data is used appropriately.
        </CustomParaText>
        <CustomParaText>
          We protect your data on-line. Data access is protected by an account
          authentication process. Only account holder who knows the account
          credential can access to your own data in your account. Other users
          cannot access your data unless you have opted in location sharing.
        </CustomParaText>
        <CustomParaText>
          We protect your data off-line. Your account and location data are
          stored in our secured databases. Only employee who needs the
          information to perform a specific job is granted access. The server in
          which we store our database is hosted with Amazon Web Service and
          MongoDB in a secure environment.
        </CustomParaText>
        <CustomSubtitle>
          5. Do we share your information to outside parties?
        </CustomSubtitle>
        <CustomFaintThinGreyLine />
        <CustomParaText>
          We do not share your personal data with third parties, other than as
          necessary to fulfill our services. We do not sell your personal data
          to any third parties. We may be required to disclose an individual’s
          personal data in response to a lawful request by public authorities,
          including to meet national security or law enforcement requirements.
          For example, we may share information to respond to a court order,
          subpoena, or request from a law enforcement agency.
        </CustomParaText>
        <CustomSubtitle>6. Contact Us</CustomSubtitle>
        <CustomFaintThinGreyLine />
        <CustomParaText>
          If you have questions or concerns regarding this Privacy Policy, you
          should first email us at support@sheriffconsulting.ca.
        </CustomParaText>
      </CustomScrollView>
    </CustomScreenContainer>
  );
};

export default Privacy;
