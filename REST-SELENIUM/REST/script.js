var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('parse-link-header');


////// FILL IN THE BLANKS
//GMAIL
//var token = "token " + "d086b580407e4b07509ff319dafc77fb92556cec";
//var userId = "subodh-dharma";

//NCSU
var token = "token " + "fc4f7620327f1e8cb89b805a8af86703ff352cb8";	//full scope
var userId = "ssdharma";
//var token = "token " + "bdb602dafed9a39f60b192806c3a1f8dfd0004bd";	//repo-org scope


//var urlRoot = "https://api.github.com";
// NCSU Enterprise endpoint:
var urlRoot = "https://github.ncsu.edu/api/v3"

getYourRepos(userId);
//listBranches(userId,"hello-world");


function getYourRepos(userName)
{

	var options = {
		url: urlRoot + '/users/' + userName + "/repos",
		method: 'GET',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token,
			"private": "true"
		}
	};

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body)
	{
		var obj = JSON.parse(body);
//		console.log( obj );
		for( var i = 0; i < obj.length; i++ )
		{
			var name = obj[i].name;
			console.log( name );
			console.log( "\t"+obj[i].description);
			console.log("\tbranches");
			listBranches(userId,name);
		}
	});

}

function listBranches(owner,repo)
{
	var options = {
		url: urlRoot + "/repos/" + owner + "/" + repo + "/branches",
		method: 'GET',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token
		}
	};

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body)
	{
		var obj = JSON.parse(body);
		//console.log( obj );
		for( var i = 0; i < obj.length; i++ )
		{
			var name = obj[i].name;
			console.log( name );
		}
	});
}

