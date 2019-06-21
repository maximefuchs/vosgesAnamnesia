Global.includeCSS('dev/css/Application/FichePerenne.css');

class FichePerenne extends DivObject {
    constructor(parent, id, json, couleur) {
        super(parent, id);
        this.addClass('pagePerenne');

        this._id = id;
        this._json = json;
        this._couleur = couleur;

        var loremShort = 'Ut dolor ea irure laboris est do. Enim labore non aute duis exercitation voluptate consectetur eu sint non occaecat adipisicing.';
        var lorem = 'Est laborum mollit ea excepteur ullamco sunt sint commodo exercitation esse consequat elit. Duis elit minim mollit et deserunt culpa laboris minim cillum et in sint incididunt. Magna consequat incididunt officia deserunt. Velit voluptate proident ex ad ut sunt anim aliqua Lorem aliqua proident nisi. Mollit et incididunt mollit exercitation mollit qui excepteur non. Ad laborum anim tempor sint. Adipisicing proident ea officia anim ut minim minim culpa.';
        var loremLong = 'Irure ea Lorem ad sint ex laboris laborum commodo sint incididunt. Magna non in excepteur nulla eu pariatur duis qui sit. Do irure ex adipisicing quis Lorem magna.Est excepteur sit sint aute ea commodo irure esse cupidatat ipsum. Quis culpa qui cillum aute veniam cillum elit ipsum nulla deserunt labore nulla nulla. Ad et Lorem irure veniam tempor. Anim aute amet nisi minim et nostrud. Lorem velit eiusmod aliqua non amet aliquip ex proident in velit cillum nostrud. Enim id adipisicing ullamco sit tempor velit.Excepteur voluptate commodo dolor exercitation excepteur quis quis. Non cillum laboris nostrud pariatur laboris. Duis esse eu velit nisi aute eu aliquip ipsum ex ex et. Tempor elit nulla magna qui. Tempor commodo voluptate et laborum sint aliqua dolore. Eu commodo aliquip aliqua ex adipisicing velit magna. Esse consectetur occaecat ipsum deserunt tempor non elit et.'
        var loremTitre = 'Irure ea Lorem ad sint ex laboris laborum';

        this.signaux = {
            finFermer: new signals.Signal()
        }

        var divTop = new DivObject(this._balise, 'divTop_' + this._id);
        divTop.addClass('divTop');
        var imageTop = new Img(divTop._balise, 'imageTop_' + this._id, "datas/imgs/perenne/test/top.jpg");
        imageTop.addClass('topImage');

        var titre = new BaliseObject(divTop._balise, 'h1');
        titre.addClass('topTitre');
        titre.css('color', couleur);
        titre.html(loremTitre.toUpperCase());

        var divContain = new DivObject(this._balise, 'divContain_' + this._id);
        divContain.addClass('divContain');

        var divLeft = new DivObject(divContain._balise, 'divLeft_' + this._id);
        divLeft.addClass('flex');
        // divLeft.html(lorem);

        var divRight = new DivObject(divContain._balise, 'divRight' + this._id);
        divRight.addClass('flex');
        // divRight.html(loremLong);

        var introLeft = new BaliseObject(divLeft._balise, 'b', 'introLeft_' + this._id);
        introLeft.html(loremShort);

        var titreLeft = new BaliseObject(divLeft._balise, 'h2', 'titreLeft_' + this._id);
        titreLeft.css('color', couleur);
        titreLeft.html(loremTitre);

        var paraLeft = new BaliseObject(divLeft._balise, 'p', 'paraLeft_' + this._id);
        paraLeft.html(lorem);

        this.css('opacity', 0);
    }

    init() {
        TweenLite.to(this._balise, 1, { opacity: 1 });
    }

    fermerFiche(element) {
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