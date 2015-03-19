var unirest = require('unirest');
var Promise = require('promise');
var Session = require('./session');


// Attempt to authenticate with August's webservers
// returns a promise to a session
exports.authenticate = function authenticate(username, password, installId) {
	installId = installId || "0";
	password = password || "";

	return new Promise(function (fulfill, reject) {
		unirest.post('https://api-production.august.com/session')
			.headers({ 'Content-Type': 'application/json', 'x-kease-api-key': '14445b6a2dba'})
			.send({
				"identifier": username,
				"installId": installId,
				"password": password
			}).end(function (response) {
				if(response.status < 299){
					fulfill(new Session(response.headers["x-august-access-token"]));
				} else {
					reject(response);
				}
		});
	});
};
