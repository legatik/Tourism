var crypto = require('crypto');

var server = Bones.Server.extend({

	options: {},
	initialize: function (app) {
		var self = this;
		this.post('/register', function (req, res) {
			var user = req.body;
			user.email = user.email.toLowerCase()
			user.id = Bones.utils.guid();
			user.registered_on = new Date()
			var md5 = crypto.createHash('md5')
			md5.update(user.password)
			user.password = md5.digest('base64')
			user = new models.User(user)
			user.save()
			res.redirect('/')
		});
	}

});

