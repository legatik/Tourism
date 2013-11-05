view = views.Main.extend({
	template: 'Result',

	initialize: function (options) {
		_.bindAll(this, 'render');
		var self=this
		if (Bones.url && Bones.url != 'undefined') {
			this.socket = io.connect(Bones.url);
		} else {
			this.socket = io.connect('http://localhost:3000');
		}
		this.socket.on('pegasAnswer', function(data) {
			console.log('PEGAS', data);
			var tour = new models.Tour(data.tour)
			t = new views.Tour({model: tour})
			$('table', self.el).append(t.render().attach().el)
		})
		this.socket.on('noFind', function(data) {
			console.log('noFind');
			$('table', self.el).append($('<div>По вашему запросу ничего не найдено.</div>'))
		})

	},

	tagName: 'div',

	events: {


	},






	render: function () {
		$(this.el).html(templates[this.template]);
		return this;
	},

	attach: function () {




		return this;
	}



});

