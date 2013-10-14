view = views.Main.extend({
	template: 'Search_module',

	tagName: 'div',

	id: 'search-module',

	initialize: function (options) {
		_.bindAll(this, 'render');
		var self = this;
		this.model = options.model
		if (Bones.url && Bones.url != 'undefined') {
			this.socket = io.connect(Bones.url);
		} else {
			this.socket = io.connect('http://localhost:3000');
		}
		this.getInfo(function() {
			self.attachInfo()
		})
		this.category_checked=[]
		this.cities_checked=[]
		this.hotels_checked=[]
	},


	getInfo: function(cb) {
		var self = this
		this.depcity = new models.Depcities
		this.depcity.fetch({
			filter: {
				title: $('#select-start').val()
			},
			success: function() {
				if (self.depcity.length==0) {
					self.arrcities = null
					self.hotels = null
					return cb()
				}
				self.depcity = self.depcity.first()
				var cities = self.depcity.get('arr_cities')
				cities = _.filter(cities, function(el) {
					return el.country==$('.select-finish', self.el).val()
				})
				cities = cities[0].cities;
					self.arrcities = new models.Arrcities
					self.arrcities.fetch({
						filter: {
							title: {
								$in: cities
							}
						},
						success: function() {
							var mas_hotels = []
							self.arrcities.each(function(el) {
								_.each(el.get('hotels'), function(hotel) {
									mas_hotels.push(hotel)
								})
							})
							self.hotels = new models.Hotels
							self.hotels.fetch({
								filter: {
									title: {
										$in: mas_hotels
									}
								},
								success: function() {
									cb()
								}
							})
						}
					})
			}
		})
	},

	attachInfo: function() {
		var self = this;
		$('#list-resort-tow', self.el).empty()
		$('#list-hotel', self.el).empty()
		this.arrcities && this.arrcities.each(function(city) {
				var cit = new views.City({model: city, parrent: self})
			$('#list-resort-tow', self.el).append(cit.render().attach().el)
		})
		this.hotels && this.hotels.each(function(hotel) {
			var hot = new views.Hotel({model: hotel, parrent: self})
			$('#list-hotel', self.el).append(hot.render().attach().el)
		})

	},

	events: {
		'click #search-submit': 'startSearch',
		'change #select-start': 'changeCity',
		'click #list-category input': 'selectCategory',
		'change .select-finish': 'changeCity'
	},

	changeHotels: function() {
		var self = this;
		var hotels = self.hotels.filter(function(hotel) {
			if (self.category_checked.length==0&&self.cities_checked==0) {
				return true
			}
			else if (self.cities_checked==0){
				return self.category_checked.indexOf(hotel.get('category'))!=-1
			}
			else if (self.category_checked==0) {
				var flag = false;
				_.each(self.cities_checked, function(city) {
					if (city.get('hotels').indexOf(hotel.get('title'))!=-1) {
						flag = true
					}
				})
				return flag
			}
			else {
				var flag = false;
				_.each(self.cities_checked, function(city) {
					if (city.get('hotels').indexOf(hotel.get('title'))!=-1) {
						flag = true
					}
				})
				return self.category_checked.indexOf(hotel.get('category'))!=-1 && flag
			}
		})
		$('#list-hotel', self.el).empty()
		hotels.forEach(function(hotel) {
			var hot = new views.Hotel({model: hotel, parrent: self})
			$('#list-hotel', self.el).append(hot.render().attach().el)
		})
	},

	selectCategory: function(e) {
		var self=this
			var par = $(e.target).parent()
			var category = $('span', par).text()
		if (e.target.checked) {
			self.category_checked.push(category)
		}
		else {
			_.each(self.category_checked, function(cat, num) {
				if (cat==category) {
					self.category_checked.splice(num,1)
				}
			})
		}
		this.changeHotels()
	},

	changeCity: function() {
		var self = this;
		this.getInfo(function(error) {
			if (error=="error") return
			self.attachInfo()
		})
	},

	startSearch: function() {
		var self=this;
		$.ajax({
			data: {
				hotels: this.hotels_checked,
				cities: this.cities_checked
			},
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

