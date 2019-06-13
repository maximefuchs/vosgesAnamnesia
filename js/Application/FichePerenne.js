Global.includeCSS('dev/css/Application/FichePerenne.css');

class FichePerenne extends DivObject {
    constructor(parent, id, json){
        super(parent, id);
        this.addClass('pagePerenne');

        this._id = id;
        this._json = json;

        this.signaux = {
            finFermer: new signals.Signal()
        }

        // var imageGauche = new Img(this._balise, 'imageGauche_' + this._id, this._json....);
        var imageGauche = new Img(this._balise, 'imageGauche_' + this._id, "datas/imgs/perenne/test/gauche.jpg");
        imageGauche.addClass('flexElement');

        var divDroit = new DivObject(this._balise, 'divDroit_' + this._id);
        divDroit.addClass('flexElement');
        divDroit.addClass('divDroit');

        var titre = new BaliseObject(divDroit._balise, 'h1');
        titre.html('How she longed to get out of that dark hall');
        
        var texte = new BaliseObject(divDroit._balise, 'p');
        texte.html('Duis in nulla labore adipisicing dolore officia commodo sunt aute. Velit velit exercitation adipisicing cillum excepteur tempor mollit nisi. Consectetur eu qui sint elit consequat esse fugiat aliqua commodo est id quis.')

        var fiche = this;
        var backButton = new DivObject(parent, "backButton");
        var img = new Img(backButton._balise, 'bachButton_img', "datas/imgs/interface/boutons_carte/home.png");
        img.attr('width', 60); img.attr('height', 60); img.css('margin-top', '15px');
        backButton._balise.click(function () {
            backButton._balise.remove();
            fiche.fermerFiche("menu");
        });

        this.css('opacity', 0);
    }

    init(){
        TweenLite.to(this._balise, 1, { opacity: 1});
    }

    fermerFiche(element){
        TweenLite.to(this._balise, 1, { opacity: 0, onComplete: this.supprimerFiche, onCompleteParams: [this] });
        this.finFermerSignal.dispatch(element);
    }

    supprimerFiche(fiche) {
        fiche._balise.remove();
    }


     // GETTERS
     get finFermerSignal() {
        return this.signaux.finFermer;
    }
}