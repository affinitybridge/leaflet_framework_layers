LF.LayerFactory = LF.Util.Factory.extend({ type: 'layer' });

LF.Layers = LF.Plugin.extend({

    enable: function (map) {
        this._map = map;

        this._layerFactory = new LF.LayerFactory(this.options.layer_factory || {});

        if (this.options.switcher) {
            this.addControl(this.options.switcher);
        }

        var i, definition, layer;

        for (i in this.options.layers) {
            definition = this.options.layers[i];
            layer = this._layerFactory.get(definition.provider, definition);
            this.addLayer(layer, definition);
        }
    },

    addLayer: function (layer, definition) {
        if (!definition.disabled) {
            this._map.addLayer(layer);
        }
        if (this._control && 'type' in definition) {
            if (definition.type == 'base') {
                this._control.addBaseLayer(layer, definition.title)
            }
            else if (definition.type == 'overlay') {
                this._control.addOverlay(layer, definition.title);
            }
        }
    },

    addControl: function (options) {
        this._control = L.control.layers({}, {}, options).addTo(this._map);
    }
});
