const recordsEmailsParams = (
  currentUser,
  totalRollingCPDHoursRequired,
  CPDAccomplishedThreeYears,
  currentYear,
  currentYearNeedVerHours
) => {
  return {
    Destination: {
      /* required */
      ToAddresses: [currentUser.email],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: `<h3>Hello ${currentUser.name}:</h3>
          <p>For testing purposes, your email address is ${
            currentUser.email
          }.</p>
          <p>You currently need <b>${
            totalRollingCPDHoursRequired - CPDAccomplishedThreeYears
          }</b> total CPD hours for the year ${currentYear} to fulfill all your CPD requirements for the province of ${
            currentUser.province
          }. Of which, <b>${
            currentYearNeedVerHours - currentUser.hours[0].verifiable
          }</b> hour(s) will need to be verifiable.</p>
          <p>If you do not wish to receive similar emails from us in the future, please reply to this email requesting to be removed from our email notification list. A human will manually remove your email address from this list.</p>
  
          <p>Thank you for using CPD Tracker by Sheriff Consulting.</p>
          <p><b>
          Leonard Shen, Application Developer<br>
          Sheriff Consulting</b><br>
          <br>
          </p>
  
          `,
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY - testing email on cert upload',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email',
      },
    },
    Source: 'developer@sheriffconsulting.com' /* required */,
    ReplyToAddresses: [
      'developer@sheriffconsulting.com',
      /* more items */
    ],
  };
};

module.exports = { recordsEmailsParams };
