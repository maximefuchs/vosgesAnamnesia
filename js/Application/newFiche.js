Global.include('dev/js/Application/SliderDiaporama.js');

Global.includeCSS('dev/css/Application/Fiche.css');

class Fiche extends DivObject {
    // constructor(div, poi, id) {
    constructor(poi, id, couleur) {
        super(poi._balise, id);

        this.signaux = {
            fermer: new signals.Signal()
        };

        this._id = id;
        this._poi = poi;
        this._couleur = couleur;
        this._ouvert = false;
        // this._langue = paramsJSON.langueParDefault;

        this.addClass('elementFiche');
        //permet la suppression de toutes les fiches avec $('.elementFiche').remove()

        var divFiche = new DivObject(this._balise, 'divFiche_' + this._id);
        divFiche.addClass("fiche");

        this._divTexte = new DivObject(divFiche._balise, "divtxt_" + this._id);
        this._divTexte.addClass('divTexte');
        this._titre = new BaliseObject(this._divTexte._balise, "h1");
        this._titre.css('color', couleur)
        this._titre.html(poi._title);
        this._sousTitre = new BaliseObject(this._divTexte._balise, "h3");
        this._sousTitre.html(poi._subtitle);
        this._texte = new BaliseObject(this._divTexte._balise, "p");


        var bottom = new DivObject(this._divTexte._balise, "divBottom_" + this._id);
        bottom.addClass('divBottom');
        bottom.html(poi._address.stringify());

        var galerie = [];
        poi._galerie.forEach(element => {
            galerie.push(element.src);
        });

        var subContent = poi._subcontent;
        var txtContent = "";
        subContent.forEach(element => {
            txtContent += "<h3>" + element.title + "</h3>";
            txtContent += element.text;
            element.galerie.forEach(pic => {
                galerie.push(pic.src);
            });
        });

        this._texte.html(poi._text + txtContent);
        var s = $('<style></style>')
            .html(".fiche p::-webkit-scrollbar-thumb {\
        background: "+ couleur + "; \
      }");
        this._texte._balise.after(s);



        this._btFermer = new DivObject(this._divTexte._balise, this._id + "_BtFermer");
        this._btFermer.addClass("ficheBt");
        this._btFermer.addClass("ficheBtFermer");
        this._btFermer.css('background', couleur);
        this._btFermer.append('<div class="ficheBtFermerTexte">+</div>');
        this._btFermer.x = 500 - this._btFermer.width / 2;
        this._btFermer.y = - this._btFermer.height / 2;
        // fermeture de l'élément gérer dans utilsOpenseadragon.js -> removeOverlay()

        var divSlider = new DivObject(divFiche._balise, 'divSlider_' + this._id);
        divSlider.addClass('divSlider');
        new SliderDiaporama(divSlider._balise, 'slider_' + this._id, galerie, couleur, 500, 3, 0.5);

        this._overlay = ficheToOverlay(this);
        this._balise.toggle();

    }


    maj_texte() {
        this._titre.html(Global.getTexteLangue(this._poi._titre, this._langue));
        this._sousTitre.html(Global.getTexteLangue(this._poi._soustitre, this._langue));
        this._texte.html(Global.getTexteLangue(this._poi._texte, this._langue));
    }

    get fermerSignal() {
        return this.signaux.fermer;
    }
}