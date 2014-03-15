var jobs = require('../lib/jobs');
/* GET users listing. */
exports.list = function(req, res){
	var collection = jobs.listAll();
  res.send(collection);
};

exports.find = function(req, res){
	var collection = jobs.get(parseInt(req.params.id));
  res.send(collection);
}
