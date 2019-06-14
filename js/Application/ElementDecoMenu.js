Global.includeCSS('dev/css/Application/ElementMenu.css');

class ElementDecoMenu extends BlocMenu {
    constructor(parent, json, couleur) {

        // params: parent, id, x, y, taille, couleur
        super(parent, "decoElement_" + json.id, json.x, json.y, 100, couleur);

        this._json = json;
        this._alpha = this._json.a;

        this.addClass('elementDecoMenu');
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
        TweenLite.to(this._balise, 3,
            {
                left: this._x,
                top: this._y,
                opacity: this._alpha,
                delay: 2
            });
    }
}