Global.includeCSS('dev/css/Application/ElementMenu.css');

class ElementMenu extends BlocMenu {
    constructor(parent, json, scale) {

        // params: parent, id, x, y, taille, couleur
        super(parent, 'menuElement_' + json.id, json.x, json.y, json.taille, json.couleur);

        this._scale = scale;
        this._json = json;
        this.addClass('elementMenu');

        this._src_fond = this._json.src_fond;
        this._picto = this._json.picto;
        this._titre = this._json.titre;
        this._lien = this._json.lien;

        this._front = new DivObject(this._balise, this._id + "_front");
        this._front.addClass('elementMenu_front');
        var titre = new BaliseObject(this._front._balise, 'h1');
        titre.addClass('elementMenu_titre'); titre.html(this._titre);

        // posibilité qu'il n'y ait pas de picto
        if (this._picto != "") {
            var pictogramme = new Img(this._front._balise, this._id + "_picto", this._picto);
            pictogramme.addClass('elementMenu_picto');
        }

        // si image de fond d'écran, la couleur doit être transparente
        var frontBackColor = this._src_fond != '#' ? this._couleur + 'A5' : this._couleur;
        this._front.css('background', frontBackColor);

        this._balise.css({
            "background": "url(" + this._src_fond + ") center center",
            "background-size": "cover",
            "width": this._taille * this._scale,
            "height": this._taille * this._scale,
            "left": Math.random() * 2500,
            "bottom": Math.random() * 2500,
            "opacity": 0
        })
            .attr('lien', this._lien);
    }

    init() {
        this.tweenAnimate({
            width: this._taille * this._scale,
            height: this._taille * this._scale,
            'font-size': "",
            'line-height': "",
            left: this._x * this._scale,
            bottom: this._y * this._scale,
            opacity: 1
        }, 0, 2);
        this._front.tweenAnimate({
            background: this._src_fond != '#' ? this._couleur + 'A5' : this._couleur
        });
    }
}