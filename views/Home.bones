view = views.Main.extend({

	template: 'Home',

	initialize: function (options) {
		_.bindAll(this, 'render');
		if (Bones.server) return
		Bones.home = this;
		var self = this;
		this.options = options;
		this.search = new models.Search


//		var city = new models.Arrcity(JSON)
//		id: Bones.utils.guid(),

//		city.set({
//			id: Bones.utils.guid(),
//			title: "Агиос Николаос",
//			operators: ["Пегас"],
//			hotels: ["IBEROSTAR MIRABELLO BEACH & VILLAGE 5*"],
//			hotels: ["CANDIA PARK VILLAGE 4*", "IBEROSTAR HERMES 4*", "IBEROSTAR MIRABELLO BEACH and VILLAGE 5*", "MINOS BEACH ART HOTEL 5*", "MIRAMARE ARIADNI VILLAGE 4*", "MIRAMARE HOTEL 4*", "MIRAMARE LUXURY SUITE and VILLAS 5*", "OLYMPUS APART HOTEL 4*", "SANTA MARINA HOTEL 3*", "SENSIMAR MINOS PALACE 5*"],
//			id_pegas: 486
//		})
//		city.save()

//		var hotel = new models.Hotel
//		hotel.set({
//			id: Bones.utils.guid(),
//			title: "IBEROSTAR MIRABELLO BEACH and VILLAGE 5*",
//			id_pegas: 1645
//		})
//		hotel.save()



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

