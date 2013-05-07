LF.LayerFactory.include({
    google: function (options) {
        return L.google(options.set, options);
    }
});

LF.LayerFactory.include({
    tilelayer: function (options) {
        var url = options.urlTemplate;
        return L.tileLayer(url, options);
    }
});
