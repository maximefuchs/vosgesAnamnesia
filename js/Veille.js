Global.includeCSS('dev/css/Veille.css');

class Veille extends DivObject{
    constructor(){
        super(body, "Veille");
        this.addClass("page");
        this.addClass("zMax");

        this.signaux = {
            finFermer : new signals.Signal(),
            finOuvrir : new signals.Signal()
        };
        
        // FOND VIDEO
        this._videoDiv = new DivObject(this._balise, "VeilleVideoFond");
        this._videoDiv.addClass("page");

        this._video = new Video(this._videoDiv._balise, "VeilleVideo", "datas/videos/veille.mp4", StageWidth, StageHeight);
        this._video.autoplay(true);
        this._video.loop(true);

        // ELEMENTS
        this._elements = new DivObject(this._balise, "VeilleElements");
        this._elements.addClass("page");

        //BTS LANG
        this._btsDiv1 = new DivObject(this._elements._balise, "VeilleBts1");
        this._btsDiv2 = new DivObject(this._elements._balise, "VeilleBts2");
        this._bts = [];

        for(var i = 0; i < paramsJSON.langues.length; i++){
            var bt = new DivObject(this._btsDiv1._balise, "VeilleBt_" + paramsJSON.langues[i].langue);
            bt.addClass("VeilleBt")
            bt.append('<div class="VeilleBtTexte">' + this.getTexteBt(paramsJSON.langues[i].langue) + '</div>');
            this._bts.push(bt);
            var bt = new DivObject(this._btsDiv2._balise, "VeilleBt_" + paramsJSON.langues[i].langue);
            bt.addClass("VeilleBt")
            bt.append('<div class="VeilleBtTexte">' + this.getTexteBt(paramsJSON.langues[i].langue) + '</div>');
            this._bts.push(bt);
        }

        this._balise.find(".VeilleBt").on("click touchstart", null,{instance:this}, this.clickBtn);
        this._elements._balise.on("click touchstart", null,{instance:this}, this.clickBtnFond);
    }

    // FONCTION CLICK FOND
    clickBtnFond(e) {
        e.stopPropagation(); e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }        
        langue = paramsJSON.langueParDefault;
        gestionLangue();

        e.data.instance.fermer();
    };

    // FONCTION CLICK LANG
    clickBtn(e) {
        e.stopPropagation(); e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }
        var s = String($(this).attr('id'));
        // $('#' + s).addClass("VeilleBtSelect");
        
        langue = s.replace(/VeilleBt_/, '');
        gestionLangue();

        e.data.instance.fermer();
    };

    ouvrir(){
        this._video.play(); 
        TweenLite.to(this._balise, 1, {delay:1, autoAlpha:1, onComplete:this.finOuvrir, onCompleteParams:[this]});
    }

    finOuvrir(instance){
        instance.finOuvrirSignal.dispatch();
    }

    //FONCTION FERMER
    fermer(){
        this._balise.find(".VeilleBt").each(function(){$(this).addClass('disable')});
        TweenLite.to(this._balise, 1, {delay:1, autoAlpha:0, onComplete:this.finFermer, onCompleteParams:[this]});
    }

    finFermer(instance){
        console.log("Veille finFermer : ");
        console.log(instance);
        instance._video.pause();        
        // $('.VeilleBt').removeClass("VeilleBtSelect");
        $('.VeilleBt').removeClass("disable");
        instance.finFermerSignal.dispatch();
    }

    //FONCTION qui récupère le texte d'un bouton
    getTexteBt(key){
        var t;
        if(textesJSON.veille.bt[key] != "" && textesJSON.veille.bt[key]){
            t = textesJSON.veille.bt[key];
        } else {
            t ="Texte manquant : " + key;
        }
        return t;
    }

    //GETS

    get finFermerSignal(){
        return this.signaux.finFermer;
    }

    get finOuvrirSignal(){
        return this.signaux.finOuvrir;
    }
}