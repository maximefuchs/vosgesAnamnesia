class FicheBtLien extends DivObject{
    constructor(parent, idCat, idFiche, fiche){
        super(parent, idCat + "-"+ idFiche);

        this.addClass("FicheBtLien");

        this._fiche = fiche;
        this._idCat = idCat;
        this._idFiche = idFiche;
        for(var i = 0; i < textesJSON.Application.Carte.poi.length; i++){
            if(textesJSON.Application.Carte.poi[i].idCat === this._idCat && textesJSON.Application.Carte.poi[i].id === this._idFiche){
                this._json = textesJSON.Application.Carte.poi[i];
            }
        }
        console.log("NEW FICHE BT LIEN " + this._idCat + " - " + this._id);
        console.log(this._json);

        this._img = new Img(this._balise, this._id + "Img", "datas/imgs/Carte/" + idCat + "-" + idFiche + "/vignette.png");
        this._texte = new BaliseObject(this._balise, "span", this._id + "Texte");

        this._balise.on("click touchstart", null,{instance:this}, this.clickBtn);
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
        application._carte.ouvrirFicheBtLien(instance);
    };

    texte(){
        console.log(this._idFiche);
        console.log(this._id);
        this._texte.html(Global.getTexteLangue(this._json.titre, this._fiche._langue));
    }
}