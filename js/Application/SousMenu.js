Global.include('dev/js/Application/ElementSousMenu.js');

Global.includeCSS('dev/css/Application/SousMenu.css');

class SousMenu extends DivObject {
    constructor(parent, json, titreElement, couleur, scale, lien) {
        super(parent, 'sousmenu');
        this.addClass('sousmenu');

        this._json = json;
        this._scale = scale;
        this._couleur = couleur;
        this._titreElement = titreElement;
        this._lien = lien;
        this._jsonPoi = poisJSON[lien];

        console.log(poisJSON);
        console.log(lien);
        console.log(this._jsonPoi);

        this._carte = new Carte(
            $('#Application'),
            textesJSON.Application.Carte,
            couleur);

        this.signalFermer = new signals.Signal();


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
            height: 1.8 * scale,
            'margin-top': 0.5 * scale
        });
        var s = $('<style></style>')
            .html('#txt_' + this._id + "::-webkit-scrollbar-thumb {\
            background: "+ couleur + "; \
          }");
        texte._balise.after(s);
        this._texte = texte;

        this._enSavoirPlus = new DivObject(this._divText._balise, 'enSavoirPlus_' + this._id);
        this._enSavoirPlus.addClass('enSavoirPlus');
        this._enSavoirPlus.css('margin-top', scale / 2 + 'px')
        this._enSavoirPlus.html("En savoir plus →");

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
        this._btnFermer._balise.click(function () {
            ssMenu.close();
            ssMenu.signalFermer.dispatch();
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

    displaySSMenuByElement(sMenu, num) {
        // var sMenu = e.data.param;
        // var num = e.data.num;
        var s = sMenu._json.sousmenu[num].titre.toUpperCase();
        var size = 840 / s.length;
        if (size > 65) { size = 65; }
        if (size < 37) { size = 37; }
        sMenu._titre.html(s);
        sMenu._titre.css('font-size', size + 'px');

        if (sMenu._json.sousmenu[num].texte !== undefined) {
            sMenu._texte.html(sMenu._json.sousmenu[num].texte);
        }

        $('#divLeft').remove();
        var divLeft = new DivObject(sMenu._divssSousMenu._balise, 'divLeft');
        var ssTitre = new BaliseObject(divLeft._balise, 'h1');
        ssTitre.html(sMenu._titreElement.toUpperCase());

        divLeft.append('<hr>');
        for (let i = 0; i < sMenu._json.sousmenu.length; i++) {
            if (sMenu._json.sousmenu[i].sousmenu !== undefined) {
                var span = new BaliseObject(divLeft._balise, 'span', 'spanSSMenu_' + i);
                span.html(sMenu._json.sousmenu[i].titre.toUpperCase());
                if (i == num) { span.addClass('selected'); }
                span._balise.click({ param: sMenu, num: i }, sMenu.displaySSMenuByTitle);
                divLeft.append('<hr>');
            }
        }

        var jsonElements = sMenu._json.sousmenu[num].sousmenu;
        sMenu.updateDivSousElements(jsonElements);
        sMenu.initSousMenuElement();
    }

    displaySSMenuByTitle(e) {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        var sMenu = e.data.param;
        var num = e.data.num;
        var jsonElements = sMenu._json.sousmenu[num].sousmenu;
        var s = sMenu._json.sousmenu[num].titre.toUpperCase();
        var size = 840 / s.length;
        if (size > 65) { size = 65; }
        if (size < 37) { size = 37; }
        sMenu._titre.html(s);
        sMenu._titre.css('font-size', size + 'px');
        if (sMenu._json.sousmenu[num].texte !== undefined) {
            sMenu._texte.html(sMenu._json.sousmenu[num].texte);
        }
        sMenu.updateDivSousElements(jsonElements);
        sMenu.initSousMenuElement();
    }

    updatePoiJson(sMenu, json) {
        sMenu._jsonPoi = json;
        console.log(sMenu._jsonPoi);
    }


    updateDivSousElements(json) {
        this.divSousElements = json;
        var i = 0;
        var sMenu = this;
        this._divSousElements.forEach(element => {
            var num = i;
            var lien = element._lien;
            var type = element._type;
            var jsonPoi = sMenu._jsonPoi;
            element._balise.click(function () {
                console.log('click lien : ' + lien);
                console.log('click type : ' + type);
                switch (type) {
                    case 'perenne':
                        $('.pagePerenne').remove();
                        var fp = new FichePerenne($('#Application'), 'fichePerenne', null, element._params.couleur);
                        fp.init();
                        break;

                    case 'carte':
                        console.log('carte');
                        sMenu.updatePoiJson(sMenu, jsonPoi[lien]);
                        sMenu.displaySSMenuByElement(sMenu, num);

                        sMenu._carte.init();

                        break;

                    case 'poi':
                        console.log('poi');
                        sMenu.updatePoiJson(sMenu, jsonPoi[lien]);

                        sMenu._carte.initPOIsandFiches(sMenu._jsonPoi);
                        sMenu._carte.init();

                        break;

                    default:
                        sMenu.updatePoiJson(sMenu, jsonPoi[lien]);
                        console.log(sMenu._jsonPoi);
                        sMenu.displaySSMenuByElement(sMenu, num);
                        break;
                }
            });
            i++;
        });
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