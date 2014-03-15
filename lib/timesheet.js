/**
 * Timesheets
 */

var _ = require('underscore');
var db = require('./db');
var employees = require('./employee');
var database = new db();

/**
 * Add a new timesheet to be completed
 * @param {string}  name             Name of the Client
 * @param {integer} number           Job number
 * @param {float}   hours            Estimated number of hours
 * @param {integer} employee_number  Assignee's employee number
 * @param {string}  description      Quick summary of the task
 */
var add = function(employee_number, date, job_number, hours, description){
  var dataObject = {
    "date": date,
    "job_number": number,
    "hours": hours,
    "description": description
  };

  var person = employees.get(employee_number);
  console.log(person);

  return false;
};

/**
 * Return a whole list of employees in the database
 * @return {Array} list of employees
 */
var listAll = function(){
  return database.get('employees');
};

/**
 * Return a list of timesheets for a given day
 * @param  {Date}       date
 * @return {Array}      list of timesheets
 */
var listByDate = function(date){
  return _.filter(listAll(), function(item, index){
    return item.date === date;
  });
};

/** Module exports **/
module.exports = {
  add: add,
  get: get,
  listAll: listAll,
  getByName: getByName,
  listByDepartment: listByDepartment
};
