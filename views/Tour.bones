view = views.Main.extend({
	template: 'Tour',

	initialize: function (options) {
		_.bindAll(this, 'render');
		this.model = options.model



	},

	tagName: 'tr',

	events: {


	},






	render: function () {
		$(this.el).html(templates[this.template](this.model.toJSON()));
		return this;
	},

	attach: function () {




		return this;
	}



});

