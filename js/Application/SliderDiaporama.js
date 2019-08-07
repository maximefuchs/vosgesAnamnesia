Global.include('dev/js/utils/zSlider.js');
Global.includeCSS('dev/css/utils/zSlider.css');

class SliderDiaporama extends DivObject {
    constructor(parent, id, jsonImages, couleur, size, interval, duration) {
        super(parent, id);

        this._json = jsonImages;

        // NE PAS CHANGER LES NOMS DE CLASSE

        var divSlider = new DivObject(this._balise, 'divSlider_' + this._id);
        divSlider.addClass('divSlider');
        var carousselRight = new DivObject(divSlider._balise, 'caroussel_' + this._id);
        carousselRight.addClass('z-slide-wrap');
        carousselRight.addClass('top');
        var ul = new BaliseObject(carousselRight._balise, 'ul');
        ul.addClass('z-slide-content');
        
        var length;
        if (jsonImages.length == 2 && jsonImages[1] == undefined) // bugs dans ce cas là
            length = 1;
        else if (jsonImages.length == 3 && jsonImages[2] == undefined) // idem
            length = 2;
        else
            length = jsonImages.length;
        if (length == 2) { // idem, plantage avec seulement 2 images. On en met donc au minimum 3
            var first = jsonImages[0];
            jsonImages.push(first);
            length = 3;
        }
        for (let i = 0; i < length; i++) {
            var li = new BaliseObject(ul._balise, 'li', 'li_' + i);
            li.css('background', 'url(' + jsonImages[i] + ')');
            li.css('background-size', 'cover');
            li.css('background-position', 'center');
            li.addClass('z-slide-item');
        }
        // size peut être de 2 type : soit size = 20px ou size = {height: 20px, width: 20px}
        $('#divSlider_' + this._id + ' .z-slide-wrap').css({ height: size.height ? size.height : size + 'px', width: size.width ? size.width : size + 'px' });

        // API zSlider
        new Slider('#caroussel_' + this._id, '.z-slide-item', {
            interval: interval,
            duration: duration
        });
        $('#divSlider_' + this._id + ' .z-slide-indicator').css('background', couleur);
    }
}