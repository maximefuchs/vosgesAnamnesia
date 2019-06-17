Global.include('dev/js/Application/ElementMenu.js');
Global.include('dev/js/Application/ElementDecoMenu.js');
Global.include('dev/js/Application/ElementSousMenu.js');

Global.include('dev/js/Application/Jeu.js');

class Menu extends DivObject {
    constructor(parent, json) {
        super(parent, "menu");
        this.addClass('page');

        console.log('menu');

        this._json = json;

        this.signaux = {
            finClick: new signals.Signal(),
            finFermer: new signals.Signal()
        }

        this._fondImgs = [];
        this._couleursAssociees = [];
        for (let i = 0; i < this._json.diaporama.menu.length; i++) {
            console.log("new back image : " + i);
            var img = this._json.diaporama.menu[i];
            var image = new Img(this._balise, "fond_img_" + img.id, img.src);
            image.addClass('page');
            image.css('opacity', 0);
            this._fondImgs.push(image);
            this._couleursAssociees.push(img.color);
        }

        this._menuElements = [];
        for (let i = 0; i < this._json.element.length; i++) {
            console.log("new menu element : " + i);
            var element = new ElementMenu(this._balise, this._json.element[i]);
            this._menuElements.push(element);
        }

        this._sousMenuElement = [];
        // permet d'avoir facilement accès aux sous éléments et de savoir si un menu est ouvert
        // vide si pas de sous menu ouvert

        this._decoMenuElements = [];
        for (let i = 0; i < this._json.deco.length; i++) {
            var eltDeco = new ElementDecoMenu(this._balise, this._json.deco[i], this._couleursAssociees[0]);
            this._decoMenuElements.push(eltDeco);
        }


        this._balise.find(".elementMenu").on("click touchstart", null, { instance: this }, this.clickBtn);


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
        e.stopPropagation();
        e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }
        // var type = $(this).attr('type');
        // var lien = $(this).attr('lien');
        // e.data.instance.fermerMenu(type, lien);
        e.data.instance.clickMenu($(this));
    }

    // fond d'écran changeant toutes les 8 secondes
    displayBackground() {
        var images = this._fondImgs;
        var nbImgs = images.length;
        var i = 0;
        var menu = this;
        TweenLite.to(images[i]._balise, 1, { opacity: 1 });
        setInterval(function () {
            var current = i % nbImgs;
            var next = (i + 1) % nbImgs;
            TweenLite.to(images[current]._balise, 1, { opacity: 0 });
            TweenLite.to(images[next]._balise, 1, { opacity: 1 });

            var newColor = menu._couleursAssociees[next];
            menu._decoMenuElements.forEach(e => {
                e.changeColor(newColor);
            });

            i++;
        }, 6000);
    }

    ouvrirMenu() {
        this._balise.toggle();
        TweenLite.to(this._balise, 1, { opacity: 1 });
        // this.toggleMenu();
    }

    clickMenu(menuElt) {
        var type = menuElt.attr('type');
        switch (type) {
            case "menu":
                this.toggleSousMenu(menuElt);
                break;

            default:
                var lien = menuElt.attr('lien');
                this.fermerMenu(type, lien);
                break;
        }
    }

    fermerMenu(ouvrirType, lien) {
        TweenLite.to(this._balise, 1, { opacity: 0, onComplete: this.toggleMenu, onCompleteParams: [this] });
        this.finFermerSignal.dispatch(ouvrirType, lien);
    }

    toggleMenu(menu) {
        menu._balise.toggle();
    }

    toggleSousMenu(menuElt) {
        var id = menuElt.attr('id');
        if (this._sousMenuElement.length == 0) {
            this.hideAllElementsButOne(id);
            this.showSousMenu(menuElt);
        } else {
            this.deleteSousMenu();
            this.showAllElements(id);
        }
    }

    hideAllElementsButOne(id) {
        var menu = this;
        this._menuElements.forEach(menuE => {
            if (menuE._id != id)
                TweenLite.to(menuE._balise, 1, { opacity: 0, onComplete: menu.toggleElement, onCompleteParams: [menuE] });
        });
        this._decoMenuElements.forEach(decoE => {
            TweenLite.to(decoE._balise, 1, { opacity: 0, onComplete: menu.toggleElement, onCompleteParams: [decoE] });
        });
    }
    showAllElements(id) {
        var menu = this;
        this._menuElements.forEach(menuE => {
            if (menuE._id != id) {
                menu.toggleElement(menuE);
                TweenLite.to(menuE._balise, 1, { opacity: 1 });
            }
        });
        this._decoMenuElements.forEach(decoE => {
            menu.toggleElement(decoE);
            TweenLite.to(decoE._balise, 1, { opacity: decoE._alpha });
        });
    }
    toggleElement(element) {
        element._balise.toggle();
    }


    showSousMenu(menuElt) {
        var lien = menuElt.attr('lien');
        var couleur = menuElt.children().css('background-color');
        var json = this._json.SousMenu[lien];
        var size = 250;
        var oX = parseInt(menuElt.css('left'));
        var oY = parseInt(menuElt.css('top')) - size;
        // on commence les éléments de sous menu juste au dussus de l'élément séléctionné
        var ligne = 0;
        var colonne = 0;
        for (let i = 0; i < json.length; i++) {
            var menu = this;
            setTimeout(function () {
                var x = oX + size * colonne;
                var y = oY - size * ligne;
                var bloc = new ElementSousMenu(menu._balise, json[i], x, y, size, couleur, lien);
                bloc.clickSignal.add(function(bloc){
                    var element = bloc._element;
                    switch (element) {
                        case "jeu":
                            var lien = bloc._lien;
                            var jeu = new Jeu(menu._parent, lien, couleur);
                            jeu.init();
                            break;
                    
                        default:
                            break;
                    }
                });
                bloc.init();
                menu._sousMenuElement.push(bloc);
                colonne++;
                if (colonne == 5) {
                    colonne = 0;
                    ligne++;
                }
            }, i * 50);
        }
    }

    deleteSousMenu() {
        var menu = this;
        for (let i = 0; i < this._sousMenuElement.length; i++) {
            setTimeout(function () {
                menu._sousMenuElement[i].close();
                if (i == menu._sousMenuElement.length - 1)
                    menu._sousMenuElement = []; // on vide la tableau à la fin de la boucle
            }, i * 50);
        }
    }

    // GETTERS

    get finFermerSignal() {
        return this.signaux.finFermer;
    }
    get finClickSignal() {
        return this.signaux.finClick;
    }
}