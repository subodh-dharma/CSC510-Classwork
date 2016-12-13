var request = require('request');
var fs = require("fs");
var Promise = require('bluebird');
var parse = require('parse-link-header');


////// FILL IN THE BLANKS

//NCSU
//var token = "token " + "fc4f7620327f1e8cb89b805a8af86703ff352cb8";	//full scope
var userId = "ssdharma";
var token = "token " + "bdb602dafed9a39f60b192806c3a1f8dfd0004bd";	//repo-org scope


//var urlRoot = "https://api.github.com";
// NCSU Enterprise endpoint:
var urlRoot = "https://github.ncsu.edu/api/v3"

//Gets the names of Repos and its Branches.
getYourRepos(userId);

var glo_repoName = "Scripted_Repo";
var glo_repoDesc = "Created Using Script";
//calling Create Repo
createRepo(userId, glo_repoName,glo_repoDesc);

//call for Issue Creation
var bugTitle = "This is bug title";
createIssue(userId, glo_repoName, bugTitle);

//call for Patch Creation
createPatch(userId, glo_repoName, glo_repoDesc);

function getYourRepos(userName)
{

	var options = {
		url: urlRoot + '/users/' + userName + '/repos',
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
			console.log("Repo Name: " + name );
			//console.log( "\t"+obj[i].description);
			//console.log("\tbranches");
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
			console.log("Branch Name: " + name );
		}
	});
}

function createRepo(owner,repoName,repoDesc)
{
	var options = {
		//url: urlRoot + '/' + owner + '/repos',
		url: urlRoot + '/user/repos',
		method: 'POST',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token
		},
		json: {
			"name": repoName,
			"description": repoDesc,
			"has_issues": true,
			"has_wiki": false,
			"private": false,
			"has_downloads": true,
			"auto_init": true
		}
	};

	request(options, function (error, response, body)
	{
		//var obj = JSON.parse(body);
		if(!error && response.statusCode == 201)
		{
			console.log("Repository Created succesfully");
		}else{
			//console.log("Repository Creation Failed with status:"+response.statusCode);
			console.log("Repository Creation failed : Either repository exists or something went wrong!");
		}
	})

}

//creating a general issues
function createIssue(owner, repoName, bugTitle)
{
	var options = {
			url: urlRoot + '/repos/' + owner + '/' + repoName + '/issues',
			method: 'POST',
			headers: {
				"User-Agent": "EnableIssues",
				"content-type": "application/json",
				"Authorization": token
			},
			json: {
				"title": bugTitle,
				"body": "This is just a general bug",
				"assignee": owner,
			}
		};

		request(options, function (error, response, body)
		{
			//var obj = JSON.parse(body);
			if(!error && response.statusCode == 201)
			{
				console.log("Issue succesfully created");
			}else{
				console.log("Issue creation failed: "+response.statusCode);

			}
		})
}


//Patching to enable wiki pages
function createPatch(owner, repoName, repoDesc)
	{
		var options = {
				url: urlRoot + '/repos/' + owner + '/' + repoName,
				method: 'PATCH',
				headers: {
					"User-Agent": "EnableIssues",
					"content-type": "application/json",
					"Authorization": token
				},
				json: {
					"name": repoName,
					"description": repoDesc + "Update 1",
					"has_wiki": true,
					"default_branch": "master"
				}
			};

			request(options, function (error, response, body)
			{
				//var obj = JSON.parse(body);
				if(!error && response.statusCode == 200)
				{
					console.log("Patch succesfully posted!");
				}else{
					console.log("Patch Failed, Status Code: "+response.statusCode);

				}
			})

	}
