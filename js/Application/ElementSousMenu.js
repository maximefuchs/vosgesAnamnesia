class ElementSousMenu extends BlocMenu {
    constructor(parent, json, params, scale) {

        var x = params.x;
        var y = params.y;
        var taille = params.taille;
        var couleur = params.couleur;
        // params: parent, id, x, y, taille, couleur, nom du menu auquel il appartient
        super(parent, 'sousMenuElement_' + json.id, x * scale, y * scale, taille * scale, couleur);

        this._json = json;
        this._scale = scale;
        this._lien = json.lien;
        this._type = json.type;
        this._params = params;
        this.addClass('elementSousMenu');

        var titre = new BaliseObject(this._balise, 'h2', 'titre_' + this._id)
        titre.html(this._json.titre.toUpperCase());
    }

    init() {
        this._balise.css({
            "width": this._taille,
            "height": this._taille,
            "left": this._x,
            "bottom": this._y,
            "background": this._couleur,
            "opacity": 0
        });
        this.tweenAnimate({ opacity: this._params.opacity }, 0.6 + this._params.num * 0.1, 0.5);
    }
}