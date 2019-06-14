Global.includeCSS('dev/css/Application/ElementMenu.css');

class ElementDecoMenu extends DivObject {
    constructor(parent, json, couleur) {
        super(parent, "decoElement_" + json.id);
        this._json = json;
        this.addClass('elementDecoMenu');

        this._id = this._json.id;
        this._x = this._json.x;
        this._y = this._json.y;
        this._alpha = this._json.a;
        this._couleur = couleur;
        this._taille = 100;
    }

    init() {
        this._balise.css({
            "width": this._taille,
            "height": this._taille,
            "left": Math.random() * 2500,
            "top": Math.random() * 2500,
            "background": this._couleur,
            "opacity": 0
        });
        TweenLite.to(this._balise, 3, { left: this._x, top: this._y, opacity: this._alpha, delay: 2 });
    }

    click() {
        console.log("click id : " + this._id);
    }

    changeColor(color) {
        TweenLite.to(this._balise, 1, { background: color });
    }
}