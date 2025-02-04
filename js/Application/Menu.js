Global.include('dev/js/Application/ElementMenu.js');
Global.include('dev/js/Application/ElementDecoMenu.js');
Global.include('dev/js/Application/SousMenu.js');
Global.include('dev/js/Application/Jeu.js');

Global.includeCSS('dev/css/Application/Menu.css');

class Menu extends DivObject {
    constructor(parent, json) {
        super(parent, "menu");
        this.addClass('page');

        this._json = json;

        this._fondImgs = [];
        this._couleursAssociees = [];

        this.langueSignal = new signals.Signal();

        this.backgroundDiaporama = json.diaporama;
        var overlay = new Img(this._balise, 'filterBackground', 'datas/imgs/menu/diaporama/overlay_img.png');
        overlay.addClass('page');
        overlay.css('z-index', 1);
        var overlayPerenne = new Img(this._balise, 'overlayPerenne', 'datas/imgs/perenne/texture_fiche.png');
        overlayPerenne.addClass('page');
        overlayPerenne.css('z-index', 1);
        overlayPerenne.css('display', 'none');
        this.backPause = false;
        this._setIntervalFonction = 0; // id of the setInterval founction used to switch between background images

        var scale = 140; // unité en pixels pour la taille d'un élément. Beaucoup d'éléments repose sur ce chiffre
        // le changer modifiera donc tous ces éléments de la bonne manière
        // cependant, comme ce n'est pas accessible dans le css, tout n'est pas lié à ce chiffre
        this._scale = scale;

        this._sousMenu = null;

        // VEILLE
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


        
        this._divEltsMenu = new DivObject(this._parent, "elementsMenu");

        var bandeauLangues = new DivObject(this._divEltsMenu._balise, "bandeauLangues");
        bandeauLangues.css('height', scale + 'px');
        this._btnLangues = [];
        for (var i = 0; i < paramsJSON.langues.length; i++) {
            var langue = paramsJSON.langues[i].langue;
            var bt = new DivObject(bandeauLangues._balise, this._id + "_BtLang_" + langue);
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
            
            bt._balise.on("click touchstart", null, { instance: this }, this.clickElementMenuLang);
        }
        
        var maxHeight = 0; // pour la taille des divs. On va récupérer l'élément le plus haut pour avoir la taille max

        this._menuElements = [];
        for (let i = 0; i < json.element.length; i++) {
            var element = new ElementMenu(this._divEltsMenu._balise, json.element[i], scale);
            var bas = element._y + element._taille;
            if (bas > maxHeight) { maxHeight = bas; }
            this._menuElements.push(element);
        }

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
            element._balise.click({ menu: this }, this.clickElementMenu);
            i++;
        });

    }

    init() {
        this.displayBackground();
        var menu = this;
        setTimeout(function () {
            menu._menuElements.forEach(menuElement => {
                menuElement.init();
            });
            menu._decoMenuElements.forEach(decoElement => {
                decoElement.init();
            });
        }, 2000);
    }

    clickElementMenu(e) {
        console.log('click Element in menu');
        var menu = e.data.menu;
        menu._tempsInactivite = 0;
        menu.tidyElements(menu, $(this).attr('id'));
        menu.supprimerCarte();
        menu.supprimerPerenne();
        menu.supprimerJeu();
        $('.sousMenuListePoi').remove();
        $('#overlayPerenne').css('display', 'none');
        $('#filterBackground').css('display', '');
        menu.showSousMenu($(this));
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

    clickElementMenuLang(e) {
        console.log('click langue');
        var instance = e.data.instance;
        var s = String($(this).attr('id'));
        s = s.replace(instance._id + "_BtLang_", '');
        instance.langueSignal.dispatch(s); // redemarrage de l'interface avec changement des fichiers json
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

    // "rangement" de tous les éléments en bas de l'écran
    // celui qui a été séléctionné reste plus grand
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

    showSousMenu(menuElt) {
        var menu = this;
        var lien = menuElt.attr('lien');
        console.log('lien : ' + lien);
        var couleur = menuElt.children().css('background-color');
        couleur = couleur.split(/[()]/);
        couleur = couleur[1].split(',');
        couleur = 'rgb(' + couleur[0] + ',' + couleur[1] + ',' + couleur[2] + ')';
        var json = menu._json.SousMenu[lien];
        $('.sousmenu').remove();
        var titre = menuElt.find('.elementMenu_titre').html();

        if (lien == 'local') {
            $('#overlayPerenne').css('display', '');
            $('#filterBackground').css('display', 'none');
            var fp = new FichePerenne($('#Application'), 'fichePerenne', perennesJSON['autour de moi'], couleur);
            fp.clickSignal.add(function () {
                sMenu.clickPerenne.dispatch();
            });
            fp.init();
        } else {
            var sm = new SousMenu(menu._balise, json, titre, couleur, menu._scale, lien);
            sm._carte.carteOpenSignal.add(function () { menu.pauseBackground() });
            sm._carte.clickSignal.add(function () { menu._tempsInactivite = 0; });
            sm.closeCarteSignal.add(menu.playBackground);
            sm.clickPerenne.add(function () { menu._tempsInactivite = 0; });
            sm.signalFermer.add(function () { menu.fermerSousMenu(menu); });
            sm.stopBackSignal.add(function () {
                menu.pauseBackground();
                $('.backgroundImage').css('display', 'none');
            });
            menu._sousMenu = sm;

            sm.init();
            menu.moveDecoElements(menu);

            setTimeout(function () {
                menu.backgroundDiaporama = json.diaporama;
                menu.displayBackground();
            }, 2050);
        }
    }

    // animation de fermeture du sous menu
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
        setTimeout(function () {
            menu.backgroundDiaporama = menu._json.diaporama;
            menu.displayBackground();
        }, 3050);
    }


    // GETTERS

    // mets à jour les photos de fond
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