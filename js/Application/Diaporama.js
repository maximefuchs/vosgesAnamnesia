Global.includeCSS('dev/css/Application/Diaporama.css');

class Diaporama extends DivObject{
    constructor(parent){
        super(parent, "Diaporama");
        this.addClass("page");
        this.addClass("zMax");

        this._div = new DivObject(this._balise, this._id + "Div");
        
        this._imgsDiv = new DivObject(this._div._balise, this._id + "_Imgs");
        this._imgs = [];

        this._ligne = new DivObject(this._div._balise, this._id + "_Ligne");
        
        this._legende = new DivObject(this._div._balise, this._id + "_Legende");
        this._json;
        this._num;
        this._fiche;

        this._btFermer = new DivObject(this._div._balise, this._id + "_BtFermer");
        this._btFermer.addClass("DiaporamaBt");

        this._btGauche = new DivObject(this._div._balise, this._id + "_BtGauche");
        this._btGauche.addClass("DiaporamaBt");
        this._btGauche.y = 640;
        this._btGauche._balise.on("click touchstart", null,{instance:this}, this.clickBtn);

        this._btDroite = new DivObject(this._div._balise, this._id + "_BtDroite");
        this._btDroite.addClass("DiaporamaBt");
        this._btDroite.y = 640;
        this._btDroite._balise.on("click touchstart", null,{instance:this}, this.clickBtn);
        this._btFermer._balise.on("click touchstart", null,{instance:this}, this.clickBtn);
    }

    // FONCTION CLICK BT
    clickBtn(e) {
        e.stopPropagation(); e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }
        var instance = e.data.instance;
        var s = String($(this).attr('id'));

        console.log(s === instance._btGauche._id);
        
        if(s === instance._btGauche._id){
            instance._div.css("width", instance._imgs[instance._numImg].width);
            instance._numImg--;
            instance.changeImg();
        } else if(s === instance._btDroite._id){
            instance._div.css("width", instance._imgs[instance._numImg].width);
            instance._numImg++;
            instance.changeImg();
        } else if(s === instance._btFermer._id){
            instance.fermer();
        }
    };

    //Fonction de changement D'image
    changeImg(){
        if(this._numImg < 0){
            this._numImg = this._imgs.length - 1;
        }
        if(this._numImg > this._imgs.length - 1){
            this._numImg = 0;
        }

        for(var i = 0; i < this._imgs.length; i++){
            TweenLite.killTweensOf(this._imgs[i]._balise);
            if(i === this._numImg){
                this._imgs[i].css("display", "");
                this._div.css("width", this._imgs[i].width);
                TweenLite.to(this._imgs[i]._balise, 0.5,{autoAlpha:1});
            } else {
                this._imgs[i].css("display", "none");
                TweenLite.to(this._imgs[i]._balise, 0,{autoAlpha:0});
            }
        }

        this.texteImg();
    }

    init(){
        TweenLite.to(this._balise, 0, {autoAlpha:0});
        this.css("display", "none");
        this._div.css("width", "");
        this._imgsDiv.html("");
    }

    ouvrir(fiche, json, num){
        this._json = json;
        this._numImg = num;
        this._fiche = fiche;
        this._imgs = [];
        this._imgsDiv.html("");
        this.css("display", "");
        this._div.css("width", "");

        for(var i = 0; i < this._json.length; i++){
            console.log(this._json[i].name);
            var img = new Img(this._imgsDiv._balise, this._id + "_Img_" + i, "datas/imgs/carte/" + this._fiche._idFiche + "/grande/" + this._json[i].name + ".jpg");
            if(i === this._numImg){
                TweenLite.to(img._balise, 0, {autoAlpha:1});
                img.css("display", "");
            } else {
                TweenLite.to(img._balise, 0, {autoAlpha:0});
                img.css("display", "none");
            }
            this._imgs.push(img);
        }

        if(this._imgs.length <= 1){
            this._btGauche.css("display","none");
            this._btDroite.css("display","none");
        } else {
            this._btGauche.css("display","");
            this._btDroite.css("display","");
        }

        console.log("Diaporama ouvrir : " + num);
        console.log(json);

        TweenLite.to(this._balise, 0.5, {autoAlpha:1});
        this.texteImg();
    }

    fermer(){
        TweenLite.to(this._balise, 0.5, {autoAlpha:0, onComplete:this.finFermer, onCompleteParams:[this]});
    }

    finFermer(instance){
        init();
    }

    texte(){
        this.texteImg();
    }

    texteImg(){
        if(this._json){
            this._legende.html(Global.getTexteLangue(this._json[this._numImg].legende));
        }
    }
}