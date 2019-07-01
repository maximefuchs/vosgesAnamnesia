class ElementListePoi extends DivObject {
    constructor(parent, id, titre, adresse, imgSource, scale) {
        super(parent, id);
        this.addClass('elementListePoi');
        var divImg = new DivObject(this._balise, 'image_' + this._id);
        divImg.addClass('divImgEltLiPoi');
        var divTexte = new DivObject(this._balise, 'texte_' + this._id);
        var txt = new DivObject(divTexte._balise, 'txtLiPoiElt_' + this._id);
        txt.addClass('poiLiEltTexte');
        txt.html('<b>' + titre.toUpperCase() + '</b><br>' + adresse);

        this._balise.css({
            height: scale + 'px'
        });
        divImg._balise.css({
            width: 2 * scale + 'px',
            height: scale + 'px',
            background: 'url(' + imgSource + ')',
            'background-size': 'cover',
            'background-position': 'center'
        });
    }
}