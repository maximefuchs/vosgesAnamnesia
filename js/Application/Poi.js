class Poi extends DivObject {
    constructor(div, json, viewer) {
        super(div, "Poi_" + json.id); // parent and id

        this._json = json;

        this._viewer = viewer;

        this._id = "Poi_" + json.id;
        this._lat = this._json.lat;
        this._long = this._json.long;
        this._titre = this._json.titre;
        this._soustitre = this._json.soustitre;
        this._image = this._json.image;
        this._texte = this._json.texte;
        this._adresse = this._json.adresse;
        this._tel = this._json.tel;
        this._mail = this._json.mail;
        this._site = this._json.site;
        this.addClass("poi");

        // not yet implemented
        // this.css("background-image", "url(" + this._json.img + ")");

    }

}