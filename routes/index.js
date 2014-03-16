var _ = require('underscore');
var moment = require('moment');
var sampleData = require('../lib/data.json');
var db = require('../lib/storage');
var async = require('async');

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

	// if(!findJob(number, date)){
	return db.insert('jobs', data, function(){
		callback(data);
	});

	// }else{
	// 	var index = findJobIntex(number, date);

	// 	jobs[index].date = date;
	// 	jobs[index].job_number = number;
	// 	jobs[index].hours = hours;
	// 	jobs[index].description = description;

	// 	return true;
	// }
	// return false;
};

/* GET home page. */
exports.index = function(req, res){
  res.render('index', {});
};

exports.account = function(req, res){
	var today = moment().format("YYYY-MM-DD");

	if( req.query.date != undefined && moment(req.query.date, 'YYYY-MM-DD').isValid() ){
		today = req.query.date;
	}

	getJobs(today, function(results){
	  res.render('account', { jobs: results, date: today });
	});
};

exports.updateAccount = function(req, res){
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
