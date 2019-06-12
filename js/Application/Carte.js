Global.include('dev/js/Application/Poi.js');
Global.include('dev/js/Application/Fiche.js');

Global.include('dev/js/utils/utilsOpenseadragon.js');

// Global.includeCSS('dev/css/Application/Carte.css');
Global.includeCSS('dev/css/Application/OSD.css');

class Carte extends DivObject {
    constructor(div, json, lien) {
        super(div, "Carte");
        this.addClass("page");

        this._json = json;
        this._lien = lien;

        this._categories = [];

        // for (var i = 0; i < this._json.categorie.length; i++) {
        //     console.log(this._json.categorie[i].id + " " + this._json.categorie[i].img);
        //     this._categories.push({ "id": this._json.categorie[i].id, "img": this._json.categorie[i].img })
        // }

        this._poisSelect = [];
        this._fiches = [];
        // this._fichesDiv = new DivObject(this._balise, "CarteFiches");
        // this._fichesDiv.addClass("page");
        // this._maxPoiOuvert = this._json.maxPoiOuvert;
        this._tabZindex = [];

        // for (var i = 0; i < this._json.poi.length; i++) {
        //     console.log("new POI : " + i);
        //     var cat;
        //     for (var j = 0; j < this._categories.length; j++) {
        //         console.log(this._categories[j].id + " - " + this._json.poi[i].idCat);
        //         console.log(this._categories[j].id === this._json.poi[i].idCat);
        //         if (this._categories[j].id === this._json.poi[i].idCat) {
        //             cat = this._categories[j];
        //         }
        //     }
        //     console.log(cat);
        //     var poi = new Poi(this._poisDiv._balise, this._json.poi[i], cat);
        //     this._pois.push(poi);
        //     var poiSelect = new DivObject(this._poisDiv._balise, "PoiSelect_" + i);
        //     poiSelect.addClass("PoiSelect");
        //     poiSelect.css("background-image", 'url("datas/imgs/carte/' + poi._id + '/vignette.png")');
        //     this._poisSelect.push(poiSelect);
        //     TweenLite.to(poiSelect._balise, 0, { x: poi._x, y: poi._y });
        //     if (poi._y < StageHeight / 2) {
        //         poiSelect.addClass("PoiSelectHaut");
        //         TweenLite.to(poiSelect._balise, 0, { rotation: 180 });
        //     } else {
        //         poiSelect.addClass("PoiSelectBas");
        //     }
        //     var fiche = new Fiche(this._fichesDiv._balise, this._json.poi[i], cat);
        //     fiche.fermerSignal.add(this.fermerFiche);
        //     this._fiches.push(fiche);
        // }

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

        var pois = this._json.poi[this._lien];
        for (let i = 0; i < pois.length; i++) {
            console.log("new point : " + i);

            var poi = new Poi(this._poiDiv._balise, pois[i]);
            this._pois.push(poi);
        }


        this._layers = [];
        this._layersDiv = new DivObject(this._balise, "CarteLayers");

        for (let i = 0; i < this._json.layer.length; i++) {
            console.log("new Layer : " + i);
            var layer = new Img(this._layersDiv._balise, this._json.layer[i].id, this._json.layer[i].src);
            this._layers.push(layer);
        }
    }

    ouvrirFicheBtLien(btLien) {
        console.log("ouvrirFicheBtLien");
        console.log(btLien);

        var count = 0;
        for (var i = 0; i < this._fiches.length; i++) {
            if (this._fiches[i]._ouvert) {
                count++;
            }
        }
        console.log(count + " - " + this._maxPoiOuvert);

        if (count >= this._maxPoiOuvert) {
            return;
        }

        for (var i = 0; i < this._fiches.length; i++) {
            if (this._fiches[i]._idFiche == btLien._id) {
                if (!this._fiches[i]._ouvert) {
                    this._poisSelect[i].css("display", "");
                    this._fiches[i].ouvrir();
                    this.gestionZindex(i);
                }
            }
        }
    }

    fermerFiche(fiche) {
        console.log("fermerFiche");
        var instance = application._carte;
        console.log(instance);
        console.log(fiche);
        for (var i = 0; i < instance._fiches.length; i++) {
            if (fiche._id === instance._fiches[i]._id) {
                instance._poisSelect[i].css("display", "none");
            }
        }
    }

    gestionZindex(numFiche) {
        var num = -1;
        for (var i = 0; i < this._tabZindex.length; i++) {
            if (this._tabZindex[i] === this._fiches[numFiche]) {
                num = i;
            }
        }
        console.log("gestionZindex : " + num);
        if (num != -1) {
            this._tabZindex = Global.array_move(this._tabZindex, num, this._tabZindex.length - 1);
        } else {
            this._tabZindex.push(this._fiches[numFiche]);
        }

        for (var i = 0; i < this._tabZindex.length; i++) {
            console.log(this._tabZindex[i]);
            this._tabZindex[i].css("z-index", 100 + i);
        }
    }

    // FONCTION DRAG FICHE
    rotateListener(event) {

        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            angle = (parseFloat(target.getAttribute('rotate')) || 0) + event.da;

        // translate the element
        TweenLite.to(target, 0, { rotation: angle });

        // update the posiion attributes
        target.setAttribute('rotate', angle);
    }

    // FONCTION DRAG FICHE
    dragMoveListener(event) {

        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        TweenLite.to(target, 0, { x: x, y: y });

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    // FONCTION CLICK FICHE
    clickFiche(e) {
        e.stopPropagation();
        e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }

        var instance = e.data.instance;
        var s = String($(this).attr('id'));
        for (var i = 0; i < instance._fiches.length; i++) {
            if (instance._fiches[i]._id == s) {
                instance.gestionZindex(i);
            }
        }
    };

    // FONCTION CLICK POI
    clickBtn(e) {
        e.stopPropagation();
        e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }

        var instance = e.data.instance;
        var count = 0;
        for (var i = 0; i < instance._fiches.length; i++) {
            if (instance._fiches[i]._ouvert) {
                count++;
            }
        }
        console.log(count + " - " + instance._maxPoiOuvert);

        if (count >= instance._maxPoiOuvert) {
            return;
        }

        var s = String($(this).attr('id'));
        // $('#' + s).addClass("VeilleBtSelect");

        var num = s.replace(/Poi_/, '');
        console.log("Click : " + num);
        for (var i = 0; i < instance._fiches.length; i++) {
            if (instance._fiches[i]._idFiche == num) {
                if (instance._fiches[i]._ouvert) {
                    return;
                }
                instance._poisSelect[i].css("display", "");
                instance._fiches[i].ouvrir();
                instance.gestionZindex(i);
                console.log("j'ouvre la fiche");
            }
        }
    };

    init() {
        // for (var i = 0; i < this._pois.length; i++) {
        //     this._pois[i].init();
        //     this._fiches[i].init();
        //     this._poisSelect[i].css("display", "none");
        // }
        this.displayCarteOpenSeadragon();
    }

    ouvrirCarte() {
        // for (var i = 0; i < this._pois.length; i++) {
        //     // this._pois[i].ouvrir(0);
        //     this._pois[i].ouvrir(0.02 * i);
        // }

        this._balise.toggle();
    }

    fermerCarte(elementAouvrir) {
        TweenLite.to(this._balise, 1, { opacity: 0, onComplete: this.supprimerCarte, onCompleteParams: [this] });
        this.finFermerSignal.dispatch(elementAouvrir);
    }

    supprimerCarte(carte) {
        carte._balise.remove();
    }

    texte() {
        this.css("background-image", "url(" + Global.getTexteLangue(this._json.img, "fr") + ")");
        for (var i = 0; i < this._fiches.length; i++) {
            this._fiches[i].texte();
        }
    }

    displayCarteOpenSeadragon() {
        var div = new DivObject(this._balise, "OSDandButtons");
        div.addClass('page');

        var seadragonView = new DivObject(div._balise, 'seadragon-viewer');

        var overlaysPoints = getPointsOverlays(this._pois, this._json.origineCarte, this._json.finCarte);
        console.log(overlaysPoints);

        var overlaysLayer = getLayerOverlays(this._layers);
        console.log(overlaysLayer);

        var overlays = overlaysLayer.concat(overlaysPoints);
        console.log(overlays);

        $("#seadragon-viewer").width("100%").height("100%");
        var viewer = OpenSeadragon({
            id: "seadragon-viewer",
            prefixUrl: this._json.boutonsCarte,
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
                    Url: Global.getTexteLangue(this._json.img, "fr"),
                    Format: "jpg",
                    Overlap: "1",
                    TileSize: "256",
                    Size: {
                        Height: "8000",
                        Width: "8000"
                    }
                }
            },
            overlays: overlays,
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
        viewer.addHandler('canvas-double-click', function (args) {
            console.log('double');
            var targetZoomLevel = viewer.viewport.getHomeZoom();
            // if (openseadragon.viewport.getZoom() >= targetZoomLevel) {
            //     targetZoomLevel = 1;
            // }
            viewer.viewport.zoomTo(
                targetZoomLevel,
                viewer.viewport.pointFromPixel(args.position, true));
            viewer.viewport.applyConstraints();
        });
        viewer.addHandler('open', function (e) {
            for (let i = 0; i < overlaysPoints.length; i++) {
                addClickHandler(overlaysPoints[i], viewer);
            }
        });
        for (let i = 0; i < overlaysLayer.length; i++) {
            $("#" + overlaysLayer[i].id).toggle();
            var btnId = "btn_" + overlaysLayer[i].id;
            var btn = new BtObject(div._balise, btnId);
            $("#" + btnId).html("Toggle " + overlaysLayer[i].id)
                .addClass('layerBtn')
                .css("bottom", 30 + 45 * i);
            $("#btn_" + overlaysLayer[i].id).click(function () {
                $("#" + overlaysLayer[i].id).toggle();
            });
        }

        var carte = this;
        var backButton = new BtObject(div._balise, "backButton");
        backButton.html("Retour menu");
        backButton._balise.click(function () {
            backButton._balise.toggle();
            carte.fermerCarte("menu");
        });

        var zoomInBtn = new BtObject(div._balise, "zoomInBtn");
        zoomInBtn.html("+");
        zoomInBtn.addClass('zoomButtons');
        zoomInBtn.css('left', '40%');
        var zMax = viewer.viewport.getMaxZoom();
        zoomInBtn._balise.click(function () {
            var z = viewer.viewport.getZoom();
            if (z < zMax)
                viewer.viewport.zoomTo(z * 1.3);
        });

        var zoomOutBtn = new BtObject(div._balise, "zoomOutBtn");
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

    // GETTERS 

    get finFermerSignal() {
        return this.signaux.finFermer;
    }
}