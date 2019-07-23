Global.include('dev/js/Application/ElementMenu.js');
Global.include('dev/js/Application/ElementDecoMenu.js');
Global.include('dev/js/Application/SousMenu.js');
Global.include('dev/js/Application/Jeu.js');

Global.includeCSS('dev/css/Application/Menu.css');

class Menu extends DivObject {
    constructor(parent, json) {
        super(parent, "menu");
        this.addClass('page');


        // require("electron").remote.require("electron-download-manager").download({
        //     url: "http://parc-ballons-vosges.validation.php56.sbg.advisa.fr/wp-content/uploads/2015/01/Luxeuil-les-Bains2.jpg"
        // }, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //         return;
        //     }
        //     console.log("DONE: " + info.url);
        // });



        this._json = json;

        this._fondImgs = [];
        this._couleursAssociees = [];

        this.backgroundDiaporama = json.diaporama;
        this.backPause = false;
        this._setIntervalFonction = 0; // id of the setInterval founction used to switch between background images

        var scale = 140;
        this._scale = scale;

        this._sousMenu = null;
        this._tempsInactivite = 0;
        var tempsInactifMax = paramsJSON.tempsInactivity;
        var menu = this;
        var veille = setInterval(function () {
            if (menu._sousMenu != null && menu._tempsInactivite == tempsInactifMax) {
                menu._sousMenu.close();
                menu._sousMenu.signalFermer.dispatch();
                // clearInterval(veille);
                menu._sousMenu = null;
            }
            menu._tempsInactivite++;
        }, 1000);

        this._balise.click(function () {
            menu._tempsInactivite = 0;
        });


        var maxHeight = 0;

        this._divEltsMenu = new DivObject(this._parent, "elementsMenu");

        var bandeauLangues = new DivObject(this._divEltsMenu._balise, "bandeauLangues");
        bandeauLangues.css('height', scale + 'px');
        this._btnLangues = [];
        for (var i = 0; i < paramsJSON.langues.length; i++) {
            var langue = paramsJSON.langues[i].langue;
            var bt = new DivObject(bandeauLangues._balise,
                this._id + "_BtLang_" + langue);
            bt.addClass("menuBtn");
            bt.addClass("menuBtnLangue");
            if (langue == Global.getLangue())
                bt.addClass('menuBtnLangueSelect')
            var right = 40 + 120 * i;
            bt.css('right', right + 'px');
            bt.append('<div class="menuBtnLangueTexte">'
                + String(langue).toUpperCase()
                + '</div>');
            this._btnLangues.push(bt);

            bt._balise.on("click touchstart", null, { instance: this }, this.clickBtnLang);
        }

        this._menuElements = [];
        for (let i = 0; i < json.element.length; i++) {
            console.log("new menu element : " + i);
            var element = new ElementMenu(this._divEltsMenu._balise, json.element[i], scale);
            var bas = element._y + element._taille;
            if (bas > maxHeight) { maxHeight = bas; }
            this._menuElements.push(element);
        }

        this._sousMenuElement = [];
        // permet d'avoir facilement accès aux sous éléments et de savoir si un menu est ouvert
        // vide si pas de sous menu ouvert

        this._decoMenuElements = [];
        this._divEltsDeco = new DivObject(this._balise, "elementsDeco");
        for (let i = 0; i < json.deco.menu.length; i++) {
            var eltDeco = new ElementDecoMenu(this._divEltsDeco._balise,
                this._json.deco.menu[i],
                this._couleursAssociees[0],
                scale);
            var bas = eltDeco._y + 1;
            if (bas > maxHeight) { maxHeight = bas; }
            this._decoMenuElements.push(eltDeco);
        }

        var tailleDiv = maxHeight * scale;
        this._divEltsMenu.css('height', tailleDiv + 'px');
        this._divEltsDeco.css('height', tailleDiv + 'px');


        var i = 0;
        this._menuElements.forEach(element => {
            element._balise.click({ menu: this, element: this._menuElements[i] }, this.clickBtn);
            i++;
        });

    }

    init() {
        this.displayBackground();
        this._menuElements.forEach(menuElement => {
            menuElement.init();
        });
        this._decoMenuElements.forEach(decoElement => {
            decoElement.init();
        });
    }

    clickBtn(e) {
        console.log('click Element in menu');
        // e.stopPropagation();e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }
        var menu = e.data.menu;
        menu._tempsInactivite = 0;
        var element = e.data.element;
        menu.tidyElements(menu, $(this).attr('id'));
        menu.supprimerCarte();
        menu.supprimerPerenne();
        $('.sousMenuListePoi').remove();
        if (element._type == 'carte') {
            menu.hideDecoElements(menu);
            menu._divEltsDeco.css('display', 'none');
            menu.showSousMenu($(this));
        } else {
            menu._divEltsDeco.css('display', 'block');
            menu.moveDecoElements(menu);
            menu.showSousMenu($(this));
        }
    }

    supprimerCarte() {
        $('#Carte').remove();
        $(body).find('.elementFiche').remove();
        this.playBackground();
    }
    supprimerPerenne() {
        $('.pagePerenne').remove();
    }
    supprimerJeu() {
        $('#jeu').remove();
    }
    supprimerSousMenu() {
        $('.sousmenu').remove();
        $('.sousMenuListePoi').remove();
        this._sousMenu = null;
    }

    clickBtnLang(e) {
        console.log('click langue');
        // e.stopPropagation(); e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }
        var instance = e.data.instance;
        var s = String($(this).attr('id'));

        instance._langue = s.replace(instance._id + "_BtLang_", '');
        console.log(instance._langue);
        // instance.maj_texte();
    }

    // fond d'écran changeant
    displayBackground() {
        var images = this._fondImgs;
        var nbImgs = images.length;
        var i = 0;
        var menu = this;
        var duree = paramsJSON.dureeFadeFond;
        clearInterval(this._setIntervalFonction);
        if (nbImgs == 0) {
            this._setIntervalFonction = 0;
        }
        else {
            TweenLite.to(images[i]._balise, duree, { opacity: 1 });
            this._setIntervalFonction = setInterval(function () {
                if (!menu.backPause) {
                    var current = i % nbImgs;
                    var next = (i + 1) % nbImgs;
                    TweenLite.to(images[current]._balise, duree, { opacity: 0 });
                    TweenLite.to(images[next]._balise, duree, { opacity: 1 });

                    var newColor = menu._couleursAssociees[next];
                    menu._decoMenuElements.forEach(e => {
                        e.changeColor(newColor);
                    });

                    i++;
                }
            }, paramsJSON.dureeFond * 1000); // temps entre chaque execution de la fonction
        }
    }

    pauseBackground() {
        this.backPause = true;
    }

    playBackground() {
        this.backPause = false;
    }

    toggleMenu(menu) {
        menu._balise.toggle();
    }

    tidyElements(menu, id) {
        var left = 0;
        var tailleSelect = 2.5;
        menu._menuElements.forEach(element => {
            if (element._id == id) {
                element.tweenAnimate({
                    height: tailleSelect * menu._scale,
                    width: tailleSelect * menu._scale,
                    top: '',
                    bottom: 0,
                    left: left * menu._scale,
                    'line-height': '',
                    'font-size': '25px'
                });
                element._front.tweenAnimate({
                    background: element._src_fond != '#' ? element._couleur + 'A5' : element._couleur
                });
                left += tailleSelect;
            }
            else {
                element.tweenAnimate({
                    height: menu._scale,
                    width: menu._scale,
                    top: '',
                    bottom: 0,
                    left: left * menu._scale,
                    'line-height': '20px',
                    'font-size': '10px'
                });
                element._front.tweenAnimate({
                    background: element._couleur
                })
                left++;
            }
        });
    }
    moveDecoElements(menu) {
        menu._divEltsDeco.tweenAnimate({ bottom: menu._scale + 'px' });
        for (let i = 0; i < menu._decoMenuElements.length; i++) {
            var element = menu._decoMenuElements[i];
            var jsonElt = menu._json.deco.sousmenu[i];
            element.tweenAnimate({
                left: jsonElt.x * menu._scale,
                bottom: jsonElt.y * menu._scale,
                opacity: 0
            }, 0, 0);
            element.tweenAnimate({ opacity: jsonElt.a });
        }
    }
    hideDecoElements(menu) {
        menu._decoMenuElements.forEach(element => {
            element.tweenAnimate({ opacity: 0 });
        });
    }

    showSousMenu(menuElt) {
        var lien = menuElt.attr('lien');
        console.log('lien : ' + lien);
        var couleur = menuElt.children().css('background-color');
        couleur = couleur.split(/[()]/);
        couleur = couleur[1].split(',');
        couleur = 'rgb(' + couleur[0] + ',' + couleur[1] + ',' + couleur[2] + ')';
        var json = this._json.SousMenu[lien];
        $('.sousmenu').remove();
        var titre = menuElt.find('.elementMenu_titre').html();
        var menu = this;
        var sm = new SousMenu(this._balise, json, titre, couleur, this._scale, lien);
        sm._carte.carteOpenSignal.add(function () {
            menu.pauseBackground();
        });
        sm.closeCarteSignal.add(function () {
            menu.playBackground();
        });
        sm.stopBackSignal.add(function () {
            menu.pauseBackground();
            $('.backgroundImage').css('display', 'none');
        });
        this.backgroundDiaporama = json.type == 'carte' ? [] : json.diaporama;
        var menu = this;
        sm.signalFermer.add(function () {
            menu.fermerSousMenu(menu);
        });
        sm.init();

        this.displayBackground();

        sm._carte.clickSignal.add(function () {
            menu._tempsInactivite = 0;
        });
        sm.clickPerenne.add(function () {
            menu._tempsInactivite = 0;
        });
        this._sousMenu = sm;
    }

    fermerSousMenu(menu) {
        $('.backgroundImage').css('display', 'block');
        menu.supprimerCarte();
        menu.supprimerPerenne();
        menu.supprimerJeu();
        menu._divEltsDeco.tweenAnimate({ bottom: 0, onComplete: function () { menu.supprimerSousMenu(); } });
        menu._menuElements.forEach(menuElement => {
            menuElement.init();
        });
        menu._decoMenuElements.forEach(decoElement => {
            decoElement.init();
        });
        menu.backgroundDiaporama = menu._json.diaporama;
        menu.displayBackground();
    }


    // GETTERS

    set backgroundDiaporama(imagesJson) {
        for (let i = 0; i < this._fondImgs.length; i++) {
            this._fondImgs[i]._balise.remove();
        }
        this._fondImgs = [];
        this._couleursAssociees = [];
        if (imagesJson.length != 0) {
            for (let i = 0; i < imagesJson.length; i++) {
                console.log("new back image : " + i);
                var img = imagesJson[i];
                var image = new Img(this._balise, "fond_img_" + img.id, img.src);
                image.addClass('page');
                image.addClass('backgroundImage');
                image.css('opacity', 0);
                this._fondImgs.push(image);
                this._couleursAssociees.push(img.color);
            }
        }
    }
}