Global.includeCSS('dev/css/Application/ElementMenu.css');

class ElementDecoMenu extends BlocMenu {
    constructor(parent, json, couleur, scale) {

        // params: parent, id, x, y, taille, couleur
        super(parent, "decoElement_" + json.id, json.x, json.y, scale, couleur);

        this._json = json;
        this._alpha = this._json.a;
        this._scale = scale;

        this.addClass('elementDecoMenu');
    }

    init() {
        this.tweenAnimate({ 
            "width": this._taille,
            "height": this._taille,
            "left": this._x * this._scale,
            "bottom": this._y * this._scale,
            "background": this._couleur,
            "opacity": 0 
        }, 0, 0);
        this.tweenAnimate({ 
            opacity: this._alpha 
        }, 1, 1);
    }
}