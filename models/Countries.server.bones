models.Countries.prototype.sync = function (method, model, options) {
        Backbone.mongosync.apply(this, arguments);
}

