var _ = require('underscore');
var moment = require('moment');
var async = require('async');
var scookie = require('scookie');
var timesheets = require('../lib/timesheet');

/* GET Account page */
exports.index = function(req, res){
	var cookie = scookie.getCookie(req);
	var id = parseInt(cookie.employee_id);
	var today = moment().format("YYYY-MM-DD");

	if( req.query.date != undefined && moment(req.query.date, 'YYYY-MM-DD').isValid() ){
		today = req.query.date;
	}

	var next_date = new moment(today).add('days', 1).format("YYYY-MM-DD");
	var previous_date = new moment(today).subtract('days', 1).format("YYYY-MM-DD");

	timesheets.getJobs( id, today, function(results){
	  res.render('account', {
	  	jobs: results,
	  	date: today,
	  	previous_date: previous_date,
	  	next_date: next_date
	  });
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
	var next_date = new moment(today).add('days', 1).format("YYYY-MM-DD");
	var previous_date = new moment(today).subtract('days', 1).format("YYYY-MM-DD");


	/** Get all parameters from the form into a single collection **/
	var jobs = [];
	_.each(req.body.job_number, function(item, index){
		jobs.push({
			number: req.body.job_number[index],
			date: today,
			hours: parseFloat(req.body.hours[index]),
			description: req.body.description[index]
		});
	});

	/** Asynchronously write  to the database **/
	async.each(jobs, function(item, callback){
		timesheets.addJob( id, item , callback);
	}, function(){

		/** Once done, retrieve new data and render the view **/
		timesheets.getJobs(id, today, function(results){
		  res.render('account', {
		  	jobs: results,
		  	date: today,
		  	previous_date: previous_date,
		  	next_date: next_date
		  });
		});
	});
};
