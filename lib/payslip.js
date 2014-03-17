/**
 * Payslip module
 */

var _ = require('underscore');
var moment = require('moment');
var db = require('../lib/storage');

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

			payslip.total_hours = roundedToFixed(calculateTotalHours(jobs), 2);
			payslip.gross_total = roundedToFixed(calculateGrossTotal(payslip.total_hours, user.hourly_rate), 2);
			payslip.net_total = roundedToFixed(calculateNetTotal(payslip.gross_total, user.tax_rate), 2);
			payslip.tax_total = roundedToFixed(calculateTax(payslip.gross_total, user.tax_rate), 2);

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

function roundedToFixed(_float, _digits){
  var rounder = Math.pow(10, _digits);
  return (Math.round(_float * rounder) / rounder).toFixed(_digits);
}

module.exports = {
	generate: generate,
	calculateTotalHours: calculateTotalHours,
	calculateGrossTotal: calculateGrossTotal,
	calculateNetTotal: calculateNetTotal,
	calculateTax: calculateTax,
};
