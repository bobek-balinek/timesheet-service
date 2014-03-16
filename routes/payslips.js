/**
 * - Filter jobs by employee number
 * - Count up all hours together
 * - Take extra information about employee (national insurance number)
 * - Give back object with all the date to be rendered/printed
 */
var _ = require('underscore');
var moment = require('moment');
var sampleData = require('../lib/data.json');
var db = require('../lib/storage');
var async = require('async');

/**
 * Object returned can be passed to the browser (viewed online)
 * or passed to a PDF generator ()
 */
var generate = function(employee_id, date_from, date_to, callback){
	return getUserData(employee_id, function(user){
		var payslip = {
			total_hours: 0.0,
			gross_total: 0.0,
			net_total: 0.0,
			tax_total: 0.0
		};

		getUserJobs(employee_id, date_from, date_to, function(jobs){

			payslip.total_hours = calculateTotalHours(jobs);
			payslip.gross_total = calculateGrossTotal(payslip.total_hours, user.hourly_rate);
			payslip.net_total = calculateNetTotal(payslip.gross_total, user.tax_rate);
			payslip.tax_total = calculateTax(payslip.gross_total, user.tax_rate);

			_.extend(payslip, user);

			return callback(payslip);
		});
	});
};

var getUserJobs = function(employee_id, date_from, date_to, callback){
	return db.get('jobs', function(obj){
		var results = _.filter(obj, function(item, index){
			return (item.assignee === employee_id) && moment(item.date, 'YYYY-MM-DD').isAfter(date_from) && moment(item.date, 'YYYY-MM-DD').isBefore(date_to);
		});

		return callback(results);
	});
};

/**
 * - Where would the data come from?
 * - What fields would the payslip contain??
 * - How does tax calculation work?
 *
 * Sample: full_name, address, postcode, tax code, tax rate, department,
 */
var getUserData = function(employee_id, callback){
	return db.get('employees', function(obj){
		var results = _.find(obj, function(item, index){
			return item.number === employee_id;
		});

		return callback(results);
	});
};

var calculateTotalHours = function(collection){
	var total = 0.0;

	_.each(collection, function(item, index){
		total += parseFloat(item.hours);
	});

	return total;
};

var calculateGrossTotal = function(hours, rate){
	return hours * rate;
};

var calculateNetTotal = function(grossTotal, tax_rate){
	var taxed = calculateTax(grossTotal, tax_rate);

	return grossTotal - taxed;
};

var calculateTax = function(sum, tax_rate){
	return sum * tax_rate;
};

exports.index = function(req, res){
	var employee_id, date_from, date_to;

	if( req.params.employee_id && req.params.date ){

		date_from = new moment(req.params.date, 'MM-YYYY').startOf('month');
		date_to = new moment(req.params.date, 'MM-YYYY').endOf('month');
		employee_id = parseInt(req.params.employee_id);

		generate(employee_id, date_from.format('YYYY-MM-DD'), date_to.format("YYYY-MM-DD") , function(payslip){
		  // res.send(payslip);
		  res.render('payslips', {user: payslip, string: JSON.stringify(payslip)});
		});

	}else{
		res.redirect('/');
	}
};
