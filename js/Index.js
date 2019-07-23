Global.include('dev/librairies/Signal.js');
Global.include('dev/librairies/SignalBinding.js');

Global.include('dev/js/Application.js');

var langue;

var textesJSON;
var paramsJSON;

var poisJSON;
var poisJsonFR;
var poisJsonDE;
var poisJsonEN;
var perennesJSON;
var jeuxJSON;

var body;
var StageWidth;
var StageHeight;

var t;

var application;

function initApplication() {
    var img = document.createElement('IMG');
    img.setAttribute("src", "datas/buffer.gif");
    img.setAttribute("id", "bufferContent");
    document.body.appendChild(img);
    $('<img src="datas/buffer.gif">');
    //Chargement du fichier de params
    $.when($.getJSON("datas/params.json", finChargementParams),
        $.getJSON("datas/texte.json", finChargementTexte),
        $.getJSON("datas/jeu.json", finChargementJeu),
        $.getJSON("datas/poi.json", chargeOldPoi),
        $.getJSON("datas/perenne.json", finChargementPerenne)
    ).then(chargementJsonPoiFR);
};

function createApplication() {
    console.log("createApplication");
    $('#bufferContent').remove();

    body = $("body");

    StageWidth = body.width();
    StageHeight = body.height();

    console.log(StageWidth + " - " + StageHeight);

    poisJSON = poisJsonFR;
    application = new Application();
};


function finChargementParams(data) {
    //Récupération des données de params
    paramsJSON = data;
    langue = paramsJSON.langueParDefault;
    console.log("langue : " + langue);
    if (paramsJSON.hideCursor) {
        $("html").css("cursor", "none");
        $("body").css("cursor", "none");
    }
}


function finChargementTexte(data) {
    textesJSON = data;
}
function finChargementJeu(data) {
    jeuxJSON = data;
}
function finChargementPerenne(data) {
    perennesJSON = data;
}
function chargeOldPoi(data) {
    poisJSON = data;
}

function chargementJsonPoiFR() {

    var token = 'ev79X7MuE';
    var url = 'https://parc-ballons-vosges.fr/wp-json/wp/v2/exportjson/fr';
    fetch(url, { method: 'GET', headers: new Headers({ 'password': token, 'Content-Type': 'application/json' }), })
        .then(response => { return response.json(); })
        .then(data => {
            require('fs').writeFile('datas/poiFR.json', JSON.stringify(data), (err) => {
                if (err) {
                    console.error(err.message);
                    $.when($.getJSON("datas/poiFR.json", function (data) { poisJsonFR = data; })).then(chargementJsonPoiEN);
                } else {
                    poisJsonFR = data;
                    chargementJsonPoiEN();
                }
            });
        })
        .catch((error) => console.error(error));
}
function chargementJsonPoiEN() {

    var token = 'ev79X7MuE';
    var url = 'https://parc-ballons-vosges.fr/wp-json/wp/v2/exportjson/en';
    fetch(url, { method: 'GET', headers: new Headers({ 'password': token, 'Content-Type': 'application/json' }), })
        .then(response => { return response.json(); })
        .then(data => {
            require('fs').writeFile('datas/poiEN.json', JSON.stringify(data), (err) => {
                if (err) {
                    console.error(err.message);
                    $.when($.getJSON("datas/poiEN.json", function (data) { poisJsonEN = data; })).then(chargementJsonPoiDE);
                } else {
                    poisJsonEN = data;
                    chargementJsonPoiDE();
                }
            });
        })
        .catch((error) => console.error(error));
}
function chargementJsonPoiDE() {

    var token = 'ev79X7MuE';
    var url = 'https://parc-ballons-vosges.fr/wp-json/wp/v2/exportjson/de';
    fetch(url, { method: 'GET', headers: new Headers({ 'password': token, 'Content-Type': 'application/json' }), })
        .then(response => { return response.json(); })
        .then(data => {
            require('fs').writeFile('datas/poiDE.json', JSON.stringify(data), (err) => {
                if (err) {
                    console.error(err.message);
                    $.when($.getJSON("datas/poiDE.json", function (data) { poisJsonDE = data; })).then(createApplication);
                } else {
                    poisJsonDE = data;
                    createApplication();
                }
            });
        })
        .catch((error) => console.error(error));
}


/*************************************************/
/****************  UTILS   ***********************/
/*************************************************/

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function somme(int) {
    var somme = 0;
    for (let i = 1; i < int; i++) {
        somme += i;
    }
    return somme;
}