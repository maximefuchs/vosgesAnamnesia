Global.include('dev/js/Application/ElementMenu.js');

class Menu extends DivObject {
    constructor(parent, json) {
        super(parent, "menu");
        this.addClass('page');

        console.log('menu');

        this._json = json;

        this.signaux = {
            finFermer: new signals.Signal()
        }

        this._fondImgs = [];
        for (let i = 0; i < this._json.diaporama.menu.length; i++) {
            console.log("new back image : " + i);
            var img = this._json.diaporama.menu[i];
            var image = new Img(this._balise, "fond_img_" + img.id, img.src);
            image.addClass('page');
            image.css('opacity', 0);
            this._fondImgs.push(image);
        }

        this._menuElements = [];
        for (let i = 0; i < this._json.element.length; i++) {
            console.log("new menu element : " + i);
            var element = new ElementMenu(this._balise, this._json.element[i]);
            this._menuElements.push(element);
        }

        this._balise.find(".elementMenu").on("click touchstart", null, { instance: this }, this.clickBtn);


    }

    init() {
        this.displayBackground();
        this._menuElements.forEach(e => {
            e.init();
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
        var type = $(this).attr('type');
        var lien = $(this).attr('lien');
        e.data.instance.fermerMenu(type, lien);
    }

    // fond d'écran changeant toutes les 8 secondes
    displayBackground() {
        var images = this._fondImgs;
        var nbImgs = images.length;
        var i = 0;
        TweenLite.to(images[i]._balise, 1, { opacity: 1 });
        setInterval(function () {
            var current = i % nbImgs;
            var next = (i + 1) % nbImgs;
            TweenLite.to(images[current]._balise, 1, { opacity: 0 });
            TweenLite.to(images[next]._balise, 1, { opacity: 1 });
            i++;
        }, 6000);
    }

    ouvrirMenu() {
        this._balise.toggle();
        TweenLite.to(this._balise, 1, { opacity: 1 });
        // this.toggleMenu();
    }

    fermerMenu(ouvrirType, lien) {
        TweenLite.to(this._balise, 1, { opacity: 0, onComplete: this.toggleMenu, onCompleteParams: [this] });
        this.finFermerSignal.dispatch(ouvrirType, lien);
    }

    toggleMenu(menu) {
        menu._balise.toggle();
    }

    // GETTERS

    get finFermerSignal() {
        return this.signaux.finFermer;
    }
}