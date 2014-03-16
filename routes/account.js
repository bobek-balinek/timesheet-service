var _ = require('underscore');
var moment = require('moment');
var sampleData = require('../lib/data.json');
var db = require('../lib/storage');
var async = require('async');
var scookie = require('scookie');

/**
 * Fetch jobs from the database, if date given, filter by 'dd-mm-yyyy'
 */
var getJobs = function(date, callback){
	return db.get('jobs', function(res){
		var results = res;

		if(date){
			results = _.filter(results, function(item, index){
				return item.date === date;
			});
		}

		callback(results);
	});
};

/**
 * Find a job object by its job number
 */
var findJob = function(number, date, callback){
	getJobs(date, function(obj){
		var results = _.find(obj, function(item, index){
			return (item.job_number === number) && (item.date == date);
		});

		callback(results);
	})
};

/**
 * Find an index in jobs array by given job number
 */
var findJobIntex = function(number, date){
	var job_index;

	_.find(jobs, function(item, index){

		if(item.job_number === number && item.date == date){
			job_index = index;
			return item;
		}

		return false;
	});

	return job_index;
};

/**
 * Add a new job entry to an array of today's timesheet
 */
var addJob = function(number, date, hours, description, callback){
	var data = {
		"date": date,
		"assignee": 1,
		"job_number": number,
		"description": description,
		"hours": parseFloat(hours)
	};

	return db.insert('jobs', data, function(){
		callback(data);
	});
};

/* GET Account page */
exports.index = function(req, res){
	var cookie = scookie.getCookie(req);
	console.log(cookie);
	var today = moment().format("YYYY-MM-DD");

	if( req.query.date != undefined && moment(req.query.date, 'YYYY-MM-DD').isValid() ){
		today = req.query.date;
	}

	getJobs(today, function(results){
	  res.render('account', { jobs: results, date: today });
	});
};

/* POST to Account page */
exports.update = function(req, res){
	var cookie = scookie.getCookie(req);
	console.log(cookie);
	var today = moment().format("YYYY-MM-DD");

	if( req.body.date != undefined && moment(req.body.date, 'YYYY-MM-DD').isValid() ){
		today = req.body.date;
	}

	var jobs = [];

	_.each(req.body.job_number, function(item, index){
		jobs.push({
			job_number: req.body.job_number[index],
			date: today,
			hours: req.body.hours[index],
			description: req.body.description[index]
		});
	});

	async.each(jobs, function(item, callback){
		addJob( item.job_number, item.date, item.hours, item.description , callback);
	}, function(err){

		getJobs(today, function(results){
		  res.render('account', { jobs: results, date: today });
		});
	});
};
