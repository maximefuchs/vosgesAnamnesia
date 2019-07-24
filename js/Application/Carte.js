Global.include('dev/js/Application/Poi.js');
Global.include('dev/js/Application/Fiche.js');

Global.include('dev/js/utils/utilsOpenseadragon.js');

Global.includeCSS('dev/css/Application/Carte.css');

class Carte extends DivObject {
    constructor(div, jsonCarte, couleur) {
        super(div, "Carte");
        this.addClass("page");
        this.css('background', couleur);

        this._jsonCarte = jsonCarte;
        this._couleur = couleur;

        this.carteOpenSignal = new signals.Signal();


        this._pois = [];
        this._poiDiv = new DivObject(this._balise, "CartePoints");

        var backFilter = new DivObject(this._balise, "filterBackCarte");
        backFilter.addClass('page');
        backFilter.css('background', 'url(datas/imgs/perenne/texture_fiche.png)');

        this._fiches = [];

        this.clickSignal = new signals.Signal();
        var carte = this;
        this._balise.click(function () {
            carte.clickSignal.dispatch();
        });

        this._viewer = this.getOSDviewer();
        this._balise.toggle();
    }

    initPOIsandFiches(jsonPOIs) {
        this.removeAllOverlays();
        this._pois = [];
        this._fiches = [];
        for (let i = 0; i < jsonPOIs.length; i++) {
            console.log("new point + fiche : " + i);
            if (jsonPOIs[i] !== undefined) {
                var poi = new Poi(this._poiDiv._balise, i + 'poi_' + this._id, jsonPOIs[i]);
                this._pois.push(poi);
                var f = new Fiche(poi, i + 'fiche_' + poi._id, this._couleur);
                this._fiches.push(f);
            }
            else {
                console.log("undefined");
            }
        }
        this.setOverlays();
    }

    init() {
        $('.poi').css('border', '5px solid ' + this._couleur);
        this.setPoiClickListeners();
        this.setOSDtools();
        this._balise.css('display', 'block');
        this.carteOpenSignal.dispatch();
    }

    getOSDviewer() {
        var div = new DivObject(this._balise, "OSDandButtons");
        div.addClass('page');

        new DivObject(div._balise, 'seadragon-viewer');

        $("#seadragon-viewer").width("100%").height("100%");
        var viewer = OpenSeadragon({
            id: "seadragon-viewer",
            prefixUrl: this._jsonCarte.boutonsCarte,
            maxZoomLevel: 4,
            visibilityRatio: 1,
            defaultZoomLevel: 1.2, // no white borders
            // defaultZoomLevel: 1,
            constrainDuringPan: true,
            showNavigator: true,
            navigatorAutoFade: false,
            showNavigationControl: false,
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
            if (z < zMax) {
                var zoomTo = z * 1.3;
                if (zoomTo > zMax)
                    zoomTo = zMax;
                viewer.viewport.zoomTo(z * 1.3);
            }
        });

        var zoomOutBtn = new BtObject(div, "zoomOutBtn");
        zoomOutBtn.html("-");
        zoomOutBtn.addClass('zoomButtons');
        zoomOutBtn.css('right', '250px');
        var zMin = viewer.viewport.getMinZoom();
        zoomOutBtn._balise.click(function () {
            var z = viewer.viewport.getZoom();
            if (z > zMin) {
                var zoomTo = z / 1.3;
                if (zoomTo < zMin)
                    zoomTo = zMin;
                viewer.viewport.zoomTo(zoomTo);
            }
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
        // for (let i = 0; i < this._layers.length; i++) {
        //     this._viewer.addOverlay(layerToOverlay(this._layers[i]));
        // }
    }

    setPoiClickListeners() {
        var carte = this;

        for (let i = 0; i < carte._pois.length; i++) {
            $('#' + carte._pois[i]._id).click(function () {
                var f = carte._fiches[i];
                carte.clickOnPoi(f, carte);
            });
        }
    }

    clickOnPoi(f, carte) {
        var p = f._poi;
        if (!f._ouvert) {
            p.addClass('large');
            var b = p._thumbnail != false ? p._thumbnail : 'datas/imgs/menu/diaporama/3.jpg';
            p._balise.css({ 'background': 'url(' + b + ')', 'background-size': 'cover', 'background-position': 'center' });
            var overlay = poiToOverlay(p);
            console.log(overlay);

            f._balise.toggle();
            f._ouvert = true;
            carte._viewer.addOverlay(f._overlay);
            carte.removeOverlay(f, p);

            var viewport = carte._viewer.viewport;
            var pt = new OpenSeadragon.Point(overlay.x, overlay.y);
            viewport.panTo(pt);
            viewport.zoomTo(1.5);
        }
    }

    removeOverlay(fiche, poi) {
        var carte = this;
        $('#' + fiche._btFermer._id).click(function () {
            carte._viewer.removeOverlay(fiche._id);
            fiche._ouvert = false;
            poi.removeClass('large');
            poi.css('background', 'white');
        });
        // OTHER METHOD
        // return new OpenSeadragon.MouseTracker({
        //     element: fiche._btFermer._id,
        //     clickHandler: function (event) {
        //     }
        // });
    }

    removeAllOverlays() {
        this._viewer.clearOverlays();
        $('.poi').remove();
        // <.poi><.elementFiche></></> donc pas besoin d'enlever les fiches. 
        // Elles seront supprimées en meme temps que les poi
    }
}