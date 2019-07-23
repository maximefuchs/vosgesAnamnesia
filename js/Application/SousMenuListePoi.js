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
        var menu = this;
        for (let i = 0; i < json.length; i++) {
            var e = new ElementListePoi(divListePoi._balise, i + 'elementListePoi', json[i], scale);
            if (i % 2 == 0) { e.css('background', '#EEE'); }
            e._balise.click(function () {
                menu.clickSignal.dispatch(i);
            });
        }
        var s = $('<style></style>')
            .html(".divListePoi::-webkit-scrollbar-thumb {\
            background: "+ couleur + "; \
            }");
        divListePoi._balise.after(s);

        this.clickSignal = new signals.Signal();
    }
}