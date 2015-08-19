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
			var newDocs = documents.map(function(doc){
				var totalScore = 0
				for (var key in doc.rating) {
					totalScore += doc.rating[key]
				}
				console.log('total? ', totalScore)
				doc.totalScore = totalScore
				console.log('doc? ', doc)
				return doc 
			})
			// console.log(newDocs)
			res.render('treatment', {
				user       : req.user,
				treatments : newDocs
			});
		})
	},
	about: function(req, res) {
		res.render('about.jade')
	},

	contactinfo: function(req, res) {
		res.render('contactinfo.jade')
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
		})
		newTreatment.save(function(error) {
			if (error) {
				console.log(error)
			}
			res.redirect('/addtreatment')
		})
	},
	plusone: function(req, res) {
		Treatment.find({name : req.body.name}, function(error, documents){
			if (error) {
				console.log(error)
			}
			documents[0].rating[req.user.email] = 1
			documents[0].markModified('rating')
			documents[0].save(function(error){
				if (error) {
					console.log(error)
				}
				var totalScore = 0
				for (var key in documents[0].rating) {
					totalScore += documents[0].rating[key]
				}
				res.send({totalScore: totalScore})
			});

		});
	},
	minusone: function(req, res) {
		Treatment.find({name : req.body.name}, function(error, documents){
			if (error) {
				console.log(error)
			}
			documents[0].rating[req.user.email] = -1
			documents[0].markModified('rating')
			documents[0].save(function(error){
				if (error) {
					console.log(error)
				}
				var totalScore = 0
				for (var key in documents[0].rating) {
					totalScore += documents[0].rating[key]
				}
				res.send({totalScore: totalScore})
			});

		});
	}
};

module.exports = indexController;
