/**
 * Database adapter
 */
var _ = require('underscore');

/**
 * This service shuld make async calls to the database
 * and execute callbacks.
 */

// TODO: file read
var sampleData = require('./data.json');

module.exports = function(){

	this.storage = sampleData; // Start off with a simple database

	this.get = function(key){
		if(key){
			return sampleData[key];
		}

		return sampleData;
	};

	this.insert = function(collection, data){
		if(collection, data){
			sampleData[collection] = data;

			// TODO: if Array, push, elsewhere, extend
		}

		return false;
	};
};
