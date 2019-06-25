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
        var colors = ['lightgreen', 'lightblue', 'lightpink'];
        for (let i = 0; i < 3; i++) {
            var li = new BaliseObject(ul._balise, 'li', 'li_' + i);
            li.css('background', colors[i]);
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