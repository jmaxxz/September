var jwt = require('jsonwebtoken');
function Session(token) {
  this.token = token;
  this.decodedToken = jwt.decode(token);
/*
  installId: '0',
  applicationId: '',
  userId: '1'
  vInstallId: false,
  vPassword: false,
  vEmail: false,
  vPhone: false,
  hasInstallId: true,
  hasPassword: true,
  hasEmail: true,
  hasPhone: true,
  isLockedOut: false,
  captcha: '',
  email: [ 'email:your@email.com' ],
  phone: [ 'phone:+1555123456' ],
  expiresAt: '2015-07-03T00:36:14.023Z',
  LastName: 'Doe',
  FirstName: 'Jane' }
*/
}


module.exports = Session;
