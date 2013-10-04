view = views.Main.extend({
	template: 'Search_module',

	tagName: 'div',

	id: 'search-module',

	initialize: function (options) {
		_.bindAll(this, 'render');
		this.model = options.model
		if (Bones.url && Bones.url != 'undefined') {
			this.socket = io.connect(Bones.url);
		} else {
			this.socket = io.connect('http://localhost:3000');
		}
		this.socket.on('test', function() {

			console.log('URAAAAAAa');

		})


	},

	events: {
		'click #search-submit': 'startSearch'

	},

	startSearch: function() {
		var self=this;
		console.log('startSearch');

		$.ajax({
			url: '/pegas',
			type: 'GET',
			success: function() {

			}
		})

	},


	render: function () {
		$(this.el).html(templates[this.template]);
		return this;
	},

	attach: function () {
		//Search_module
		return this;
	}
});

