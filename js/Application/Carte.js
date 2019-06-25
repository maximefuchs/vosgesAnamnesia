Global.include('dev/js/Application/Poi.js');
Global.include('dev/js/Application/Fiche.js');

Global.include('dev/js/utils/utilsOpenseadragon.js');

Global.includeCSS('dev/css/Application/Carte.css');

class Carte extends DivObject {
    constructor(div, jsonCarte, jsonPoi, lien, couleur) {
        super(div, "Carte");
        this.addClass("page");

        this._jsonCarte = jsonCarte;
        this._jsonPoi = jsonPoi;
        lien = "parc";
        this._lien = lien;

        this.signaux = {
            finFermer: new signals.Signal()
        }

        this._pois = [];
        this._poiDiv = new DivObject(this._balise, "CartePoints");
        var pois = jsonPoi[lien];
        for (let i = 0; i < pois.length; i++) {
            console.log("new point : " + i);
            var poi = new Poi(this._poiDiv._balise, pois[i]);
            this._pois.push(poi);
        }
        $('.poi').css('border', '5px solid ' + couleur);


        this._fiches = [];
        for (let i = 0; i < this._pois.length; i++) {
            var f = new Fiche(this._pois[i], i + 'fiche_' + poi._id, couleur);
            this._fiches.push(f);
        }

        this._layers = [];
        this._layersDiv = new DivObject(this._balise, "CarteLayers");
        var layers = jsonCarte.layer;
        for (let i = 0; i < layers.length; i++) {
            console.log("new Layer : " + i);
            var layer = new Img(this._layersDiv._balise, layers[i].id, layers[i].src);
            this._layers.push(layer);
        }

        this._viewer = this.getOSDviewer();
    }

    init() {
        this.setOverlays();
        this.setPoiClickListeners();
        this.setOSDtools();
    }

    fermerCarte(elementAouvrir) {
        TweenLite.to(this._balise, 1, { opacity: 0, onComplete: this.supprimerCarte, onCompleteParams: [this] });
        this.finFermerSignal.dispatch(elementAouvrir);
    }

    supprimerCarte(carte) {
        $(body).find('.elementFiche').remove();
        carte._balise.remove();
    }

    getOSDviewer() {
        var div = new DivObject(this._balise, "OSDandButtons");
        div.addClass('page');

        var seadragonView = new DivObject(div._balise, 'seadragon-viewer');

        $("#seadragon-viewer").width("100%").height("100%");
        var viewer = OpenSeadragon({
            id: "seadragon-viewer",
            prefixUrl: this._jsonCarte.boutonsCarte,
            maxZoomLevel: 3,
            visibilityRatio: 1,
            // defaultZoomLevel: 1.2, // no white borders
            defaultZoomLevel: 1,
            constrainDuringPan: true,
            showNavigator: true,
            navigatorAutoFade: false,
            tileSources: {
                Image: {
                    xmlns: "http://schemas.microsoft.com/deepzoom/2009",
                    Url: Global.getTexteLangue(this._jsonCarte.img, "fr"),
                    Format: "jpg",
                    Overlap: "1",
                    TileSize: "256",
                    Size: {
                        Height: "8000",
                        Width: "8000"
                    }
                }
            },
            gestureSettingsMouse: {
                scrollToZoom: false,
                clickToZoom: false,
                dblClickToZoom: false
            },
            gestureSettingsTouch: {
                pinchToZoom: false,
                clickToZoom: false,
                dblClickToZoom: false
            }
        });
        return viewer;
    }

    setOSDtools() {
        var viewer = this._viewer;
        var div = this._balise;

        // doubble ckick to reset to home zoom
        viewer.addHandler('canvas-double-click', function (args) {
            var targetZoomLevel = viewer.viewport.getHomeZoom();
            viewer.viewport.zoomTo(
                targetZoomLevel,
                viewer.viewport.pointFromPixel(args.position, true));
            viewer.viewport.applyConstraints();
        });

        var zoomInBtn = new BtObject(div, "zoomInBtn");
        zoomInBtn.html("+");
        zoomInBtn.addClass('zoomButtons');
        zoomInBtn.css('right', '400px');
        var zMax = viewer.viewport.getMaxZoom();
        zoomInBtn._balise.click(function () {
            var z = viewer.viewport.getZoom();
            if (z < zMax)
                viewer.viewport.zoomTo(z * 1.3);
        });

        var zoomOutBtn = new BtObject(div, "zoomOutBtn");
        zoomOutBtn.html("-");
        zoomOutBtn.addClass('zoomButtons');
        zoomOutBtn.css('right', '250px');
        var zMin = viewer.viewport.getMinZoom();
        zoomOutBtn._balise.click(function () {
            var z = viewer.viewport.getZoom();
            if (z > zMin)
                viewer.viewport.zoomTo(z / 1.3);
        });
    }

    hideOSDtools() {
        $('#zoomInBtn').toggle();
        $('#zoomOutBtn').toggle();
    }

    setOverlays() {
        for (let i = 0; i < this._pois.length; i++) {
            this._viewer.addOverlay(poiToOverlay(this._pois[i]));
        }
        for (let i = 0; i < this._layers.length; i++) {
            this._viewer.addOverlay(layerToOverlay(this._layers[i]));
        }
    }

    setPoiClickListeners() {
        var carte = this;
        for (let i = 0; i < carte._pois.length; i++) {
            this._viewer.addHandler('open', function (e) {
                new OpenSeadragon.MouseTracker({
                    element: carte._pois[i]._id,
                    clickHandler: function (event) {
                        var f = carte._fiches[i];
                        var p = f._poi;
                        if (!f._ouvert) {
                            p.addClass('large');
                            p._balise.css({ 'background': 'url(' + p._images[0] + ')', 'background-size': 'cover', 'background-position': 'center' });
                            var overlay = poiToOverlay(p);
                            console.log(overlay);

                            f._balise.toggle();
                            f._ouvert = true;
                            carte._viewer.addOverlay(f._overlay);
                            carte.removeOverlay(f, p);
                        }
                    }
                });
            });
        }
    }

    removeOverlay(fiche, poi) {
        var carte = this;
        return new OpenSeadragon.MouseTracker({
            element: fiche._btFermer._id,
            clickHandler: function (event) {
                // fiche._balise.toggle();
                carte._viewer.removeOverlay(fiche._id);
                fiche._ouvert = false;
                poi.removeClass('large');
                poi.css('background', 'white');
            }
        });
    }

    // GETTERS 

    get finFermerSignal() {
        return this.signaux.finFermer;
    }
}