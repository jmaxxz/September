var unirest = require('unirest');
var Promise = require('promise');
var Session = require('./session');

exports.sendTokenToPhone = function sendTokenToPhone(session, phoneNumber) {
	return new Promise(function (fulfill, reject) {
		unirest.post('https://api-production.august.com/validation/phone')
			.headers({ 'Content-Type': 'application/json', 'x-kease-api-key': '14445b6a2dba', 'x-august-access-token': session.token})
			.send({"value":"+"+phoneNumber})
			.end(function (response) {
				if(response.status < 299){
					fulfill(session);
				} else {
					reject(response);
				}
		});
	});
}

exports.sendTokenToEmail = function sendTokenToEmail(session, email) {
	return new Promise(function (fulfill, reject) {
		unirest.post('https://api-production.august.com/validation/email')
			.headers({ 'Content-Type': 'application/json', 'x-kease-api-key': '14445b6a2dba', 'x-august-access-token': session.token})
			.send({"value": email})
			.end(function (response) {
				if(response.status < 299){
					fulfill(session);
				} else {
					reject(response);
				}
		});
	});
}

exports.validatePhone = function validatePhone(session, code, phoneNumber) {
	return new Promise(function (fulfill, reject) {
		unirest.post('https://api-production.august.com/validate/phone')
			.headers({ 'Content-Type': 'application/json', 'x-kease-api-key': '14445b6a2dba', 'x-august-access-token': session.token})
			.send({
				"code": code,
				"value":"+" + phoneNumber
			})
			.end(function (response) {
				if(response.status < 299){
					fulfill(new Session(response.headers["x-august-access-token"]));
				} else {
					reject(response);
				}
		});
	});
}

exports.validateEmail = function validatePhone(session, code, email) {
	return new Promise(function (fulfill, reject) {
		unirest.post('https://api-production.august.com/validate/email')
			.headers({ 'Content-Type': 'application/json', 'x-kease-api-key': '14445b6a2dba', 'x-august-access-token': session.token})
			.send({
				"code": code,
				"value": email
			})
			.end(function (response) {
				if(response.status < 299){
					fulfill(new Session(response.headers["x-august-access-token"]));
				} else {
					reject(response);
				}
		});
	});
}

exports.changePassword = function changePassword(session, newPassword) {
	return new Promise(function (fulfill, reject) {
		unirest.put('https://api-production.august.com/users')
			.headers({ 'Content-Type': 'application/json', 'x-kease-api-key': '14445b6a2dba', 'x-august-access-token': session.token})
			.send({
				"password": newPassword,
			})
			.end(function (response) {
				if(response.status < 299){
					fulfill(new Session(response.headers["x-august-access-token"]));
				} else {
					reject(response);
				}
		});
	});
};
