/* BALISE OBJECT */

class BaliseObject {
    constructor(parent, name, id, attr) {
        this._nameBalise = name;
        this._parent = parent;
        this._id = id;
        this._balise;
        this._x;
        this._y;

        var idString = '';
        if (id === undefined || id === "") {

        } else {
            idString = 'id="' + this._id + '"';
        }

        // Ajout des attributs
        if (attr != undefined) {
            var attrString = "";
            for (var i = 0; i < attr.length; i++) {
                if (attr[i].attr != undefined) {
                    attrString += attr[i].name + '="' + attr[i].attr + '" ';
                } else {
                    attrString += attr[i].name + " ";
                }
            }
            this._string = '<' + this._nameBalise + ' ' + idString + ' ' + attrString + '></' + this._nameBalise + '>';
        } else {
            this._string = '<' + this._nameBalise + ' ' + idString + ' ></' + this._nameBalise + '>';
        }
        // console.log(this._string);

        this._parent.append(this._string);

        this._balise = this._parent.find("#" + this._id);
        if (this._balise.length === 0) {
            this._balise = this._parent.find(this._nameBalise);
        }
        // console.log(this._balise);
    }

    addClass(name) {
        this._balise.addClass(name);
    }

    removeClass(name) {
        this._balise.removeClass(name);
    }

    attr(name, a) {
        if (a != undefined) {
            this._balise.attr(name, a);
        } else {
            this._balise.attr(name, "");
        }
    }

    removeAttr(name) {
        this._balise.removeAttr(name);
    }

    append(string) {
        this._balise.append(string);
    }

    html(string) {
        this._balise.html(string);
    }

    css(element, value) {
        console.log(element + " - " + value);
        this._balise.css(element, value);
        console.log(this._balise.css(element))
    }

    set x(num) {
        this._x = num;
        TweenLite.to(this._balise, 0, { x: this._x });
    }

    set y(num) {
        this._y = num;
        TweenLite.to(this._balise, 0, { y: this._y });
    }

    get width() {
        return this._balise.width();
    }

    get height() {
        return this._balise.height();
    }
}

/* DivObject */

class DivObject extends BaliseObject {
    constructor(parent, id) {
        super(parent, "div", id);
    }
}

/* BtObject */

class BtObject extends BaliseObject {
    constructor(parent, id) {
        super(parent, "button", id);
    }
}

/* Img */

class Img extends BaliseObject {
    constructor(parent, id, src) {
        super(parent, "img", id);
        this.src = src;
        this.attr("src", src);
    }
}

/* Icone */

class Icone extends BaliseObject {
    constructor(parent, id, src, color) {
        super(parent, "div", id);
        this.addClass('divIcone');
        this.css('background-color', color);
        var icone = new BaliseObject(this._balise, "img");
        icone.addClass('icone');
        icone.attr('src', src);
    }
}

/* Span */

class Span extends BaliseObject {
    constructor(parent, id) {
        super(parent, 'span', id);
    }
}

/* Video */

class Video extends BaliseObject {
    constructor(parent, id, src, width, height) {
        super(parent, "video", id);
        this._video = this._balise[0];
        this._src = src;
        this.attr("src", this._src);
        this._width = width;
        this.attr("width", this._width);
        this._height = height;
        this.attr("height", this._height);
        this._autoplay = false;
        this._loop = false;
    }

    src(src) {
        this._src = src;
        this.attr("src", this._src);
    }

    autoplay(bool) {
        this._autoplay = bool;
        if (bool) {
            this.attr("autoplay");
        } else {
            this.removeAttr("autoplay");
        }
    }

    loop(bool) {
        this._loop = bool;
        if (bool) {
            this.attr("loop");
        } else {
            this.removeAttr("loop");
        }
    }

    play() {
        this._video.play();
    }

    pause() {
        this._video.pause();
    }

}

/* Bloc Menu Element */
class BlocMenu extends BaliseObject {
    constructor(parent, id, x, y, taille, couleur) {
        super(parent, 'div', id);

        this.signaux = {
            click: new signals.Signal()
        }

        this._id = id;
        this._x = x;
        this._y = y;
        this._couleur = couleur;
        this._taille = taille;

        this._balise.click({param: this},this.click);
    }

    init() {
        this._balise.css({
            "width": this._taille,
            "height": this._taille,
            "left": Math.random() * 2500,
            "top": Math.random() * 2500,
            "background": this._couleur,
            "opacity": 0
        });
        TweenLite.to(this._balise, 3, { left: this._x, top: this._y, opacity: 1 });
    }

    click(event) {
        var element = event.data.param;
        console.log("click id : " + element._id);
        element.clickSignal.dispatch(element);
    }

    changeColor(color) {
        TweenLite.to(this._balise, 1, { background: color });
    }

    hide() {
        TweenLite.to(this._balise, 2, { opacity: 0, onComplete: this.toggle });
    }
    toggle() {
        this._balise.toggle();
    }
    show() {
        this._balise.toggle();
        TweenLite.to(this._balise, 2, { opacity: 1 });
    }

     // GETTERS

     get clickSignal() {
        return this.signaux.click;
    }
}