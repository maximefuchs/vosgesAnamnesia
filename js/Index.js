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

var loc = window.location.pathname;
var mainFolder = loc.substring(1, loc.lastIndexOf('/')) + '/';
var s = loc.split('/');
var folderImgs = s[1] + '/' + s[2] + '/' + s[3] + '/Documents/MediaBallonDesVosges/';

var t;

var application;

// si l'on veut télécharger les jsons et images au démarrage
var download = true;

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

    if (download)
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
    if (download) {
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
    } else
        createApplication();
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

    var imgs = extractJSON(poisJsonFR);
    require("electron").remote.require("electron-download-manager").bulkDownload({
        urls: imgs
    }, function (error, finished, errors) {
        if (error) {
            console.log("finished: " + finished);
            console.log("errors: " + errors);
            createApplication();
            return;
        }

        console.log("all finished");
        createApplication();
    });

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

function extractJSON(obj, imgs) {
    if (imgs === undefined)
        imgs = []
    for (const i in obj) {
        if (Array.isArray(obj[i]) || typeof obj[i] === 'object') {
            imgs.concat(extractJSON(obj[i], imgs));
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