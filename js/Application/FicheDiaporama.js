class FicheDiaporama extends DivObject{
    constructor(div, fiche, json, width, height){
        super(div, fiche._id + "_Diaporama");
        this._fiche = fiche;
        this._json = json;
        this._width = width;
        this._height = height;
        this._numImg = 0;
        this.addClass("FicheDiaporama");

        this._imgsDiv = new DivObject(this._balise, this._id + "_Imgs");
        this._imgsDiv.addClass("FicheDiaporamaImgs");
        this._imgs = [];

        for(var i = 0; i < this._json.length; i++){
            console.log(this._json[i].name);
            var img = new Img(this._imgsDiv._balise, this._id + "_Img_" + i, "datas/imgs/carte/" + this._fiche._idFiche + "/grande/" + this._json[i].name + ".jpg");
            this._imgs.push(img);
        }

        this._ligne = new DivObject(this._balise, this._id + "_Ligne");
        this._ligne.addClass("FicheDiaporamaLigne");
        
        this._legende = new DivObject(this._balise, this._id + "_Legende");
        this._legende.addClass("FicheDiaporamaLegende");

        // this._btZoom = new DivObject(this._balise, this._id + "_BtZoom");
        // this._btZoom.addClass("FicheBt");
        // this._btZoom.addClass("FicheDiaporamaBtZoom");
        // this._btZoom.x = this.width - this._btZoom.width / 2;
        // this._btZoom.y = 180 - this._btZoom.height / 2;
        // this._btZoom._balise.on("click touchstart", null,{instance:this}, this.clickBtn);

        this._btGauche = new DivObject(this._balise, this._id + "_BtGauche");
        this._btGauche.addClass("FicheBt");
        this._btGauche.addClass("FicheDiaporamaBtGauche");
        this._btGauche.x = - this._btGauche.width / 2;
        this._btGauche.y = 255 - this._btGauche.height / 2;
        this._btGauche._balise.on("click touchstart", null,{instance:this}, this.clickBtn);

        this._btDroite = new DivObject(this._balise, this._id + "_BtDroite");
        this._btDroite.addClass("FicheBt");
        this._btDroite.addClass("FicheDiaporamaBtDroite");
        this._btDroite.x = this.width - this._btDroite.width / 2;
        this._btDroite.y = 255 - this._btDroite.height / 2;
        this._btDroite._balise.on("click touchstart", null,{instance:this}, this.clickBtn);

        if(this._imgs.length <= 1){
            this._btGauche.css("display","none");
            this._btDroite.css("display","none");
        }
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
            instance._numImg--;
            instance.changeImg();
        } else if(s === instance._btDroite._id){
            instance._numImg++;
            instance.changeImg();
        } else if(s === instance._btZoom._id){
            application._diaporama.ouvrir(instance._fiche, instance._json, instance._numImg);
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
            if(i === this._numImg){
                TweenLite.to(this._imgs[i]._balise, 0.5,{autoAlpha:1});
            } else {
                TweenLite.to(this._imgs[i]._balise, 0.5,{autoAlpha:0});
            }
        }

        this.texteImg();
    }

    init(){
        this._numImg = 0;
        for(var i = 0; i < this._imgs.length; i++){
            if(i === this._numImg){
                TweenLite.to(this._imgs[i]._balise, 0,{autoAlpha:1});
            } else {
                TweenLite.to(this._imgs[i]._balise, 0,{autoAlpha:0});
            }
        }
    }

    texte(){
        this.texteImg();
    }

    texteImg(){
        this._legende.html(Global.getTexteLangue(this._json[this._numImg].legende, this._fiche._langue));
    }
}