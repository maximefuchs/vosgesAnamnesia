var R = 6371;

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function pow(base, exposant) {
    return Math.pow(base, exposant);
}

function distanceBtw2Coord(lat1, lon1, lat2, lon2) {
    dLat = degreesToRadians(lat2 - lat1);
    dLon = degreesToRadians(lon2 - lon1);
    l1 = degreesToRadians(lat1);
    l2 = degreesToRadians(lat2);
    a = pow(Math.sin(dLat / 2), 2) + pow(Math.sin(dLon / 2), 2) * Math.cos(l1) * Math.cos(l2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return c * R;
}

// params : Poi[] , Poi json , Poi json
function getPointsOverlays(points, origineCarte, finCarte) {
    height = 8000;
    width = 8000;

    console.log(origineCarte);

    var dPixel = Math.sqrt(pow(height, 2) + pow(width, 2));
    var dDistance =
        distanceBtw2Coord(finCarte.lat, finCarte.long, origineCarte.lat, origineCarte.long);
    var echelle = dDistance / dPixel; // en km/Pixel

    console.log(echelle);
    var overlays = [];

    for (let i = 0; i < points.length; i++) {
        var p = points[i];

        var coefXLat = pow(Math.cos((p._lat - origineCarte.lat) * 0.25), 2);
        var coefXLatPixel = (1 - coefXLat) * width * echelle;

        var coefYLong = pow(Math.cos((p._long - origineCarte.long) * 0.22), 2);
        var coefYLongPixel = (1 - coefYLong) * height * echelle;

        var x = distanceBtw2Coord(p._lat, p._long, p._lat, origineCarte.long);
        var y = distanceBtw2Coord(p._lat, p._long, origineCarte.lat, p._long);

        var x = x + coefXLatPixel;
        var y = y - coefYLongPixel;

        x = x / echelle;
        y = y / echelle;

        pourcentageX = x / width;
        pourcentageY = y / height;

        var overlay = {
            element: p._balise[0],
            poi: p,
            id: p._id,
            x: pourcentageX,
            y: pourcentageY,
            placement: 'CENTER'
        };

        overlays.push(overlay);
    }
    return overlays;
}

// param : Img[]
function getLayerOverlays(layers) {
    var overlays = [];
    for (let i = 0; i < layers.length; i++) {
        var l = layers[i];
        var overlay = {
            element: l._balise[0],
            layer: l,
            id: l._id,
            x: 0,
            y: 0,
            width: 1,
            height: 1
        }
        overlays.push(overlay);
    }
    return overlays;
}

function newpushPin() {
    var img = document.createElement("img");
    img.src = "http://upload.wikimedia.org/wikipedia/commons/7/7a/Red_Arrow_Right.svg";
    img.width = 20;
    img.id = "img_arrow_" + id;
    id++;
    return img;
}

function addClickHandler(overlay, viewer) {
    var newOverlayId = 'fiche' + overlay.id;
    var p = overlay.poi;
    return new OpenSeadragon.MouseTracker({
        element: overlay.id,
        clickHandler: function (event) {
            console.log("click on " + overlay.id);
            var fiche = new Fiche(p._balise, p, newOverlayId);

            var over = {
                element: fiche._balise[0],
                id: newOverlayId,
                x: overlay.x,
                y: overlay.y,
                placement: 'CENTER'
            }
            viewer.addOverlay(over);
            // removeOverlay(newOverlayId, viewer);

            // console.log(event);
            // var target = event.originalEvent.target;
            // if (target.matches('a')) {
            //     if (target.getAttribute('target') === '_blank') {
            //         window.open(target.getAttribute('href'));
            //     } else {
            //         location.href = target.getAttribute('href');
            //     }
            // }
        }
    });
}

function removeOverlay(overlayId, viewer) {
    return new OpenSeadragon.MouseTracker({
        element: overlayId,
        clickHandler: function (event) {
            viewer.removeOverlay(overlayId);
        }
    });
}