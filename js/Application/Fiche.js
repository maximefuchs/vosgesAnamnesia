Global.include('dev/js/Application/SliderDiaporama.js');
Global.include('dev/js/utils/qrcode.js');

Global.includeCSS('dev/css/Application/Fiche.css');

class Fiche extends DivObject {
    // constructor(div, poi, id) {
    constructor(poi, id, couleur) {
        super(poi._balise, id);

        this.signaux = {
            fermer: new signals.Signal()
        };

        this._id = id;
        this._poi = poi;
        this._couleur = couleur;
        this._ouvert = false;
        // this._langue = paramsJSON.langueParDefault;

        this.addClass('elementFiche');
        //permet la suppression de toutes les fiches avec $('.elementFiche').remove()

        var divFiche = new DivObject(this._balise, 'divFiche_' + this._id);
        divFiche.addClass("fiche");

        this._divTexte = new DivObject(divFiche._balise, "divtxt_" + this._id);
        this._divTexte.addClass('divTexte');
        this._titre = new BaliseObject(this._divTexte._balise, "h1");
        this._titre.css('color', couleur);
        this._titre.html(poi._title);
        this._sousTitre = new BaliseObject(this._divTexte._balise, "h3");
        this._sousTitre.html(poi._subtitle);
        this._texte = new BaliseObject(this._divTexte._balise, "p");
        this._texte.addClass('paraScroll');


        var bottom = new DivObject(this._divTexte._balise, "divBottom_" + id);
        bottom.addClass('divBottom');

        var ad = poi._address;
        var adressContent = "";
        if (ad.name === undefined)
            adressContent = 'Unknown Adress';
        else {
            if (ad.name != null && ad.name != "") { adressContent += '<b>' + ad.name + '</b>'; }
            if (ad.address != null && ad.address != "") { adressContent += '<br>' + ad.address; }
            if (ad.mail != null && ad.mail != "") { adressContent += "<br>" + ad.mail; }
            if (ad.tel != null && ad.tel != "") { adressContent += "<br>" + ad.tel; }
        }
        var divAdress = new DivObject(bottom._balise, 'divAdress_' + this._id);
        divAdress.addClass('divAdress');
        divAdress.html(adressContent);

        var divPartage = new DivObject(bottom._balise, 'partage_' + this._id);
        divPartage.addClass('divPartage');

        var tel = '<svg id="CalqueTEL_' + this._id + '" data-name="Calque tel ' + this._id + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.97 48.57"><defs><style>.ccls-1{fill:' + couleur + ';}.ccls-2,.ccls-3{fill:#fff;}.ccls-3{stroke:' + couleur + ';stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title>sms</title><rect class="ccls-1" width="26" height="48.57" rx="2.86" ry="2.86"/><rect class="ccls-2" x="2.02" y="5.02" width="21.95" height="37.69" rx="1.69" ry="1.69"/><circle class="ccls-2" cx="13" cy="45.93" r="1.4"/><rect class="ccls-2" x="10.62" y="1.67" width="4.76" height="0.97" rx="0.49" ry="0.49"/><path class="ccls-3" d="M234.52,339.74a10.45,10.45,0,0,0-9.91,13.85l-4.16,4.09h6.72a10.47,10.47,0,1,0,7.35-17.94Z" transform="translate(-209.02 -327.79)"/><path class="ccls-1" d="M230.17,350.21a1,1,0,0,1,.26-.72,1,1,0,0,1,.75-.25,1,1,0,0,1,.73.25.94.94,0,0,1,.27.72,1,1,0,0,1-.27.72,1.17,1.17,0,0,1-1.47,0A.94.94,0,0,1,230.17,350.21Z" transform="translate(209.02 -327.79)"/><path class="ccls-1" d="M233.51,350.21a1,1,0,0,1,.26-.72,1.24,1.24,0,0,1,1.49,0,1,1,0,0,1,.26.72,1,1,0,0,1-.27.72,1.17,1.17,0,0,1-1.47,0A.94.94,0,0,1,233.51,350.21Z" transform="translate(-209.02 -327.79)"/><path class="ccls-1" d="M236.86,350.21a.94.94,0,0,1,.25-.72,1,1,0,0,1,.75-.25,1,1,0,0,1,.74.25,1,1,0,0,1,.26.72,1,1,0,0,1-.26.72,1.18,1.18,0,0,1-1.48,0A.94.94,0,0,1,236.86,350.21Z" transform="translate(209.02 -327.79)"/></svg>';
        divPartage.html(tel + '<div>Partager</div>');
        divPartage._balise.click({ fiche: this }, this.clickPartage);

        var galerie = [];
        poi._galerie.forEach(element => {
            galerie.push(element.src);
        });

        var subContent = poi._subcontent;
        var txtContent = "";
        subContent.forEach(element => {
            txtContent += "<h3>" + element.title + "</h3>";
            txtContent += element.text;
            element.galerie.forEach(pic => {
                galerie.push(pic.src);
            });
        });

        this._texte.html(poi._text + txtContent);
        var s = $('<style></style>')
            .html(".fiche .paraScroll::-webkit-scrollbar-thumb {\
        background: "+ couleur + "; \
      }");
        this._texte._balise.after(s);

        if (poi._thumbnail != false) {
            galerie.push(poi._thumbnail);
        }
        if (galerie.length == 0)
            galerie.push('datas/imgs/menu/diaporama/logo.png');


        this._btFermer = new DivObject(this._divTexte._balise, this._id + "_BtFermer");
        this._btFermer.addClass("ficheBt");
        this._btFermer.addClass("ficheBtFermer");
        this._btFermer.css('background', couleur);
        this._btFermer.append('<div class="ficheBtFermerTexte">+</div>');
        this._btFermer.x = 500 - this._btFermer.width / 2;
        this._btFermer.y = - this._btFermer.height / 2;
        // fermeture de l'élément gérer dans utilsOpenseadragon.js -> removeOverlay()

        var divSlider = new DivObject(divFiche._balise, 'divSlider_' + this._id);
        divSlider.addClass('divSlider');
        new SliderDiaporama(divSlider._balise, 'slider_' + this._id, galerie, couleur, 500, 3, 0.5);

        this._overlay = ficheToOverlay(this);
        this._balise.toggle();

        this._divSlider = divSlider;

    }

    clickPartage(e) {
        var f = e.data.fiche;
        var site = f._poi._site
        console.log('partage : ' + site);

        var divQR = new DivObject(f._divSlider._balise, 'img_qrCode_' + f._id);
        divQR.addClass('divQR');
        var qr = new QRCode('img_qrCode_' + f._id);
        qr.makeCode(site);
        divQR.tweenAnimate({ top: 0 });
    }



    get fermerSignal() {
        return this.signaux.fermer;
    }
}