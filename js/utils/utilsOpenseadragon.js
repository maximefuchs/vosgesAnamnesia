var R = 6371;

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function pow(base, exposant) {
    return Math.pow(base, exposant);
}

// distance entre deux points avec coordonnées connues
function distanceBtw2Coord(lat1, lon1, lat2, lon2) {
    dLat = degreesToRadians(lat2 - lat1);
    dLon = degreesToRadians(lon2 - lon1);
    l1 = degreesToRadians(lat1);
    l2 = degreesToRadians(lat2);
    a = pow(Math.sin(dLat / 2), 2) + pow(Math.sin(dLon / 2), 2) * Math.cos(l1) * Math.cos(l2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return c * R;
}


// renvoi le json overlay (nécessaire pour openseadragon) correspondant aux paramètres du poi
function poiToOverlay(p) {
    var origineCarte = textesJSON.Application.Carte.origineCarte;
    var finCarte = textesJSON.Application.Carte.finCarte;
    height = 8000;
    width = 8000;

    var lat = p._address.lat;
    var long = p._address.long;

    var dPixel = Math.sqrt(pow(height, 2) + pow(width, 2));
    var dDistance =
        distanceBtw2Coord(finCarte.lat, finCarte.long, origineCarte.lat, origineCarte.long);
    var echelle = dDistance / dPixel; // en km/Pixel

    var coefXLat = pow(Math.cos((lat - origineCarte.lat) * 0.25), 2);
    var coefXLatPixel = (1 - coefXLat) * width * echelle;

    var coefYLong = pow(Math.cos((long - origineCarte.long) * 0.22), 2);
    var coefYLongPixel = (1 - coefYLong) * height * echelle;

    var x = distanceBtw2Coord(lat, long, lat, origineCarte.long);
    var y = distanceBtw2Coord(lat, long, origineCarte.lat, long);

    var x = x + coefXLatPixel;
    var y = y - coefYLongPixel;

    x = x / echelle;
    y = y / echelle;

    pourcentageX = x / width;
    pourcentageY = y / height;

    var overlay = {
        element: p._balise[0], // balise html de l'élément
        poi: p, // pour pouvoir le récupérer si besoin
        id: p._id,
        x: pourcentageX,
        y: pourcentageY,
        placement: 'CENTER'
    }
    return overlay;
}

// param : Img.class
function layerToOverlay(l) {
    var overlay = {
        element: l._balise[0],
        layer: l,
        id: l._id,
        x: 0,
        y: 0,
        width: 1,
        height: 1
    }
    l.css('display', 'none');
    return overlay;
}

function ficheToOverlay(f) {
    var p = f._poi;
    var overlay = poiToOverlay(p);
    var over = {
        element: f._balise[0],
        id: f._id,
        x: overlay.x,
        y: overlay.y,
        placement: 'CENTER'
    }
    return over;
}
