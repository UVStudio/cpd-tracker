const provinceObjs = {
  alberta: {
    name: 'Alberta',
    url: 'https://www.cpaalberta.ca/Members/CPD-Reporting',
  },
  britishColumbia: {
    name: 'British Columbia',
    url: 'https://www.bccpa.ca/member-practice-regulation/continuing-professional-development-cpd/cpd-requirements/',
  },
  manitoba: {
    name: 'Manitoba',
    url: 'https://cpamb.ca/regulatory/cpd',
  },
  newBrunswick: {
    name: 'New Brunswick',
    url: 'https://www.cpanewbrunswick.ca/en/continuing-professional-development/continuing-professional-development-policy',
  },
  newfoundlandLabrador: {
    name: 'Newfoundland & Labrador',
    url: 'https://www.cpanl.ca/en/professional-development/cpd-policy-and-requirements',
  },
  nwtNu: {
    name: 'Northwest Territories / Nunavut',
    url: 'https://www.cpa-nwt-nu.ca/en/professional-development/cpd-policy-and-requirements',
  },
  novaScotia: {
    name: 'Nova Scotia',
    url: 'https://www.cpans.ca/web/CPANS/Continuing_Professional_Development/Requirements.aspx',
  },
  ontario: {
    name: 'Ontario',
    url: 'https://www.cpaontario.ca/members/regulations-guidance/continuing-professional-development',
  },
  pei: {
    name: 'Prince Edward Island',
    url: 'https://www.cpapei.ca/en/professional-development/cpd-policy-and-requirements',
  },
  quebec: {
    name: 'Quebec',
    url: 'https://cpaquebec.ca/en/cpa-members/requirements/compulsory-continuing-education/requirements/',
  },
  saskatchewan: {
    name: 'Saskatchewan',
    url: 'https://cpask.ca/member/fees-cpd',
  },
  yukon: {
    name: 'Yukon',
    url: 'https://www.bccpa.ca/getmedia/b1acdd6b-c753-4083-997e-e569262d2aed/cpa-yukon-bylaw-regulations.pdf',
  },
};

const provinces = () => {
  const provincesArr = [];
  for (const key in provinceObjs) {
    provincesArr.push(provinceObjs[key].name);
  }
  return provincesArr;
};

module.exports = { provinceObjs, provinces };
