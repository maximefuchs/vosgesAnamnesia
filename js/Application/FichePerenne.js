Global.includeCSS('dev/css/Application/FichePerenne.css');

Global.include('dev/js/Application/SliderDiaporama.js');

class FichePerenne extends DivObject {
    constructor(parent, id, json, couleur) {
        super(parent, id);
        this.addClass('pagePerenne');
        this.addClass('page');

        $('#elementsDeco').css('display', 'none');

        console.log(json);

        this._id = id;
        this._json = json;
        this._couleur = couleur;

        this.signaux = {
            finFermer: new signals.Signal()
        }
        this.clickSignal = new signals.Signal();

        var fp = this;
        this._balise.click(function () {
            fp.clickSignal.dispatch();
        });

        ////////////////
        // TOP
        var divTop = new DivObject(this._balise, 'divTop_' + this._id);
        divTop.addClass('divTop');
        var link = (json.imgTop == "") ? "datas/imgs/perenne/test/top.jpg" : json.imgTop;
        // var imageTop = new Img(divTop._balise, 'imageTop_' + this._id, link);
        var imageTop = new DivObject(divTop._balise, 'imageTop_' + this._id);
        imageTop.addClass('topImage');
        imageTop._balise.css({
            background: 'url('+link+')',
            'background-size': 'cover',
            'background-position': 'center'
        });

        var s = $('<style>\
        .pagePerenne h1, .pagePerenne h2, .pagePerenne h3 {\
            color : ' + couleur + ';\
        }\
        </style>');
        divTop._balise.after(s);

        var titre = new BaliseObject(divTop._balise, 'h1');
        titre.addClass('topTitre');
        // titre.html(loremTitre.toUpperCase());
        titre.html(json.titre.toUpperCase());
        // TOP //////////////////

        var divContain = new DivObject(this._balise, 'divContain_' + this._id);
        divContain.addClass('divContain');

        //////////////////
        // GAUCHE

        var divLeft = new DivObject(divContain._balise, 'divLeft_' + this._id);
        divLeft.addClass('flex');

        var introLeft = new BaliseObject(divLeft._balise, 'b', 'introLeft_' + this._id);
        introLeft.html(json.soustitre);

        var paraLeft = new BaliseObject(divLeft._balise, 'p', 'paraLeft_' + this._id);
        paraLeft.html(json.blocGauche1);
        paraLeft.css('margin-top', '30px');

        // image
        var divImage = new DivObject(divLeft._balise, 'divImage_' + this._id);
        divImage.addClass('divImage');
        var img = new Img(divImage._balise, 'imgLeft_' + this._id, json.imgGauche);
        var divTextImage = new DivObject(divImage._balise, 'divTextImage_' + this._id);
        divTextImage.css('background', couleur);
        divTextImage.html(json.desImgGauche);

        //TEXTE

        var text = new DivObject(divLeft._balise, 'textLeft_' + this._id);
        text.css('margin-top', '100px');
        text.html(json.blocGauche2);
        // GAUCHE //////////////////////

        /////////////////////////////
        // DROITE

        var divRight = new DivObject(divContain._balise, 'divRight' + this._id);
        divRight.addClass('flex');

        ////////// premier slider
        var divSliderComm = new DivObject(divRight._balise, 'divSliderComm_' + this._id);
        divSliderComm.addClass('sliderComm');
        if (json.imgSlider1.length != 0) {
            new SliderDiaporama(divSliderComm._balise, 'slider1_' + this._id, json.imgSlider1, couleur, 400, 3, 0.5);
        }
        /////////////////////

        var squareRight = new DivObject(divSliderComm._balise, 'squareRight_' + this._id);
        squareRight.addClass('squareRight');
        squareRight.css('background', couleur);
        squareRight.html(json.blocSlider1);

        var textRight = new DivObject(divRight._balise, 'textRight_' + this._id);
        textRight.addClass('textRight');
        textRight.html(json.blocDroit1);

        ////////// deuxième slider
        if (json.imgSlider2.length != 0) {
            var divSliderComm2 = new DivObject(divRight._balise, 'divSliderComm2_' + this._id);
            divSliderComm2.addClass('sliderComm');
            new SliderDiaporama(divSliderComm2._balise, 'slider2_' + this._id, json.imgSlider2, couleur, 700, 4, 0.5);
            divSliderComm2.css('margin-top', '70px');
        }
        /////////////////////

        var divBottom = new DivObject(divRight._balise, 'divBottom_' + this._id);
        divBottom.addClass('divBottom');
        divBottom.css('background', couleur);
        // divBottom.html(titreH2 + lorem);
        divBottom.html(json.blocDroit2);

        // DROITE /////////////////////////


        this.css('opacity', 0);
    }

    init() {
        TweenLite.to(this._balise, 1, { opacity: 1 });
    }

    supprimerFiche(fiche) {
        fiche._balise.remove();
    }


    // GETTERS
    get finFermerSignal() {
        return this.signaux.finFermer;
    }
}