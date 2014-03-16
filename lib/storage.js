/**
 * Storage
 *
 * In a real life scenario, this should write to a database driver such as MongoDB, MySQL or Postgres
 */
var fs = require('jsonfile');
var db_file = __dirname + '/data.json';

var get = function(collection_name, callback){
	var contents;

	return fs.readFile(db_file, function(err, obj){
		contents = obj;

		if(collection_name){
			contents = obj[collection_name];
		}

		return callback(contents);
	});
};

var insert = function(collection_name, data, callback){
	return get(null, function(db){
		db[collection_name].push(data); // Update data

		return fs.writeFile(db_file, db, 'utf-8', callback);
	});
};

module.exports = {
	get: get,
	insert: insert
};
