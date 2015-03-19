var unirest = require("unirest");

var getInitialToken = function() {
  unirest.post('https://api-production.august.com/session')
    .headers({ 'Content-Type': 'application/json', 'x-kease-api-key': '14445b6a2dba'})
    .send({
      "identifier":"phone:+15555555555",
      "installId":"0000",
      "password":""
    })
    .end(function (response) {
      if(response.status < 299){
        console.log(response.headers["x-august-access-token"]);
      } else {
        console.log('reset code failed to send');
      }
  });
}
getInitialToken();