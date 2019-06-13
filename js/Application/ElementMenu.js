Global.includeCSS('dev/css/Application/ElementMenu.css');

class ElementMenu extends DivObject {
    constructor(parent, json) {
        super(parent, json.id);
        this._json = json;
        this.addClass('elementMenu');

        this._id = this._json.id;
        this._couleur = this._json.couleur;
        this._src_fond = this._json.src_fond;
        this._picto = this._json.picto;
        this._titre = Global.getTexteLangue(this._json.titre);
        this._type = this._json.type;
        this._lien = this._json.lien;
        this._x = this._json.x;
        this._y = this._json.y;
        this._taille = this._json.taille;

        this._front = new DivObject(this._balise, this._id + "_front");
        this._front.addClass('elementMenu_front');
        this._front.html("<h1 class='elementMenu_titre'>" + this._titre + "</h1>");

        if (this._picto != "#") {
            var pictogramme = new Img(this._front._balise, this._id + "_picto", this._picto);
            pictogramme.addClass('elementMenu_picto')
        }
    }

    init() {
        this._balise.css({
            "background": "url(" + this._src_fond + ") center center",
            "background-size": "cover",
            "width": this._taille,
            "height": this._taille,
            "left": Math.random() * 2500,
            "top": Math.random() * 2500,
            "opacity": 0
        })
        .attr('lien', this._lien)
        .attr('type', this._type);
        this._front._balise.css({
            "background": this._couleur,
            "width": "100%",
            "height": "100%"
        });
        TweenLite.to(this._balise, 3, {left: this._x, top: this._y, opacity: 1, delay: 2});
    }

    click() {
        console.log("click id : " + this._id);
    }
}