Global.includeCSS('dev/css/Application/FichePerenne.css');

Global.include('dev/js/Application/SliderDiaporama.js');

class FichePerenne extends DivObject {
    constructor(parent, id, json, couleur) {
        super(parent, id);
        this.addClass('pagePerenne');

        var s = $('\
        <style>\
        .pagePerenne h1, .pagePerenne h2, .pagePerenne h3 {\
            color : ' + couleur + ';\
        }\
        </style>');
        this._balise.after(s);

        this._id = id;
        this._json = json;
        this._couleur = couleur;

        var loremShort = 'Ut dolor ea irure laboris est do. Enim labore non aute duis exercitation voluptate consectetur eu sint non occaecat adipisicing.';
        var lorem = 'Est laborum mollit ea excepteur ullamco sunt sint commodo exercitation esse consequat elit. Duis elit minim mollit et deserunt culpa laboris minim cillum et in sint incididunt. Magna consequat incididunt officia deserunt. Velit voluptate proident ex ad ut sunt anim aliqua Lorem aliqua proident nisi. Mollit et incididunt mollit exercitation mollit qui excepteur non. Ad laborum anim tempor sint. Adipisicing proident ea officia anim ut minim minim culpa.';
        var loremLong = 'Irure ea Lorem ad sint ex laboris laborum commodo sint incididunt. Magna non in excepteur nulla eu pariatur duis qui sit. Do irure ex adipisicing quis Lorem magna.Est excepteur sit sint aute ea commodo irure esse cupidatat ipsum. Quis culpa qui cillum aute veniam cillum elit ipsum nulla deserunt labore nulla nulla. Ad et Lorem irure veniam tempor. Anim aute amet nisi minim et nostrud. Lorem velit eiusmod aliqua non amet aliquip ex proident in velit cillum nostrud. Enim id adipisicing ullamco sit tempor velit.Excepteur voluptate commodo dolor exercitation excepteur quis quis. Non cillum laboris nostrud pariatur laboris. Duis esse eu velit nisi aute eu aliquip ipsum ex ex et. Tempor elit nulla magna qui. Tempor commodo voluptate et laborum sint aliqua dolore. Eu commodo aliquip aliqua ex adipisicing velit magna. Esse consectetur occaecat ipsum deserunt tempor non elit et.'
        var loremTitre = 'Irure ea Lorem ad sint ex laboris laborum';
        var titreH2 = '<h2>Titre un peu long</h2>'

        this.signaux = {
            finFermer: new signals.Signal()
        }
        this.clickSignal = new signals.Signal();
        
        var fp = this;
        this._balise.click(function(){
            fp.clickSignal.dispatch();
        });

        ////////////////
        // TOP
        var divTop = new DivObject(this._balise, 'divTop_' + this._id);
        divTop.addClass('divTop');
        var imageTop = new Img(divTop._balise, 'imageTop_' + this._id, "datas/imgs/perenne/test/top.jpg");
        imageTop.addClass('topImage');

        var titre = new BaliseObject(divTop._balise, 'h1');
        titre.addClass('topTitre');
        titre.html(loremTitre.toUpperCase());

        ////////////////////

        var divContain = new DivObject(this._balise, 'divContain_' + this._id);
        divContain.addClass('divContain');

        //////////////////
        // GAUCHE

        var divLeft = new DivObject(divContain._balise, 'divLeft_' + this._id);
        divLeft.addClass('flex');

        var introLeft = new BaliseObject(divLeft._balise, 'b', 'introLeft_' + this._id);
        introLeft.html(loremShort);

        var titreLeft = new BaliseObject(divLeft._balise, 'h2', 'titreLeft_' + this._id);
        titreLeft.html(loremTitre);

        var paraLeft = new BaliseObject(divLeft._balise, 'p', 'paraLeft_' + this._id);
        paraLeft.html(loremLong);

        // image
        var divImage = new DivObject(divLeft._balise, 'divImage_' + this._id);
        divImage.addClass('divImage');
        var img = new Img(divImage._balise, 'imgLeft_' + this._id, "datas/imgs/perenne/test/imgLeft.jpg");
        var divTextImage = new DivObject(divImage._balise, 'divTextImage_' + this._id);
        divTextImage.css('background', couleur);
        divTextImage.html(titreH2 + loremShort);

        //TEXTE

        var text = new DivObject(divLeft._balise, 'textLeft_' + this._id);
        text.css('margin-top', '100px');
        text.html(titreH2 + loremLong + loremLong + loremLong + loremLong);

        ////////////////////////
        /////////////////////////

        /////////////////////////////
        // DROITE

        var divRight = new DivObject(divContain._balise, 'divRight' + this._id);
        divRight.addClass('flex');

        ////////// premier slider
        var divSliderComm = new DivObject(divRight._balise, 'divSliderComm_' + this._id);
        divSliderComm.addClass('sliderComm');
        new SliderDiaporama(divSliderComm._balise, 'slider1_' + this._id, null, couleur, 400, 4, 0.5);
        /////////////////////

        var squareRight = new DivObject(divSliderComm._balise, 'squareRight_' + this._id);
        squareRight.addClass('squareRight');
        squareRight.css('background', couleur);
        squareRight.html(titreH2 + loremShort);

        var textRight = new DivObject(divRight._balise, 'textRight_' + this._id);
        textRight.addClass('textRight');
        textRight.html(titreH2 + loremLong);

        ////////// deuxième slider
        var divSliderComm2 = new DivObject(divRight._balise, 'divSliderComm2_' + this._id);
        divSliderComm2.addClass('sliderComm');
        new SliderDiaporama(divSliderComm2._balise, 'slider2_' + this._id, null, couleur, 700, 4, 0.5);
        divSliderComm2.css('margin-top', '70px');
        /////////////////////

        var divBottom = new DivObject(divRight._balise, 'divBottom_' + this._id);
        divBottom.addClass('divBottom');
        divBottom.css('background', couleur);
        divBottom.html(titreH2 + lorem);


        ///////////////////////////
        //////////////////////////


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