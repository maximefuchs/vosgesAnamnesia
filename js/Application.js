Global.include('dev/js/Application/Menu.js');
Global.include('dev/js/Application/Carte.js');
Global.include('dev/js/Application/FichePerenne.js');

class Application extends DivObject {
    constructor() {
        super(body, "Application"); // parent : body, id : Application
        this.addClass("page");

        this.lgSignal = new signals.Signal();

        var _ = this;
        this._menu = new Menu(this._balise, textesJSON.Application.Menu);
        this._menu.langueSignal.add(function (langue) {
            _.lgSignal.dispatch(langue);
        });
        this.init();
    }

    init() {
        console.log("APPLICATION INIT");
        this._menu.init();
    }

    texte() {
        this._carte.texte();
        // this._menuLang.texte();
        this._diaporama.texte();
    }
}