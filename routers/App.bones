/**
 * Initialize underscore mixins for f_.
 *
 * We are doing this here (for now) because the bones library
 * doesn't (yet) easily allow us to set up our own global stack.
 */
_.mixin({
	f: Bones.server ? require('f_underscore') : f_,
	// Lazy evaluate a value.
	lazy: function (v) {
		return _.isFunction(v) ? v() : v;
	}
});

if (Bones.server) {
	var redis = require('redis');
	var client = redis.createClient();

}

/**
 * The main application router.
 */
router = Backbone.Router.extend({


	routes: {
		'/': 'home',
		'/admin': 'admin',
		'/admin/country': 'admin',
		'/admin/cities': 'admin'
	},



	initializeState: function (app) {
		Backbone.Router.prototype.initializeState.call(this, app);
		Bones.router = this;
		var self = this;
		if (Bones.server && this.req.user) {
			this.state = new models.State({
				user: true
			});
			var user = new models.User(this.req.user)
			this.state.set({
				user: user,
			});
			user.loadUser();
		} else {
			this.state = new models.State({
				user: false
			});
		}

		this.interface = new views.Interface({
			model: this.state
		});

		this.interface.bind('sync', this.syncView, this);

	},


	//	registration: function() {
	//        $.when(this.state.isLoaded()).then(_.bind(function(state) {
	//			this.send(views.Register, {state: state});
	//        }, this));
	//	},

	//	login: function() {
	//        $.when(this.state.isLoaded()).then(_.bind(function(state) {
	//			this.send(views.Login, {state: state});
	//        }, this));
	//	},


	home: function () {
		$.when(this.state.isLoaded()).then(_.bind(function (state) {
			this.send(views.Home, {
				state: state
			});
		}, this));
	},

	admin: function() {
		$.when(this.state.isLoaded()).then(_.bind(function (state) {
			this.send(views.Admin, {
				state: state
			});
		}, this));
	},

	// Helper to assemble the page title.
	pageTitle: function (view) {
		var title = 'Tourism';
		return (view.pageTitle ? view.pageTitle + ' | ' + title : title);
	},

	// The send method is...
	send: function (view) {
		var options = (arguments.length > 1 ? arguments[1] : {});
		var v = new view(options);

		// Populate the #page div with the main view.
		$('#page').empty().append(v.el);

		// TODO explain this!
		v.render().attach().activeLinks().scrollTop();

		// Set the page title.
		document.title = this.pageTitle(v);
	},

	// Generic error handling for our Router.
	error: function (error) {
		this.send(views.Error, _.isArray(error) ? error.shift() : error);
	},

	// Helper to fetch a set of models/collections in parrellel.
	fetcher: function () {
		var models = [];

		return {
			push: function (item) {
				models.push(item)
			},
			fetch: function (callback) {
				if (!models.length) return callback();
				var errors = [];
				var _done = _.after(models.length, function () {
					callback(errors.length ? errors : null);
				});
				_.each(models, function (model) {
					model.fetch({
						success: _done,
						error: function (error) {
							errors.push(error);
							_done();
						}
					});
				});
			}
		}
	}
});

