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
        // this._langue = paramsJSON.langueParDefault;

        // mise en place de cette variable car les pois pour les communes seront différents
        // = pas de contenu dans la fiche
        // on ne l'affiche pas, mais on a besoin d'une fiche associée afin de récupérer le poi et du coup les coordonnées
        var isCommune = poi._subtitle === undefined;
        if (!isCommune) {

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


            // div pour l'adresse et le bouton de partage de la fiche
            var bottom = new DivObject(this._divTexte._balise, "divBottom_" + id);
            bottom.addClass('divBottom');
            bottom.css('background', couleur.split(')')[0] + ', 0.85)');

            var ad = poi._address;
            var adressContent = "";
            if (ad.name === undefined)
                adressContent = 'Unknown Adress';
            else {
                if (ad.name != null && ad.name != "") { adressContent += ad.name.toUpperCase(); }
                if (ad.address != null && ad.address != "") { adressContent += '<br>' + ad.address; }
                if (ad.mail != null && ad.mail != "") { adressContent += "<br>" + ad.mail; }
                if (ad.tel != null && ad.tel != "") { adressContent += "<br>" + ad.tel; }
            }
            var divAdress = new DivObject(bottom._balise, 'divAdress_' + this._id);
            divAdress.addClass('divAdress');
            divAdress.html(adressContent);

            var divPartage = new DivObject(bottom._balise, 'partage_' + this._id);
            divPartage.addClass('divPartage');
            divPartage.css('background', couleur);

            var partage = '<img src="datas/imgs/carte/partage.svg">';
            divPartage.html(partage + '<div>PARTAGER LA FICHE</div>');
            divPartage._balise.click({ fiche: this }, this.clickPartage);

            var galerie = [];
            poi._galerie.forEach(element => {
                var t = folderImgs;
                var split = element.src.split('/');
                t += split[split.length - 1];
                galerie.push(t);
            });

            var subContent = poi._subcontent; // voir la structure de l'export pour comprendre
            // un poi a un attribut galerie mais a aussi un attribut subcontent qui lui peut aussi avoir un attribut galerie
            var txtContent = "";
            subContent.forEach(element => {
                txtContent += "<h3>" + element.title + "</h3>";
                txtContent += element.text;
                element.galerie.forEach(pic => {
                    var t = folderImgs;
                    var split = pic.src.split('/');
                    t += split[split.length - 1];
                    galerie.push(t);
                });
            });

            this._texte.html(poi._text + txtContent);
            var s = $('<style></style>')
                .html(".fiche .paraScroll::-webkit-scrollbar-thumb {background: "+ couleur + "; }");
            this._texte._balise.after(s);

            if (poi._thumbnail != false) {
                var t = folderImgs;
                var split = poi._thumbnail.split('/');
                t += split[split.length - 1];
                galerie.push(t);
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
            new SliderDiaporama(divSlider._balise, 'slider_' + this._id, galerie, couleur, { height: 540, width: 500 }, 3, 0.5);

            this._overlay = ficheToOverlay(this);
            this._balise.toggle();

            this._divSlider = divSlider;

        } // if(commune)

    }

    clickPartage(e) {
        var f = e.data.fiche;
        var site = f._poi._site

        $('.slidePartage').remove();
        var slidePartage = new DivObject(f._divSlider._balise, 'slidePartage_' + f._id);
        slidePartage.addClass('slidePartage');
        slidePartage.css('background', f._couleur);
        var enTete = new BaliseObject(slidePartage._balise, 'h3');
        enTete.html('RECEVOIR LA FICHE');

        var champTel = new DivObject(slidePartage._balise, 'champTel_' + f._id);
        champTel.addClass('champTel');
        champTel.html('+');

        var ind = new DivObject(slidePartage._balise, 'indication_' + f._id);
        ind.addClass('indicationTel');
        ind.html(paramsJSON.indicationTel);

        var captionQR = new BaliseObject(slidePartage._balise, 'span', 'captionQR_' + f._id);
        captionQR.addClass('captionQR');
        captionQR.html('EN FLASHANT LE CODE');
        var divQR = new DivObject(slidePartage._balise, 'img_qrCode_' + f._id);
        divQR.addClass('divQR');
        var qr = new QRCode('img_qrCode_' + f._id);
        qr.makeCode(site);

        var captionTEL = new BaliseObject(slidePartage._balise, 'span', 'captionTEL_' + f._id);
        captionTEL.addClass('captionTEL');
        captionTEL.html('EN ENTRANT VOTRE NUMÉRO DE PORTABLE');
        var divPave = new DivObject(slidePartage._balise, 'divPave_' + f._id);
        divPave.addClass('paveNum');
        divPave.css('color', f._couleur);

        var captionFeedBack = new BaliseObject(slidePartage._balise, 'span', 'captionFeedBack' + f._id);
        captionFeedBack.addClass('captionFeedBack');
        $('.captionFeedBack').css('display', 'none');
        var feedBack = new Img(slidePartage._balise, 'feedBack' + f._id, '');
        feedBack.addClass('feedBack');
        $('.feedBack').css('display', 'none');


        for (var i = 1; i < 13; i++) {
            var chiffre = new DivObject(divPave._balise, i + 'chiffre_' + f._id);
            chiffre.addClass('chiffre');
            chiffre.attr('num', i);
            chiffre._balise.css({
                left: ((i - 1) % 3) * 45 + 'px',
                top: Math.trunc((i - 1) / 3) * 60 + 'px'
            });
            if (i == 10) {
                chiffre.html('<');
                chiffre.css('color', 'red');
            } else if (i == 11)
                chiffre.html(0);
            else if (i == 12) {
                chiffre.html('✓');
                chiffre.css('color', 'white');
                chiffre.css('background', 'green');
            }
            else
                chiffre.html(i);

            chiffre._balise.click(function (e) {
                e.stopPropagation();
                var num = $(this).attr('num');
                var tel = champTel._balise.html();
                if (num == 10) {
                    if (tel.length > 1)
                        tel = tel.slice(0, -1);
                } else if (num == 11)
                    tel += '0';
                else if (num == 12) {
                    $('.captionQR').remove();
                    $('.captionTEL').remove();
                    $('.indicationTel').remove();
                    $('.divQR').remove();
                    $('.paveNum').remove();
                    $('.captionFeedBack').css('display', '');
                    $('.feedBack').css('display', '');
                    var content = 'Bonjour,%20veuillez%20trouver%20la%20fiche%20sur%20le%20lien%20suivant%20:%20' + site;
                    var num = '00' + tel.slice(1);
                    var url = 'https://www.ovh.com/cgi-bin/sms/http2sms.cgi?&account=sms-ss271992-1&contentType=text/json&login=pnrbv&password=anamnesi&from=Anamnesia&to=' + num + '&message=' + content;
                    console.log(url);
                    fetch(url, { method: 'GET' })
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            console.log(data);
                            if (data.status == 100) {
                                // succès envoi
                                captionFeedBack.html('MESSAGE ENVOYÉ AVEC SUCCÈS');
                                feedBack.attr('src', 'datas/imgs/carte/feedBackPositif.png');
                            } else {
                                // echec
                                var message = data.message
                                captionFeedBack.html('ERREUR : ' + message);
                                feedBack.attr('src', 'datas/imgs/carte/feedBackNegatif.png');
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            captionFeedBack.html('ERREUR : ' + error);
                            feedBack.attr('src', 'datas/imgs/carte/feedBackNegatif.png');
                        });
                }
                else
                    tel += num;
                champTel.html(tel);
            });
        }

        var btnFermer = new DivObject(slidePartage._balise, f._id + "_btnFermer");
        btnFermer.html('<div>+</div>');
        btnFermer.addClass('btnFermerPartage');
        btnFermer._balise.click(function () {
            slidePartage._balise.remove();
        });
        slidePartage.tweenAnimate({ opacity: 1 });

    }



    get fermerSignal() {
        return this.signaux.fermer;
    }
}