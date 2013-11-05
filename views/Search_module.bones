view = views.Main.extend({
	template: 'Search_module',

	tagName: 'div',

	id: 'search-module',

	initialize: function (options) {
		_.bindAll(this, 'render','startFachingPegast','startSearch');
		var self = this;
		this.model = options.model

		this.getInfo(function() {
			self.attachInfo()
		})
		this.category_checked=[]
		this.cities_checked=[]
		this.hotels_checked=[]
		this.food = []




	},


	events: {
		'click #search-submit': 'startSearch',
		'change #select-start': 'changeCity',
		'click #list-category input': 'selectCategory',
		'change .select-finish': 'changeCity',
		'click #list-food input': 'selectfood'

	},

	selectfood: function(e) {
		console.log('selectfood');

		var self=this
			var par = $(e.target).parent()
			var food = $('span', par).text()
			console.log('food',$(e.target));

		if (e.target.checked) {
			self.food.push(food)
		}
		else {
			_.each(self.food, function(cat, num) {
				if (cat==food) {
					self.food.splice(num,1)
				}
			})
		}
		console.log('this.food',this.food);







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
				console.log('self.depcity',self.depcity, self.depcity.get('arr_cities'))
				var cities = self.depcity.get('arr_cities')
				console.log('cities111',cities)
				cities = _.filter(cities, function(el) {
					return el.country==$('.select-finish', self.el).val()
				})

				console.log('cities222',cities);
				self.country = cities[0]
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

		var search = this.model.toJSON()

		search.date_start=moment($('#input-date-start').val(), 'D-MM-YYYY')
		search.date_finish=moment($('#input-date-finish').val(), 'D-MM-YYYY')
		search.start = this.depcity.toJSON()
		search.finish = this.country
		search.night_max = $('#night-max').val()*1
		search.night_min = $('#night-min').val()*1
		search.hotel = _.map(this.hotels_checked, function(hotel) {return hotel.toJSON()})
		search.resort_town = _.map(this.cities_checked, function(city) {return city.toJSON()})
		search.food = this.food
		search.number_adult = $('.select-adult').val()*1
		search.number_child = $('.select-child').val()*1
		search.format_price = $('.select-price').val()
		search.min_price = $('#input-min-price').val()
		search.max_price = $('#input-max-price').val()
		search.category = this.category_checked
		this.startFachingPegast(search)
		return

		var self=this;
	},

	startFachingPegast:function(model){
		var searchModel = {
			samo_action:"PRICES",
			TOWNFROMINC:model.start.id_pegas,
			STATEINC: model.finish.pegas_id ,
			TOURINC:0, //выбор тура
			PROGRAMINC:0, //выбор программы
			CHECKIN_BEG: moment(model.date_start).format('YYYYMMDD'),
			NIGHTS_FROM:model.night_min,
			CHECKIN_END:moment(model.date_finish).format('YYYYMMDD') ,
			NIGHTS_TILL:model.night_max,
			ADULT:model.number_adult,
			PRICE_MIN:model.min_price,
			CHILD:model.number_child,
			PRICE_MAX:model.max_price,
			hotelsearch:0, //поиск по названию
			FREIGHT:1,//не нашел где мненять
			FILTER:1, //не нашел где мненять
			HOTELTYPES:"",// тип : молодежный ,рекомендуемый.Думаю это не использовать вообще.
			PACKET:0, // не нашел где менять
			_:new Date() *1
		}
		switch (model.format_price) {
			 case "RUB":
					searchModel["CURRENCY"]  = 1
					break
			 case "USD":
					searchModel["CURRENCY"]  = 2
					break
			 default:
					searchModel["CURRENCY"]  = 2
					break
		}
		if(model.resort_town.length){
			townto = []
			model.resort_town.forEach(function(town){
				townto.push(town.id_pegas)
			})
			searchModel["TOWNTO"]  = townto.toString()
			searchModel["TOWNTO_ANY"]  = 0
		}else{
			searchModel["TOWNTO_ANY"]  = 1
			searchModel["TOWNTO"]  = ''
		}

		if(model.category.length){
			stars = []
			model.category.forEach(function(category){
				category = category.replace("*","")
				if(category == "5"){category = "6"}
				stars.push(category)
			})
			searchModel["STARS"] = stars.toString()
			searchModel["STARS_ANY"] = 0
		}else{
			searchModel["STARS_ANY"] = 1
			searchModel["STARS"] = ''
		}

		if(model.hotel.length){
			hotels = []
			model.hotel.forEach(function(hotel){
				hotels.push(hotel.id_pegas)
			})
			searchModel["HOTELS"] = hotels.toString()
			searchModel["HOTELS_ANY"] = 0
		}else{
			searchModel["HOTELS_ANY"] = 1
			searchModel["HOTELS"] = ''
		}

		if(model.food.length){
			var meal = []
			model.food.forEach(function(food){
				switch (food) {
					 case "AI":
							meal.push(2)
							break
					 case "BB":
							meal.push(4)
							break
					 case "FB":
							meal.push(3)
							break
					 case "HB":
							meal.push(5)
							break
					 case "RO":
							meal.push(7)
							break
					 case "UAI":
							meal.push(6)
							break
					 default:
							alert("питание")
							break
				}
			})
			searchModel["MEAL"] = meal.toString()
		}else{
			searchModel["MEAL"] = ''
		}


		console.log("searchModel",searchModel)
		self.result && self.result.remove()
		$.ajax({
			data: searchModel,
			url: '/pegas',
			type: 'GET',
			success: function(err,data) {
				console.log("status",data)
			}
		})
		self.result = new views.Result
		$('#result-field', self.el).append(self.result.render().attach().el)


	},

	render: function () {
		$(this.el).html(templates[this.template]);
		return this;
	},

	attach: function () {
		//Search_module

		$('#input-date-start', this.el).datepicker({
			dateFormat: "d.mm.yy"
		});
		$('#input-date-finish', this.el).datepicker({
			dateFormat: "d.mm.yy"
		});

		return this;
	}
});

