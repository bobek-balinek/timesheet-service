var cookie = require('scookie');

/**
 * Setup Scookie
 */
cookie.init({
    name: 'user_data',
    secret: '7436ac45bb896069d3d5d5234ab28a1c570b78a2',
    age: 3600000,
    unauthorisedUrl: '/'
});


/* GET home page. */
exports.index = function(req, res){
  res.render('index', {});
};

/* POST to home page */
exports.login = function(req, res){
	var id = parseInt(req.body.employee_number);
	console.log(req.body);

	if (id) {
		cookie.login({ employee_id: id }, res);
		res.redirect('/account');
	}else{
		res.redirect('/');
	}
};
