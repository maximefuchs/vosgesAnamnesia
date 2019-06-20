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
        this._balise.css({
            "width": this._taille,
            "height": this._taille,
            "left": Math.random() * 2500,
            "bottom": Math.random() * 2500,
            "background": this._couleur,
            "opacity": 0
        });
        this.tweenAnimate(
            {
                left: this._x * this._scale,
                bottom: this._y * this._scale,
                opacity: this._alpha,
            }, 2, 1);
    }
}