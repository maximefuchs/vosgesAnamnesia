// Global.include('dev/js/utils/BaliseObject.js', "module");
import BaliseObject from 'BaliseObject.js';

export default class DivObject extends BaliseObject {
    constructor(parent, id) {
        super(parent, "div", id);
    }
}