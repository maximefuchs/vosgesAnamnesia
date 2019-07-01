Global.include('dev/js/Application/ElementSousMenu.js');
Global.includeCSS('dev/css/Application/SousMenu.css');

Global.include('dev/js/Application/SousMenuListePoi.js');

class SousMenu extends DivObject {
    constructor(parent, json, titreElement, couleur, scale, lien) {
        super(parent, 'sousmenu');
        this.addClass('sousmenu');

        this._json = json;
        this._scale = scale;
        this._couleur = couleur;
        this._titreElement = titreElement;
        // enregistrement de tous les liens successifs dans un tableau pour pouvoir faire un retour en arrière
        this._lien = [lien];
        this._jsonPoi = poisJSON[lien];

        console.log(poisJSON);
        console.log(lien);
        console.log(this._jsonPoi);

        this._carte = new Carte(
            $('#Application'),
            textesJSON.Application.Carte,
            couleur);

        this.signalFermer = new signals.Signal();
        this.closeCarteSignal = new signals.Signal();
        this.clickPerenne = new signals.Signal();

        this.css('bottom', 1 * scale);

        var tailleEltTxt = 5.5;

        /////////////////////////////////
        // element avec titre et texte

        this._divText = new DivObject(this._balise, "divText_" + this._id);
        this._divText.addClass('text_sousmenu');
        this._divText._balise.css({
            bottom: 4 * scale,
            left: -tailleEltTxt * scale,
            height: (tailleEltTxt - 2) * scale,
            width: (tailleEltTxt - 1) * scale,
            padding: scale + 'px ' + scale / 2 + 'px'
        });

        var titre = new BaliseObject(this._divText._balise, 'h1', 'titre_' + this._id);
        var s = titreElement.toUpperCase();
        var size = 840 / s.length;
        if (size > 65) { size = 65; }
        if (size < 37) { size = 37; }
        titre.html(s);
        titre.css('color', couleur);
        titre.css('font-size', size + 'px');
        this._titre = titre;

        var texte = new BaliseObject(this._divText._balise, 'p', 'txt_' + this._id);
        texte.html(json.texte);
        texte._balise.css({
            'max-height': 1.8 * scale,
            'margin-top': 0.5 * scale
        });
        var st = $('<style></style>')
            .html('#txt_' + this._id + "::-webkit-scrollbar-thumb {\
            background: "+ couleur + "; \
          }");
        texte._balise.after(st);
        this._texte = texte;

        this._btnFermer = new DivObject(this._divText._balise, 'btnFermer_' + this._id);
        this._btnFermer.addClass('btnFermerSousMenu');
        this._btnFermer._balise.css({
            bottom: 4.5 * scale,
            height: scale,
            width: scale,
            background: couleur
        });
        this._btnFermer.html('<span>+</span>');
        var ssMenu = this;
        this.btnShouldClose = true; // click on btn while close sous menu
        // if false -> come back to previous menu
        this._btnFermer._balise.click(function () {
            if (ssMenu.btnShouldClose) {
                ssMenu.close();
                ssMenu.signalFermer.dispatch();
            } else {
                $('.sousMenuListePoi').remove();
                $('.divBtnCarteElement').remove();
                ssMenu._btnFermer.html('<span>+</span>');
                ssMenu._divssSousMenu.html("");
                titre.html(s);
                titre.css('font-size', size + 'px');
                texte.html(json.texte);
                ssMenu.btnShouldClose = true;
                ssMenu.reinitializeContent();
                ssMenu.oldPoiJson(ssMenu);
                ssMenu._divSousElements = [];
                ssMenu.updateDivSousElements(json.sousmenu);
                ssMenu.initSousMenuElement();
                ssMenu._jsonPoi = poisJSON[lien];
                sMenu._divText.tweenAnimate({ bottom: 4 * scale + 'px' });
                sMenu._divssSousMenu.tweenAnimate({ bottom: 4 * scale + 'px' });
            }
        });

        /////////////////////////////////////////

        ////////////////////////////////
        // sous elements

        this._divSousElements = [];
        this.updateDivSousElements(json.sousmenu);



        ///////////////////////////////////

        //////////////////////////////////
        // if sous menu

        this._divssSousMenu = new DivObject(this._balise, 'ssSousMenu_' + this._id);
        this._divssSousMenu.addClass('ssSousMenu');
        this._divssSousMenu._balise.css({
            bottom: 4 * scale,
            left: -3 * scale,
            width: 1.5 * scale,
            height: (tailleEltTxt - 0.5) * scale,
            padding: 0.25 * scale,
            background: couleur
        });

    }

    reinitializeContent() {
        this._carte.removeAllOverlays();
        $('.poi').remove();
        $('.pagePerenne').remove();
        this._fichePerenne = null;
    }

    init() {
        this._divText.tweenAnimate({ left: 2 * this._scale });
        this._btnFermer.tweenAnimate({ bottom: 5.5 * this._scale }, 1, 0.3);
        this.initSousMenuElement();
        this._divssSousMenu.tweenAnimate({ left: 0 });
        if (this._json.type == 'carte') {
            this._carte.init();
        }
    }

    initSousMenuElement() {
        this._divSousElements.forEach(element => {
            element.init();
        });
    }

    close() {
        this._btnFermer.tweenAnimate({ bottom: 5.5 * this._scale }, 0, 0.3);
        this._divText.tweenAnimate({ left: -2 * this._scale, opacity: 0 });
        this._divSousElements.forEach(element => {
            element.tweenAnimate({ opacity: 0 });
        });
        this._divssSousMenu.tweenAnimate({ left: - 2 * this._scale });
    }

    displaySSMenuByElement(sMenu, json, num, type) {
        sMenu._btnFermer.html('<span class="noRotation">⤺</span>');
        sMenu.btnShouldClose = false;
        var s = json[num].titre.toUpperCase();
        var size = 840 / s.length;
        if (size > 65) { size = 65; }
        if (size < 37) { size = 37; }
        sMenu._titre.html(s);
        sMenu._titre.css('font-size', size + 'px');

        if (json[num].texte !== undefined) {
            sMenu._texte.html(json[num].texte);
        }

        $('#divLeft').remove();
        var divLeft = new DivObject(sMenu._divssSousMenu._balise, 'divLeft');
        var ssTitre = new BaliseObject(divLeft._balise, 'h1');
        ssTitre.html(sMenu._titreElement.toUpperCase());

        divLeft.append('<hr>');
        for (let i = 0; i < json.length; i++) {
            if (json[i].sousmenu !== undefined) {
                var span = new BaliseObject(divLeft._balise, 'span', 'spanSSMenu_' + i);
                span.html(json[i].titre.toUpperCase());
                if (i == num) { span.addClass('selected'); }
                span._balise.click(function () {
                    sMenu.displaySSMenuByTitle(sMenu, i, json);
                });
                divLeft.append('<hr>');
            }
        }

        var jsonElements = json[num].sousmenu;

        if (type == 'carte') {
            sMenu.updateCarteSousElements(jsonElements);
        } else {
            sMenu.updateDivSousElements(jsonElements);
        }
    }


    displaySSMenuByTitle(sMenu, num, json) {
        var type = json[num].type;
        sMenu._carte.removeAllOverlays();
        $('.selected').removeClass('selected');
        $('#spanSSMenu_' + num).addClass('selected');
        var jsonElements = json[num].sousmenu;
        var s = json[num].titre.toUpperCase();
        var size = 840 / s.length;
        if (size > 65) { size = 65; }
        if (size < 37) { size = 37; }
        sMenu._titre.html(s);
        sMenu._titre.css('font-size', size + 'px');
        if (json[num].texte !== undefined) {
            sMenu._texte.html(json[num].texte);
        }
        if (type == 'carte') {
            sMenu.oldPoiJson(sMenu);
            sMenu.updatePoiJson(sMenu, json[num].lien);
            sMenu.updateCarteSousElements(jsonElements);
        } else {
            sMenu.updateDivSousElements(jsonElements);
        }
    }

    updatePoiJson(sMenu, lien) {
        var json = sMenu._jsonPoi;
        sMenu._jsonPoi = json[lien];
        sMenu._lien.push(lien);
        console.log(sMenu._jsonPoi);
        console.log(sMenu._lien);
    }

    oldPoiJson(sMenu) {
        sMenu._lien.pop();
        var newJsonPoi = poisJSON;
        sMenu._lien.forEach(key => {
            newJsonPoi = newJsonPoi[key];
        });
        sMenu._jsonPoi = newJsonPoi;
        console.log(sMenu._jsonPoi);
    }

    displayPoiOnMap(json) {
        var b;
        switch (json.length) {
            case 1:
                b = 4;
                break;
            case 2:
                b = 4;
                break;
            default:
                b = 1.5 + json.length;
                break;
        }
        if (b > 8) { b = 8; }
        this._divText.tweenAnimate({ bottom: b * this._scale + 'px' });
        this._divssSousMenu.tweenAnimate({ bottom: b * this._scale + 'px' });
        $('#sousMenuListePOI').remove();
        var sMenu = this;
        var smlp = new SousMenuListePoi(this._parent, 'sousMenuListePOI', json, this._scale, this._couleur);
        smlp.clickSignal.add(function (num) {
            console.log(num);
            sMenu._carte.clickOnPoi(sMenu._carte._fiches[num], sMenu._carte);
        });
        this._carte.initPOIsandFiches(json);
        this._carte.init();
    }

    // AFFICHAGE DE SOUS ELEMENTS DE MENU NORMAUX
    // LIENS VERS UNE FICHE PERENNE, UNE CARTE, OU UN AUTRE SOUS MENU
    updateDivSousElements(json) {
        this.divSousElements = json;
        var i = 0;
        var sMenu = this;
        this._divSousElements.forEach(element => {
            var num = i;
            var lien = element._lien;
            var type = element._type;
            element._balise.click(function () {
                console.log('click lien : ' + lien);
                console.log('click type : ' + type);
                switch (type) {
                    case 'perenne':
                        sMenu.reinitializeContent();
                        var fp = new FichePerenne($('#Application'), 'fichePerenne', null, element._params.couleur);
                        fp.clickSignal.add(function(){
                            sMenu.clickPerenne.dispatch();
                        });
                        fp.init();
                        break;

                    case 'carte':
                        sMenu.reinitializeContent();
                        sMenu.updatePoiJson(sMenu, lien);
                        sMenu.displaySSMenuByElement(sMenu, json, num, 'carte');
                        break;

                    case 'poi':
                        sMenu.reinitializeContent();
                        sMenu.updatePoiJson(sMenu, lien);

                        sMenu.displayPoiOnMap(sMenu._jsonPoi);
                        sMenu.oldPoiJson(sMenu); // get back to previous state for next click
                        break;

                    default:
                        if (lien !== undefined)
                            sMenu.updatePoiJson(sMenu, lien);
                        sMenu.displaySSMenuByElement(sMenu, json, num);
                        break;
                }
            });
            i++;
        });
        sMenu.initSousMenuElement();
    }

    // remove old elements and display the new ones
    // buttons are filters for poi overlays
    updateCarteSousElements(json) {
        var sMenu = this;
        sMenu.divSousElements = [];
        var iconEyeClosed = "<svg id='Calque_1' data-name='Calque 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><style>.cls-1{fill:none;stroke: " + sMenu._couleur + ";stroke-linecap:round;stroke-linejoin:round;stroke-width:6.24px;}</style></defs><path class='cls-1' d='M26.54,69.69s20.17,39.6,74,39.6,74-39.6,74-39.6'/><line class='cls-1' x1='100.5' y1='109.29' x2='100.5' y2='129.38'/><line class='cls-1' x1='129.64' y1='106.15' x2='138.62' y2='124.12'/><line class='cls-1' x1='154.02' y1='92.86' x2='166.46' y2='108.63'/><line class='cls-1' x1='45.61' y1='91.91' x2='33.16' y2='107.69'/><line class='cls-1' x1='68.73' y1='106.15' x2='62.37' y2='125.21'/></svg>";
        var iconEyeOpen = "<svg id='Calque_2' data-name='Calque 2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><style>.cls-1{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:9.18px;}.cls-1,.cls-2{stroke:" + sMenu._couleur + ";}.cls-2{fill:" + sMenu._couleur + ";stroke-miterlimit:10;stroke-width:3.19px;}</style></defs><title>Plan de travail 1</title><path class='cls-1' d='M100.66,56.49c-59,0-81.08,43.41-81.08,43.41s22.11,43.4,81.08,43.4,81.08-43.4,81.08-43.4S159.62,56.49,100.66,56.49Z'/><circle class='cls-1' cx='100.66' cy='99.9' r='26.89'/><path class='cls-2' d='M90.72,76.14s-7.41,36.48,33,34.44C123.71,110.58,130.75,64.2,90.72,76.14Z'/></svg>";
        var iconPerenne = "<svg viewBox='-66 0 569 569.286' style='fill: " + sMenu._couleur + "' xmlns='http://www.w3.org/2000/svg'><path d='m.109375 66.382812v493.132813c0 5.238281 4.246094 9.484375 9.484375 9.484375h360.367188c5.234374 0 9.480468-4.246094 9.480468-9.484375v-398.296875c0-.210938-.101562-.390625-.121094-.597656-.046874-.832032-.210937-1.652344-.484374-2.4375-.105469-.304688-.179688-.597656-.3125-.894532-.460938-1.03125-1.101563-1.972656-1.898438-2.777343l-94.832031-94.832031c-.804688-.800782-1.75-1.441407-2.789063-1.898438-.285156-.121094-.574218-.222656-.871094-.3125-.792968-.273438-1.617187-.4375-2.457031-.492188-.160156.027344-.347656-.074218-.546875-.074218h-265.535156c-5.238281 0-9.484375 4.242187-9.484375 9.480468zm346.957031 85.351563h-62.457031v-62.457031zm-327.992187-75.867187h246.570312v85.351562c0 5.234375 4.246094 9.480469 9.480469 9.480469h85.351562v379.335937h-341.402343zm0 0' /><path d='m398.410156 493.132812v18.964844h28.449219c5.238281 0 9.484375-4.242187 9.484375-9.480468v-493.132813c0-5.238281-4.246094-9.484375-9.484375-9.484375h-360.367187c-5.238282 0-9.484376 4.246094-9.484376 9.484375v28.449219h18.96875v-18.96875h341.398438v474.167968zm0 0' /><path d='m75.976562 189.667969h227.597657v18.964843h-227.597657zm0 0' /><path d='m75.976562 132.765625h75.867188v18.96875h-75.867188zm0 0' /><path d='m75.976562 246.566406h151.734376v18.96875h-151.734376zm0 0' /><path d='m246.675781 246.566406h56.898438v18.96875h-56.898438zm0 0' /><path d='m75.976562 303.464844h227.597657v18.96875h-227.597657zm0 0' /><path d='m75.976562 417.265625h227.597657v18.96875h-227.597657zm0 0' /><path d='m161.324219 360.367188h142.25v18.964843h-142.25zm0 0' /><path d='m75.976562 360.367188h66.382813v18.964843h-66.382813zm0 0' /><path d='m75.976562 474.167969h37.933594v18.964843h-37.933594zm0 0' /><path d='m132.875 474.167969h170.699219v18.964843h-170.699219zm0 0' /></svg>";
        $('.divBtnCarteElement').remove();
        var divBtn = new DivObject(sMenu._divText._balise, 'divBtnFiltre_' + sMenu._id);
        divBtn.addClass('divBtnCarteElement');
        var divs = [];
        var allPOIs = [];
        // suppression des anciens elements
        for (let i = 0; i < json.length; i++) {
            var jsonElt = json[i];
            var div = new DivObject(divBtn._balise, i + 'btnsFiltre_' + sMenu._id);
            div.addClass('btnsFiltre');
            div.css('top', Math.trunc(i / 2) * 70 + 'px');
            div.css(i % 2 == 0 ? 'left' : 'right', 0);
            var text = jsonElt.titre;
            var span = new BaliseObject(div._balise, 'span');
            span.html(text.toUpperCase());
            var icone = new DivObject(div._balise, i + 'icone_' + sMenu._id);
            icone.addClass('iconCarteElement');
            switch (jsonElt.type) {
                case 'poi':
                    icone.html(iconEyeOpen);
                    div.isOpen = false;
                    div.jsonPOIs = sMenu._jsonPoi[jsonElt.lien];
                    allPOIs = allPOIs.concat(div.jsonPOIs);
                    div._balise.click(function () {
                        sMenu.reinitializeContent();
                        if (!divs[i].isOpen) {
                            for (let k = 0; k < json.length; k++) {
                                if (k != i){
                                    divs[k].isOpen = false;
                                    $('#' + k + 'icone_' + sMenu._id).html(iconEyeClosed);
                                }
                                else
                                    $('#' + k + 'icone_' + sMenu._id).html(iconEyeOpen);

                            }
                            divs[i].isOpen = true;
                            sMenu._carte.removeAllOverlays();
                            sMenu.displayPoiOnMap(divs[i].jsonPOIs);
                        } else {
                            for (let k = 0; k < json.length; k++) {
                                $('#' + k + 'icone_' + sMenu._id).html(iconEyeOpen);
                                divs[k].isOpen = false;
                            }
                            sMenu._carte.removeAllOverlays();
                            sMenu.displayPoiOnMap(allPOIs);
                        }
                    });
                    break;

                case 'perenne':
                    icone.html(iconPerenne);
                    div._balise.click(function () {
                        sMenu.reinitializeContent();
                        var fp = new FichePerenne($('#Application'), 'fichePerenne', null, sMenu._couleur);
                        fp.clickSignal.add(function(){
                            sMenu.clickPerenne.dispatch();
                        });
                        fp.init();
                    });
                    break;

                default:
                    console.log('Non existant : ' + jsonElt.type);
                    break;
            }
            div.css('color', sMenu._couleur);
            divs.push(div);
        }
        console.log(allPOIs);
        sMenu.displayPoiOnMap(allPOIs);
    }

    set divSousElements(jsonElements) {
        $('.elementSousMenu').remove();
        this._divSousElements = [];
        var emplacements = [
            { x: 9.5, y: 1.5 },
            { x: 7.5, y: 3.5 },
            { x: 9.5, y: 5.5 },
            { x: 7.5, y: 7.5 },
            { x: 9.5, y: 9.5 },
            { x: 6.5, y: 9.5 },
            { x: 4.5, y: 10 },
            { x: 2.5, y: 11 },
            { x: 6, y: 12 },
            { x: 5.5, y: 2 },
            { x: 3.5, y: 1.5 }
        ];
        var taille = 2;
        for (let i = 0; i < jsonElements.length; i++) {
            var jsonElt = jsonElements[i];
            var params = {
                x: emplacements[i].x,
                y: emplacements[i].y,
                taille: taille,
                couleur: this._couleur,
                opacity: (Math.floor(Math.random() * 2) == 0) ? 1 : 0.9
            }
            var eltSsMenu = new ElementSousMenu(this._balise, jsonElt, params, this._scale);
            this._divSousElements.push(eltSsMenu);
        }
    }
}