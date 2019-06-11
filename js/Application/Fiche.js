Global.include('dev/js/Application/FicheDiaporama.js');
Global.include('dev/js/Application/FicheBtLien.js');

class Fiche extends DivObject {
    constructor(div, poi, id) {
        super(div, id);

        this.signaux = {
            fermer: new signals.Signal()
        };

        this._id = id;
        this._poi = poi;
        // this._categorie = categorie;
        // this._idFiche = categorie.id + "-" + this._json.id;
        // this._x = this._json.x;
        // this._y = this._json.y;
        this._ouvert = false;
        this._langue = paramsJSON.langueParDefault;
        this.addClass("fiche");

        // this._diaporama = new FicheDiaporama(this._balise, this,this._json.diaporama, 345, 230);

        this._img = new BaliseObject(this._balise, "img");

        this._divTexte = new DivObject(this._balise, "divtxt_" + this._id);
        this._divTexte.addClass('divTexte');
        this._titre = new BaliseObject(this._divTexte._balise, "h1");
        this._sousTitre = new BaliseObject(this._divTexte._balise, "h2");
        this._texte = new BaliseObject(this._divTexte._balise, "p");

        var bottom = new DivObject(this._balise, "divBottom_" + this._id);
        bottom.addClass('divBottom');

        var bottomLeft = new DivObject(bottom._balise, 'divBottomLeft_' + this._id);
        bottomLeft.addClass('flexElt');
        var divPhone = new DivObject(bottomLeft._balise, "divPhone_" + this._id);
        new Icone(divPhone._balise, "iconPhone_" + this._id, 'datas/imgs/carte/poi/phone.png', 'darkgreen');
        var numTel = new Span(divPhone._balise, "numTel_" + this._id);
        var divMail = new DivObject(bottomLeft._balise, "divMail_" + this._id);
        new Icone(divMail._balise, "iconMail_" + this._id, 'datas/imgs/carte/poi/mail.png', 'darkgreen');
        var mail = new Span(divMail._balise, "mail_" + this._id);
        
        var bottomRight = new DivObject(bottom._balise, 'divBottomRight_' + this._id);
        bottomRight.addClass('flexElt');

        this._img.attr("src", this._poi._image);
        this._titre.html(Global.getTexteLangue(this._poi._titre, this._langue));
        this._sousTitre.html(Global.getTexteLangue(this._poi._soustitre, this._langue));
        this._texte.html(Global.getTexteLangue(this._poi._texte, this._langue));

        numTel.html(this._poi._tel);
        mail.html(this._poi._mail);

        // imagePhone.attr('src', 'datas/imgs/carte/poi/phone.png');
        // imageMail.attr('src', 'datas/imgs/carte/poi/mail.png');

        // if(this._json.liens){
        //     this._liensDiv = new DivObject(this._balise, this._id + "Liens");
        //     this._liensDiv.addClass("FicheLiens");

        //     this._liensTitre = new DivObject(this._liensDiv._balise, this._id + "LiensTitre");
        //     this._liensTitre.addClass("FicheLiensTitre");

        //     this._liensBtsDiv = new DivObject(this._liensDiv._balise, this._id + "LiensBts");
        //     this._liensBts = [];
        //     for(var i = 0; i < this._json.liens.length; i++){
        //         var bt = new FicheBtLien(this._liensBtsDiv._balise, this._json.liens[i].idCat, this._json.liens[i].id, this);
        //         this._liensBts.push(bt);
        //     }
        // }



        this._btFermer = new DivObject(this._balise, this._id + "_BtFermer");
        this._btFermer.addClass("ficheBt");
        this._btFermer.addClass("ficheBtFermer");
        this._btFermer.x = 500 - this._btFermer.width / 2;
        this._btFermer.y = - this._btFermer.height / 2;

        // this._btFermer._balise.on("click touchstart", null, { instance: this }, this.clickBtnFermer);

        this._bts = [];

        for (var i = 0; i < paramsJSON.langues.length; i++) {
            var bt = new DivObject(this._balise, this._id + "_BtLang_" + paramsJSON.langues[i].langue);
            bt.addClass("ficheBt");
            bt.addClass("ficheBtLang");
            bt.x = 500 - bt.width / 2;
            bt.y = 250 + 70 * i;
            bt.append('<div class="ficheBtLangTexte">' + String(paramsJSON.langues[i].langue).toUpperCase() + '</div>');
            this._bts.push(bt);

            bt._balise.on("click touchstart", null, { instance: this }, this.clickBtnLang);
        }

    }

    // FONCTION CLICK BT
    clickBtnLang(e) {
        console.log('click langue');
        e.stopPropagation(); e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }
        var instance = e.data.instance;
        var s = String($(this).attr('id'));

        instance._langue = s.replace(instance._id + "_BtLang_", '');
        console.log(instance._langue);
        instance.maj_texte();
    };

    // FONCTION CLICK BT
    clickBtnFermer(e) {
        e.stopPropagation(); e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }
        var instance = e.data.instance;
        var s = String($(this).attr('id'));

        if (s === instance._btFermer._id) {
            instance.fermer();
        }
    };


    // init() {
    //     // this._diaporama.init();
    //     this._ouvert = false;
    //     TweenLite.to(this._balise, 0, { x: StageWidth, y: StageHeight });
    //     TweenLite.to(this._balise, 0, { autoAlpha: 0 });
    // }

    // ouvrir(n) {
    //     this._ouvert = true;
    //     // this.positionement();
    //     TweenLite.to(this._balise, 0.3, { delay: n, autoAlpha: 1 });
    // }

    // fermer() {
    //     this.fermerSignal.dispatch(this);
    //     TweenLite.to(this._balise, 0.3, { autoAlpha: 0, onComplete: this.finFermer, onCompleteParams: [this] });
    // }

    // finFermer(instance) {
    //     instance.init();
    // }

    maj_texte() {
        // this._diaporama.texte();

        // if (this._json.liens) {
        //     this._liensTitre.html(Global.getTexteLangue(textesJSON.Application.Carte.Liens, this._langue));

        //     for (var i = 0; i < this._liensBts.length; i++) {
        //         this._liensBts[i].texte();
        //     }
        // }

        // for (var i = 0; i < this._bts.length; i++) {
        //     if (String(this._bts[i]._id).replace(this._id + "_BtLang_", '') === this._langue) {
        //         this._bts[i].addClass("FicheBtLangSelect");
        //     } else {
        //         this._bts[i].removeClass("FicheBtLangSelect");
        //     }
        // }
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

    // testX() {
    //     var x;
    //     console.log(this._x - this._balise.width() / 2);
    //     if (this._x - this._balise.width() / 2 < 50) {
    //         x = 50;
    //     } else if (this._x + this._balise.width() / 2 > StageWidth) {
    //         x = StageWidth - 50 - this._balise.width();
    //     } else {
    //         x = this._x - this._balise.width() / 2;
    //     }
    //     return x;
    // }

    // testY() {
    //     var y;
    //     if (this._y - this._balise.height() / 2 < 50) {
    //         y = 50;
    //     } else if (this._y + this._balise.height() / 2 > StageHeight) {
    //         y = StageHeight - 50 - this._balise.height();
    //     } else {
    //         y = this._y - this._balise.height() / 2;
    //     }
    //     return y;
    // }

    get fermerSignal() {
        return this.signaux.fermer;
    }
}