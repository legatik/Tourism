view = views.Main.extend({

	template: 'Login',

	initialize: function (options) {
		_.bindAll(this, 'render');


	},


	attach: function() {



		return this;
	},


	render: function () {
		$(this.el).html(templates[this.template]);
		return this;
	}


});

