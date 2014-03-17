var _ = require('underscore');
var moment = require('moment');
var db = require('../lib/storage');

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

	if(data.job_number && data.assignee && data.date && data.hours){
		return db.insert('jobs', data, function(){
			callback(data);
		});
	}else{
		return callback(data);
	}
};

module.exports = {
	addJob: addJob,
	getJobs: getJobs,
	findJob: findJob
};
