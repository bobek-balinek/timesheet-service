var _ = require('underscore');
var sampleData = require('../lib/data.json');
var jobs = sampleData.employees[0].timesheets;

var findJob = function(number){
	return _.find(jobs, function(item, index){
		return item.job_number === number;
	});
};

var findJobIntex = function(number){
	var job_index;

	_.find(jobs, function(item, index){
		job_index = index;
	});

	return job_index;
};

var addJob = function(number, hours, description){
	var data = {
		"date": new Date(),
		"job_number": number,
		"description": description,
		"hours": parseInt(hours)
	};

	if(!findJob(number)){
		jobs.push(data);

		return true;
	}else{
		var index = findJobIntex(number);

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
  res.render('account', { title: 'Today\'s list', jobs: jobs });
};

exports.updateAccount = function(req, res){
	_.each(req.body.job_number, function(item, index){
		addJob( req.body.job_number[index], req.body.hours[index], req.body.description[index] );
	});

  res.render('account', { title: 'Today\'s list', jobs: jobs });
};

