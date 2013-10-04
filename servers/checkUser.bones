var crypto = require('crypto');

var server = Bones.Server.extend({

	options: {},
	initialize: function (app) {
		var self = this;
		this.post('/checkUser', function (req, res) {
			var email = req.body.email;
			var users = new models.Users
			users.fetch({
				filter: {
					email: email
				},
				success: function() {
					user = users.first()
					if (user) {
						res.send({err:'exist user'})
					}
					else {
						res.send({err:null})
					}

				},


			})

		});
	}

});

