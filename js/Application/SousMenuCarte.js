Global.include('dev/js/Application/ElementSousMenu.js');

// Global.includeCSS('dev/css/Application/SousMenu.css');
// Global.includeCSS('dev/css/Application/SousMenuCarte.css');

class SousMenuCarte extends DivObject {
    constructor(parent, json, titreElement, couleur, scale, lien) {
        super(parent, 'sousmenuCarte');
        this.addClass('sousmenu');

        this._json = json;
        this._scale = scale;
        this._couleur = couleur;
        this._titreElement = titreElement;

        this._carte = new Carte(
            $('#Application'),
            textesJSON.Application.Carte,
            poisJSON,
            lien,
            couleur);


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

        /////////////////////////////////////////

        this._ssSousMenu = (json.sousmenu !== undefined);
        var jsonElements = this._ssSousMenu ? json.sousmenu : json.elements;

        ////////////////////////////////
        // sous elements

        this._divSousElements = [];
        this.divSousElements = jsonElements;
        if (this._ssSousMenu) {
            var i = 0;
            this._divSousElements.forEach(element => {
                element._balise.click({ param: this, num: i }, this.displaySSMenuByElement);
                i++;
            });
        } else {
            var i = 0;
            this._divSousElements.forEach(element => {
                element._balise.click(function () {
                    console.log('lien : ' + element._lien);
                    if (element._lien == 'perenne') {
                        $('.pagePerenne').remove();
                        var fp = new FichePerenne($('#Application'), 'fichePerenne', null, element._params.couleur);
                        fp.init();
                    }
                });
                i++;
            });
        }

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
        this._divSousElements.forEach(element => {
            element.init();
        });
        this._divssSousMenu.tweenAnimate({ left: 0 });
        this._carte.init();
    }

    displaySSMenuByElement(e) {
        var sMenu = e.data.param;
        var num = e.data.num;
        var s = sMenu._json.sousmenu[num].titre.toUpperCase();
        var size = 840 / s.length;
        if (size > 65) { size = 65; }
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
            var span = new BaliseObject(divLeft._balise, 'span', 'spanSSMenu_' + i);
            span.html(sMenu._json.sousmenu[i].titre.toUpperCase());
            if (i == num) { span.addClass('selected'); }
            span._balise.click({ param: sMenu, num: i }, sMenu.displaySSMenuByTitle);
            divLeft.append('<hr>');
        }

        var jsonElements = sMenu._json.sousmenu[num].elements;
        sMenu.divSousElements = jsonElements;
        sMenu._divSousElements.forEach(element => {
            element.init();
            element._balise.click(function () {
                console.log('lien : ' + element._lien);
                if (element._lien == 'perenne') {
                    $('.pagePerenne').remove();
                    var fp = new FichePerenne($('#Application'), 'fichePerenne', null, element._params.couleur);
                    fp.init();
                }
                // if carte -> nouvelle classe sousMenu carte
            });
        });
    }

    displaySSMenuByTitle(e) {
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        var sMenu = e.data.param;
        var num = e.data.num;
        var jsonElements = sMenu._json.sousmenu[num].elements;
        var s = sMenu._json.sousmenu[num].titre.toUpperCase();
        var size = 840 / s.length;
        if (size > 65) { size = 65; }
        sMenu._titre.html(s);
        sMenu._titre.css('font-size', size + 'px');
        if (sMenu._json.sousmenu[num].texte !== undefined) {
            sMenu._texte.html(sMenu._json.sousmenu[num].texte);
        }
        sMenu.divSousElements = jsonElements;
        sMenu._divSousElements.forEach(element => {
            element.init();
            element._balise.click(function () {
                console.log('lien : ' + element._lien);
                if (element._lien == 'perenne') {
                    console.log('click perenne : ' + element._id);
                    $('.pagePerenne').remove();
                    var fp = new FichePerenne($('#Application'), 'fichePerenne', null, element._params.couleur);
                    fp.init();
                }
            });
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
            { x: 6, y: 12 }];
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