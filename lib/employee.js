/**
 * Employees
 */

var _ = require('underscore');
var db = require('./db');
var database = new db();

/**
 * Add a new job to be completed
 * @param {string}  name             Name of the Client
 * @param {integer} number           Job number
 * @param {float}   hours            Estimated number of hours
 * @param {integer} employee_number  Assignee's employee number
 * @param {string}  description      Quick summary of the task
 */
var add = function(name, number, hours, employee_number, description){
  var dataObject = {
    "job_number": number,
    "client_name": name,
    "assignee": employee_number,
    "hours": hours,
    "description": description
  };

  if (validateJob(dataObject) === true) {
    return database.insert('jobs', dataObject);
  }else{
    return validateJob(dataObject);
  }

  return false;
};

/**
 * Validate input, this could be handles by an external service
 * @param  {Object} data   User's input
 * @return {Array}         Collection of user
 */
var validateJob = function(data){
  var messages = [];

  if(!data.client_name && (typeof data.client_name != 'string')){
    messages.push('Client\'s name needs to be entered');
  }

  if(messages.lengh){
    return messages;
  }

  return true;
};

/**
 * Return a whole list of employees in the database
 * @return {Array} list of employees
 */
var listAll = function(){
  return database.get('employees');
};

/**
 * Return a list of employees in a given department
 * @param  {string} Department name
 * @return {Array}  list of employees
 */
var listByDepartment = function(name){
  return _.filter(listAll(), function(item, index){
    return item.department === name;
  });
};

/**
 * Find an employee by employee number
 * @param  {integer} number  Employee's number
 * @return {Object}  Employee's entry
 */
var get = function(number){
  return _.find(listAll(), function(item, index){
    return item.number === number;
  });
};

/**
 * Find an employee by name
 * @param  {integer} name Employee's name
 * @return {Object}  Employee's entry
 */
var getByName = function(name){
  return _.find(listAll(), function(item, index){
    return item.name === name;
  });
};

/** Module exports **/
module.exports = {
  get: get,
  listAll: listAll,
  listByClient: listByClient,
  listByDepartment: listByDepartment
};
