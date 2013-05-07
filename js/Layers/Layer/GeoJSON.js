LF.LayerFactory.include({
    lazygeojson: function (definition) {
        var options = definition.options;

        // TODO: Set style callbacks & stuff here from values in this.options.

        return new LF.LazyGeoJSON(definition.url, options);
    }
});

LF.LazyGeoJSON = L.GeoJSON.extend({
    initialize: function (url, options) {
        this._waiting = false;
        this._loaded = false;

        if (url) {
            this.addUrl(url);
        }
        L.GeoJSON.prototype.initialize.call(this, null, options);
    },

    addUrl: function (url) {
        this._url = url;
    },

    onAdd: function (map) {
        if (!this._url) {
            throw new Error('No data source url provided.');
        }
        if (!this._loaded) {

            // TODO: Trigger map loading.

            jQuery.get(this._url, L.Util.bind(this._onLoad, this));
            this._waiting = true;
        }
        L.GeoJSON.prototype.onAdd.call(this, map);
    },

    onRemove: function (map) {
        if (this._waiting) {

            // TODO: End map loading.

            this._waiting = false;
        }
        L.GeoJSON.prototype.onRemove.call(this, map);
    },

    _onLoad: function (resp) {
        if (this._waiting) {

            // TODO: End map loading.

            this.addData(resp);
            this._loaded = true;
        }
    }
});
