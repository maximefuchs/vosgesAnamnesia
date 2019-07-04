Global.include('dev/js/utils/zSlider.js');
Global.includeCSS('dev/css/utils/zSlider.css');

class SliderDiaporama extends DivObject {
    constructor(parent, id, jsonImages, couleur, size, interval, duration) {
        super(parent, id);

        this._json = jsonImages;

        var divSlider = new DivObject(this._balise, 'divSlider_' + this._id);
        divSlider.addClass('divSlider');
        var carousselRight = new DivObject(divSlider._balise, 'caroussel_' + this._id);
        carousselRight.addClass('z-slide-wrap');
        carousselRight.addClass('top');
        var ul = new BaliseObject(carousselRight._balise, 'ul');
        ul.addClass('z-slide-content');
        // jsonImages = ['datas/imgs/menu/diaporama/diapo_1.jpg', 'datas/imgs/menu/diaporama/diapo_2.jpg', 'datas/imgs/menu/diaporama/diapo_3.jpg'];
        for (let i = 0; i < jsonImages.length; i++) {
            var li = new BaliseObject(ul._balise, 'li', 'li_' + i);
            li.css('background', 'url(' + jsonImages[i] + ')');
            li.css('background-size', 'cover');
            li.css('background-position', 'center');
            li.addClass('z-slide-item');
        }
        $('#divSlider_' + this._id + ' .z-slide-wrap').css({ height: size + 'px', width: size + 'px' });

        new Slider('#caroussel_' + this._id, '.z-slide-item', {
            interval: interval,
            duration: duration
        });
        $('#divSlider_' + this._id + ' .z-slide-indicator').css('background', couleur);
    }
}