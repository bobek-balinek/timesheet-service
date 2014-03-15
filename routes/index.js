var _ = require('underscore');
var moment = require('moment');
var sampleData = require('../lib/data.json');

jobs = sampleData.employees[0].timesheets;

/**
 * Fetch jobs from the database, if date given, filter by 'dd-mm-yyyy'
 */
var getJobs = function(date){
	console.log(jobs);

	if(date){
		return _.filter(jobs, function(item, index){
			return item.date === date;
		});
	}

	return jobs;
};

/**
 * Find a job object by its job number
 */
var findJob = function(number, date){
	return _.find(jobs, function(item, index){
		return (item.job_number === number) && (item.date == date);
	});
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
var addJob = function(number, date, hours, description){
	var data = {
		"date": date,
		"job_number": number,
		"description": description,
		"hours": parseFloat(hours)
	};

	console.log(findJob(number, date));

	if(!findJob(number, date)){
		jobs.push(data);

		return true;
	}else{
		var index = findJobIntex(number);

		jobs[index].date = date;
		jobs[index].job_number = number;
		jobs[index].hours = hours;
		jobs[index].description = description;

		return true;
	}

	return false;
};

/* GET home page. */
exports.index = function(req, res){
  res.render('index', { title: 'Timesheets' });
};

exports.account = function(req, res){
	var today = moment().format("DD-MM-YYYY");

	if( moment(req.query.date).isValid() ){
		today = req.query.date;
	}

  res.render('account', { title: 'Today\'s list', jobs: getJobs(today), date: today });
};

exports.updateAccount = function(req, res){
	var today = moment().format("DD-MM-YYYY");
	console.log(req.body);

	if(req.body.date){
		today = req.body.date;
	}

	_.each(req.body.job_number, function(item, index){
		addJob( req.body.job_number[index], today, req.body.hours[index], req.body.description[index] );
	});

  res.render('account', { title: 'Today\'s list', jobs: getJobs(today), date: today });
};

