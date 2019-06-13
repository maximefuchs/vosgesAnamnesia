Global.include('dev/js/Application/Poi.js');
Global.include('dev/js/Application/Fiche.js');

Global.include('dev/js/utils/utilsOpenseadragon.js');

// Global.includeCSS('dev/css/Application/Carte.css');
Global.includeCSS('dev/css/Application/OSD.css');

class Carte extends DivObject {
    constructor(div, jsonCarte, jsonPoi, lien) {
        super(div, "Carte");
        this.addClass("page");

        this._jsonCarte = jsonCarte;
        this._jsonPoi = jsonPoi;
        this._lien = lien;
        
        // interact('.Fiche')
        //     .draggable({
        //         onmove: this.dragMoveListener,
        //         ignoreFrom: '.FicheBt, .FicheBtLien',
        //         restrict: {
        //             restriction: 'parent',
        //             elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        //         },
        //     });

        // interact('.Fiche')
        //     .gesturable({
        //         onmove: this.rotateListener
        //     });

        // this._balise.find(".Poi").on("click touchstart", null, { instance: this }, this.clickBtn);
        // this._balise.find(".Fiche").on("mousedown touchstart", null, { instance: this }, this.clickFiche);

        this.signaux = {
            finFermer: new signals.Signal()
        }

        this._pois = [];
        this._poiDiv = new DivObject(this._balise, "CartePoints");
        var pois = this._jsonPoi[this._lien];
        for (let i = 0; i < pois.length; i++) {
            console.log("new point : " + i);
            var poi = new Poi(this._poiDiv._balise, pois[i]);
            this._pois.push(poi);
        }


        this._fiches = [];
        for (let i = 0; i < this._pois.length; i++) {
            var f = new Fiche(this._pois[i], i + 'fiche_' + poi._id);
            this._fiches.push(f);
        }

        this._layers = [];
        this._layersDiv = new DivObject(this._balise, "CarteLayers");
        var layers = this._jsonCarte.layer;
        for (let i = 0; i < layers.length; i++) {
            console.log("new Layer : " + i);
            var layer = new Img(this._layersDiv._balise, layers[i].id, layers[i].src);
            this._layers.push(layer);
        }

        this._viewer = this.getOSDviewer();
    }

    // FONCTION DRAG FICHE
    // dragMoveListener(event) {

    //     var target = event.target,
    //         // keep the dragged position in the data-x/data-y attributes
    //         x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    //         y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    //     // translate the element
    //     TweenLite.to(target, 0, { x: x, y: y });

    //     // update the posiion attributes
    //     target.setAttribute('data-x', x);
    //     target.setAttribute('data-y', y);
    // }

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
        $(body).find('.fiche').remove();
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

        var carte = this;
        var backButton = new DivObject(div, "backButton");
        var img = new Img(backButton._balise, 'bachButton_img', "datas/imgs/interface/boutons_carte/home.png");
        img.attr('width', 60); img.attr('height', 60); img.css('margin-top', '15px');
        backButton._balise.click(function () {
            carte.hideOSDtools();
            carte.fermerCarte("menu");
        });

        var zoomInBtn = new BtObject(div, "zoomInBtn");
        zoomInBtn.html("+");
        zoomInBtn.addClass('zoomButtons');
        zoomInBtn.css('left', '40%');
        var zMax = viewer.viewport.getMaxZoom();
        zoomInBtn._balise.click(function () {
            var z = viewer.viewport.getZoom();
            if (z < zMax)
                viewer.viewport.zoomTo(z * 1.3);
        });

        var zoomOutBtn = new BtObject(div, "zoomOutBtn");
        zoomOutBtn.html("-");
        zoomOutBtn.addClass('zoomButtons');
        zoomOutBtn.css('right', '40%');
        var zMin = viewer.viewport.getMinZoom();
        zoomOutBtn._balise.click(function () {
            var z = viewer.viewport.getZoom();
            if (z > zMin)
                viewer.viewport.zoomTo(z / 1.3);
        });
    }

    hideOSDtools() {
        $('#backButton').toggle();
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
                        var overlay = poiToOverlay(p);
                        console.log(overlay);

                        f._balise.toggle();
                        carte._viewer.addOverlay(f._overlay);
                        carte.removeOverlay(f);
                    }
                });
            });
        }
    }

    removeOverlay(fiche) {
        var carte = this;
        return new OpenSeadragon.MouseTracker({
            element: fiche._btFermer._id,
            clickHandler: function (event) {
                // fiche._balise.toggle();
                carte._viewer.removeOverlay(fiche._id);
            }
        });
    }

    // GETTERS 

    get finFermerSignal() {
        return this.signaux.finFermer;
    }
}