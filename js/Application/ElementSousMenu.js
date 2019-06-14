class ElementSousMenu extends BlocMenu {
    constructor(parent, json, x, y, taille, couleur) {

        // params: parent, id, x, y, taille, couleur
        super(parent, 'sousMenuElement_' + json.id, x, y, taille, couleur);

        this._json = json;
        this.addClass('elementSousMenu');

        var titre = new BaliseObject(this._balise, 'h2', 'titre_' + this._id)
        titre.css('vertical-align', 'middle');
        titre.html(this._json.titre);

        this._balise.click(this.click);

    }

    init() {
        this._balise.css({
            "width": this._taille,
            "height": this._taille,
            "left": this._x,
            "top": this._y + this._taille,
            "background": this._couleur,
            "opacity": 0
        });
        TweenLite.to(this._balise, 0.3, { top: this._y, opacity: 1 });
    }

    close() {
        TweenLite.to(this._balise, 0.3, { top: this._y + this._taille, opacity: 0, onComplete: this.delete, onCompleteParams: [this] });
    }
    delete(elt) {
        elt._balise.remove();
    }
}