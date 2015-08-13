var Treatment = require('../models/treatment.js');
var User = require('../models/user.js')

var apiController = {
	API: function(req, res) {
		res.render('API');
	},
	treatment: function(req, res) {
		Treatment.find({category : req.query.category}, function(err, results) {
			if (err) {
				console.log(err);
			}
			else {
				res.render('treatments', {treatments : treatments});
			}	
		})
	}

};

module.exports = apiController;