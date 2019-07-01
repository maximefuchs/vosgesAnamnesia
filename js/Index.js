Global.include('dev/librairies/Signal.js');
Global.include('dev/librairies/SignalBinding.js');

Global.include('dev/js/Application.js');

var langue;

var textesJSON;
var paramsJSON;

var poisJSON;
var jeuxJSON;

var body;
var head;
var StageWidth;
var StageHeight;

var t;

var application;

function initApplication() {
    //Chargement du fichier de params
    $.when($.getJSON("datas/params.json", finChargementParams),
        $.getJSON("datas/texte.json", finChargementTexte),
        $.getJSON("datas/jeu.json", finChargementJeu),
        $.getJSON("datas/poi.json", finChargementPoi)
    ).then(createApplication);
};

function createApplication() {
    console.log("createApplication");

    body = $("body");

    StageWidth = body.width();
    StageHeight = body.height();

    console.log(StageWidth + " - " + StageHeight);

    application = new Application();
};


function gestionLangue() {
    application.texte();
}

function finChargementParams(data) {
    console.log("finChargementParams");
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
function finChargementPoi(data) {
    poisJSON = data;
}
function finChargementJeu(data) {
    jeuxJSON = data;
}

function addInactivityTime() {
    console.log("addInactivityTime : " + document);
    $(document).on("mousedown mouseup mousemove touchstart touchend touchmove", resetTimer);
}

function removeInactivityTime() {
    console.log("removeInactivityTime : " + document);
    $(document).off("mousedown mouseup mousemove touchstart touchend touchmove", resetTimer);
}

function logout() {
    removeInactivityTime();
    veille.ouvrir();
}

function resetTimer() {
    if (t) {
        clearTimeout(t);
    }
    t = setTimeout(logout, paramsJSON.tempsInactivity);
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

function dragMoveListener(event) {
    console.log(event.target);
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;