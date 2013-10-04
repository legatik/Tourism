view = views.Main.extend({

	template: 'Register',

	initialize: function (options) {
		_.bindAll(this, 'render');
		var self = this;


	},


	checkUser: function(email, cb) {
		var self = this;
		$.ajax({
			type: 'POST',
			url: "/checkUser",
			data: {
				email: email
			},
			success: function(data) {
				if (!data.err) {
					return cb(true)
				}
				else {
					$('.alert-danger', self.el).removeClass('hide')
					return cb(false)

				}
			}
		})
	},

	events: {
		'click #registration-submit': 'submit'
	},

	submit: function() {
		var self = this;
		$('.alert-danger').addClass('hide')
		var email = $('#inputEmail').val()
		if (!email) {
			return true
		}
		this.checkUser(email, function(result) {
			if (result) {
				$('#registration-form', self.el).submit()
			}
		})
		return false
	},

	attach: function() {
		return this;
	},

	render: function () {
		$(this.el).html(templates[this.template]);
		return this;
	}

});

