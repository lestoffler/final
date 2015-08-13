var mongoose = require('mongoose');

var treatmentSchema = mongoose.Schema ({

	email        : {type : String},
	category     : {type : String},
	type         : {type : String},
	name         : {type : String},
	materials    : {type : String},
	description  : {type : String},
	rating       : {type : Object}

});

var Treatment = mongoose.model('Treatment', treatmentSchema);

module.exports = Treatment;