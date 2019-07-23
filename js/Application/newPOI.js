class Poi extends DivObject {
    constructor(div, id, json, viewer) {
        super(div, id + json.id); // parent and id

        this._json = json;

        this._viewer = viewer;

        this._id = id + json.id;
        this._title = json.title;
        this._subtitle = json.subtitle;
        this._text = json.text;
        this._site= json.site;
        this._galerie = josn.galerie;
        this._address = json.mainAddress;
        this._thumbnail = json.thumbnail;
        this._subcontent = json.subContent;
        this.addClass("poi");
    }

}