view = views.Main.extend({

	template: 'Home',

	initialize: function (options) {
		_.bindAll(this, 'render');
		if (Bones.server) return
		Bones.home = this;
		var self = this;
		this.options = options;
		this.search = new models.Search

	},

	events: {

	},

	attach: function () {
		//header
//		this.header = new views.Header({
//			el: $('#header', this.el)
//		});
//		this.header.render().attach();

		//content
		this.content = new views.Content({
			el: $('#content', this.el),
			search: this.search
		});
		this.content.render().attach()

		return this;
	},


	render: function () {
		$(this.el).html(templates[this.template]);
		return this;
	}


});

