class Poi extends DivObject{
    constructor(div, json, categorie){
        super(div, "Poi_" + categorie.id + "-" + json.id);

        this._json = json;

        this._categorie = categorie;

        console.log(this._categorie);

        this._id = categorie.id + "-" + json.id;
        this._x = this._json.x;
        this._y = this._json.y;
        this.addClass("Poi");
        this.css("background-image", "url(" + this._categorie.img + ")");
        if(this._y < StageHeight / 2){
            // this.addClass("PoiHaut");
            TweenLite.to(this._balise, 0, {rotation:180});
        } else {
        }

        TweenLite.to(this._balise, 0, {x:this._x, y:this._y});
    }

    init(){
        TweenLite.to(this._balise, 0, {scale:0.5, autoAlpha:0});
    }

    ouvrir(n){
        TweenLite.to(this._balise, 0.3, {delay:n, scale:1, autoAlpha:1});
    }
}