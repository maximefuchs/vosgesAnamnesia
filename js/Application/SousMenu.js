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
        this._jsonPerenne = perennesJSON[lien];

        console.log(poisJSON);
        console.log(lien);
        console.log(this._jsonPoi);
        console.log(this._jsonPerenne);

        this._carte = new Carte(
            $('#Application'),
            textesJSON.Application.Carte,
            couleur);

        this.signalFermer = new signals.Signal();
        this.closeCarteSignal = new signals.Signal();
        this.stopBackSignal = new signals.Signal();
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
        titre.css('margin-top', '-20px');
        this._titre = titre;

        var texte = new BaliseObject(this._divText._balise, 'p', 'txt_' + this._id);
        texte.html(json.texte);
        texte._balise.css({
            'max-height': 1.8 * scale,
            'margin-top': 0.3 * scale
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
            $('#filterBackground').css('display', '');
            $('#overlayPerenne').css('display', 'none');
            if (ssMenu.btnShouldClose) {
                ssMenu.close();
                ssMenu.signalFermer.dispatch();
            } else {
                $('#jeu').remove();
                $('.sousMenuListePoi').remove();
                $('.divBtnCarteElement').remove();
                ssMenu._btnFermer.html('<span>+</span>');
                ssMenu._divssSousMenu.html("");
                titre.html(s);
                titre.css('font-size', size + 'px');
                texte.html(json.texte);
                ssMenu.btnShouldClose = true;
                ssMenu.reinitializeContent();
                ssMenu.oldLienJson(ssMenu);
                ssMenu._sousMenuElements = [];
                ssMenu.affichageMenuElements(json.sousmenu);
                ssMenu.initSousMenuElement();
                ssMenu._lien = [lien];
                ssMenu._jsonPoi = poisJSON[lien];
                ssMenu._jsonPerenne = perennesJSON[lien];
                ssMenu._divText.tweenAnimate({ bottom: 4 * scale + 'px' });
                ssMenu._divssSousMenu.tweenAnimate({ bottom: 4 * scale + 'px' });
            }
        });

        /////////////////////////////////////////

        ////////////////////////////////
        // sous elements

        this._sousMenuElements = [];
        this.affichageMenuElements(json.sousmenu);



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


        this._inSousMenu = false; // pour savoir s'il faudra retirer ou non un étage dans _lien lorsque que l'on clique sur un élément 'carte' dans le menu de gauche

    }

    reinitializeContent() {
        this._carte.removeAllOverlays();
        $('.poi').remove();
        $('.pagePerenne').remove();
        this._fichePerenne = null;
    }

    init() {
        this._divText.tweenAnimate({ left: 2 * this._scale }, 0, 0.6);
        this._btnFermer.tweenAnimate({ bottom: 5.5 * this._scale }, 0.6, 0.3);
        this.initSousMenuElement();
        this._divssSousMenu.tweenAnimate({ left: 0 });
        if (this._lien[0] == 'coeur') {
            this._carte.init();
            this.displayPoiOnMap(favPOIS);
        }
    }

    initSousMenuElement() {
        this._sousMenuElements.forEach(element => {
            element.init();
        });
    }

    close() {
        $('#filterBackground').css('display', '');
        $('#elementsDeco').css('display', '');
        this._btnFermer.tweenAnimate({ bottom: 5.5 * this._scale }, 0, 0.3);
        this._divText.tweenAnimate({ left: -2 * this._scale, opacity: 0 });
        this._sousMenuElements.forEach(element => {
            element.tweenAnimate({ opacity: 0 });
        });
        this._divssSousMenu.tweenAnimate({ left: - 2 * this._scale });
    }

    affichageMenuGauche(sMenu, json, num, type, couleur) {
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
        for (var i = 0; i < json.length; i++) {
            var span = new BaliseObject(divLeft._balise, 'span', 'spanSSMenu_' + i);
            span.html(json[i].titre.toUpperCase());
            span.attr('num', i);
            if (i == num) { span.addClass('selected'); }
            span._balise.click(function () {
                sMenu.clickMenuGauche(sMenu, $(this).attr('num'), json, couleur);
            });
            divLeft.append('<hr>');
        }

        if (type != 'jeu' && type != 'poi') {
            var jsonElements = json[num].sousmenu;
            console.log(jsonElements);

            if (type == 'carte') {
                $('#filterBackground').css('display', 'none');
                sMenu.sousElementsPOI(jsonElements);
            } else {
                sMenu.affichageMenuElements(jsonElements);
            }
        }
    }

    clickMenuGauche(sMenu, num, json, couleur) {
        var type = json[num].type;
        var lien = json[num].lien;
        sMenu._carte.removeAllOverlays();
        $('.selected').removeClass('selected');
        $('#spanSSMenu_' + num).addClass('selected');
        var s = json[num].titre.toUpperCase();
        var size = 840 / s.length;
        if (size > 65) { size = 65; }
        if (size < 37) { size = 37; }
        sMenu._titre.html(s);
        sMenu._titre.css('font-size', size + 'px');
        if (json[num].texte !== undefined) {
            sMenu._texte.html(json[num].texte);
        }

        switch (type) {
            case 'perenne':
                sMenu.reinitializeContent();
                $('.divBtnCarteElement').remove();
                $('.sousMenuListePoi').remove();
                $('#overlayPerenne').css('display', '');
                sMenu._divText.tweenAnimate({ bottom: 4 * sMenu._scale + 'px' });
                sMenu._divssSousMenu.tweenAnimate({ bottom: 4 * sMenu._scale + 'px' });

                if (sMenu._inSousMenu) {
                    sMenu.oldLienJson(sMenu);
                    sMenu._inSousMenu = false;
                }

                $('.elementSousMenu').remove();

                var fp = new FichePerenne($('#Application'), 'fichePerenne', sMenu.getJsonPerenne(sMenu, lien), couleur);
                fp.clickSignal.add(function () {
                    sMenu.clickPerenne.dispatch();
                });
                fp.init();
                break;

            case 'poi':
                sMenu.reinitializeContent();
                $('.elementSousMenu').remove();
                $('.divBtnCarteElement').remove();
                $('#overlayPerenne').css('display', 'none');

                if (sMenu._inSousMenu) {
                    sMenu.oldLienJson(sMenu);
                    sMenu._inSousMenu = false;
                }

                sMenu.displayPoiOnMap(lien == "communes" ? json[0].points : sMenu.getJsonPoi(sMenu, lien));
                // sMenu.displayPoiOnMap(sMenu.getJsonPoi(sMenu, lien));
                sMenu.affichageMenuGauche(sMenu, json, num, type, couleur);
                break;

            case 'carte':
                sMenu.reinitializeContent();
                $('#filterBackground').css('display', 'none');
                $('.elementSousMenu').remove();
                $('#overlayPerenne').css('display', 'none');
                var jsonElements = json[num].sousmenu;
                if (sMenu._inSousMenu)
                    sMenu.oldLienJson(sMenu);
                else
                    sMenu._inSousMenu = true;
                sMenu._lien.push(lien);
                sMenu.sousElementsPOI(jsonElements);
                break;

            case 'jeu':
                var jeu = new Jeu($('#Application'), lien, couleur, sMenu._scale);
                jeu.clickSignal.add(function () {
                    sMenu.clickPerenne.dispatch(); // remet le compteur pour la veille à 0
                });
                jeu.init();
                sMenu.affichageMenuGauche(sMenu, json, num, type, couleur);
                break;

            default:
                if (sMenu._inSousMenu) {
                    sMenu.oldLienJson(sMenu);
                }
                if (lien !== undefined)
                    sMenu._lien.push(lien);
                $('.sousMenuListePoi').remove();
                $('.divBtnCarteElement').remove();
                sMenu._divText.tweenAnimate({ bottom: 4 * sMenu._scale + 'px' });
                sMenu._divssSousMenu.tweenAnimate({ bottom: 4 * sMenu._scale + 'px' });
                sMenu._inSousMenu = true;
                var jsonElements = json[num].sousmenu;
                sMenu.affichageMenuElements(jsonElements);
                break;
        }
    }


    getJsonPoi(sMenu, lien) {
        console.log(sMenu._lien);
        console.log(lien);
        var json = poisJSON;
        sMenu._lien.forEach(element => {
            if (json !== undefined && json[element] !== undefined)
                json = json[element];
        });
        return json[lien];
    }
    getJsonPerenne(sMenu, lien) {
        console.log(sMenu._lien);
        console.log(lien);
        var json = perennesJSON;
        sMenu._lien.forEach(element => {
            if (json !== undefined && json[element] !== undefined)
                json = json[element];
        });
        return json[lien];
    }

    oldLienJson(sMenu) {
        sMenu._lien.pop();
        var newJsonPoi = poisJSON;
        var newJsonPerenne = perennesJSON;
        sMenu._lien.forEach(key => {
            newJsonPoi = newJsonPoi[key];
            newJsonPerenne = newJsonPerenne[key];
        });
        sMenu._jsonPoi = newJsonPoi;
        sMenu._jsonPerenne = newJsonPerenne;
    }

    displayPoiOnMap(json) {
        $('#filterBackground').css('display', 'none');
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
        var smlp = new SousMenuListePoi(sMenu._parent, 'sousMenuListePOI', json, sMenu._scale, sMenu._couleur);
        smlp.clickSignal.add(function (num) {
            console.log(num);
            sMenu._carte.clickOnPoi(sMenu._carte._fiches[num], sMenu._carte);
        });
        setTimeout(function () {
            sMenu._carte.initPOIsandFiches(json);
            sMenu._carte.init();
        }, 1000);
    }

    // AFFICHAGE DE SOUS ELEMENTS DE MENU NORMAUX
    // LIENS VERS UNE FICHE PERENNE, UNE CARTE, OU UN AUTRE SOUS MENU
    affichageMenuElements(json) {
        this.sousMenuElements = json;
        var i = 0;
        var sMenu = this;
        this._sousMenuElements.forEach(element => {
            var num = i;
            var lien = element._lien;
            var type = element._type;
            element._balise.click(function () {
                console.log('click lien : ' + lien);
                console.log('click type : ' + type);
                switch (type) {
                    case 'perenne':
                        sMenu.reinitializeContent();
                        $('#overlayPerenne').css('display', '');
                        var fp = new FichePerenne($('#Application'), 'fichePerenne', sMenu.getJsonPerenne(sMenu, lien), element._params.couleur);
                        fp.clickSignal.add(function () {
                            sMenu.clickPerenne.dispatch();
                        });
                        fp.init();
                        break;

                    case 'carte':
                        $('#overlayPerenne').css('display', 'none');
                        sMenu.reinitializeContent();
                        $('.elementSousMenu').remove();

                        sMenu._inSousMenu = true;
                        sMenu._lien.push(lien);
                        sMenu.affichageMenuGauche(sMenu, json, num, type, element._params.couleur);
                        break;

                    case 'poi':
                        $('#overlayPerenne').css('display', 'none');
                        sMenu.reinitializeContent();
                        $('.elementSousMenu').remove();

                        sMenu.displayPoiOnMap(lien == "communes" ? json[0].points : sMenu.getJsonPoi(sMenu, lien));
                        // sMenu.displayPoiOnMap(sMenu.getJsonPoi(sMenu, lien));
                        sMenu.affichageMenuGauche(sMenu, json, num, type, element._params.couleur);
                        break;

                    case 'jeu':
                        var jeu = new Jeu($('#Application'), lien, element._params.couleur, sMenu._scale);
                        jeu.clickSignal.add(function () {
                            sMenu.clickPerenne.dispatch(); // remet le compteur pour la veille à 0
                        });
                        jeu.init();
                        sMenu.affichageMenuGauche(sMenu, json, num, type, element._params.couleur);
                        break;

                    default:
                        if (lien !== undefined)
                            sMenu._lien.push(lien);
                        sMenu._inSousMenu = true;
                        sMenu.affichageMenuGauche(sMenu, json, num, type, element._params.couleur);
                        break;
                }
            });
            i++;
        });
        sMenu.initSousMenuElement();
    }

    // remove old elements and display the new ones
    // buttons are filters for poi overlays
    sousElementsPOI(json) {
        var sMenu = this;
        sMenu.sousMenuElements = [];
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
            var sw = new DivObject(div._balise, i + 'sw_' + sMenu._id);
            sw.addClass('iconCarteElement');
            var label = new BaliseObject(sw._balise, 'label', i + 'labelSwitch' + sMenu._id);
            label.addClass('switch');
            label.attr('for', i + 'cbSwitch_' + sMenu._id);
            label._balise.after('<input type="checkbox" id="' + i + 'cbSwitch_' + sMenu._id + '" checked><span class="sliderSwitch"></span>');
            div.isOpen = true;
            div.jsonPOIs = sMenu.getJsonPoi(sMenu, jsonElt.lien);
            allPOIs = allPOIs.concat(div.jsonPOIs);
            $('#' + i + 'labelSwitch' + sMenu._id).click(function () {
                sMenu.reinitializeContent();
                sMenu._carte.removeAllOverlays();
                divs[i].isOpen = !divs[i].isOpen;
                var toDisp = [];
                divs.forEach(d => {
                    if (d.isOpen) {
                        toDisp = toDisp.concat(d.jsonPOIs);
                        console.log(d.jsonPOIs);
                    }
                });
                sMenu.displayPoiOnMap(toDisp);
            });
            div.css('color', sMenu._couleur);
            divs.push(div);

        }
        var style = new BaliseObject(divBtn._balise, 'style');
        style.html('input:checked + .sliderSwitch:before {\
            background-color: '+ sMenu._couleur + ';\
          }');
        sMenu.displayPoiOnMap(allPOIs);
    }

    set sousMenuElements(jsonElements) {
        $('.elementSousMenu').remove();
        this._sousMenuElements = [];
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
                num: i,
                opacity: (Math.floor(Math.random() * 2) == 0) ? 1 : 0.9
            }
            var eltSsMenu = new ElementSousMenu(this._balise, jsonElt, params, this._scale);
            this._sousMenuElements.push(eltSsMenu);
        }
    }
}