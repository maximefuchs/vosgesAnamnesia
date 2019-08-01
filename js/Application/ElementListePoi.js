class ElementListePoi extends DivObject {
    constructor(parent, id, json, scale) {
        super(parent, id + json.id);
        this.addClass('elementListePoi');
        var divImg = new DivObject(this._balise, 'image_' + this._id);
        divImg.addClass('divImgEltLiPoi');
        var divTexte = new DivObject(this._balise, 'texte_' + this._id);
        var txt = new DivObject(divTexte._balise, 'txtLiPoiElt_' + this._id);
        txt.addClass('poiLiEltTexte');
        var ad = json.mainAddress;
        var contact = ad.address;

        if (ad.name !== undefined)
            txt.html('<b>' + ad.name.toUpperCase() + '</b><br><p style="font-size:16px">' + contact + '</p>');
        else
            txt.html('<b>' + json.title.toUpperCase() + '</b><br><p style="font-size:16px">Unknown</p>')

        this._balise.css({
            height: scale - 5 + 'px'
        }); // margin bottom : 5px
        var thumbnail = json.thumbnail;
        if (!thumbnail) {
            thumbnail = 'datas/imgs/carte/poi/img_manquant.jpg';
        } else {
            var t = folderImgs;
            var split = thumbnail.split('/');
            t += split[split.length - 1];
            thumbnail = t;
        }
        divImg._balise.css({
            width: 2 * scale + 'px',
            height: scale - 5 + 'px',
            background: 'url(' + thumbnail + ')',
            'background-size': 'cover',
            'background-position': 'center'
        });
    }
}