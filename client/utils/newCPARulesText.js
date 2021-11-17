import currentYear from './currentYear';

const newCPARules = (province) => {
  switch (province) {
    case 'Alberta':
    case 'Northwest Territories / Nunavut':
      return `First year CPA ${province} members are fully exempt from any CPD requirement. If you've obtained your CPA ${province} membership during calender year ${currentYear}, you are fully exempt from any CPD requirement. Your 3-Year Rolling CPD requirement would not begin until ${
        currentYear + 1
      }.`;
    case 'British Columbia':
    case 'Manitoba':
    case 'New Brunswick':
    case 'Saskatchewan':
    case 'Yukon':
      return `First year CPA ${province} members are required to fulfill their annual CPD obligations, regardless of which month they joined. There is no proration. If you've obtained your CPA ${province} membership during calender year ${currentYear}, you are required to obtain a minimum of 20 CPD hours, of which at least 10 hours need to be verifiable. However, courses and hours obtained throughout the year can be used to meet your CPD requirement. Your 3-Year Rolling CPD requirement starts in your first year of membership.`;
    case 'Nova Scotia':
      return `From 2021 and onwards, first year CPA ${province} members are no longer exempt from their annual CPD obligations in their first year of membership. If you've obtained your CPA ${province} membership during calender year ${currentYear}, you are required to obtain a minimum of 20 CPD hours, of which at least 10 hours need to be verifiable. However, courses and hours obtained throughout the year can be used to meet your CPD requirement. Your 3-Year Rolling CPD requirement starts in your first year of membership.`;
    case 'Ontario':
      return `Starting 2022, a first year CPA ${province} member's CPD obligation will be determined based on whether the member obtained their CPA ${province} membership on or before September 30th. If you've obtained your membership on or prior to September 30th, you are obligated to fulfill your annual CPD requirement of a minimum of 20 CPD hours, of which at least 10 hours need to be verifiable. Your 3-Year Rolling CPD requirement starts in your first year of membership.`;
    case 'Prince Edward Island':
      return `First year CPA ${province} members' CPD obligarions are prorated by the month of which they joined CPA. The month you joined counts towards the proration. For instance, if you've joined in July, 6 months will count towards your prorated CPD requirement (Jul, Aug, Sept, Oct, Nov, Dec). Your 3-Year Rolling CPD requirement starts in your first year of membership.`;
  }
};

export default newCPARules;
