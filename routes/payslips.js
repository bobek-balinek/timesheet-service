var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var db = require('../lib/storage');
var payslips = require('../lib/payslip');


/** GET /payslips **/
exports.index = function(req, res){
	var date = new moment().format('MM-YYYY');
	var dates = ['01-2014','02-2014', '03-2014','04-2014','05-2014','06-2014','07-2014','08-2014','09-2014','10-2014','11-2014','12-2014'];

	// If URL has a date parameter, then overwrite today's date
	if(req.query.date){
		date = req.query.date;
	}

	// Format the link with the date, if current one, indicate to the user by making the font bold
	var formatted = function(){
		return function(text, render) {
			if(render(text) === date){
	      return "<strong>" + render(text) + "</strong>";
			}

	    return render(text);
    }
	};

	// Get list of all employees and render the template
	db.get('employees', function(data){
		res.render('payslips', {
			formatted: formatted,
			employees: data,
			dates: dates,
			current_date: date
		});
	});
};


/** GET /payslips/view/:employee_id/:date **/
exports.view = function(req, res){
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
		  res.render('payslip', {user: payslip, date_from: date_from.format('DD-MM-YYYY'), date_to: date_to.format('DD-MM-YYYY'), full_date: pretty_date });
		});

	}else{
		res.redirect('/');
	}
};
