Global.include('dev/js/Application/ElementListePoi.js');

class SousMenuListePoi extends DivObject {
    constructor(parent, id, json, scale, couleur) {
        super(parent, id);

        this.addClass('sousMenuListePoi');
        var b;
        switch (json.length) {
            case 1:
                b = 4;
                break;
            case 2:
                b = 3;
                break;

            default:
                b = 2.5;
                break;
        }
        this._balise.css({
            'max-height': 6.5 * scale + 'px',
            width: 7.5 * scale + 'px',
            bottom: b * scale + 'px'
        });
        var divListePoi = new DivObject(this._balise, 'listePoi');
        divListePoi.addClass('divListePoi');
        divListePoi._balise.css({
            width: 7 * scale + 'px',
            'margin-right': 0.2 * scale + 'px'
        });
        for (let i = 0; i < json.length; i++) {
            var e = new ElementListePoi(divListePoi._balise, i + 'elementListePoi', json[i].titre, json[i].adresse, json[i].images[0], scale);
            if (i % 2 == 0) { e.css('background', '#EEE'); }
        }
        var s = $('<style></style>')
            .html(".divListePoi::-webkit-scrollbar-thumb {\
            background: "+ couleur + "; \
            }");
        divListePoi._balise.after(s);
    }
}