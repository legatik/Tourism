var crypto = require('crypto');
server = servers.PassportLocal.extend({
	verify: function (username, password, done) {
		var md5 = crypto.createHash('md5')
		md5.update(password)
		password = md5.digest('base64')
		username = username.toLowerCase()
		var users = new models.Users;
		users.fetch({
			filter: {
				email: username,
				password: password
			},
			success: function () {
				var user = users.first();
				if (user) {
					return done(null, user);
				}
				else {
					return done(null, false, {
						message: 'invalid user username'
					});
				}
			}
		})
	}
});

