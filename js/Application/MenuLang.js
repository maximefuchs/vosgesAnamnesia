Global.includeCSS('dev/css/Application/MenuLang.css');

class MenuLang extends DivObject{
    constructor(parent){
        super(parent, "MenuLang");
        this.addClass("zMax");

        this._bts = [];

        for(var i = 0; i < paramsJSON.langues.length; i++){
            var bt = new DivObject(this._balise, "BtLang_" + paramsJSON.langues[i].langue);
            bt.addClass("BtLang")
            bt.append('<div class="BtLangTexte">' +  paramsJSON.langues[i].langue + '</div>');
            this._bts.push(bt);
        }

        this._balise.find(".BtLang").on("click touchstart", null,{instance:this}, this.clickBtn);
    }

    // FONCTION CLICK LANG
    clickBtn(e) {
        e.stopPropagation(); e.preventDefault();
        var touch;
        if (e.originalEvent.touches || e.originalEvent.changedTouches) {
            touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        } else {
            touch = e;
        }
        var s = String($(this).attr('id'));
        // $('#' + s).addClass("VeilleBtSelect");
        
        langue = s.replace(/BtLang_/, '');
        gestionLangue();
    };

    init(){
        TweenLite.to(this._balise, 0 , {y: - 200})
    }

    ouvrir(){
        TweenLite.to(this._balise, 0.5 , {y: 50})
    }

    texte(){
        console.log("MenuLang : " + langue);
        for(var i = 0; i < paramsJSON.langues.length; i++){
            if(paramsJSON.langues[i].langue === langue){
                this._bts[i].addClass("BtLangSelect");
            } else {
                this._bts[i].removeClass("BtLangSelect");
            }
        }
    }
}