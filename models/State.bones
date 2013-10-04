/**
 * The state model holds various parts of information on the
 * running state of the page.
 *
 * It is responsible for keeping track of which facet is displayed,
* and what the active field is.
*/
model = Backbone.Model.extend({
    url: function () {
        return '/api/State/' + this.id;
    },
    defaults: {
        activeFacet: null,
        activeField: null,
        initialField: null
    },

    initialize: function initialize(opts) {
        /*
        _.bindAll(this, 'loadFacet');

       // this.on('change:activeField', this._setActiveField, this);

        // this collection tracks the facets that are loaded.
        this.facets = new Backbone.Collection([], {
            model: models.Facet
        });
        this.facets.on('add', this._addFacet, this);

        // this is a to track the previous fields
        // we have viewed.
        this.history = new Backbone.Collection([], {
            model: models.Field
        });

        this.glossary = new models.Glossary();
        */
    },
    /*
    newFacet: function(opts) {
        // add user id to model
        if(this.get('user')) {
            opts.id = this.get('user').get('id');
        }
        return new (models[opts.schemaId] || models.Facet)(opts);
    },
    */
    /**
     * Generates a JSON representation to be published in the markup.
     */
    deflate: function() {
        var obj = this.toJSON();
        /*
        if(this.get('activeFacet')) {
            obj.activeFacet = this.get('activeFacet').get('schemaId');
            obj.activeField = obj.activeField.id;
        }
        */
        if (this.get('user')) {
            obj.user = this.get('user').toJSON();
        }
        if (this.get('categories')) {
            obj.user = this.get('categories').toJSON();
        }


        return obj;
    },
    inflate: function(data) {
        if(data.user) {
            this.set({user: new models.User(data.user)});
        }
        if(data.categories) {
            this.set({user: new models.Categories(data.categories)});
        }

        /*
        if(data.activeFacet) {
            var facet = this.newFacet({schemaId: data.activeFacet});
            $.when(facet.isLoaded()).then(_.bind(function(facet) {
                this.set('activeField', facet.fields.get(data.activeField));
                this.facets.add([facet]);
            }, this));
        }
        */
        return this;
    },
    /*
    _addFacet: function(facet, collection) {
        // if there isnt an active facet, this one is it.
        if (!this.get('activeFacet')) {
            this.set('activeFacet', facet);
        }
    },
    _setActiveField: function(model, value) {
        var previous = this.previous('activeField');

        // add the previous field onto the history stack.
        previous && (this.history.push(previous));
    },
    loadFacet: function(schemaId, fieldId) {
        var facet = this.newFacet({schemaId: schemaId});

        $.when(facet.isLoaded()).then(_.bind(function(facet) {
            this.facets.add([facet]);
        }, this));

        return facet;
    },
    activeField: function() {
        return this.get('activeField');
    },
    initialField: function() {
        return this.get('initialField') || this.get('activeFacet').startField();
    },
    // Asks the current active field where to go to next.
    nextField: function(value) {
        console.log("look: child -> facet -> attributes: ", this.history.models[0]);
        var field = this.get('activeField');
        var nextId = field.nextField(value);

        var href = nextId ? nextId.split('#') : [];
        if(href[0] == "") href.shift();

        if(href.length > 1) {
            var opts = {
                schemaId: href[0],
                returnTo: {
                    facet: this.get('activeFacet'),
                    field: this.get('activeField').nextField()
                }
            }
            var facet = this.newFacet(opts);
            $.when(facet.isLoaded()).then(_.bind(function(facet) {
                this.set('activeFacet', facet);
                if(facet.schema.get('type') != 'array') {
                    this.set('activeField', facet.fields.get(href[1]));
                }
            }, this));
            return null;
        }
        else {
            // todo : make this load a field from a different facet.
            var nextField = (nextId !== null)
                ? field.facet.fields.get(href[0]) : null;

            return nextField;
        }
    },
    */

    // we are only loaded when the models schema has been loaded.
    isLoaded: function() {
    	//console.log('++++++++++++++++++++++++++++user', this.get('user'));
    	var user = this.get('user');
    	if (user==false) {
			return  this
    	}
    	else {
    		if (!this.get('user')) return false;
    		return $.when(this.get('user').isLoaded())
    		.pipe(_.f.functionize(this));
    	}

////        if (!this.get('user')||!this.get('categories')) return false;
//		if (!this.get('categories')) return false;
////        return $.when(this.get('user').isLoaded(), this.get('categories').isLoaded())
//			return $.when(this.get('categories').isLoaded())
//             .pipe(_.f.functionize(this));
//		return .pipe(_.f.functionize(this));
    }
});


model.augment({
    fetch: function(parent, options) {
        return $.when(parent.apply(this, [options]))
            .pipe(_.f.functionize(this));
    }
});

