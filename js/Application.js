Global.include('dev/js/Application/Carte.js');
Global.include('dev/js/Application/Diaporama.js');
Global.include('dev/js/Application/Menu.js');
Global.include('dev/js/Application/MenuLang.js');

class Application extends DivObject {
    constructor() {
        super(body, "Application"); // parent : body, id : Application
        this.addClass("page");

        this._menu = new Menu(this._balise, textesJSON.Application.Menu);
        // this._diaporama = new Diaporama(this._balise);
        // this._menuLang = new MenuLang(this._balise);

        var application = this;
        this._menu.finFermerSignal.add(function(type, lien){                
            switch (type) {
                case "carte":
                    application.ouvrirCarte(lien);
                    break;
                case "perenne":
                    console.log("perenne");
                    application._menu.ouvrirMenu();
                    break;
            }
        });

        this.init();
    }

    init() {
        console.log("APPLICATION INIT");
        // this._diaporama.init();
        // this._menuLang.init();
        this._menu.init();
    }

    ouvrir() {
        // this._menuLang.ouvrir();
    }

    ouvrirCarte(lien){
        var application = this;
        var carte = new Carte(this._balise, textesJSON.Application.Carte, lien);
        carte.init();
        carte.finFermerSignal.add(function(element){
            switch (element) {
                case "menu":
                    application._menu.ouvrirMenu();
                    break;
            }
        });
    }

    texte() {
        this._carte.texte();
        // this._menuLang.texte();
        this._diaporama.texte();
    }
}