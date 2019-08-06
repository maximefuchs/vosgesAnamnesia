Global.include('dev/librairies/Signal.js');
Global.include('dev/librairies/SignalBinding.js');

Global.include('dev/js/Application.js');

var langue;

var textesJSON;
var textesJsonFR;
var textesJsonDE;
var textesJsonEN;

var paramsJSON;

var poisJSON;
var poisJsonFR;
var poisJsonDE;
var poisJsonEN;

var perennesJSON;
var perennesJsonFR;
var perennesJsonDE;
var perennesJsonEN;

var jeuxJSON;
var jeuxJsonFR;
var jeuxJsonDE;
var jeuxJsonEN;

var favPOIS;
var favPoisFR;
var favPoisDE;
var favPoisEN;

var body;
var StageWidth;
var StageHeight;

var loc = window.location.pathname;
var mainFolder = loc.substring(1, loc.lastIndexOf('/')) + '/';
var s = loc.split('/');
var folderImgs = s[1] + '/' + s[2] + '/' + s[3] + '/Documents/MediaBallonDesVosges/';

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
        $.getJSON("datas/texteFR.json", finChargementTexteFR),
        $.getJSON("datas/texteDE.json", finChargementTexteDE),
        $.getJSON("datas/texteEN.json", finChargementTexteEN),
        $.getJSON("datas/jeuFR.json", finChargementJeuFR),
        $.getJSON("datas/jeuDE.json", finChargementJeuDE),
        $.getJSON("datas/jeuEN.json", finChargementJeuEN),
        $.getJSON("datas/perenneFR.json", finChargementPerenneFR),
        $.getJSON("datas/perenneDE.json", finChargementPerenneDE),
        $.getJSON("datas/perenneEN.json", finChargementPerenneEN)
    ).then(chargementJsonPoiFR);
};

function createApplication() {
    console.log("createApplication");
    $('#bufferContent').remove();

    body = $("body");

    StageWidth = body.width();
    StageHeight = body.height();

    console.log(StageWidth + " - " + StageHeight);

    textesJSON = textesJsonFR;
    jeuxJSON = jeuxJsonFR;
    poisJSON = poisJsonFR;

    newApplication();
};

function newApplication(lg) {
    if (lg === undefined)
        lg = 'fr';
    $('#Application').remove();
    console.log(lg);
    langue = lg;
    switch (lg) {
        case 'fr':
            textesJSON = textesJsonFR;
            jeuxJSON = jeuxJsonFR;
            poisJSON = poisJsonFR;
            perennesJSON = perennesJsonFR;
            favPOIS = favPoisFR;
            break;
        case 'en':
            textesJSON = textesJsonEN;
            jeuxJSON = jeuxJsonEN;
            poisJSON = poisJsonEN;
            perennesJSON = perennesJsonEN;
            favPOIS = favPoisEN;
            break;
        case 'de':
            textesJSON = textesJsonDE;
            jeuxJSON = jeuxJsonDE;
            poisJSON = poisJsonDE;
            perennesJSON = perennesJsonDE;
            favPOIS = favPoisDE;
            break;

        default:
            break;
    }
    application = new Application();
    application.lgSignal.add(function (lg) {
        newApplication(lg);
    });
}


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


function finChargementTexteFR(data) { textesJsonFR = data; }
function finChargementTexteDE(data) { textesJsonDE = data; }
function finChargementTexteEN(data) { textesJsonEN = data; }

function finChargementJeuFR(data) { jeuxJsonFR = data; }
function finChargementJeuDE(data) { jeuxJsonDE = data; }
function finChargementJeuEN(data) { jeuxJsonEN = data; }

function finChargementPerenneFR(data) { perennesJsonFR = data; }
function finChargementPerenneDE(data) { perennesJsonDE = data; }
function finChargementPerenneEN(data) { perennesJsonEN = data; }

function chargementJsonPoiFR() {
    var token = 'ev79X7MuE';
    var url = 'https://parc-ballons-vosges.fr/wp-json/wp/v2/exportjson/fr';
    fetch(url, { method: 'GET', headers: new Headers({ 'password': token, 'Content-Type': 'application/json' }) })
        .then(response => { return response.json(); })
        .then(data => {
            require('fs').writeFile(mainFolder + 'datas/poiFR.json', JSON.stringify(data), (err) => {
                if (err) {
                    console.error(err.message);
                    $.when($.getJSON(mainFolder + "datas/poiFR.json", function (data) { poisJsonFR = data; })).then(chargementJsonPoiEN);
                } else {
                    poisJsonFR = data;
                    chargementJsonPoiEN();
                }
            });
        })
        .catch((error) => {
            console.error(error);
            $.when($.getJSON(mainFolder + "datas/poiFR.json", function (data) { poisJsonFR = data; })).then(chargementJsonPoiEN);
        });
}
function chargementJsonPoiEN() {

    var token = 'ev79X7MuE';
    var url = 'https://parc-ballons-vosges.fr/wp-json/wp/v2/exportjson/en';
    fetch(url, { method: 'GET', headers: new Headers({ 'password': token, 'Content-Type': 'application/json' }) })
        .then(response => { return response.json(); })
        .then(data => {
            require('fs').writeFile(mainFolder + 'datas/poiEN.json', JSON.stringify(data), (err) => {
                if (err) {
                    console.error(err.message);
                    $.when($.getJSON(mainFolder + "datas/poiEN.json", function (data) { poisJsonEN = data; })).then(chargementJsonPoiDE);
                } else {
                    poisJsonEN = data;
                    chargementJsonPoiDE();
                }
            });
        })
        .catch((error) => {
            console.error(error);
            $.when($.getJSON(mainFolder + "datas/poiEN.json", function (data) { poisJsonEN = data; })).then(chargementJsonPoiDE);
        });
}
function chargementJsonPoiDE() {

    var token = 'ev79X7MuE';
    var url = 'https://parc-ballons-vosges.fr/wp-json/wp/v2/exportjson/de';
    fetch(url, { method: 'GET', headers: new Headers({ 'password': token, 'Content-Type': 'application/json' }) })
        .then(response => { return response.json(); })
        .then(data => {
            require('fs').writeFile(mainFolder + 'datas/poiDE.json', JSON.stringify(data), (err) => {
                if (err) {
                    console.error(err.message);
                    $.when($.getJSON(mainFolder + "datas/poiDE.json", function (data) { poisJsonDE = data; })).then(downloadImages);
                } else {
                    poisJsonDE = data;
                    downloadImages();
                }
            });
        })
        .catch((error) => {
            console.error(error);
            $.when($.getJSON(mainFolder + "datas/poiDE.json", function (data) { poisJsonDE = data; })).then(downloadImages);
        });
}

function downloadImages() {

    // require("electron").remote.require("electron-download-manager").register({
    //     downloadFolder: mainFolder + "datas/imgs/carte/poi/download"
    // });

    var imgs = extractPicFileLinks(poisJsonFR);
    require("electron").remote.require("electron-download-manager").bulkDownload({
        urls: imgs
    }, function (error, finished, errors) {
        if (error) {
            console.log("finished: " + finished);
            console.log("errors: " + errors);
            getFavouritePOIs();
            return;
        }

        console.log("all finished");
        getFavouritePOIs();
    });
}

function getFavouritePOIs() {

    favPoisFR = extractCoeurPois(poisJsonFR);
    favPoisEN = extractCoeurPois(poisJsonEN);
    favPoisDE = extractCoeurPois(poisJsonDE);

    createApplication();
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

function extractPicFileLinks(obj, imgs) {
    if (imgs === undefined)
        imgs = []
    for (const i in obj) {
        if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
            imgs.concat(extractPicFileLinks(obj[i], imgs));
        } else {
            if (i == 'thumbnail' || i == 'src') {
                if (obj[i] != false) {
                    // console.log(obj[i]);
                    imgs.push(obj[i]);
                }
            }
        }
    }
    return imgs;
}

function extractCoeurPois(obj, coeurs) {
    if (coeurs === undefined)
        coeurs = []
    for (const i in obj) {
        if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
            // console.log('OBJECT');
            coeurs.concat(extractCoeurPois(obj[i], coeurs));
        } else {
            if (i == 'favorite') {
                if (obj[i] != false) {
                    coeurs.push(obj);
                }
            }
        }
    }
    return coeurs;
}