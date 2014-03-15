/**
 * Employees
 */

var _ = require('underscore');
var db = require('./db');
var database = new db();

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
  getByName: getByName,
  listByDepartment: listByDepartment
};
