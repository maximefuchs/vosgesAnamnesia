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
                var t = jsonPOIs[i].title;
                var pointer = '<svg id="Calque_' + jsonPOIs[i].id + '" class="pointer" data-name="Calque ' + jsonPOIs[i].id + '" \
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118.3 58">\
                <title>'+ t + '</title>\
                <rect x="40.72" y="9.68" width="'+ t.length * 6.5 + '" height="30.42" fill="#131313" opacity="0.45"/>\
                <text transform="translate(53.51 22.62)" font-size="10" fill="#fff" font-family="OpenSans-Bold, OpenSans Bold" font-weight="700">\
                    <tspan y="4">'+ t.split('/')[0] + '</tspan>\
                </text>\
                <path d="M188.77,370.09a23.7,23.7,0,1,1,9.33,0l-4.66,8.09Zm4.67-30.68a7.19,7.19,0,1,0,7.18,7.18A7.19,7.19,0,0,0,193.44,339.41Z" transform="translate(-168.75 -322.18)" fill="' + this._couleur + '"/>\
                <path d="M193.44,324.18a22.69,22.69,0,0,1,4,45l-4,7-4-7a22.69,22.69,0,0,1,4-45m0,30.6a8.19,8.19,0,1,0-8.19-8.19,8.18,8.18,0,0,0,8.19,8.19m0-32.6a24.69,24.69,0,0,0-5.31,48.8l3.57,6.2,1.74,3,1.73-3,3.58-6.2a24.69,24.69,0,0,0-5.31-48.8Zm0,30.6a6.19,6.19,0,1,1,6.18-6.19,6.19,6.19,0,0,1-6.18,6.19Z" transform="translate(-168.75 -322.18)" fill="#fff"/>\
            </svg>';
                var poi = new Poi(this._poiDiv._balise, i + 'poi_' + this._id, jsonPOIs[i]);
                poi._balise.append(pointer);
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
        this.setPoiClickListeners();
        this.setOSDtools();
        this._balise.css('display', 'block');
        $('#elementsDeco').css('display', 'none');
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
            navigatorPosition: "ABSOLUTE",
            navigatorTop: "1510px",
            navigatorLeft: "2280px",
            navigatorHeight: "500px",
            navigatorWidth: "500px",
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
                pinchToZoom: true,
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
        zoomInBtn._balise.css({ right: '7px', opacity: 0.92 });
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
        zoomOutBtn.css('right', '77px');
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
        
        $('.large').removeClass('large');
        $('.pointer').css('display', '');
        carte._fiches.forEach(fiche => {
            carte._viewer.removeOverlay(fiche._id);
            var poi = fiche._poi;
            poi._balise.css({ border: '', background: '' });
        });
        var p = f._poi;
        $('#' + p._id + ' .pointer').css('display', 'none');
        
        p.addClass('large');
        p.css('border', '5px solid ' + this._couleur);
        if (p._thumbnail != false) {
            var t = folderImgs;
            var split = p._thumbnail.split('/');
            t += split[split.length - 1];
            var b = t;
        } else {
            var b = 'datas/imgs/menu/diaporama/3.jpg';
        }
        p._balise.css({ 'background': 'url(' + b + ')', 'background-size': 'cover', 'background-position': 'center' });
        var overlay = poiToOverlay(p);
        console.log(overlay);

        f._balise.css('display', 'block');
        carte._viewer.addOverlay(f._overlay);
        carte.removeOverlay(f, p);

        var viewport = carte._viewer.viewport;
        var pt = new OpenSeadragon.Point(overlay.x, overlay.y);
        viewport.panTo(pt);
        viewport.zoomTo(1.5);
    }

    removeOverlay(fiche, poi) {
        var carte = this;
        $('#' + fiche._btFermer._id).click(function () {
            carte._viewer.removeOverlay(fiche._id);
            poi.removeClass('large');
            $('#' + poi._id + ' .pointer').css('display', 'block');
            poi._balise.css({ border: '', background: '' });
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