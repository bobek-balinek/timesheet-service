/**
 * Client jobs
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
 * Return a whole list of jobs in the database
 * @return {Array} list of jobs
 */
var listAll = function(){
  return database.get('jobs');
};

/**
 * Return a list of jobs filtered by a client name
 * @param  {string} name Client's name
 * @return {Array} list of jobs
 */
var listByClient = function(name){
  return _.filter(listAll(), function(item, index){
    return item.cient_name === name;
  });
};

/**
 * Return a list of jobs filtered by a employee's number
 * @param  {integer} Employee's number
 * @return {Array}  list of jobs
 */
var listByAssignee = function(number){
  return _.filter(listAll(), function(item, index){
    return item.assignee === number;
  });
};

/**
 * Find a particular job entry by it's job number
 * @param  {integer} name Client's name
 * @return {Object}  Job entry
 */
var get = function(number){
  return _.find(listAll(), function(item, index){
    return item.job_number === number;
  });
};

/** Module exports **/
module.exports = {
  get: get,
  listAll: listAll,
  listByClient: listByClient,
  listByAssignee: listByAssignee
};
