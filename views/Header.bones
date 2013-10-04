view = views.Main.extend({
	template: 'Header',

	initialize: function (options) {
		_.bindAll(this, 'render');


	},

	events: {
//		'mouseover .calendar-view': 'showMenuCalendar',
//		'mouseleave .calendar-view': 'hideMenu',
//		'mouseover .calendar-view ul': 'showMenuCalendar'

	},

//	showMenuCalendar: function (e) {
//		clearInterval(this.timeId);
//		$('.header-menu', '.calendar-view').removeClass('hide')
//	},


//	hideMenu: function() {
//		var self=this;
//		this.timeId = setTimeout(function() {
//			$('.header-menu', this.el).addClass('hide')
//		},1000)
//	},

	render: function () {
		$(this.el).html(templates[this.template]);
		return this;
	},

	attach: function () {




		return this;
	}



});

