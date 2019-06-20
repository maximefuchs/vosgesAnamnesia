Global.include('dev/js/Application/ElementSousMenu.js');

Global.includeCSS('dev/css/Application/SousMenu.css');

class SousMenu extends DivObject {
    constructor(parent, json, titreElement, couleur, scale) {
        super(parent, 'sousmenu');
        this.addClass('sousmenu');

        this._json = json;
        this._scale = scale;
        this._couleur = couleur;


        this.css('bottom', 1 * scale);

        var tailleEltTxt = 5;

        /////////////////////////////////
        // element avec titre et texte

        this._divText = new DivObject(this._balise, "divText_" + this._id);
        this._divText.addClass('text_sousmenu');
        this._divText._balise.css({
            bottom: (tailleEltTxt - 1) * scale,
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
            height: 1.5 * scale,
            'margin-top': 0.5 * scale
        });
        var s = $('<style></style>')
            .html('#txt_' + this._id + "::-webkit-scrollbar-thumb {\
            background: "+ couleur + "; \
          }");
        texte._balise.after(s);

        this._enSavoirPlus = new DivObject(this._divText._balise, 'enSavoirPlus_' + this._id);
        this._enSavoirPlus.addClass('enSavoirPlus');
        this._enSavoirPlus.css('margin-top', scale / 2 + 'px')
        this._enSavoirPlus.html("En savoir plus →");

        this._btnFermer = new DivObject(this._divText._balise, 'btnFermer_' + this._id);
        this._btnFermer.addClass('btnFermerSousMenu');
        this._btnFermer._balise.css({
            bottom: 4 * scale,
            height: scale,
            width: scale,
            background: couleur
        });
        this._btnFermer.html('<span>+</span>');

        /////////////////////////////////////////

        this._ssSousMenu = (json.sousmenu != undefined);
        var jsonElements = this._ssSousMenu ? json.sousmenu[0].elements : json.elements;

        ////////////////////////////////
        // sous elements

        this._divSousElements = [];
        var nbParDoubleCol = 5, taille = 2, doubleCol = 0, nbLignes = 0;
        var compteurColonne = 0, decalageY = 0;
        for (let i = 0; i < jsonElements.length; i++) {
            var jsonElt = jsonElements[i];
            var params = {
                x: tailleEltTxt + (doubleCol * taille * 2) + (i % 2) * taille,
                y: 2 + (i % 2) * taille + (nbLignes * 2) * taille - decalageY,
                taille: taille,
                couleur: couleur,
                opacity: (Math.floor(Math.random() * 2) == 0) ? 1 : 0.9
            }
            var eltSsMenu = new ElementSousMenu(this._balise, jsonElt, params, scale);
            this._divSousElements.push(eltSsMenu);

            if (i % 2 == 1) {
                nbLignes++;
            }
            compteurColonne++;
            if (compteurColonne == nbParDoubleCol) {
                compteurColonne = 0; decalageY = 0; doubleCol++; nbLignes = 0;
            } else {
                decalageY = Math.floor(Math.random() * 2);
            }
        }

        ///////////////////////////////////

        //////////////////////////////////
        // if sous menu

        this._divssSousMenu;
        if (this._ssSousMenu) {
            var s = json.sousmenu[0].titre.toUpperCase();
            var size = 840 / s.length;
        if (size > 65) { size = 65; }
            this._titre.html(s);
            this._titre.css('font-size', size + 'px');

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
            var ssTitre = new BaliseObject(this._divssSousMenu._balise, 'h1');
            ssTitre.html(titreElement.toUpperCase());

            this._divssSousMenu.append('<hr>');
            for (let i = 0; i < json.sousmenu.length; i++) {
                var span = new BaliseObject(this._divssSousMenu._balise, 'span', 'spanSSMenu_' + i);
                span.html(json.sousmenu[i].titre.toUpperCase());
                if (i == 0) { span.addClass('selected'); }
                this._divssSousMenu.append('<hr>');
            }
        }
    }

    init() {
        this._divText.tweenAnimate({ left: this._ssSousMenu ? 2 * this._scale : 0 });
        this._btnFermer.tweenAnimate({ bottom: 5 * this._scale }, 1, 0.3);
        this._divSousElements.forEach(element => {
            var decalage = this._ssSousMenu ? 2 * this._scale : 0;
            element.init(decalage);
        });
        if (this._ssSousMenu)
            this._divssSousMenu.tweenAnimate({ left: 0 });
    }
}