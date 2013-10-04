view = views.Main.extend({
	template: 'Content',

	initialize: function (options) {
		_.bindAll(this, 'render');
		this.search = options.search
	},

	events: {

	},


	render: function () {
		$(this.el).html(templates[this.template]);
		return this;
	},

	attach: function () {
		//Search_module
		this.search_module = new views.Search_module({model: this.search})
		$(this.el).append(this.search_module.render().attach().el)

		return this;
	}
});

