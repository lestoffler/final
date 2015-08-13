var Treatment = require('../models/treatment.js');
var User = require('../models/user.js')

var indexController = {
	index: function(req, res) {
		res.render('signup');
	},
	signup: function(req, res) {
		var someDude = new User({
			username : req.body.username,
			email    : req.body.email,
			password : req.body.password
		})
		someDude.save(function(error, user) {
			if (error) {
				console.log('Error', error)
			}
			console.log('going to login')
			// res.redirect('/')
			req.login(user, function(error) {
			console.log(req)
				if (error) {
					console.log('Error', error)
				}
				return res.redirect('/home')
			})
		})
	
	},
	home: function(req, res) {
		var queryObj = {}
		if (!req.query.type && !req.query.category) {
			queryObj.email = req.user.email
		}
		else {
			if (req.query.type) {
				queryObj.type = req.query.type
			}
			if (req.query.category) {
				queryObj.category = req.query.category
			}
		}
		console.log(req.query)
		Treatment.find(queryObj, function(error, documents){
			if (error) {
				console.log(error)
			}
			res.render('treatment', {
				user       : req.user,
				treatments : documents
			});
		})
	},

	addtreatment: function(req, res) {
		res.render('addtreatments.jade')
	},

	posttreatment: function(req, res) {
		var newTreatment = new Treatment({
			email        : 	req.user.email,		
			category     :  req.body.category,
			type         :  req.body.type,
			name         :  req.body.name,
			materials    :  req.body.materials,
			description  :  req.body.description,
			rating       :  []
		})
		newTreatment.save(function(error) {
			if (error) {
				console.log(error)
			}
			res.redirect('/addtreatment')
		})
	}
};

module.exports = indexController;
