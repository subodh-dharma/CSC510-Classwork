var Promise = require("bluebird");
var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");
var _ = require("underscore");
var github = require("./github.js");


// Which person is assigned to most to issues?
function findMostFrequentAssignee(user,repo)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getIssues(user,repo).then(function (issues) 
		{
			var names = _.pluck(issues,"assignee")
			var frequency = _.countBy(names, function (name) { return name; });
			var max = _.max(_.keys(frequency), function(item){ return frequency[item] })
			resolve({userName: max, count: frequency[max]});
		});
	});
}

// How many closed issues?
function countClosed(user,repo)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getIssues(user,repo).then(function (issues) 
		{
			var states = _.pluck(issues,"state")
			var close_count = 0;
			console.log(states);
			for(state_val in states){
				if(states[state_val]=="closed") 
				{	
					close_count++;
				}
			}
			resolve(close_count);
		});
	});
}

// How many words in an issue's title version an issue's body?
function titleBodyWordCountRatio(user,repo,number)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getAnIssue(user,repo,number).then(function (issue) 
		{
			var titleWords = issue.title.split(/\W+|\d+/).length;
			var bodyWords  = issue.body.split(/\W+|\d+/).length;
//			console.log( titleWords, bodyWords, issue.body);			

			if( bodyWords == 1 )
			{
				resolve("NA");
				// HINT: http://stackoverflow.com/questions/4964484/why-does-split-on-an-empty-string-return-a-non-empty-array
			}
//			console.log( titleWords, bodyWords, issue.body);			
			var str = ( titleWords / bodyWords ) + "";
			resolve(str);
		});
	});
}

function maxStars(user, repos)
{
	return new Promise(function (resolve, reject)
	{
		//mock data needs list of repos
		var max_count = 0;
		github.getRepos(user).then(function (repos){
			var r = repos[0];			
			
			for(var i = 0; i < r.length; i ++){
			//	console.log(r[i]);
				if(max_count < r[i].stargazers_count)
				{
					max_count = r[i].stargazers_count;
				}
			}
			//console.log("Max: " + max_count);
			resolve(max_count+"");
		});
	});

}

exports.findMostFrequentAssignee = findMostFrequentAssignee;
exports.countClosed = countClosed;
exports.titleBodyWordCountRatio = titleBodyWordCountRatio;
exports.maxStars = maxStars;
