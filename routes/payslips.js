var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var db = require('../lib/storage');
var payslips = require('../lib/payslip');


/** GET /payslips/view/:employee_id/:date **/
exports.index = function(req, res){
	var employee_id, date_from, date_to, pretty_date;

	/** If date and employee's number is passed retrieve relevant data **/
	if( req.params.employee_id && req.params.date ){

		/** Assume the employee gets paid at the first day of each month **/
		date_from = new moment(req.params.date, 'MM-YYYY').startOf('month');
		date_to = new moment(req.params.date, 'MM-YYYY').endOf('month');
		employee_id = parseInt(req.params.employee_id);

		pretty_date = new moment(req.params.date, 'MM-YYYY').format('MMMM YYYY');

		/** Generate a payslip data object, calculate gross, net total and tax values **/
		payslips.generate(employee_id, date_from.format('YYYY-MM-DD'), date_to.format("YYYY-MM-DD") , function(payslip){
			/** render relevant view **/
		  res.render('payslips', {user: payslip, date_from: date_from.format('DD-MM-YYYY'), date_to: date_to.format('DD-MM-YYYY'), full_date: pretty_date });
		});

	}else{
		res.redirect('/');
	}
};
