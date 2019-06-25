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

        var lorem = "Ut aute enim tempor veniam anim excepteur enim magna. Minim occaecat dolore Lorem quis. Do et sunt duis veniam nisi sit. Pariatur officia labore mollit sit duis excepteur cillum voluptate magna quis sit. Laborum nisi exercitation amet reprehenderit pariatur officia exercitation.";
        var t = 'titre titre titre';
        var st = 'soustitre soustitre'

        this._divTexte = new DivObject(divFiche._balise, "divtxt_" + this._id);
        this._divTexte.addClass('divTexte');
        this._titre = new BaliseObject(this._divTexte._balise, "h1");
        this._titre.css('color', couleur)
        // this._titre.html(t);
        this._titre.html(poi._titre);
        this._sousTitre = new BaliseObject(this._divTexte._balise, "h3");
        // this._sousTitre.html(st);
        this._sousTitre.html(poi._soustitre);
        this._texte = new BaliseObject(this._divTexte._balise, "p");
        // this._texte.html(lorem);
        this._texte.html(poi._texte);
        var s = $('<style></style>')
            .html(".fiche p::-webkit-scrollbar-thumb {\
            background: "+ couleur + "; \
          }");
        this._texte._balise.after(s);

        var bottom = new DivObject(this._divTexte._balise, "divBottom_" + this._id);
        bottom.addClass('divBottom');
        var ti = new BaliseObject(bottom._balise, 'h4');
        ti.html(poi._titre);
        if (poi._adresse != "") { bottom.append(poi._adresse + '<br>') };
        if (poi._tel != "") { bottom.append(poi._tel + '<br>') };
        if (poi._mail != "") { bottom.append(poi._mail + '<br>') };
        if (poi._site != "") { bottom.append(poi._site + '<br>') };






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
        new SliderDiaporama(divSlider._balise, 'slider_' + this._id, poi._images, couleur, 500, 3, 0.5);

        this._overlay = ficheToOverlay(this);
        this._balise.toggle();

    }


    maj_texte() {
        this._titre.html(Global.getTexteLangue(this._poi._titre, this._langue));
        this._sousTitre.html(Global.getTexteLangue(this._poi._soustitre, this._langue));
        this._texte.html(Global.getTexteLangue(this._poi._texte, this._langue));
    }

    // positionement() {
    //     TweenLite.to(this._balise, 0, { x: this.testX(), y: this.testY() });
    //     if (this._y < StageHeight / 2) {
    //         this.attr("rotate", 180);
    //         TweenLite.to(this._balise, 0, { rotation: 180 });
    //     } else {
    //         this.attr("rotate", 0);
    //         TweenLite.to(this._balise, 0, { rotation: 0 });
    //     }
    //     this.attr("data-x", this.testX());
    //     this.attr("data-y", this.testY());
    // }

    get fermerSignal() {
        return this.signaux.fermer;
    }
}