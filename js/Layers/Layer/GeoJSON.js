LF.LayerFactory.include({
    lazygeojson: function (definition) {
        // TODO: Set style callbacks & stuff here from values in this.options.

        return new LF.LazyGeoJSON(definition.url, definition);
    }
});

LF.LazyGeoJSON = L.GeoJSON.extend({
    initialize: function (url, options) {
        this._waiting = false;
        this.loading = true;

        if (url) {
            this.addUrl(url);
        }

        if (!('style' in options) && 'style' in this) {
            options.style = this.style;
        }

        if (!('pointToLayer' in options) && 'pointToLayer' in this) {
            options.pointToLayer = this.pointToLayer;
        }

        if (!('onEachFeature' in options) && 'onEachFeature' in this) {
            options.onEachFeature = this.onEachFeature;
        }

        if (!('filter' in options) && 'filter' in this) {
            options.filter = this.filter;
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
        if (!this._waiting) {
            this.fire('data:loading');
            // jQuery.get(this._url, L.Util.bind(this._onLoad, this));
            jQuery.ajax({
                url: this._url,
                success: L.Util.bind(this._onLoad, this),
                error: L.Util.bind(this._onError, this)
            });
            this._waiting = this.loading = true;
        }
        L.GeoJSON.prototype.onAdd.call(this, map);
    },

    onRemove: function (map) {
        if (this._waiting) {
            this.fire('data:loaded');
            this._waiting = this.loading = false;
        }
        L.GeoJSON.prototype.onRemove.call(this, map);
    },

    _onLoad: function (resp, textStatus, jqxhr) {
        if (this._waiting) {
            this._waiting = this.loading = false;
            this.fire('data:loaded');
            this.addData(resp);
        }
    },

    _onError: function (jqxhr, textStatus, errorThrown) {
        this.fire('data:loaded');
        this._waiting = this.loading = false;
        this._map.removeLayer(this);
        console.error(jqxhr.status + " " + jqxhr.statusText + ": " + this._url);
    }
});
