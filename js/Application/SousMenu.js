Global.include('dev/js/Application/ElementSousMenu.js');

Global.includeCSS('dev/css/Application/SousMenu.css');

class SousMenu extends DivObject {
    constructor(parent, json, couleur, scale) {
        super(parent, 'sousmenu');
        this.addClass('sousmenu');

        this._json = json;
        this._scale = scale;
        this._couleur = couleur;


        this.css('bottom', 5 * this._scale);

        this._divText = new BaliseObject(this._balise, "div");
        this._divText.addClass('text_sousmenu');
        this._divText.css('height', 5 * this._scale);
        this._divText.css('width', 4 * this._scale);
        this._divText._balise.css({
            height: 3 * this._scale,
            width: 4 * this._scale,
            padding: this._scale + 'px ' + this._scale / 2 + 'px'
        });

        var titre = new BaliseObject(this._divText._balise, 'h1', 'titre_' + this._id);
        titre.html('TITRE');
        titre.css('color', couleur);

        var texte = new BaliseObject(this._divText._balise, 'p', 'txt_' + this._id);
        texte.html('Excepteur duis culpa ex tempor exercitation consectetur proident dolor. Laboris sint sit exercitation velit aliquip in tempor elit veniam adipisicing excepteur nostrud incididunt. Id deserunt eiusmod velit eiusmod ea magna aliquip aliquip. Sunt eu mollit voluptate et excepteur commodo consequat laborum eiusmod exercitation non elit velit. Incididunt incididunt elit sunt elit laboris Lorem quis duis aliquip eiusmod amet excepteur culpa proident.');
        texte._balise.css({
            height: 1.5 * this._scale,
            'margin-top': 0.5 * this._scale
        });
        var s = $('<style></style>')
            .html('#txt_' + this._id + "::-webkit-scrollbar-thumb {\
            background: "+ couleur + "; \
          }");
        texte._balise.after(s);

        this._enSavoirPlus = new DivObject(this._divText._balise, 'enSavoirPlus_' + this._id);
        this._enSavoirPlus.addClass('enSavoirPlus');
        this._enSavoirPlus.css('margin-top', this._scale / 2 + 'px')
        this._enSavoirPlus.html("En savoir plus →");
    }
}