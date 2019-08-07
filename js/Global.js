class Global {

    static getLangue(){
        return langue;
    }

    static include(file, mod = "text/javascript") {
        console.log("Je veux ajouter : " + file);
        // console.log($("head")[0].children);
        for(var i = 0; i < $("head")[0].children.length; i++){
            var n = String($($("head")[0].children[i])[0].src).search(file);
            // console.log(n);
            if(n != -1){
                console.log("Il existe déjà je return");
                return;
            }
        }
        var oScript =  document.createElement("script");
        oScript.src = file;
        oScript.type = mod;
        document.head.appendChild(oScript);
    }

    static includeCSS(file){
        var oScript =  document.createElement("link");
        oScript.href = file;
        oScript.rel = "stylesheet";
        document.head.appendChild(oScript);
    }
}