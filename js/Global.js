class Global {

    // Fonction qui récupére la texte de la langue
    static getTexteLangue(json, l) {
        var s;
        if (l === undefined) {
            l = langue;
        }
        if (json[l]) {
            this.s = json[l];
        } else {
            this.s = "inexistant " + l;
        }
        console.log(this.s);
        return this.s;
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

    static array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    };
}