var express = require('express');


var RedisStore = require('connect-redis')(express);




servers.Middleware.augment({
    initialize: function (parent, app) {
        parent.call(this, app);

        this.use(express.session({
            secret: 'sdfg234tg234g243',
        }));



//        this.use(new servers.Register(app));
//        this.use(new servers.checkUser(app));
//        this.use(new servers.PassportLocal(app));
//      this.use(new servers.getCollections(app));
      this.use(new servers.parsePegas(app));
      this.use(new servers.parsePegasBd(app));
    }
});

