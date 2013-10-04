var path = require('path');

servers.Route.augment({
    initializeAssets: function(parent, app) {
        this.assets.vendor = this.assets.vendor || [];
        this.assets.vendor.push(require.resolve('../assets/js/json2'));
        this.assets.vendor.push(require.resolve('f_underscore/f_underscore'));
        this.assets.vendor.push(require.resolve('../assets/js/socket.io'));
		this.assets.vendor.push(require.resolve('../assets/js/moment.min'));
		this.assets.vendor.push(require.resolve('../assets/js/jquery-ui'));
//		this.assets.vendor.push(require.resolve('../assets/js/jquery.ui.datepicker'));
        parent.call(this, app);

    }
});

