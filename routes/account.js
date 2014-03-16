var _ = require('underscore');
var moment = require('moment');
var sampleData = require('../lib/data.json');
var db = require('../lib/storage');
var async = require('async');
var scookie = require('scookie');

/**
 * Fetch jobs from the database, if date given, filter by 'dd-mm-yyyy'
 */
var getJobs = function(employee, date, callback){
	return db.get('jobs', function(res){
		var results = res;

		if(date){
			results = _.filter(results, function(item, index){
				return item.date === date && item.assignee === employee;
			});
		}

		callback(results);
	});
};

/**
 * Find a job object by its job number
 */
var findJob = function(employee, number, date, callback){
	getJobs(employee, date, function(obj){
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
var addJob = function(assignee_id, data, callback){
	var data = {
		"date": data.date,
		"assignee": parseInt(assignee_id),
		"job_number": data.number,
		"description": data.description,
		"hours": parseFloat(data.hours)
	};

	return db.insert('jobs', data, function(){
		callback(data);
	});
};

/* GET Account page */
exports.index = function(req, res){
	var cookie = scookie.getCookie(req);
	var id = parseInt(cookie.employee_id);
	var today = moment().format("YYYY-MM-DD");

	if( req.query.date != undefined && moment(req.query.date, 'YYYY-MM-DD').isValid() ){
		today = req.query.date;
	}

	getJobs( id, today, function(results){
	  res.render('account', { jobs: results, date: today });
	});
};

/* POST to Account page */
exports.update = function(req, res){
	var cookie = scookie.getCookie(req);
	var id = parseInt(cookie.employee_id);

	/**
	 * If no date is passed, use today's date
	 */
	var today = moment().format("YYYY-MM-DD");
	if( req.body.date != undefined && moment(req.body.date, 'YYYY-MM-DD').isValid() ){
		today = req.body.date;
	}

	/** Get all parameters from the form into a single collection **/
	var jobs = [];
	_.each(req.body.job_number, function(item, index){
		jobs.push({
			number: req.body.job_number[index],
			date: today,
			hours: req.body.hours[index],
			description: req.body.description[index]
		});
	});

	/** Asynchronously write  to the database **/
	async.each(jobs, function(item, callback){
		addJob( id, item , callback);
	}, function(err){

		/** Once done, retrieve new data and render the view **/
		getJobs(id, today, function(results){
		  res.render('account', { jobs: results, date: today });
		});
	});
};
